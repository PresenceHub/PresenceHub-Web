import { describe, expect, it } from "vitest";

import {
  AUTH_SESSION_COOKIE,
  AUTH_USER_COOKIE,
  AUTH_USER_UUID_STUB,
  AUTH_WORKSPACE_COOKIE,
} from "@/lib/auth/constants";

describe("auth constants", () => {
  it("exposes stable cookie keys", () => {
    expect(AUTH_SESSION_COOKIE).toBe("ph_session");
    expect(AUTH_USER_COOKIE).toBe("ph_user");
    expect(AUTH_WORKSPACE_COOKIE).toBe("ph_workspace");
    expect(AUTH_USER_UUID_STUB).toBe("");
  });
});
