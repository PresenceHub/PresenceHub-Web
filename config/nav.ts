import type { RemixiconComponentType } from "@remixicon/react";
import {
  RiCalendarScheduleLine,
  RiDashboardLine,
  RiEdit2Line,
  RiLinksLine,
  RiSettings3Line,
} from "@remixicon/react";

export type NavItem = {
  title: string;
  href: string;
  icon: RemixiconComponentType;
};

export const dashboardNav: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: RiDashboardLine },
  { title: "Queue", href: "/dashboard/queue", icon: RiCalendarScheduleLine },
  // { title: "Compose", href: "/dashboard/compose", icon: RiEdit2Line },
  // { title: "Analytics", href: "/dashboard/analytics", icon: RiBarChartLine },
  // { title: "Accounts", href: "/dashboard/accounts", icon: RiLinksLine },
  { title: "Settings", href: "/dashboard/settings", icon: RiSettings3Line },
];

const titleByPath: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/queue": "Queue",
  "/dashboard/compose": "Compose",
  "/dashboard/analytics": "Analytics",
  "/dashboard/accounts": "Accounts",
  "/dashboard/settings": "Settings",
};

export function pageTitleForPathname(pathname: string): string {
  if (titleByPath[pathname]) {
    return titleByPath[pathname];
  }
  for (const [path, title] of Object.entries(titleByPath)) {
    if (path !== "/dashboard" && pathname.startsWith(`${path}/`)) {
      return title;
    }
  }
  return "PresenceHub";
}
