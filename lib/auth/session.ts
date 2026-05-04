import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  AUTH_SESSION_COOKIE,
  AUTH_USER_COOKIE,
  AUTH_USER_UUID_STUB,
} from "./constants";
import type { AuthSession, AuthUser } from "./types";

export async function getSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_SESSION_COOKIE)?.value;
  if (!token) return null;

  const userJson = cookieStore.get(AUTH_USER_COOKIE)?.value;
  if (userJson) {
    try {
      const parsed = JSON.parse(userJson) as Partial<AuthUser>;
      return {
        user: {
          uuid: String(parsed.uuid ?? AUTH_USER_UUID_STUB),
          email: parsed.email ?? null,
          name: parsed.name ?? null,
        },
      };
    } catch {
      /* ignore malformed snapshot */
    }
  }

  return {
    user: {
      uuid: AUTH_USER_UUID_STUB,
      email: null,
    },
  };
}

export async function requireAuth(): Promise<AuthSession> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}
