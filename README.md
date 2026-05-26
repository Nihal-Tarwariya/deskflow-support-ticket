# DeskFlow — Support Ticket Triage Board

A full-stack MERN support ticket management system with SLA tracking, Kanban board UI, drag-and-drop, and real-time status management.

## Tech Stack

| Layer    | Technology              |
|----------|-------------------------|
| Frontend | React (Vite), Vanilla CSS |
| Backend  | Node.js, Express        |
| Database | MongoDB (Mongoose)      |
| Deploy   | Vercel (FE) + Render (BE) |

## Features

- **Kanban board** — 4 columns: Open, In Progress, Resolved, Closed
- **SLA tracking** — per-priority response time targets with breach detection
- **Status state machine** — enforced transitions (no skipping)
- **Drag-and-drop** — HTML5 DnD with snap-back animation on invalid drops
- **Filters** — by priority and SLA-breached status (combinable)
- **Stats strip** — live counts per status + breached ticket count
- **Inline form validation** — no generic alerts

## SLA Targets

| Priority | Target   |
|----------|----------|
| Urgent   | 1 hour   |
| High     | 4 hours  |
| Medium   | 24 hours |
| Low      | 72 hours |

## Status Transitions

```
open → in_progress → resolved → closed
         ↑___________↓  (one step back allowed)
```

## Local Development

### Prerequisites
- Node.js 18+
- MongoDB Atlas free cluster (or local MongoDB)

### Backend

```bash
cd deskflow-backend
cp .env.example .env
# Fill in MONGO_URI in .env
npm install
npm run dev
# API running on http://localhost:5000
```

### Frontend

```bash
cd deskflow-frontend
cp .env.example .env
# For local dev, leave VITE_API_URL empty (proxied via Vite)
npm install
npm run dev
# App running on http://localhost:5173
```

## API Reference

| Method | Endpoint         | Description                        |
|--------|------------------|------------------------------------|
| POST   | /tickets         | Create a ticket                    |
| GET    | /tickets         | List tickets (filterable)          |
| PATCH  | /tickets/:id     | Update status (enforces rules)     |
| DELETE | /tickets/:id     | Delete a ticket                    |
| GET    | /tickets/stats   | Aggregate stats                    |

### Query Parameters for GET /tickets

| Param     | Values                              |
|-----------|-------------------------------------|
| `status`  | `open`, `in_progress`, `resolved`, `closed` |
| `priority`| `low`, `medium`, `high`, `urgent`   |
| `breached`| `true`                              |

## Deployment

### Backend (Render)
1. Create a new **Web Service** on Render
2. Connect this repo, set root dir to `deskflow-backend`
3. Set environment variables: `MONGO_URI`, `FRONTEND_URL`
4. Build command: `npm install` | Start command: `node server.js`

### Frontend (Vercel)
1. Import repo on Vercel
2. Set root dir to `deskflow-frontend`
3. Set environment variable: `VITE_API_URL=https://your-backend.onrender.com`
4. Deploy — `vercel.json` handles SPA routing automatically
