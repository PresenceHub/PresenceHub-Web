## Cursor Cloud specific instructions

### Architecture overview

This is the **PresenceHub-Web** repository — a Next.js 16 (React 19, App Router) frontend app. It communicates with the Laravel API backend (sibling repo `PresenceHub-API`) via `PH_API_URL`.

### System dependencies

- Node.js 22
- pnpm 10.33.x (enforced via `packageManager` field in `package.json`)

### Running locally

1. Copy env: `cp .env.example .env.local` and set `PH_API_URL=http://localhost:8000`
2. Install: `pnpm install --frozen-lockfile`
3. Dev server: `pnpm dev` (port 3000 by default)

### Key gotchas

- The `PH_API_URL` must point to the running API (default port 8000 for `php artisan serve`). Do NOT use port 80 unless nginx is running.
- pnpm version is enforced via `packageManager` field — do not use npm or yarn.

### Lint / Test / Build commands

- Lint: `pnpm run lint`
- Format check: `pnpm run format:check`
- TypeScript check: `pnpm exec tsc --noEmit`
- Tests: `pnpm run test`
- Build: `pnpm run build`
