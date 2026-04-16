from __future__ import annotations

import asyncio
import shutil
import uuid
from pathlib import Path

import aiofiles
from fastapi import HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.logging import get_logger
from app.kafka.producer import KafkaProducerService
from app.kafka.topics import TRACK_UPLOADED
from app.models.track import Track, TrackStatus
from app.services.storage_service import StorageService
from app.utils.ffmpeg import probe_duration_seconds

logger = get_logger(__name__)


class TrackService:
    def __init__(self, storage: StorageService, kafka: KafkaProducerService) -> None:
        self.storage = storage
        self.kafka = kafka
        self.settings = get_settings()

    async def upload_track(
        self,
        db: AsyncSession,
        user_id: uuid.UUID,
        title: str,
        artist: str,
        file: UploadFile,
    ) -> Track:
        track = Track(
            user_id=user_id,
            title=title,
            artist=artist,
            status=TrackStatus.uploaded,
        )
        db.add(track)
        await db.flush()

        tmp_dir = Path(self.settings.upload_tmp_dir) / str(track.id)
        await asyncio.to_thread(tmp_dir.mkdir, parents=True, exist_ok=True)
        filename = file.filename or "upload.bin"
        local_path = tmp_dir / filename

        try:
            async with aiofiles.open(local_path, "wb") as out_file:
                while True:
                    chunk = await file.read(1024 * 1024)
                    if not chunk:
                        break
                    await out_file.write(chunk)

            duration = await probe_duration_seconds(str(local_path))
            source_blob_path = f"tracks/{track.id}/source/{filename}"
            await self.storage.upload_file(
                local_path=str(local_path),
                blob_path=source_blob_path,
                content_type=file.content_type,
            )

            track.duration = duration
            track.blob_path = source_blob_path
            await db.commit()
            await db.refresh(track)

            await self.kafka.send(
                TRACK_UPLOADED,
                {
                    "track_id": str(track.id),
                    "source_blob_path": source_blob_path,
                    "attempt": 0,
                },
                key=str(track.id),
            )

            return track
        except Exception as exc:
            await db.rollback()
            logger.exception("track upload failed", extra={"user_id": str(user_id), "track_id": str(track.id)})
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Track upload failed",
            ) from exc
        finally:
            await file.close()
            await asyncio.to_thread(shutil.rmtree, tmp_dir, True)

    async def list_tracks(self, db: AsyncSession, user_id: uuid.UUID) -> list[Track]:
        result = await db.scalars(
            select(Track).where(Track.user_id == user_id).order_by(Track.created_at.desc())
        )
        return list(result)

    async def get_track(self, db: AsyncSession, track_id: uuid.UUID, user_id: uuid.UUID) -> Track:
        track = await db.scalar(
            select(Track).where(Track.id == track_id, Track.user_id == user_id)
        )
        if not track:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Track not found")
        return track

    async def get_playback(self, db: AsyncSession, track_id: uuid.UUID, user_id: uuid.UUID) -> dict:
        track = await self.get_track(db, track_id, user_id)
        if track.status != TrackStatus.ready or not track.master_playlist_url:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Track is not ready for playback",
            )

        master_blob_path = f"tracks/{track.id}/master.m3u8"
        if not await self.storage.blob_exists(master_blob_path):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Track assets are missing. Re-upload or reprocess this track.",
            )

        dynamic_hls_url = self.storage.blob_url(master_blob_path)
        return {"track_id": track.id, "hls_url": dynamic_hls_url}
