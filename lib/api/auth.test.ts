import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  getPresenceHubApiMock,
  getPresenceHubApiWithBearerMock,
  apiPostJsonMock,
  normalizedErrorFromResponseMock,
} = vi.hoisted(() => ({
  getPresenceHubApiMock: vi.fn(),
  getPresenceHubApiWithBearerMock: vi.fn(),
  apiPostJsonMock: vi.fn(),
  normalizedErrorFromResponseMock: vi.fn(),
}));

vi.mock("@/lib/api/client", () => ({
  API_URL_NOT_CONFIGURED_MESSAGE:
    "API URL is not configured (set NEXT_PUBLIC_API_URL or API_URL).",
  getPresenceHubApi: getPresenceHubApiMock,
  getPresenceHubApiWithBearer: getPresenceHubApiWithBearerMock,
  apiPostJson: apiPostJsonMock,
  normalizedErrorFromResponse: normalizedErrorFromResponseMock,
}));

import { loginRequest, logoutRequest, registerRequest } from "@/lib/api/auth";

describe("auth api module", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns config error when base client is missing", async () => {
    getPresenceHubApiMock.mockReturnValue(null);
    await expect(
      loginRequest({ email: "a@b.com", password: "x" }),
    ).resolves.toMatchObject({
      ok: false,
      status: 0,
    });
  });

  it("returns normalized failure for non-ok auth response", async () => {
    getPresenceHubApiMock.mockReturnValue({});
    apiPostJsonMock.mockResolvedValue({
      res: new Response(JSON.stringify({ message: "bad" }), {
        status: 422,
        headers: { "content-type": "application/json" },
      }),
      raw: { message: "bad" },
    });
    normalizedErrorFromResponseMock.mockReturnValue({
      message: "Invalid email",
      fieldErrors: { email: ["Invalid email"] },
    });

    await expect(
      loginRequest({ email: "a@b.com", password: "x" }),
    ).resolves.toEqual({
      ok: false,
      status: 422,
      message: "Invalid email",
      fieldErrors: { email: ["Invalid email"] },
    });
  });

  it("returns success for valid login payload shape", async () => {
    getPresenceHubApiMock.mockReturnValue({});
    apiPostJsonMock.mockResolvedValue({
      res: new Response(
        JSON.stringify({
          token: "token-1",
          user: {
            uuid: "user-1",
            email: "a@b.com",
            name: "A",
            currentWorkspace: { uuid: "ws-1" },
          },
        }),
        {
          status: 200,
          headers: { "content-type": "application/json" },
        },
      ),
      raw: {
        token: "token-1",
        user: {
          uuid: "user-1",
          email: "a@b.com",
          name: "A",
          currentWorkspace: { uuid: "ws-1" },
        },
      },
    });

    await expect(
      loginRequest({ email: "a@b.com", password: "x" }),
    ).resolves.toEqual({
      ok: true,
      token: "token-1",
      currentWorkspaceUuid: "ws-1",
      user: { uuid: "user-1", email: "a@b.com", name: "A" },
    });
  });

  it("accepts nested token field variants during register", async () => {
    getPresenceHubApiMock.mockReturnValue({});
    apiPostJsonMock.mockResolvedValue({
      res: new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
      raw: {
        data: { access_token: "token-2" },
        user: {
          uuid: "user-2",
          full_name: "Name Two",
          currentWorkspace: { uuid: "ws-2" },
        },
      },
    });

    await expect(
      registerRequest({
        name: "Name Two",
        email: "b@c.com",
        password: "pw",
        confirm_password: "pw",
      }),
    ).resolves.toEqual({
      ok: true,
      token: "token-2",
      currentWorkspaceUuid: "ws-2",
      user: { uuid: "user-2", email: null, name: "Name Two" },
    });
  });

  it("returns helpful errors for missing token and workspace", async () => {
    getPresenceHubApiMock.mockReturnValue({});

    apiPostJsonMock.mockResolvedValueOnce({
      res: new Response(JSON.stringify({ user: { uuid: "u1" } }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
      raw: { user: { uuid: "u1" } },
    });
    await expect(
      loginRequest({ email: "a@b.com", password: "x" }),
    ).resolves.toMatchObject({
      ok: false,
      message: expect.stringContaining("no token"),
    });

    apiPostJsonMock.mockResolvedValueOnce({
      res: new Response(JSON.stringify({ token: "t", user: { uuid: "u1" } }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
      raw: { token: "t", user: { uuid: "u1" } },
    });
    await expect(
      loginRequest({ email: "a@b.com", password: "x" }),
    ).resolves.toMatchObject({
      ok: false,
      message: expect.stringContaining("currentWorkspace.uuid"),
    });
  });

  it("returns helpful error when user uuid is missing", async () => {
    getPresenceHubApiMock.mockReturnValue({});
    apiPostJsonMock.mockResolvedValue({
      res: new Response(JSON.stringify({ token: "t", user: {} }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
      raw: { token: "t", user: {} },
    });

    await expect(
      loginRequest({ email: "a@b.com", password: "x" }),
    ).resolves.toMatchObject({
      ok: false,
      message: expect.stringContaining("user.uuid"),
    });
  });

  it("accepts nested user object and plainTextToken", async () => {
    getPresenceHubApiMock.mockReturnValue({});
    apiPostJsonMock.mockResolvedValue({
      res: new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
      raw: {
        plainTextToken: "token-3",
        data: {
          user: {
            uuid: "user-3",
            email: "c@d.com",
            currentWorkspace: { uuid: " ws-3 " },
          },
        },
      },
    });

    await expect(
      loginRequest({ email: "c@d.com", password: "x" }),
    ).resolves.toEqual({
      ok: true,
      token: "token-3",
      currentWorkspaceUuid: "ws-3",
      user: { uuid: "user-3", email: "c@d.com" },
    });
  });

  it("handles logout success and failure", async () => {
    getPresenceHubApiWithBearerMock.mockReturnValue({});
    apiPostJsonMock.mockResolvedValue({
      res: new Response("{}", {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
      raw: {},
    });
    await expect(logoutRequest("t", "ws")).resolves.toEqual({ ok: true });

    apiPostJsonMock.mockResolvedValue({
      res: new Response(JSON.stringify({ message: "denied" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      }),
      raw: { message: "denied" },
    });
    normalizedErrorFromResponseMock.mockReturnValue({ message: "denied" });
    await expect(logoutRequest("t", "ws")).resolves.toEqual({
      ok: false,
      status: 401,
      message: "denied",
    });
  });

  it("returns config error when bearer client is missing", async () => {
    getPresenceHubApiWithBearerMock.mockReturnValue(null);

    await expect(logoutRequest("t", "ws")).resolves.toMatchObject({
      ok: false,
      status: 0,
    });
  });
});
