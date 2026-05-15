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
pnpm install --frozen-lockfile
```

## 2) Create local environment file

```bash
cp .env.example .env.local
```

Default value:

```env
NEXT_PUBLIC_API_URL=http://localhost
```

Choose the API origin that matches how the Laravel API is running:

- Host API with `php artisan serve`: `NEXT_PUBLIC_API_URL=http://localhost:8000`
- API Docker Compose through nginx on port 80: `NEXT_PUBLIC_API_URL=http://localhost`
- API Docker Compose through local HTTPS: `NEXT_PUBLIC_API_URL=https://presencehub.test`

Use the origin only; API paths such as `/api/v1/...` are appended in code. For server-side requests only, you may also set `API_URL`; if unset, server actions fall back to `NEXT_PUBLIC_API_URL`.

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
NEXT_PUBLIC_API_URL=http://host.docker.internal
```

Because `NEXT_PUBLIC_API_URL` is also used by browser code, set it to a URL your browser can reach. Common values are `http://localhost:8000` for a host API server, `http://localhost` for API nginx on port 80, or `https://presencehub.test` for API nginx with local TLS.

If your API is reachable at a different URL, set it when starting compose:

```bash
NEXT_PUBLIC_API_URL=http://your-api-host docker compose up --build
```

The Docker dev service runs `pnpm run dev:docker`, which starts Next.js on `0.0.0.0:3000` with webpack and file polling enabled for bind-mounted source files.

3. Stop the stack:

```bash
docker compose down
```

## Quick verification

- App loads on `http://localhost:3000`
- API calls target `NEXT_PUBLIC_API_URL`
- Optional quality checks:

```bash
pnpm run lint
pnpm run format:check
pnpm exec tsc --noEmit
pnpm run test
```
