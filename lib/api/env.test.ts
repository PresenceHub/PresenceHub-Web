import { afterEach, describe, expect, it } from "vitest";

import { getApiBaseUrl } from "@/lib/api/env";

const originalApiUrl = process.env.API_URL;
const originalPublicApiUrl = process.env.NEXT_PUBLIC_API_URL;

afterEach(() => {
  process.env.API_URL = originalApiUrl;
  process.env.NEXT_PUBLIC_API_URL = originalPublicApiUrl;
});

describe("getApiBaseUrl", () => {
  it("normalizes trailing slashes and /api suffix", () => {
    process.env.NEXT_PUBLIC_API_URL = "https://example.com/api///";
    expect(getApiBaseUrl()).toBe("https://example.com");
  });

  it("prefers API_URL over NEXT_PUBLIC_API_URL on server", () => {
    const originalWindow = (globalThis as { window?: unknown }).window;
    Reflect.deleteProperty(globalThis as object, "window");
    process.env.API_URL = "https://internal.example.com/api";
    process.env.NEXT_PUBLIC_API_URL = "https://public.example.com";

    expect(getApiBaseUrl()).toBe("https://internal.example.com");

    Object.defineProperty(globalThis, "window", {
      value: originalWindow,
      configurable: true,
      writable: true,
    });
  });

  it("uses NEXT_PUBLIC_API_URL in browser context", () => {
    process.env.API_URL = "https://internal.example.com";
    process.env.NEXT_PUBLIC_API_URL = "https://public.example.com/api";
    expect(getApiBaseUrl()).toBe("https://public.example.com");
  });

  it("returns empty string when no URL is configured", () => {
    delete process.env.API_URL;
    delete process.env.NEXT_PUBLIC_API_URL;
    expect(getApiBaseUrl()).toBe("");
  });
});
