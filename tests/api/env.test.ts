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

  it("returns empty string when no URL is configured", () => {
    delete process.env.API_URL;
    delete process.env.NEXT_PUBLIC_API_URL;
    expect(getApiBaseUrl()).toBe("");
  });
});
