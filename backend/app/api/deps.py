import uuid

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer
from redis.asyncio import Redis
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import decode_access_token
from app.db.session import get_db_session
from app.kafka.producer import KafkaProducerService
from app.models.user import User
from app.services.playback_service import PlaybackService
from app.services.room_service import RoomService
from app.services.storage_service import StorageService
from app.services.track_service import TrackService

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


async def get_current_user(
    db: AsyncSession = Depends(get_db_session),
    token: str = Depends(oauth2_scheme),
) -> User:
    try:
        payload = decode_access_token(token)
        user_id = uuid.UUID(payload["sub"])
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        ) from exc

    user = await db.scalar(select(User).where(User.id == user_id))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    return user


def get_kafka_producer(request: Request) -> KafkaProducerService:
    return request.app.state.kafka_producer


def get_storage_service(request: Request) -> StorageService:
    return request.app.state.storage_service


def get_redis_client(request: Request) -> Redis:
    return request.app.state.redis


def get_track_service(
    storage_service: StorageService = Depends(get_storage_service),
    kafka_producer: KafkaProducerService = Depends(get_kafka_producer),
) -> TrackService:
    return TrackService(storage=storage_service, kafka=kafka_producer)


def get_room_service(redis_client: Redis = Depends(get_redis_client)) -> RoomService:
    return RoomService(redis_client=redis_client)


def get_playback_service(room_service: RoomService = Depends(get_room_service)) -> PlaybackService:
    return PlaybackService(room_service=room_service)
