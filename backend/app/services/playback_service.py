from __future__ import annotations

import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.playback import PlaybackEvent
from app.models.room import Room
from app.services.room_service import RoomService


class PlaybackService:
    def __init__(self, room_service: RoomService) -> None:
        self.room_service = room_service

    async def play(self, db: AsyncSession, room: Room, user_id: uuid.UUID) -> dict:
        state = await self.room_service.update_live_state(db, room=room, is_playing=True)
        await self._record_event(db, room=room, user_id=user_id, event_type="play", position=state["position"])
        return state

    async def pause(self, db: AsyncSession, room: Room, user_id: uuid.UUID) -> dict:
        state = await self.room_service.update_live_state(db, room=room, is_playing=False)
        await self._record_event(db, room=room, user_id=user_id, event_type="pause", position=state["position"])
        return state

    async def seek(self, db: AsyncSession, room: Room, user_id: uuid.UUID, position: float) -> dict:
        state = await self.room_service.update_live_state(db, room=room, position=position)
        await self._record_event(db, room=room, user_id=user_id, event_type="seek", position=state["position"])
        return state

    async def set_track(
        self,
        db: AsyncSession,
        room: Room,
        user_id: uuid.UUID,
        track_id: uuid.UUID,
        position: float = 0.0,
        is_playing: bool = False,
    ) -> dict:
        state = await self.room_service.update_live_state(
            db,
            room=room,
            track_id=track_id,
            position=position,
            is_playing=is_playing,
        )
        await self._record_event(db, room=room, user_id=user_id, event_type="set-track", position=state["position"])
        return state

    async def _record_event(
        self,
        db: AsyncSession,
        room: Room,
        user_id: uuid.UUID,
        event_type: str,
        position: float,
    ) -> None:
        event = PlaybackEvent(
            room_id=room.id,
            user_id=user_id,
            track_id=room.current_track_id,
            event_type=event_type,
            position=position,
        )
        db.add(event)
        await db.commit()
