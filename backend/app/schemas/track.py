import uuid
from datetime import datetime

from pydantic import BaseModel

from app.models.track import TrackStatus


class TrackOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    title: str
    artist: str
    duration: int | None
    status: TrackStatus
    blob_path: str | None
    master_playlist_url: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class TrackPlaybackResponse(BaseModel):
    track_id: uuid.UUID
    hls_url: str
