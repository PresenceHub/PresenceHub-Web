"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { dashboardNav } from "@/lib/nav";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
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
  CircleUserRound,
  CreditCardIcon,
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
import { useCreatePostPanelStore } from "@/store/use-create-post-panel-store";
import { NavProjects } from "../ui/nav-projects";

function navIsActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppSidebar() {
  const pathname = usePathname();
  const { isMobile } = useSidebar();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const openPanel = useCreatePostPanelStore((state) => state.openPanel);

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
          </SidebarMenu>

          <SidebarGroupLabel
            className="
          h-8
          mt-2
          group-data-[collapsible=icon]:mt-2
          group-data-[collapsible=icon]:h-8
        "
          >
            Workspace
          </SidebarGroupLabel>

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
        </SidebarGroup>
        <NavProjects />
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
                  {/* Avatar */}
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback>
                      <CircleUserRound />
                    </AvatarFallback>
                  </Avatar>

                  {/* Text */}
                  <div className="flex flex-col justify-center flex-1 overflow-hidden">
                    <span className="truncate text-sm font-medium leading-tight">
                      user
                    </span>
                    <span className="truncate text-xs leading-tight">
                      user@example.com
                    </span>
                  </div>

                  {/* Icon */}
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
                      <AvatarFallback>
                        <CircleUserRound />
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm font-medium leading-tight">
                        user
                      </span>
                      <span className="text-xs truncate leading-tight">
                        user@example.com
                      </span>
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
