# Development Setup

Follow these steps to get PresenceHub Web running locally.

## Prerequisites

- Node.js `22.x` (for non-Docker setup)
- `corepack` enabled (ships with Node.js, for non-Docker setup)
- Git
- Docker Engine + Docker Compose plugin (optional, for containerized setup)

## 1) Install dependencies

```bash
corepack enable
corepack prepare pnpm@10.33.2 --activate
pnpm install
```

## 2) Create local environment file

```bash
cp .env.example .env.local
```

Default value:

```env
PH_API_URL=http://localhost/api
```

If your API runs on a different host/port, update `PH_API_URL` in `.env.local`.

## 3) Set up git hooks (recommended)

```bash
pnpm run setup-hooks
```

This enables the pre-commit hook that runs ESLint, Prettier in check mode, and `tsc --noEmit` before each commit (same checks as the CI lint job). To run the same checks manually: `pnpm run lint`, `pnpm run format:check`, and `pnpm exec tsc --noEmit`.

## 4) Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Docker Compose setup (development alternative)

Use this path if you want a local dev environment without installing Node.js on your host.

1. Start the dev stack:

```bash
docker compose up --build
```

2. Open [http://localhost:3000](http://localhost:3000).

By default, Docker Compose setup uses:

```env
PH_API_URL=http://host.docker.internal:8000
```

To override Docker API URL without affecting non-Docker `.env` values, set `PH_API_URL_DOCKER` when starting compose:

```bash
PH_API_URL_DOCKER=http://your-api-host:8000 docker compose up --build
```

3. Stop the stack:

```bash
docker compose down
```

## Quick verification

- App loads on `http://localhost:3000`
- API calls target `PH_API_URL`
- Optional quality checks:

```bash
pnpm lint
pnpm format:check
pnpm test
```
