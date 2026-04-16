from __future__ import annotations

import uuid
from datetime import datetime, timezone

from fastapi import HTTPException, status
from redis.asyncio import Redis
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.room import Room, RoomMember


class RoomService:
    def __init__(self, redis_client: Redis) -> None:
        self.redis = redis_client

    @staticmethod
    def _room_key(room_id: uuid.UUID) -> str:
        return f"room:{room_id}"

    @staticmethod
    def _members_key(room_id: uuid.UUID) -> str:
        return f"room:{room_id}:members"

    async def create_room(
        self,
        db: AsyncSession,
        host_id: uuid.UUID,
        current_track_id: uuid.UUID | None = None,
    ) -> Room:
        room = Room(
            host_id=host_id,
            current_track_id=current_track_id,
            is_playing=False,
            current_position=0.0,
        )
        db.add(room)
        await db.flush()

        db.add(RoomMember(room_id=room.id, user_id=host_id))
        await db.commit()
        await db.refresh(room)

        await self.redis.hset(
            self._room_key(room.id),
            mapping={
                "track_id": str(current_track_id) if current_track_id else "",
                "position": "0",
                "is_playing": "0",
                "last_updated": datetime.now(timezone.utc).isoformat(),
            },
        )
        await self.redis.sadd(self._members_key(room.id), str(host_id))
        return room

    async def get_room(self, db: AsyncSession, room_id: uuid.UUID) -> Room:
        room = await db.scalar(select(Room).where(Room.id == room_id))
        if not room:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")
        return room

    async def join_room(self, db: AsyncSession, room_id: uuid.UUID, user_id: uuid.UUID) -> Room:
        room = await self.get_room(db, room_id)
        existing = await db.scalar(
            select(RoomMember).where(RoomMember.room_id == room_id, RoomMember.user_id == user_id)
        )
        if not existing:
            db.add(RoomMember(room_id=room_id, user_id=user_id))
            await db.commit()

        await self.redis.sadd(self._members_key(room_id), str(user_id))
        return room

    async def leave_room(self, db: AsyncSession, room_id: uuid.UUID, user_id: uuid.UUID) -> None:
        room = await self.get_room(db, room_id)
        member = await db.scalar(
            select(RoomMember).where(RoomMember.room_id == room.id, RoomMember.user_id == user_id)
        )
        if member:
            await db.delete(member)
            await db.commit()

        await self.redis.srem(self._members_key(room_id), str(user_id))

    async def get_live_state(self, room_id: uuid.UUID) -> dict:
        state = await self.redis.hgetall(self._room_key(room_id))
        if not state:
            return {
                "track_id": None,
                "position": 0.0,
                "is_playing": False,
                "last_updated": datetime.now(timezone.utc).isoformat(),
            }

        track_id = state.get("track_id") or None
        return {
            "track_id": track_id,
            "position": float(state.get("position", "0")),
            "is_playing": state.get("is_playing", "0") == "1",
            "last_updated": state.get("last_updated", datetime.now(timezone.utc).isoformat()),
        }

    async def update_live_state(
        self,
        db: AsyncSession,
        room: Room,
        track_id: uuid.UUID | None = None,
        position: float | None = None,
        is_playing: bool | None = None,
    ) -> dict:
        if track_id is not None:
            room.current_track_id = track_id
        if position is not None:
            room.current_position = max(0.0, position)
        if is_playing is not None:
            room.is_playing = is_playing

        await db.commit()
        await db.refresh(room)

        payload = {
            "track_id": str(room.current_track_id) if room.current_track_id else "",
            "position": str(room.current_position),
            "is_playing": "1" if room.is_playing else "0",
            "last_updated": datetime.now(timezone.utc).isoformat(),
        }
        await self.redis.hset(self._room_key(room.id), mapping=payload)

        return {
            "track_id": payload["track_id"] or None,
            "position": float(payload["position"]),
            "is_playing": payload["is_playing"] == "1",
            "last_updated": payload["last_updated"],
        }
