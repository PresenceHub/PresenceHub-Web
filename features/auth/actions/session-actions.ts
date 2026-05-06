"use server";

import { AUTH_USER_UUID_STUB } from "@/lib/auth/constants";
import { setAuthCookies } from "@/lib/auth/persist-session";
import { AuthUser } from "../types/auth.types";


export type EstablishSessionInput = {
  token: string;
  currentWorkspaceUuid: string;
  emailFallback: string;
  nameFallback?: string | null;
  user?: Partial<Pick<AuthUser, "uuid" | "email" | "name">> | null;
};

/** Sets httpOnly session cookies after a successful browser-side API login/register. */
export async function establishSessionCookiesAction(
  input: EstablishSessionInput,
): Promise<void> {
  await setAuthCookies({
    token: input.token,
    currentWorkspaceUuid: input.currentWorkspaceUuid,
    user: input.user
      ? {
          uuid: input.user.uuid,
          email: input.user.email ?? input.emailFallback,
          name: input.user.name ?? input.nameFallback ?? null,
        }
      : {
          uuid: AUTH_USER_UUID_STUB,
          email: input.emailFallback,
          name: input.nameFallback ?? null,
        },
  });
}
