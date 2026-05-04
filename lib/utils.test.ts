import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("joins string class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("omits falsy inputs", () => {
    expect(cn("base", false && "hidden", "end")).toBe("base end");
  });

  it("merges conflicting Tailwind utilities", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("handles object inputs from clsx", () => {
    expect(cn("a", { b: true, c: false })).toBe("a b");
  });
});
