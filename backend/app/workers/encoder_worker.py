from __future__ import annotations

import asyncio
import tempfile
import uuid
from pathlib import Path

from redis.asyncio import Redis
from sqlalchemy import select

from app.core.config import get_settings
from app.core.logging import configure_logging, get_logger
from app.db.session import AsyncSessionLocal
from app.kafka.consumer import KafkaConsumerService
from app.kafka.producer import KafkaProducerService
from app.kafka.topics import (
    TRACK_DEAD_LETTER,
    TRACK_ENCODED,
    TRACK_ENCODING,
    TRACK_FAILED,
    TRACK_UPLOADED,
)
from app.models.track import Track, TrackStatus
from app.services.storage_service import StorageService
from app.utils.ffmpeg import probe_duration_seconds, transcode_to_hls
from app.utils.idempotency import IdempotencyManager

settings = get_settings()
configure_logging(settings.log_level)
logger = get_logger(__name__)


async def process_encoding_job(
    payload: dict,
    storage: StorageService,
    producer: KafkaProducerService,
    idempotency: IdempotencyManager,
) -> None:
    track_id = uuid.UUID(payload["track_id"])
    source_blob_path = payload["source_blob_path"]
    attempt = int(payload.get("attempt", 0))

    lock_key = f"lock:track:{track_id}:encoding"
    lock_acquired = await idempotency.acquire_lock(lock_key, ttl_seconds=1800)
    if not lock_acquired:
        logger.info("job already in progress", extra={"track_id": str(track_id)})
        return

    try:
        async with AsyncSessionLocal() as db:
            track = await db.scalar(select(Track).where(Track.id == track_id))
            if not track:
                logger.warning("track not found for encoding", extra={"track_id": str(track_id)})
                return

            if track.status == TrackStatus.ready:
                logger.info("track already encoded", extra={"track_id": str(track_id)})
                return

            track.status = TrackStatus.processing
            track.failed_reason = None
            await db.commit()

        await producer.send(TRACK_ENCODING, {"track_id": str(track_id), "attempt": attempt}, key=str(track_id))

        with tempfile.TemporaryDirectory(prefix=f"encode-{track_id}-") as work_dir:
            work_path = Path(work_dir)
            source_file = work_path / "source_audio"
            hls_out = work_path / "hls"

            await storage.download_file(source_blob_path, str(source_file))
            await transcode_to_hls(str(source_file), str(hls_out))
            await storage.upload_directory(str(hls_out), f"tracks/{track_id}")

            duration = await probe_duration_seconds(str(source_file))
            master_blob_path = f"tracks/{track_id}/master.m3u8"
            master_url = storage.blob_url(master_blob_path)

            async with AsyncSessionLocal() as db:
                track = await db.scalar(select(Track).where(Track.id == track_id))
                if track:
                    track.status = TrackStatus.ready
                    track.master_playlist_url = master_url
                    track.duration = duration or track.duration
                    track.failed_reason = None
                    await db.commit()

        await producer.send(
            TRACK_ENCODED,
            {
                "track_id": str(track_id),
                "master_playlist_url": master_url,
            },
            key=str(track_id),
        )

    except Exception as exc:
        logger.exception("encoding failure", extra={"track_id": str(track_id), "attempt": attempt})
        async with AsyncSessionLocal() as db:
            track = await db.scalar(select(Track).where(Track.id == track_id))
            if track:
                track.failed_reason = str(exc)
                if attempt >= settings.kafka_max_retries:
                    track.status = TrackStatus.failed
                else:
                    track.status = TrackStatus.uploaded
                await db.commit()

        await producer.send(
            TRACK_FAILED,
            {
                "track_id": str(track_id),
                "attempt": attempt,
                "error": str(exc),
            },
            key=str(track_id),
        )

        if attempt < settings.kafka_max_retries:
            await producer.send(
                TRACK_UPLOADED,
                {
                    "track_id": str(track_id),
                    "source_blob_path": source_blob_path,
                    "attempt": attempt + 1,
                },
                key=str(track_id),
            )
        else:
            await producer.send(
                TRACK_DEAD_LETTER,
                {
                    "track_id": str(track_id),
                    "source_blob_path": source_blob_path,
                    "attempt": attempt,
                    "error": str(exc),
                },
                key=str(track_id),
            )
    finally:
        await idempotency.release_lock(lock_key)


async def run_worker() -> None:
    redis_client = Redis.from_url(settings.redis_url, decode_responses=True)
    idempotency = IdempotencyManager(redis_client)
    producer = KafkaProducerService()
    consumer = KafkaConsumerService(topics=[TRACK_UPLOADED], group_id=settings.kafka_consumer_group)
    storage = StorageService()

    await producer.start()
    await consumer.start()
    await storage.ensure_container()

    logger.info("encoder worker started")
    try:
        async for payload, _msg in consumer.messages():
            await process_encoding_job(payload, storage, producer, idempotency)
            await consumer.commit()
    finally:
        await consumer.stop()
        await producer.stop()
        await storage.close()
        await redis_client.close()


if __name__ == "__main__":
    asyncio.run(run_worker())
