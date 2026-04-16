import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.deps import get_current_user
from app.db.session import get_db_session
from app.models.playlist import Playlist, PlaylistTrack
from app.models.track import Track
from app.models.user import User
from app.schemas.playlist import PlaylistAddTrackRequest, PlaylistCreateRequest, PlaylistOut

router = APIRouter(prefix="/playlists", tags=["playlists"])


@router.post("", response_model=PlaylistOut)
async def create_playlist(
    payload: PlaylistCreateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session),
) -> PlaylistOut:
    playlist = Playlist(user_id=current_user.id, name=payload.name)
    db.add(playlist)
    await db.commit()
    await db.refresh(playlist)
    return PlaylistOut.model_validate(playlist)


@router.get("", response_model=list[PlaylistOut])
async def list_playlists(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session),
) -> list[PlaylistOut]:
    playlists = await db.scalars(
        select(Playlist)
        .options(selectinload(Playlist.tracks))
        .where(Playlist.user_id == current_user.id)
        .order_by(Playlist.created_at.desc())
    )
    return [PlaylistOut.model_validate(playlist) for playlist in playlists]


@router.post("/{playlist_id}/add-track", response_model=PlaylistOut)
async def add_track_to_playlist(
    playlist_id: uuid.UUID,
    payload: PlaylistAddTrackRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session),
) -> PlaylistOut:
    playlist = await db.scalar(
        select(Playlist)
        .options(selectinload(Playlist.tracks))
        .where(Playlist.id == playlist_id, Playlist.user_id == current_user.id)
    )
    if not playlist:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Playlist not found")

    track = await db.scalar(
        select(Track).where(Track.id == payload.track_id, Track.user_id == current_user.id)
    )
    if not track:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Track not found")

    existing = await db.scalar(
        select(PlaylistTrack).where(
            PlaylistTrack.playlist_id == playlist_id,
            PlaylistTrack.track_id == payload.track_id,
        )
    )
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Track already in playlist")

    next_order = payload.order
    if next_order is None:
        max_order = await db.scalar(
            select(func.max(PlaylistTrack.order)).where(PlaylistTrack.playlist_id == playlist_id)
        )
        next_order = (max_order or 0) + 1

    playlist_track = PlaylistTrack(
        playlist_id=playlist_id,
        track_id=payload.track_id,
        order=next_order,
    )
    db.add(playlist_track)
    await db.commit()

    playlist = await db.scalar(
        select(Playlist)
        .options(selectinload(Playlist.tracks))
        .where(Playlist.id == playlist_id)
    )
    return PlaylistOut.model_validate(playlist)
