"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { GalleryVerticalEndIcon, AudioLinesIcon, TerminalIcon, TerminalSquareIcon, BotIcon, BookOpenIcon, Settings2Icon, FrameIcon, PieChartIcon, MapIcon, Pen, Calendar, MessagesSquare } from "lucide-react"
import Image from "next/image"
import logo from "@/public/logo_icon.png"
import instagram_img from "@/public/instagram_icon.png";
import facebook_img from "@/public/facebook_icon.png";
import youtube_img from "@/public/youtube_icon.png";

// This is sample data.
const data = {
  user: {
    name: "User",
    email: "user@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Scheduler",
      logo: (
        <Image
        src={logo}
        width={40}
        height={40}
        alt="Logo Image"
        />
      ),
    },
  ],
  navMain: [
    {
      title: "Create",
      url: "#",
      icon: (
        <Pen />
      ),
      isActive: true,
    },
    {
      title: "Publish",
      url: "#",
      icon: (
        <Calendar />
      ),
    },
    {
      title: "Community",
      url: "#",
      icon: (
        <MessagesSquare />
      ),
    },
  ],
  connectChannels: [
    {
      name: "Instagram",
      url: "#",
      icon: (
        <Image
        src={instagram_img}
        width={25}
        height={25}
        alt="Instagram Logo"
        />
      ),
    },
    {
      name: "Facebook",
      url: "#",
      icon: (
        <Image
        src={facebook_img}
        width={25}
        height={25}
        alt="Facebook Logo"
        />
      ),
    },
    {
      name: "Youtube",
      url: "#",
      icon: (
        <Image
        src={youtube_img}
        width={25}
        height={25}
        alt="Youtube Logo"
        />
      ),
    },
  ],
}

export function AppSidebar({
  onCreatePost,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  onCreatePost: () => void
}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
  <div className="flex items-center gap-2 px-2 py-2 group-data-[collapsible=icon]:justify-center">

    {/* Logo */}
    <div className="flex items-center justify-center shrink-0">
      <Image
        src={logo}
        width={32}
        height={32}
        alt="Logo Image"
        className="min-w-[32px] min-h-[32px] ml-2"
      />
    </div>

    {/* Text */}
    <span className="font-medium text-primary truncate group-data-[collapsible=icon]:hidden">
    Presencehub
    </span>

  </div>
</SidebarHeader>
      <SidebarContent>
      <NavMain items={data.navMain} onCreatePost={onCreatePost} />
        <NavProjects projects={data.connectChannels} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
    
  )
}
