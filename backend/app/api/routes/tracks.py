import uuid

from fastapi import APIRouter, Depends, File, Form, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_track_service
from app.db.session import get_db_session
from app.models.user import User
from app.schemas.track import TrackOut, TrackPlaybackResponse
from app.services.track_service import TrackService

router = APIRouter(prefix="/tracks", tags=["tracks"])


@router.post("/upload", response_model=TrackOut)
async def upload_track(
    title: str = Form(...),
    artist: str = Form(...),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session),
    track_service: TrackService = Depends(get_track_service),
) -> TrackOut:
    track = await track_service.upload_track(
        db=db,
        user_id=current_user.id,
        title=title,
        artist=artist,
        file=file,
    )
    return TrackOut.model_validate(track)


@router.get("", response_model=list[TrackOut])
async def list_tracks(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session),
    track_service: TrackService = Depends(get_track_service),
) -> list[TrackOut]:
    tracks = await track_service.list_tracks(db, current_user.id)
    return [TrackOut.model_validate(track) for track in tracks]


@router.get("/{track_id}", response_model=TrackOut)
async def get_track(
    track_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session),
    track_service: TrackService = Depends(get_track_service),
) -> TrackOut:
    track = await track_service.get_track(db, track_id, current_user.id)
    return TrackOut.model_validate(track)


@router.get("/{track_id}/playback", response_model=TrackPlaybackResponse)
async def get_track_playback(
    track_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session),
    track_service: TrackService = Depends(get_track_service),
) -> TrackPlaybackResponse:
    payload = await track_service.get_playback(db, track_id, current_user.id)
    return TrackPlaybackResponse.model_validate(payload)
