import enum
import uuid
from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class TrackStatus(str, enum.Enum):
    uploaded = "uploaded"
    processing = "processing"
    ready = "ready"
    failed = "failed"


class Track(Base):
    __tablename__ = "tracks"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    artist: Mapped[str] = mapped_column(String(255), nullable=False)
    duration: Mapped[int | None] = mapped_column(Integer, nullable=True)
    status: Mapped[TrackStatus] = mapped_column(
        Enum(TrackStatus, name="track_status"), default=TrackStatus.uploaded, nullable=False, index=True
    )
    blob_path: Mapped[str | None] = mapped_column(Text, nullable=True)
    master_playlist_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    failed_reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    owner = relationship("User", back_populates="tracks")
    playlist_entries = relationship("PlaylistTrack", back_populates="track", cascade="all, delete-orphan")
    rooms_as_current = relationship("Room", back_populates="current_track")
    playback_events = relationship("PlaybackEvent", back_populates="track", cascade="all, delete-orphan")
