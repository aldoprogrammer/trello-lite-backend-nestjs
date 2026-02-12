# Trello Lite Backend (Nest.js)

Migrated backend (Nest.js + PostgreSQL) yang kompatibel dengan legacy Laravel Trello Lite. Fokus: auth JWT, ownership per user, CRUD Projects/Tasks, dan response JSON seragam.

## Stack
- Node.js 20+
- Nest.js 11
- PostgreSQL
- TypeORM
- JWT bearer auth
- Swagger di /docs

## Setup
1) Salin env:
```
cp .env.example .env
```
2) Isi cred DB PostgreSQL (contoh):
```
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=trello_lite_nest
DB_USER=postgres
DB_PASSWORD=your_password
PORT=3001
JWT_SECRET=replace_with_random
JWT_EXPIRES_IN=1d
```
3) Install deps:
```
npm install
```
4) Jalankan (dev):
```
npm run start:dev
```
Base URL: http://localhost:3001/api

## Endpoints (ringkas)
- Auth: POST /api/auth/register, POST /api/auth/login, GET /api/auth/me, POST /api/auth/logout
- Projects: GET/POST /api/projects, GET/PUT/DELETE /api/projects/:id
- Tasks: GET/POST /api/projects/:projectId/tasks, GET/PUT/DELETE /api/projects/:projectId/tasks/:id
- Task statuses: GET /api/statuses
- Header: Authorization: Bearer {token}

## Swagger
- UI: http://localhost:3001/docs

## Dummy Payloads (contoh)
- Register: POST /api/auth/register
```json
{
  "name": "Aldo Lata Soba",
  "email": "aldo@example.com",
  "password": "@Aldo1234",
  "passwordConfirmation": "@Aldo1234"
}
```
- Login: POST /api/auth/login
```json
{
  "email": "aldo@example.com",
  "password": "@Aldo1234"
}
```
- Create Project: POST /api/projects
```json
{
  "name": "Sprint Board",
  "description": "Tasks for sprint 1"
}
```
- Update Project: PUT /api/projects/{id}
```json
{
  "name": "Sprint Board v2",
  "description": "Updated description"
}
```
- Create Task: POST /api/projects/{projectId}/tasks
```json
{
  "title": "Write landing copy",
  "description": "Hero, value props, CTA",
  "status": "pending",
  "dueDate": "2025-12-31"
}
```
- Update Task: PUT /api/projects/{projectId}/tasks/{id}
```json
{
  "title": "Write landing copy v2",
  "description": "Refine hero text",
  "status": "in_progress",
  "dueDate": "2026-01-05"
}
```
- List Task Statuses: GET /api/statuses
  - Headers: Authorization: Bearer {token}
```json
{
  "success": true,
  "message": "Task statuses",
  "data": [
    { "value": "pending", "label": "Pending" },
    { "value": "in_progress", "label": "In progress" },
    { "value": "done", "label": "Done" }
  ]
}
```
- Authorization header (semua endpoint terproteksi):
```
Authorization: Bearer {token}
```

## Testing
```
npm run test
```

## Catatan
- DB schema dibuat via TypeORM (synchronize=true) untuk dev; untuk production, tambahkan migrations sesuai kebutuhan.
