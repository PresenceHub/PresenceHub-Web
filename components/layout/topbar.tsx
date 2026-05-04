"use client";

import { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

import { signOutAction } from "@/app/login/logout-actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { pageTitleForPathname } from "@/lib/nav";

export function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const title = pageTitleForPathname(pathname);
  const [pending, startTransition] = useTransition();

  function handleSignOut() {
    console.log("handleSignOut");
    startTransition(async () => {
      console.log("startTransition");

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
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:px-6">
      <SidebarTrigger />
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <h1 className="truncate text-lg font-semibold tracking-tight">
          {title}
        </h1>
        <div className="hidden max-w-md flex-1 md:block">
          <Input
            type="search"
            placeholder="Search posts, accounts…"
            className="h-9 bg-muted/50"
            disabled
            aria-disabled
          />
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" className="rounded-full">
            <Avatar size="sm">
              <AvatarFallback>PH</AvatarFallback>
            </Avatar>
            <span className="sr-only">Open user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-0.5">
              <p className="text-sm font-medium">Account</p>
              <p className="text-xs text-muted-foreground">Signed in (stub)</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>Profile</DropdownMenuItem>
          <DropdownMenuItem disabled>Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={pending}
            onSelect={(e) => {
              e.preventDefault();
              handleSignOut();
            }}
          >
            {pending ? "Signing out…" : "Sign out"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
