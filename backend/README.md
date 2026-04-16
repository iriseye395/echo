# ECHO Backend

Production-oriented FastAPI backend for audio upload, HLS encoding, metadata management, adaptive bitrate playback, and listen-together room sync.

## Services
- FastAPI API
- PostgreSQL metadata database
- Redis ephemeral state and room sync
- Kafka job queue for encoding pipeline
- Worker service with FFmpeg
- Azure Blob Storage for HLS assets
- Next.js frontend

## Run with Docker
1. Copy environment template:
   cp .env.example .env
2. Start stack:
   docker compose up --build
3. API base URL:
   http://localhost:8000
4. Frontend URL:
   http://localhost:3000
5. Open API docs:
   http://localhost:8000/docs

## Local development without Docker
1. Create a virtual environment and install dependencies:
   pip install -r requirements.txt
2. Ensure PostgreSQL, Redis, Kafka, and Azure Blob are reachable by variables in .env.
3. Run API:
   uvicorn app.main:app --reload --port 8000
4. Run worker:
   python -m app.workers.encoder_worker

## Required endpoints
- POST /auth/register
- POST /auth/login
- POST /tracks/upload
- GET /tracks
- GET /tracks/{id}
- GET /tracks/{id}/playback
- POST /playlists
- GET /playlists
- POST /playlists/{id}/add-track
- POST /rooms
- POST /rooms/{id}/join
- POST /rooms/{id}/leave
- GET /rooms/{id}
- POST /rooms/{id}/play
- POST /rooms/{id}/pause
- POST /rooms/{id}/seek
- POST /rooms/{id}/set-track
- WS /rooms/{id}/ws?token=<jwt>

## Kafka topics
- track.uploaded
- track.encoding
- track.encoded
- track.failed
- track.dead-letter

## Redis keys
- room:{room_id}
- room:{room_id}:members
