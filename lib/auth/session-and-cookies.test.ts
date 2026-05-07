import { beforeEach, describe, expect, it, vi } from "vitest";

const { cookieValues, setMock, deleteMock, redirectMock } = vi.hoisted(() => {
  const cookieValues = new Map<string, string>();
  return {
    cookieValues,
    setMock: vi.fn((name: string, value: string) => {
      cookieValues.set(name, value);
    }),
    deleteMock: vi.fn((name: string) => {
      cookieValues.delete(name);
    }),
    redirectMock: vi.fn(),
  };
});

vi.mock("server-only", () => ({}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({
    get: (name: string) => {
      const value = cookieValues.get(name);
      return value == null ? undefined : { value };
    },
    set: setMock,
    delete: deleteMock,
  })),
}));

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

import {
  AUTH_USER_UUID_STUB,
  AUTH_SESSION_COOKIE,
  AUTH_USER_COOKIE,
  AUTH_WORKSPACE_COOKIE,
} from "@/lib/auth/constants";
import { clearAuthCookies, setAuthCookies } from "@/lib/auth/persist-session";
import { getSession, requireAuth } from "@/lib/auth/session";

describe("auth session + cookie persistence", () => {
  beforeEach(() => {
    cookieValues.clear();
    setMock.mockClear();
    deleteMock.mockClear();
    redirectMock.mockClear();
  });

  it("sets auth cookies including user snapshot", async () => {
    await setAuthCookies({
      token: "token-1",
      currentWorkspaceUuid: "ws-1",
      user: { uuid: "user-1", email: "a@b.com", name: "A" },
    });

    expect(setMock).toHaveBeenCalled();
    expect(cookieValues.get(AUTH_SESSION_COOKIE)).toBe("token-1");
    expect(cookieValues.get(AUTH_WORKSPACE_COOKIE)).toBe("ws-1");
    expect(cookieValues.get(AUTH_USER_COOKIE)).toContain('"uuid":"user-1"');
  });

  it("sets session/workspace cookies even when user snapshot is omitted", async () => {
    await setAuthCookies({
      token: "token-2",
      currentWorkspaceUuid: "ws-2",
      user: null,
    });

    expect(cookieValues.get(AUTH_SESSION_COOKIE)).toBe("token-2");
    expect(cookieValues.get(AUTH_WORKSPACE_COOKIE)).toBe("ws-2");
    expect(cookieValues.has(AUTH_USER_COOKIE)).toBe(false);
  });

  it("fills missing user snapshot fields with defaults", async () => {
    await setAuthCookies({
      token: "token-3",
      currentWorkspaceUuid: "ws-3",
      user: {},
    });

    expect(cookieValues.get(AUTH_USER_COOKIE)).toBe(
      JSON.stringify({
        uuid: AUTH_USER_UUID_STUB,
        email: null,
        name: null,
      }),
    );
  });

  it("clears all auth cookies", async () => {
    cookieValues.set(AUTH_SESSION_COOKIE, "token");
    cookieValues.set(AUTH_USER_COOKIE, "{}");
    cookieValues.set(AUTH_WORKSPACE_COOKIE, "ws");

    await clearAuthCookies();

    expect(deleteMock).toHaveBeenCalledWith(AUTH_SESSION_COOKIE);
    expect(deleteMock).toHaveBeenCalledWith(AUTH_USER_COOKIE);
    expect(deleteMock).toHaveBeenCalledWith(AUTH_WORKSPACE_COOKIE);
    expect(cookieValues.size).toBe(0);
  });

  it("returns null session when token cookie is missing", async () => {
    await expect(getSession()).resolves.toBeNull();
  });

  it("returns parsed snapshot when user cookie is valid JSON", async () => {
    cookieValues.set(AUTH_SESSION_COOKIE, "token-1");
    cookieValues.set(
      AUTH_USER_COOKIE,
      JSON.stringify({ uuid: "u-1", email: "a@b.com", name: "A" }),
    );

    await expect(getSession()).resolves.toEqual({
      user: { uuid: "u-1", email: "a@b.com", name: "A" },
    });
  });

  it("falls back to token-only stub when snapshot is malformed", async () => {
    cookieValues.set(AUTH_SESSION_COOKIE, "token-1");
    cookieValues.set(AUTH_USER_COOKIE, "{bad json");

    await expect(getSession()).resolves.toEqual({
      user: { uuid: "", email: null },
    });
  });

  it("redirects to login when auth is required but missing", async () => {
    await requireAuth();
    expect(redirectMock).toHaveBeenCalledWith("/login");
  });

  it("returns session when auth is present", async () => {
    cookieValues.set(AUTH_SESSION_COOKIE, "token-1");
    cookieValues.set(
      AUTH_USER_COOKIE,
      JSON.stringify({ uuid: "u-1", email: null }),
    );

    await expect(requireAuth()).resolves.toEqual({
      user: { uuid: "u-1", email: null, name: null },
    });
    expect(redirectMock).not.toHaveBeenCalled();
  });
});
