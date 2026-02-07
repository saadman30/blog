# Blog Platform — Backend API

NestJS REST API with Prisma, OpenAPI, and modular hexagonal architecture.

## Stack

- **Framework:** NestJS
- **ORM:** Prisma (PostgreSQL)
- **Validation:** class-validator + DTOs
- **Docs:** OpenAPI via Swagger at `/api/docs`
- **Tests:** Jest (unit + integration)

## Setup

```bash
pnpm install
cp .env.example .env   # set DATABASE_URL
pnpm prisma:generate
pnpm prisma:migrate:dev   # local dev migrations
pnpm dev
```

API: http://localhost:4000  
Swagger: http://localhost:4000/api/docs

## API namespaces

- **Public:** `GET /api/public/posts`, `GET /api/public/posts/by-slug/:slug`
- **Admin:** `GET/POST /api/admin/posts`, `GET /api/admin/insights`, `GET/PUT /api/admin/settings`

## Tests

```bash
pnpm test              # unit
pnpm test:integration  # integration (requires DB)
```

## Docker

Backend and Postgres are defined in the repo root `docker-compose.yml`. Use profiles `prod` or `dev` to start backend + postgres.
