import uuid
from datetime import datetime

from pydantic import BaseModel


class PlaylistCreateRequest(BaseModel):
    name: str


class PlaylistAddTrackRequest(BaseModel):
    track_id: uuid.UUID
    order: int | None = None


class PlaylistTrackOut(BaseModel):
    id: uuid.UUID
    track_id: uuid.UUID
    order: int

    model_config = {"from_attributes": True}


class PlaylistOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    name: str
    created_at: datetime
    tracks: list[PlaylistTrackOut] = []

    model_config = {"from_attributes": True}
