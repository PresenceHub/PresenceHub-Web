import "server-only";

import { cookies } from "next/headers";

import {
  AUTH_SESSION_COOKIE,
  AUTH_USER_COOKIE,
  AUTH_USER_UUID_STUB,
  AUTH_WORKSPACE_COOKIE,
} from "./constants";
import type { AuthUser } from "./types";

const ONE_WEEK = 60 * 60 * 24 * 7;

const cookieBase = {
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: ONE_WEEK,
};

/** Removes auth cookies (same path/options as set) so middleware treats user as logged out. */
export async function clearAuthCookies(): Promise<void> {
  const store = await cookies();
  store.delete(AUTH_SESSION_COOKIE);
  store.delete(AUTH_USER_COOKIE);
  store.delete(AUTH_WORKSPACE_COOKIE);
}

export async function setAuthCookies(params: {
  token: string;
  currentWorkspaceUuid: string;
  user?: Partial<Pick<AuthUser, "uuid" | "email" | "name">> | null;
}) {
  const store = await cookies();
  store.set(AUTH_SESSION_COOKIE, params.token, {
    ...cookieBase,
    httpOnly: true,
  });

  store.set(AUTH_WORKSPACE_COOKIE, params.currentWorkspaceUuid, {
    ...cookieBase,
    httpOnly: true,
  });

  if (params.user) {
    const snapshot: AuthUser = {
      uuid: String(params.user.uuid ?? AUTH_USER_UUID_STUB),
      email: params.user.email ?? null,
      name: params.user.name ?? null,
    };
    store.set(AUTH_USER_COOKIE, JSON.stringify(snapshot), {
      ...cookieBase,
      httpOnly: true,
    });
  }
}
