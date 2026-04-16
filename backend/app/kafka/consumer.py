import json
from collections.abc import AsyncIterator
from typing import Any

from aiokafka import AIOKafkaConsumer

from app.core.config import get_settings


class KafkaConsumerService:
    def __init__(self, topics: list[str], group_id: str | None = None) -> None:
        settings = get_settings()
        self.topics = topics
        self.consumer = AIOKafkaConsumer(
            *topics,
            bootstrap_servers=settings.kafka_bootstrap_servers,
            group_id=group_id or settings.kafka_consumer_group,
            enable_auto_commit=False,
            value_deserializer=lambda v: json.loads(v.decode("utf-8")),
            auto_offset_reset="earliest",
        )

    async def start(self) -> None:
        await self.consumer.start()

    async def stop(self) -> None:
        await self.consumer.stop()

    async def messages(self) -> AsyncIterator[tuple[dict[str, Any], Any]]:
        async for msg in self.consumer:
            yield msg.value, msg

    async def commit(self) -> None:
        await self.consumer.commit()
