import { describe, expect, it } from "vitest";

import { parsePlatformsPayload } from "@/lib/api/platforms-payload";

describe("parsePlatformsPayload", () => {
  it("maps a Laravel data wrapper", () => {
    const raw = {
      data: [
        { slug: "instagram", name: "Instagram" },
        { slug: "facebook", name: "Facebook" },
      ],
    };
    expect(parsePlatformsPayload(raw)).toEqual([
      { slug: "instagram", name: "Instagram" },
      { slug: "facebook", name: "Facebook" },
    ]);
  });

  it("maps a plain array", () => {
    expect(
      parsePlatformsPayload([{ slug: "youtube", name: "YouTube" }]),
    ).toEqual([{ slug: "youtube", name: "YouTube" }]);
  });

  it("filters invalid entries", () => {
    expect(
      parsePlatformsPayload({
        data: [
          { slug: "ok", name: "OK" },
          { slug: "", name: "Bad" },
          { slug: "x", name: "" },
          "nope",
        ],
      }),
    ).toEqual([{ slug: "ok", name: "OK" }]);
  });

  it("returns empty for unknown shapes", () => {
    expect(parsePlatformsPayload(null)).toEqual([]);
    expect(parsePlatformsPayload({})).toEqual([]);
    expect(parsePlatformsPayload({ data: "x" })).toEqual([]);
  });
});
