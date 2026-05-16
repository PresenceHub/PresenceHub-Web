import { afterEach, describe, expect, it } from "vitest";

import { getApiBaseUrl } from "@/lib/api/env";

const url = process.env.PH_API_URL;

afterEach(() => {
  process.env.PH_API_URL = url;
});

describe("getApiBaseUrl", () => {
  it("normalizes trailing slashes and /api suffix", () => {
    process.env.PH_API_URL = "https://example.com/api///";
    expect(getApiBaseUrl()).toBe("https://example.com");
  });

  it("uses PH_API_URL in all contexts", () => {
    process.env.PH_API_URL = "https://ph.example.com/api";
    expect(getApiBaseUrl()).toBe("https://ph.example.com");
  });

  it("returns empty string when no URL is configured", () => {
    delete process.env.PH_API_URL;
    expect(getApiBaseUrl()).toBe("");
  });
});
