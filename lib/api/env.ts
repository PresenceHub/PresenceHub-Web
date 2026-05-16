/**
 * Base URL for PresenceHub API (origin only; paths like `/api/v1/...` are appended by callers).
 * Server and Browser: `PH_API_URL` only.
 */
function normalizeApiBaseUrl(raw: string): string {
  let s = raw.trim().replace(/\/+$/, "");
  if (s.endsWith("/api")) {
    s = s.slice(0, -4).replace(/\/+$/, "");
  }
  return s;
}

function browserReachableApiBaseUrl(base: string): string {
  if (typeof window === "undefined") {
    return base;
  }

  try {
    const url = new URL(base);
    if (url.hostname === "host.docker.internal") {
      // Browser cannot always resolve Docker's host alias; use page hostname.
      url.hostname = window.location.hostname || "localhost";
      return url.toString().replace(/\/+$/, "");
    }
  } catch {
    return base;
  }

  return base;
}

export function getApiBaseUrl(): string {
  const phApiUrl = process.env.PH_API_URL || "";
  const normalized = normalizeApiBaseUrl(phApiUrl);
  return browserReachableApiBaseUrl(normalized);
}
