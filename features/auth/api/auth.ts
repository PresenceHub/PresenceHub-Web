import {
  API_URL_NOT_CONFIGURED_MESSAGE,
  apiPostJson,
  getPresenceHubApi,
  getPresenceHubApiWithBearer,
  normalizedErrorFromResponse,
} from "../../../lib/api/client";
import { AuthUser } from "../types/auth.types";

export type {
  AuthApiRoleDto,
  AuthApiUserDto,
  AuthSuccessResponseBody,
} from "../../../lib/api/auth-contract";

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
};

export type AuthApiSuccess = {
  ok: true;
  token: string;
  /** Workspace scope for `X-Workspace-Uuid` on authenticated API calls. */
  currentWorkspaceUuid: string;
  user: Pick<AuthUser, "uuid"> & Partial<Pick<AuthUser, "email" | "name">>;
};

export type AuthApiFailure = {
  ok: false;
  status: number;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export type AuthApiResult = AuthApiSuccess | AuthApiFailure;

/** Result of POST /api/v1/auth/logout (revoke token). */
export type LogoutApiResult =
  | { ok: true }
  | { ok: false; status: number; message: string };

function getUserObjectFromResponse(
  data: unknown,
): Record<string, unknown> | null {
  if (!data || typeof data !== "object") return null;
  const o = data as Record<string, unknown>;
  let user: unknown = o.user;
  if (!user && o.data && typeof o.data === "object") {
    user = (o.data as Record<string, unknown>).user;
  }
  if (!user || typeof user !== "object") return null;
  return user as Record<string, unknown>;
}

function extractToken(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const o = data as Record<string, unknown>;

  if (typeof o.token === "string") return o.token;
  if (typeof o.access_token === "string") return o.access_token;
  if (typeof o.plainTextToken === "string") return o.plainTextToken;

  const nested = o.data;
  if (nested && typeof nested === "object") {
    const d = nested as Record<string, unknown>;
    if (typeof d.token === "string") return d.token;
    if (typeof d.access_token === "string") return d.access_token;
    if (typeof d.plainTextToken === "string") return d.plainTextToken;
  }

  return null;
}

function extractUser(data: unknown): AuthApiSuccess["user"] | undefined {
  const u = getUserObjectFromResponse(data);
  if (!u) return undefined;

  const uuidRaw = u.uuid;
  if (uuidRaw == null || uuidRaw === "") return undefined;
  const uuid = String(uuidRaw);

  const email = typeof u.email === "string" ? u.email : undefined;
  const name =
    typeof u.name === "string"
      ? u.name
      : typeof u.full_name === "string"
        ? u.full_name
        : undefined;

  return {
    uuid,
    email: email ?? null,
    ...(name !== undefined ? { name } : {}),
  };
}

/** Resolves workspace UUID from `user.currentWorkspace.uuid` (login and register responses use the same shape). */
function extractCurrentWorkspaceUuid(data: unknown): string | null {
  const u = getUserObjectFromResponse(data);
  if (!u) return null;
  const cw = u.currentWorkspace;
  if (!cw || typeof cw !== "object") return null;
  const uuid = (cw as Record<string, unknown>).uuid;
  if (typeof uuid === "string" && uuid.trim() !== "") return uuid.trim();
  return null;
}

async function postAuthJson(
  path: `api/v1/auth/${string}`,
  body: Record<string, string>,
): Promise<AuthApiResult> {
  const api = getPresenceHubApi();
  if (!api) {
    return {
      ok: false,
      status: 0,
      message: API_URL_NOT_CONFIGURED_MESSAGE,
    };
  }

  const { res, raw } = await apiPostJson(api, path, body);

  if (!res.ok) {
    const normalized = normalizedErrorFromResponse(res, raw, "Request failed");
    return {
      ok: false,
      status: res.status,
      message: normalized.message,
      fieldErrors: normalized.fieldErrors,
    };
  }

  const token = extractToken(raw);
  if (!token) {
    return {
      ok: false,
      status: res.status,
      message:
        "Authentication succeeded but no token was returned. Check the API response shape.",
    };
  }

  const user = extractUser(raw);
  if (!user?.uuid) {
    return {
      ok: false,
      status: res.status,
      message:
        "Authentication succeeded but the response did not include user.uuid. Check the API response shape.",
    };
  }

  const currentWorkspaceUuid = extractCurrentWorkspaceUuid(raw);
  if (!currentWorkspaceUuid) {
    return {
      ok: false,
      status: res.status,
      message:
        "Authentication succeeded but the response did not include user.currentWorkspace.uuid. Check the API response shape.",
    };
  }

  return {
    ok: true,
    token,
    currentWorkspaceUuid,
    user,
  };
}

export function loginRequest(payload: LoginPayload): Promise<AuthApiResult> {
  return postAuthJson("api/v1/auth/login", {
    email: payload.email,
    password: payload.password,
  });
}

export function registerRequest(
  payload: RegisterPayload,
): Promise<AuthApiResult> {
  return postAuthJson("api/v1/auth/register", {
    name: payload.name,
    email: payload.email,
    password: payload.password,
    confirm_password: payload.confirm_password,
  });
}

/**
 * Revokes the session token on the API (Bearer auth).
 * Call before clearing local cookies; still clear cookies if this fails.
 */
export async function logoutRequest(
  token: string,
  workspaceUuid?: string,
): Promise<LogoutApiResult> {
  const api = getPresenceHubApiWithBearer(token, { workspaceUuid });
  if (!api) {
    return {
      ok: false,
      status: 0,
      message: API_URL_NOT_CONFIGURED_MESSAGE,
    };
  }

  const { res, raw } = await apiPostJson(api, "api/v1/auth/logout", {});

  if (res.ok) {
    return { ok: true };
  }

  const normalized = normalizedErrorFromResponse(
    res,
    raw,
    "Logout request failed",
  );

  return {
    ok: false,
    status: res.status,
    message: normalized.message,
  };
}
