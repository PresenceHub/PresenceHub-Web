"use client"

import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { NavMain } from "../ui/nav-main"
import { NavProjects } from "../ui/nav-projects"
import { NavUser } from "../ui/nav-user"


function navIsActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>
) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>

        {/* Logo */}
        <Link
          href="/dashboard"
          className="
    flex h-10 items-center gap-2
  "
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary text-sm font-semibold text-sidebar-primary-foreground">
            PH
          </span>

          <span
            className="
    truncate font-semibold text-primary
  "
          >
            PresenceHub
          </span>
        </Link>

      </SidebarHeader>


      <SidebarContent>
        <NavMain navIsActive={navIsActive} />
        <NavProjects />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
      
    </Sidebar>

  )
}
