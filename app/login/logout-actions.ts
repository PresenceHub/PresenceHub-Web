"use server";

import { cookies } from "next/headers";

import { logoutRequest } from "@/lib/api/auth";
import { AUTH_SESSION_COOKIE, AUTH_WORKSPACE_COOKIE } from "@/lib/auth/constants";
import { clearAuthCookies } from "@/lib/auth/persist-session";

export type SignOutResult = {
  ok: true;
  revokeFailed?: boolean;
  revokeMessage?: string;
};

/**
 * Revokes the token on the API when present, then clears session cookies unconditionally.
 */
export async function signOutAction(): Promise<SignOutResult> {
  const store = await cookies();
  const token = store.get(AUTH_SESSION_COOKIE)?.value?.trim();
  const workspaceUuid = store.get(AUTH_WORKSPACE_COOKIE)?.value?.trim();

  let revokeFailed = false;
  let revokeMessage: string | undefined;

  if (token) {
    const revoke = await logoutRequest(token, workspaceUuid);
    if (!revoke.ok) {
      revokeFailed = true;
      revokeMessage = revoke.message;
      if (process.env.NODE_ENV === "development") {
        console.warn("[signOut] Token revoke failed:", revoke.status, revoke.message);
      }
    }
  }

  await clearAuthCookies();

  return {
    ok: true,
    ...(revokeFailed ? { revokeFailed: true, revokeMessage } : {}),
  };
}
