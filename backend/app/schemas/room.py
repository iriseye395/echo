import uuid
from datetime import datetime
from typing import Literal

from pydantic import BaseModel


class RoomCreateRequest(BaseModel):
    current_track_id: uuid.UUID | None = None


class RoomOut(BaseModel):
    id: uuid.UUID
    host_id: uuid.UUID
    current_track_id: uuid.UUID | None
    is_playing: bool
    current_position: float
    created_at: datetime

    model_config = {"from_attributes": True}


class SeekRequest(BaseModel):
    position: float


class SetTrackRequest(BaseModel):
    track_id: uuid.UUID
    position: float = 0.0
    is_playing: bool = False


class RoomSyncPayload(BaseModel):
    track_id: str | None
    position: float
    is_playing: bool
    last_updated: str


class RoomWsMessage(BaseModel):
    type: Literal["play", "pause", "seek", "sync", "set-track"]
    payload: dict
