import { describe, expect, it } from "vitest";

import { dashboardNav, pageTitleForPathname } from "@/config/nav";

describe("dashboardNav", () => {
  it("contains the expected top-level entries", () => {
    expect(dashboardNav.map((item) => item.href)).toEqual([
      "/dashboard",
      "/dashboard/queue",
      "/dashboard/compose",
      "/dashboard/analytics",
      "/dashboard/accounts",
      "/dashboard/settings",
    ]);
  });
});

describe("pageTitleForPathname", () => {
  it("returns exact route titles", () => {
    expect(pageTitleForPathname("/dashboard")).toBe("Dashboard");
    expect(pageTitleForPathname("/dashboard/queue")).toBe("Queue");
  });

  it("returns section title for nested routes", () => {
    expect(pageTitleForPathname("/dashboard/settings/team")).toBe("Settings");
  });

  it("falls back to app name for unknown paths", () => {
    expect(pageTitleForPathname("/unknown")).toBe("PresenceHub");
  });
});
