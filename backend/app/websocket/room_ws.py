from __future__ import annotations

import uuid
from collections import defaultdict

from fastapi import WebSocket


class RoomWebSocketManager:
    def __init__(self) -> None:
        self._connections: dict[str, set[WebSocket]] = defaultdict(set)

    async def connect(self, room_id: uuid.UUID, websocket: WebSocket) -> None:
        await websocket.accept()
        self._connections[str(room_id)].add(websocket)

    def disconnect(self, room_id: uuid.UUID, websocket: WebSocket) -> None:
        room_key = str(room_id)
        sockets = self._connections.get(room_key)
        if not sockets:
            return
        sockets.discard(websocket)
        if not sockets:
            self._connections.pop(room_key, None)

    async def broadcast(self, room_id: uuid.UUID, message: dict) -> None:
        room_key = str(room_id)
        stale: list[WebSocket] = []
        for socket in self._connections.get(room_key, set()):
            try:
                await socket.send_json(message)
            except Exception:
                stale.append(socket)
        for socket in stale:
            self.disconnect(room_id, socket)


room_ws_manager = RoomWebSocketManager()
