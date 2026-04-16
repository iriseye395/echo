import json
from typing import Any

from aiokafka import AIOKafkaProducer
from aiokafka.admin import AIOKafkaAdminClient, NewTopic

from app.core.config import get_settings
from app.core.logging import get_logger
from app.kafka.topics import ALL_TOPICS

logger = get_logger(__name__)


class KafkaProducerService:
    def __init__(self) -> None:
        settings = get_settings()
        self.bootstrap_servers = settings.kafka_bootstrap_servers
        self.client_id = settings.kafka_client_id
        self._producer: AIOKafkaProducer | None = None

    async def start(self) -> None:
        if self._producer:
            return
        await self._ensure_topics()
        self._producer = AIOKafkaProducer(
            bootstrap_servers=self.bootstrap_servers,
            client_id=self.client_id,
            value_serializer=lambda v: json.dumps(v).encode("utf-8"),
        )
        await self._producer.start()
        logger.info("kafka producer started")

    async def stop(self) -> None:
        if self._producer:
            await self._producer.stop()
            self._producer = None
            logger.info("kafka producer stopped")

    async def send(self, topic: str, payload: dict[str, Any], key: str | None = None) -> None:
        if not self._producer:
            raise RuntimeError("Kafka producer is not started")
        await self._producer.send_and_wait(
            topic,
            payload,
            key=key.encode("utf-8") if key else None,
        )

    async def _ensure_topics(self) -> None:
        admin = AIOKafkaAdminClient(bootstrap_servers=self.bootstrap_servers, client_id=f"{self.client_id}-admin")
        await admin.start()
        try:
            existing = set(await admin.list_topics())
            needed = [
                NewTopic(name=topic, num_partitions=3, replication_factor=1)
                for topic in ALL_TOPICS
                if topic not in existing
            ]
            if needed:
                await admin.create_topics(new_topics=needed)
                logger.info("created kafka topics", extra={"topics": [topic.name for topic in needed]})
        finally:
            await admin.close()
