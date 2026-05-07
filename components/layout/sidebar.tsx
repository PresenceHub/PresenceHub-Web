"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { dashboardNav } from "@/lib/nav";
import {
  Sidebar as SidebarRoot,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { CirclePlusIcon } from "lucide-react";

function navIsActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppSidebar({ onCreatePost }: { onCreatePost: () => void }) {
  const pathname = usePathname();

  return (
    <SidebarRoot collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <span className="flex size-8 items-center justify-center rounded-xl bg-sidebar-primary text-sm font-semibold text-sidebar-primary-foreground">
                  PH
                </span>
                <span className="truncate font-semibold">PresenceHub</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Create Post"
                onClick={onCreatePost}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <CirclePlusIcon />
                <span>Create Post</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {dashboardNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={navIsActive(pathname, item.href)}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="sm">
              <Link href="/">
                <span className="truncate text-xs text-muted-foreground">
                  Marketing site
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </SidebarRoot>
  );
}
