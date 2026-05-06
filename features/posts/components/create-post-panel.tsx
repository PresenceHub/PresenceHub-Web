"use client"

import { Maximize2, Minimize2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CreatePostPage } from "./create-post-page"
import { useCreatePostPanelStore } from "@/features/ui/store/use-create-post-panel-store"

export function CreatePostPanel() {
  const open = useCreatePostPanelStore((state) => state.open)
  const full = useCreatePostPanelStore((state) => state.full)
  const closePanel = useCreatePostPanelStore((state) => state.closePanel)
  const toggleFull = useCreatePostPanelStore((state) => state.toggleFull)

  if (!open) return null

  return (
    <div
      className={`fixed z-50 bg-background border-l shadow-xl transition-all duration-300 ${
        full
          ? "inset-0"
          : "top-0 right-0 h-full w-[420px] translate-x-0"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h2 className="font-semibold">Create Post</h2>

        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" onClick={toggleFull}>
            {full ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </Button>

          <Button size="icon" variant="ghost" onClick={closePanel}>
            <X size={16} />
          </Button>
        </div>
      </div>

      <div className="h-[calc(100%-56px)] overflow-hidden">
        <CreatePostPage full={full} />
      </div>
    </div>
  )
}