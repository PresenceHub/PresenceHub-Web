"use client"

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { CirclePlusIcon } from "lucide-react"
import { dashboardNav } from "@/config/nav"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCreatePostPanelStore } from "@/features/ui/store/use-create-post-panel-store"

export function NavMain({
    navIsActive,
}: {
    navIsActive: (pathname: string, href: string) => boolean
}) {
    const pathname = usePathname()
    const openPanel = useCreatePostPanelStore((state) => state.openPanel)

    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            tooltip="Create Post"
                            onClick={openPanel}
                            className="min-w-8 bg-primary text-primary-foreground hover:bg-primary/90 "

                        >
                            <CirclePlusIcon />

                            <span>
                                Create Post
                            </span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

                <SidebarGroupLabel
                    className="
    h-8
    group-data-[collapsible=icon]:mt-0
    group-data-[collapsible=icon]:h-8
    group-data-[collapsible=icon]:opacity-0
    group-data-[collapsible=icon]:pointer-events-none
  "
                >
                    Workspace
                </SidebarGroupLabel>

                <SidebarMenu >
                    {dashboardNav.map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <Link href={item.href} className="
    flex h-10 items-center gap-2
  ">
                            <SidebarMenuButton
                                tooltip={item.title}
                                isActive={navIsActive(pathname, item.href)}
                                className="min-h-8 group-data-[collapsible=icon]:h-8"
                                >
 
                  <item.icon/>
                  <span className="truncate">{item.title}</span>
                </SidebarMenuButton>
                                </Link>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}