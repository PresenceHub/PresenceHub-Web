"use client";

import Image from "next/image";
import Link from "next/link";
import { Share2Icon } from "lucide-react";

import type { PlatformDto } from "@/lib/api/platforms-payload";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./sidebar";

const SLUG_ICON_SRC: Record<string, string> = {
  instagram: "/icons/platforms/instagram_icon.svg",
  facebook: "/icons/platforms/facebook_icon.svg",
};

function PlatformIcon({ slug, name }: { slug: string; name: string }) {
  const src = SLUG_ICON_SRC[slug.toLowerCase()];
  if (src) {
    return (
      <Image
        src={src}
        width={25}
        height={25}
        alt={`${name} logo`}
        className="shrink-0"
      />
    );
  }
  return (
    <span
      className="flex size-[25px] shrink-0 items-center justify-center rounded-md border border-sidebar-border bg-sidebar text-sidebar-foreground"
      aria-label={name}
    >
      <Share2Icon className="size-3.5 opacity-80" />
    </span>
  );
}

type NavPlatformsProps = {
  platforms: PlatformDto[];
};

export function NavPlatforms({ platforms }: NavPlatformsProps) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:pt-4">
      <SidebarGroupLabel>Channels</SidebarGroupLabel>
      <SidebarMenu>
        {platforms.length === 0 ? (
          <SidebarMenuItem>
            <SidebarMenuButton className="pointer-events-none opacity-60">
              <span className="text-xs">No platforms available</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ) : (
          platforms.map((item) => (
            <SidebarMenuItem key={item.slug}>
              <SidebarMenuButton asChild tooltip={item.name}>
                <Link href="/dashboard/accounts">
                  <PlatformIcon slug={item.slug} name={item.name} />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
