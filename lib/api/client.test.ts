import { beforeEach, describe, expect, it, vi } from "vitest";

const { createMock, getApiBaseUrlMock, normalizeApiErrorBodyMock } = vi.hoisted(
  () => ({
    createMock: vi.fn(),
    getApiBaseUrlMock: vi.fn(),
    normalizeApiErrorBodyMock: vi.fn(),
  }),
);

vi.mock("ky", () => ({
  default: {
    create: createMock,
  },
}));

vi.mock("@/lib/api/env", () => ({
  getApiBaseUrl: getApiBaseUrlMock,
}));

vi.mock("@/lib/api/errors", () => ({
  normalizeApiErrorBody: normalizeApiErrorBodyMock,
}));

import {
  apiPostJson,
  getPresenceHubApi,
  getPresenceHubApiWithBearer,
  normalizedErrorFromResponse,
  readApiResponseBody,
} from "@/lib/api/client";

describe("api client helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null client when base URL is missing", () => {
    getApiBaseUrlMock.mockReturnValue("");
    expect(getPresenceHubApi()).toBeNull();
    expect(getPresenceHubApiWithBearer("token")).toBeNull();
  });

  it("creates base client and bearer client with workspace header", () => {
    getApiBaseUrlMock.mockReturnValue("https://api.example.com");
    createMock.mockReturnValue({ post: vi.fn() });

    getPresenceHubApi();
    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({
        prefix: "https://api.example.com",
        headers: expect.objectContaining({ Accept: "application/json" }),
      }),
    );

    getPresenceHubApiWithBearer("abc", { workspaceUuid: " ws-1 " });
    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer abc",
          "X-Workspace-Uuid": "ws-1",
        }),
      }),
    );
  });

  it("omits workspace header when uuid is blank", () => {
    getApiBaseUrlMock.mockReturnValue("https://api.example.com");
    createMock.mockReturnValue({ post: vi.fn() });

    getPresenceHubApiWithBearer("abc", { workspaceUuid: "   " });

    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer abc",
        }),
      }),
    );
    expect(createMock.mock.calls[0]?.[0]?.headers).not.toHaveProperty(
      "X-Workspace-Uuid",
    );
  });

  it("reads JSON and text responses", async () => {
    const jsonRes = new Response(JSON.stringify({ ok: true }), {
      headers: { "content-type": "application/json" },
    });
    const textRes = new Response("plain text", {
      headers: { "content-type": "text/plain" },
    });

    await expect(readApiResponseBody(jsonRes)).resolves.toEqual({ ok: true });
    await expect(readApiResponseBody(textRes)).resolves.toBe("plain text");
  });

  it("posts JSON and returns parsed body", async () => {
    const mockRes = new Response(JSON.stringify({ token: "t" }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
    const post = vi.fn().mockResolvedValue(mockRes);

    const out = await apiPostJson(
      { post } as never,
      "api/v1/auth/login",
      { email: "a@b.com" },
      { timeout: 1000 },
    );

    expect(post).toHaveBeenCalledWith("api/v1/auth/login", {
      timeout: 1000,
      json: { email: "a@b.com" },
    });
    expect(out.res.status).toBe(200);
    expect(out.raw).toEqual({ token: "t" });
  });

  it("maps thrown network errors into a synthetic 503 response", async () => {
    const post = vi.fn().mockRejectedValue(new Error("boom"));
    const out = await apiPostJson({ post } as never, "x", {});

    expect(out.res.status).toBe(503);
    expect(out.raw).toEqual({
      message: "Could not reach API (boom)",
    });
  });

  it("uses generic network message when thrown value is not Error", async () => {
    const post = vi.fn().mockRejectedValue("network down");
    const out = await apiPostJson({ post } as never, "x", {});

    expect(out.res.status).toBe(503);
    expect(out.raw).toEqual({
      message: "Could not reach API (Network request failed)",
    });
  });

  it("normalizes JSON errors and falls back for text", () => {
    normalizeApiErrorBodyMock.mockReturnValue({
      message: "Validation failed",
      fieldErrors: { email: ["Invalid"] },
    });

    const jsonRes = new Response(JSON.stringify({ message: "x" }), {
      status: 422,
      statusText: "Unprocessable Entity",
      headers: { "content-type": "application/json" },
    });
    expect(
      normalizedErrorFromResponse(jsonRes, { message: "x" }, "fallback"),
    ).toEqual({
      message: "Validation failed",
      fieldErrors: { email: ["Invalid"] },
    });

    const textRes = new Response("failed text", {
      status: 500,
      statusText: "Server Error",
      headers: { "content-type": "text/plain" },
    });
    expect(
      normalizedErrorFromResponse(textRes, "failed text", "fallback"),
    ).toEqual({
      message: "failed text",
    });
  });

  it("falls back to statusText or provided fallback for non-json errors", () => {
    const textRes = new Response("", {
      status: 500,
      statusText: "Server Error",
      headers: { "content-type": "text/plain" },
    });
    expect(normalizedErrorFromResponse(textRes, 123, "fallback")).toEqual({
      message: "Server Error",
    });

    const emptyStatusTextRes = new Response("", {
      status: 500,
      statusText: "",
      headers: { "content-type": "text/plain" },
    });
    expect(
      normalizedErrorFromResponse(emptyStatusTextRes, null, "fallback"),
    ).toEqual({
      message: "fallback",
    });
  });
});
