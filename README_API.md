RT Funds — Local API Server

This adds a lightweight REST API backed by SQLite. It is intentionally minimal so you can run it locally and connect the front-end to `/api/*` endpoints.

Quick start

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
npm start
```

The server listens on port 3000 by default. It will create a `data/db.sqlite` file in the project folder and the following endpoints will be available:

- `GET /api/students` — list students
- `POST /api/students` — create student
- `PUT /api/students/:id` — update
- `DELETE /api/students/:id` — delete

- `GET /api/events`, `POST /api/events`, `PUT /api/events/:id`, `DELETE /api/events/:id`
- `GET /api/transactions`, `POST /api/transactions`, `PUT /api/transactions/:id`, `DELETE /api/transactions/:id`
- `GET /api/summary` — aggregated totals

CORS is enabled for local testing. Use the endpoints from `app.js` via `fetch('/api/students')`, etc.
