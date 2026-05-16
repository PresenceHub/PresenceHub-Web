"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "../ui/sidebar";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { pageTitleForPathname } from "@/lib/nav";
import { useCreatePostPanelStore } from "@/store/use-create-post-panel-store";

export function Topbar() {
  const pathname = usePathname();
  const title = pageTitleForPathname(pathname);
  const openPanel = useCreatePostPanelStore((state) => state.openPanel);

  return (
    <header className="relative flex h-14 items-center border-b px-4">
      <SidebarTrigger />

      <div className="flex min-w-0 flex-1 items-center justify-between gap-4 pl-6">
        <h1 className="truncate text-lg font-semibold tracking-tight">
          {title}
        </h1>

        <Button
          size="icon"
          className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition"
          onClick={openPanel}
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
