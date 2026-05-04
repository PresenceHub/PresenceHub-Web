/**
 * Base URL for PresenceHub API (origin only; paths like `/api/v1/...` are appended by callers).
 * Server: `API_URL` (e.g. Docker internal) or `NEXT_PUBLIC_API_URL`. Browser: `NEXT_PUBLIC_API_URL` only.
 */
function normalizeApiBaseUrl(raw: string): string {
  let s = raw.trim().replace(/\/+$/, "");
  if (s.endsWith("/api")) {
    s = s.slice(0, -4).replace(/\/+$/, "");
  }
  return s;
}

export function getApiBaseUrl(): string {
  const raw =
    typeof window === "undefined"
      ? process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || ""
      : process.env.NEXT_PUBLIC_API_URL || "";

  const resolved = normalizeApiBaseUrl(raw);

  return resolved;
}
