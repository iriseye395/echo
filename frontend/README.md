# ECHO Frontend

Next.js frontend for the ECHO streaming experience.

## Backend Integration

This app authenticates against the FastAPI backend and loads tracks from:

- POST /auth/login
- GET /tracks

Server-side API integration is implemented in lib/backend-api.ts.

## Local Run

1. Copy env file:
	cp .env.example .env
2. Install dependencies:
	npm install
3. Start frontend:
	npm run dev

Default URL: http://localhost:3000

## Docker Run

Frontend is included in backend/docker-compose.yml as the frontend service.

From backend directory:

1. Copy backend env:
	cp .env.example .env
2. Start full stack:
	docker compose up --build

Services:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
