"use client";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { signOutAction } from "@/features/auth/actions/logout-actions";

import {
  ChevronsUpDownIcon,
  BadgeCheckIcon,
  CreditCardIcon,
  BellIcon,
  LogOutIcon,
  CircleUserRound,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function NavUser() {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

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
    <SidebarMenu className="flex flex-col items-stretch">
      <SidebarMenuItem className="flex items-center h-12 min-h-12">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
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
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}