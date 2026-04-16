from app.api.routes.auth import router as auth_router
from app.api.routes.playlists import router as playlists_router
from app.api.routes.rooms import router as rooms_router
from app.api.routes.tracks import router as tracks_router

__all__ = [
    "auth_router",
    "playlists_router",
    "rooms_router",
    "tracks_router",
]
