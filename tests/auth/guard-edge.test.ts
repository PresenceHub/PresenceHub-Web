import { describe, expect, it } from "vitest";

import { hasSession } from "@/lib/auth/guard-edge";
import { AUTH_SESSION_COOKIE } from "@/lib/auth/constants";

describe("hasSession", () => {
  it("returns true when auth cookie exists", () => {
    const request = {
      cookies: {
        get: (name: string) =>
          name === AUTH_SESSION_COOKIE ? { value: "token" } : undefined,
      },
    };
    expect(hasSession(request as never)).toBe(true);
  });

  it("returns false when auth cookie is missing", () => {
    const request = {
      cookies: {
        get: () => undefined,
      },
    };
    expect(hasSession(request as never)).toBe(false);
  });
});
