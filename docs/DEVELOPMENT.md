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
NEXT_PUBLIC_API_URL=http://localhost
```

If your API runs on a different host/port, update `NEXT_PUBLIC_API_URL` in `.env.local`.

## 3) Set up git hooks (recommended)

```bash
pnpm run setup-hooks
```

This enables the pre-commit hook that formats files before each commit.

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
NEXT_PUBLIC_API_URL=http://host.docker.internal
```

If your API is reachable at a different URL, set it when starting compose:

```bash
NEXT_PUBLIC_API_URL=http://your-api-host docker compose up --build
```

3. Stop the stack:

```bash
docker compose down
```

## Quick verification

- App loads on `http://localhost:3000`
- API calls target `NEXT_PUBLIC_API_URL`
- Optional quality checks:

```bash
pnpm lint
pnpm format:check
pnpm test
```
