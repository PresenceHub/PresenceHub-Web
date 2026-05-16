"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  BadgeCheckIcon,
  BellIcon,
  ChevronsUpDownIcon,
  CirclePlusIcon,
  CreditCardIcon,
  LayoutDashboard,
  LogOutIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useTransition } from "react";
import { signOutAction } from "@/app/login/logout-actions";
import type { PlatformDto } from "@/lib/api/platforms-payload";
import { useCreatePostPanelStore } from "@/store/use-create-post-panel-store";
import { NavPlatforms } from "../ui/nav-platforms";

export type SidebarUserIdentity = {
  displayName: string;
  email: string;
};

function initialsFromDisplayName(displayName: string): string {
  const parts = displayName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "?";
  }
  if (parts.length === 1) {
    return parts[0]!.slice(0, 2).toUpperCase();
  }
  return `${parts[0]![0]}${parts[parts.length - 1]![0]}`.toUpperCase();
}

export type AppSidebarProps = {
  user: SidebarUserIdentity;
  platforms: PlatformDto[];
};

export function AppSidebar({ user, platforms }: AppSidebarProps) {
  const pathname = usePathname();
  const { isMobile } = useSidebar();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const openPanel = useCreatePostPanelStore((state) => state.openPanel);

  const avatarInitials = initialsFromDisplayName(user.displayName);

  function handleSignOut() {
    startTransition(async () => {
      const result = await signOutAction();
      if (result.revokeFailed && result.revokeMessage) {
        console.warn(
          "[Sign out] Could not revoke token on server:",
          result.revokeMessage,
        );
      }
      router.push("/login");
      router.refresh();
    });
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <Link href="/dashboard" className="flex h-10 items-center gap-2">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary text-sm font-semibold text-sidebar-primary-foreground">
              PH
            </span>
            <span className="truncate font-semibold text-primary">
              PresenceHub
            </span>
          </Link>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Create Post"
                onClick={openPanel}
                className="min-w-8 bg-primary text-primary-foreground hover:bg-primary/90 "
              >
                <CirclePlusIcon />
                <span>Create Post</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="Dashboard"
                isActive={pathname === "/dashboard"}
              >
                <Link href="/dashboard">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <NavPlatforms platforms={platforms} />
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu className="flex flex-col items-stretch">
          <SidebarMenuItem className="flex items-center h-12 min-h-12">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  disabled={pending}
                  size="lg"
                  className="h-12 min-h-12 w-full flex items-center justify-start gap-2 px-2 overflow-hidden"
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback>{avatarInitials}</AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col justify-center flex-1 overflow-hidden">
                    <span className="truncate text-sm font-medium leading-tight">
                      {user.displayName}
                    </span>
                    {user.email ? (
                      <span className="truncate text-xs leading-tight text-muted-foreground">
                        {user.email}
                      </span>
                    ) : null}
                  </div>

                  <ChevronsUpDownIcon className="ml-auto size-4 shrink-0" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback>{avatarInitials}</AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm font-medium leading-tight">
                        {user.displayName}
                      </span>
                      {user.email ? (
                        <span className="text-xs truncate leading-tight text-muted-foreground">
                          {user.email}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <BadgeCheckIcon />
                    Account
                  </DropdownMenuItem>

                  <DropdownMenuItem>
                    <CreditCardIcon />
                    Billing
                  </DropdownMenuItem>

                  <DropdownMenuItem>
                    <BellIcon />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOutIcon />
                  {pending ? "Logging out..." : "Log out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
