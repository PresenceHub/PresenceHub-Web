"use client";

import type { ReactNode } from "react";

import { AppSidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { CreatePostPanel } from "./create-post-panel";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
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
