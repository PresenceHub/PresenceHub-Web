import type { NextRequest } from "next/server";

import { AUTH_SESSION_COOKIE } from "./constants";

/** Edge-safe check aligned with `getSession()` in session.ts. */
export function hasSession(request: NextRequest): boolean {
  return Boolean(request.cookies.get(AUTH_SESSION_COOKIE)?.value);
}
