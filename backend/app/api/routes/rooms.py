import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, WebSocket, WebSocketDisconnect, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_playback_service, get_room_service
from app.core.security import decode_access_token
from app.db.session import AsyncSessionLocal, get_db_session
from app.models.room import Room
from app.models.user import User
from app.schemas.room import RoomCreateRequest, RoomOut, SeekRequest, SetTrackRequest
from app.services.playback_service import PlaybackService
from app.services.room_service import RoomService
from app.websocket.room_ws import room_ws_manager

router = APIRouter(prefix="/rooms", tags=["rooms"])


def _assert_host(room: Room, user: User) -> None:
    if room.host_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the host can control room playback",
        )


@router.post("", response_model=RoomOut)
async def create_room(
    payload: RoomCreateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session),
    room_service: RoomService = Depends(get_room_service),
) -> RoomOut:
    room = await room_service.create_room(
        db=db,
        host_id=current_user.id,
        current_track_id=payload.current_track_id,
    )
    return RoomOut.model_validate(room)


@router.post("/{room_id}/join", response_model=RoomOut)
async def join_room(
    room_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session),
    room_service: RoomService = Depends(get_room_service),
) -> RoomOut:
    room = await room_service.join_room(db=db, room_id=room_id, user_id=current_user.id)
    state = await room_service.get_live_state(room_id)
    await room_ws_manager.broadcast(room_id, {"type": "sync", "payload": state})
    return RoomOut.model_validate(room)


@router.post("/{room_id}/leave")
async def leave_room(
    room_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session),
    room_service: RoomService = Depends(get_room_service),
) -> dict:
    await room_service.leave_room(db=db, room_id=room_id, user_id=current_user.id)
    return {"status": "ok"}


@router.get("/{room_id}", response_model=RoomOut)
async def get_room(
    room_id: uuid.UUID,
    _current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session),
    room_service: RoomService = Depends(get_room_service),
) -> RoomOut:
    room = await room_service.get_room(db=db, room_id=room_id)
    return RoomOut.model_validate(room)


@router.post("/{room_id}/play")
async def play_room(
    room_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session),
    room_service: RoomService = Depends(get_room_service),
    playback_service: PlaybackService = Depends(get_playback_service),
) -> dict:
    room = await room_service.get_room(db=db, room_id=room_id)
    _assert_host(room, current_user)
    state = await playback_service.play(db=db, room=room, user_id=current_user.id)
    await room_ws_manager.broadcast(room_id, {"type": "play", "payload": state})
    return state


@router.post("/{room_id}/pause")
async def pause_room(
    room_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session),
    room_service: RoomService = Depends(get_room_service),
    playback_service: PlaybackService = Depends(get_playback_service),
) -> dict:
    room = await room_service.get_room(db=db, room_id=room_id)
    _assert_host(room, current_user)
    state = await playback_service.pause(db=db, room=room, user_id=current_user.id)
    await room_ws_manager.broadcast(room_id, {"type": "pause", "payload": state})
    return state


@router.post("/{room_id}/seek")
async def seek_room(
    room_id: uuid.UUID,
    payload: SeekRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session),
    room_service: RoomService = Depends(get_room_service),
    playback_service: PlaybackService = Depends(get_playback_service),
) -> dict:
    room = await room_service.get_room(db=db, room_id=room_id)
    _assert_host(room, current_user)
    state = await playback_service.seek(
        db=db,
        room=room,
        user_id=current_user.id,
        position=payload.position,
    )
    await room_ws_manager.broadcast(room_id, {"type": "seek", "payload": state})
    return state


@router.post("/{room_id}/set-track")
async def set_track(
    room_id: uuid.UUID,
    payload: SetTrackRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session),
    room_service: RoomService = Depends(get_room_service),
    playback_service: PlaybackService = Depends(get_playback_service),
) -> dict:
    room = await room_service.get_room(db=db, room_id=room_id)
    _assert_host(room, current_user)
    state = await playback_service.set_track(
        db=db,
        room=room,
        user_id=current_user.id,
        track_id=payload.track_id,
        position=payload.position,
        is_playing=payload.is_playing,
    )
    await room_ws_manager.broadcast(room_id, {"type": "sync", "payload": state})
    return state


@router.websocket("/{room_id}/ws")
async def room_websocket(
    websocket: WebSocket,
    room_id: uuid.UUID,
    token: str = Query(...),
) -> None:
    try:
        payload = decode_access_token(token)
        user_id = uuid.UUID(payload["sub"])
    except Exception:
        await websocket.close(code=4401)
        return

    async with AsyncSessionLocal() as db:
        user = await db.scalar(select(User).where(User.id == user_id))
        if not user:
            await websocket.close(code=4401)
            return

        room_service = RoomService(redis_client=websocket.app.state.redis)
        playback_service = PlaybackService(room_service=room_service)

        room = await db.scalar(select(Room).where(Room.id == room_id))
        if not room:
            await websocket.close(code=4404)
            return

        await room_ws_manager.connect(room_id, websocket)

        state = await room_service.get_live_state(room_id)
        await websocket.send_json({"type": "sync", "payload": state})

        try:
            while True:
                message = await websocket.receive_json()
                message_type = message.get("type")
                payload = message.get("payload", {})

                if message_type == "sync":
                    latest = await room_service.get_live_state(room_id)
                    await websocket.send_json({"type": "sync", "payload": latest})
                    continue

                if room.host_id != user.id:
                    await websocket.send_json({"type": "error", "payload": {"detail": "Only host can control playback"}})
                    continue

                if message_type == "play":
                    latest = await playback_service.play(db, room, user.id)
                elif message_type == "pause":
                    latest = await playback_service.pause(db, room, user.id)
                elif message_type == "seek":
                    latest = await playback_service.seek(db, room, user.id, float(payload.get("position", 0)))
                elif message_type == "set-track":
                    track_id = uuid.UUID(payload["track_id"])
                    latest = await playback_service.set_track(
                        db,
                        room,
                        user.id,
                        track_id=track_id,
                        position=float(payload.get("position", 0)),
                        is_playing=bool(payload.get("is_playing", False)),
                    )
                else:
                    await websocket.send_json({"type": "error", "payload": {"detail": "Unknown message type"}})
                    continue

                await room_ws_manager.broadcast(room_id, {"type": message_type, "payload": latest})

        except WebSocketDisconnect:
            room_ws_manager.disconnect(room_id, websocket)
