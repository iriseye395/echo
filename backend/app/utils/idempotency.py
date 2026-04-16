from redis.asyncio import Redis


class IdempotencyManager:
    def __init__(self, redis_client: Redis) -> None:
        self.redis = redis_client

    async def acquire_lock(self, key: str, ttl_seconds: int = 900) -> bool:
        return bool(await self.redis.set(key, "1", nx=True, ex=ttl_seconds))

    async def release_lock(self, key: str) -> None:
        await self.redis.delete(key)
