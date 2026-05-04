import ky, { type KyInstance } from "ky";

import { getApiBaseUrl } from "./env";
import { normalizeApiErrorBody, type NormalizedApiError } from "./errors";

/** Shared message when `API_URL` / `NEXT_PUBLIC_API_URL` is unset. */
export const API_URL_NOT_CONFIGURED_MESSAGE =
  "API URL is not configured (set NEXT_PUBLIC_API_URL or API_URL).";

const JSON_ACCEPT = "application/json";

const sharedKyDefaults = {
  throwHttpErrors: false,
  cache: "no-store" as const,
  retry: { limit: 0 },
};

function createPresenceHubApi(
  extraHeaders?: Record<string, string>,
): KyInstance | null {
  const base = getApiBaseUrl();
  if (!base) return null;

  return ky.create({
    prefix: base,
    ...sharedKyDefaults,
    headers: {
      Accept: JSON_ACCEPT,
      ...extraHeaders,
    },
  });
}

/**
 * PresenceHub API client: base URL, JSON Accept header, no implicit retries on failures.
 * Use `throwHttpErrors: false` so callers can normalize Laravel-style error bodies.
 */
export function getPresenceHubApi(): KyInstance | null {
  return createPresenceHubApi();
}

/** Optional headers for tenant-scoped authenticated API calls. */
export type PresenceHubBearerOptions = {
  workspaceUuid?: string;
};

const X_WORKSPACE_UUID = "X-Workspace-Uuid";

/**
 * Same as {@link getPresenceHubApi} with `Authorization: Bearer <token>` for authenticated routes.
 * When `workspaceUuid` is set, sends `X-Workspace-Uuid` for multi-workspace APIs.
 */
export function getPresenceHubApiWithBearer(
  token: string,
  options?: PresenceHubBearerOptions,
): KyInstance | null {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };
  const ws = options?.workspaceUuid?.trim();
  if (ws) {
    headers[X_WORKSPACE_UUID] = ws;
  }
  return createPresenceHubApi(headers);
}

/**
 * Read JSON or text from a response based on `Content-Type` (matches prior `fetch` behavior).
 */
export async function readApiResponseBody(res: Response): Promise<unknown> {
  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes(JSON_ACCEPT);
  if (isJson) return res.json().catch(() => null);
  return res.text();
}

type KyPostOptions = NonNullable<Parameters<KyInstance["post"]>[1]>;

/**
 * POST JSON and read the response body (JSON or text). Domain modules map `raw` to result types.
 * Network failures (no TCP/TLS, DNS, etc.) are turned into a non-OK JSON Response so callers do not throw.
 */
export async function apiPostJson(
  api: KyInstance,
  path: string,
  body: unknown,
  options?: Omit<KyPostOptions, "json" | "body">,
): Promise<{ res: Response; raw: unknown }> {
  try {
    const res = await api.post(path, {
      ...options,
      json: body,
    });
    const raw = await readApiResponseBody(res);
    return { res, raw };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Network request failed";
    const res = new Response(
      JSON.stringify({
        message: `Could not reach API (${message})`,
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      },
    );
    const raw = await readApiResponseBody(res);
    return { res, raw };
  }
}

/**
 * Map a failed HTTP response body to a user-facing message (and optional field errors).
 */
export function normalizedErrorFromResponse(
  res: Response,
  raw: unknown,
  fallbackMessage: string,
): NormalizedApiError {
  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes(JSON_ACCEPT);
  if (isJson && raw && typeof raw === "object") {
    return normalizeApiErrorBody(raw);
  }
  return {
    message: typeof raw === "string" ? raw : res.statusText || fallbackMessage,
  };
}
