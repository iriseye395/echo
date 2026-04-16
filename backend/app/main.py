from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncEngine

from app.api.routes import auth_router, playlists_router, rooms_router, tracks_router
from app.core.config import get_settings
from app.core.logging import configure_logging, get_logger
from app.db.base import Base
from app.db.session import engine
from app.kafka.producer import KafkaProducerService
from app.services.storage_service import StorageService

# Ensure all model metadata is registered before create_all.
from app import models  # noqa: F401

settings = get_settings()
configure_logging(settings.log_level)
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    redis_client = Redis.from_url(settings.redis_url, decode_responses=True)
    kafka_producer = KafkaProducerService()
    storage_service = StorageService()

    await kafka_producer.start()
    await storage_service.ensure_container()

    app.state.redis = redis_client
    app.state.kafka_producer = kafka_producer
    app.state.storage_service = storage_service

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    logger.info("application startup complete")
    try:
        yield
    finally:
        await kafka_producer.stop()
        await redis_client.close()
        await storage_service.close()
        logger.info("application shutdown complete")


app = FastAPI(title=settings.app_name, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(tracks_router)
app.include_router(playlists_router)
app.include_router(rooms_router)


@app.get("/healthz")
async def healthcheck() -> dict:
    return {"status": "ok"}
