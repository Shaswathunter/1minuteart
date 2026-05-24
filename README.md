# 1 Minute Drawing App (MERN)

A starter MERN app where users can learn and practice quick sketch lessons like "How to draw a skull in 1 minute".

## Tech

- Frontend: React + Vite + React Router
- Backend: Node.js + Express + MongoDB
- Auth: JWT
- Drawing: HTML Canvas (undo/clear/brush size)

## Project Structure

```txt
client/   # React app
server/   # Express API
```

## Quick Start

1. Install dependencies:

```bash
npm install
npm run install:all
```

2. Configure environment files:

- `server/.env` from `server/.env.example`
- `client/.env` from `client/.env.example`

3. Seed sample lessons:

```bash
npm run seed --prefix server
```

4. Start frontend + backend together:

```bash
npm run dev
```

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/lessons`
- `GET /api/lessons/:slug`
- `POST /api/attempts` (auth required)
- `GET /api/progress/me` (auth required)

