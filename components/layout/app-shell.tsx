"use client";

import type { ReactNode } from "react";

import { AppSidebar, type AppSidebarProps } from "@/components/layout/sidebar";
import type { PlatformDto } from "@/lib/api/platforms-payload";
import { Topbar } from "@/components/layout/topbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { CreatePostPanel } from "./create-post-panel";

type AppShellProps = {
  children: ReactNode;
  sidebar: AppSidebarProps & {
    platforms: PlatformDto[];
  };
};

export function AppShell({ children, sidebar }: AppShellProps) {
  return (
    <SidebarProvider>
      <AppSidebar user={sidebar.user} platforms={sidebar.platforms} />
      <SidebarInset className="flex min-h-svh max-h-svh flex-col overflow-hidden">
        <Topbar />
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 md:p-6">
            {children}
          </div>
        </div>
      </SidebarInset>
      <CreatePostPanel />
    </SidebarProvider>
  );
}
