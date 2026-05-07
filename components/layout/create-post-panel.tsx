"use client";

import * as React from "react";
import { Maximize2, Minimize2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreatePostPage } from "./create-post-page";

export function CreatePostPanel({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const [full, setFull] = React.useState(false);

  const handleCloseModel = () => {
    setFull(false);
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      className={`fixed z-50 bg-background border-l shadow-xl transition-all duration-300 ${
        full
          ? "inset-0"
          : `top-0 right-0 h-full w-[420px] transform ${
              open ? "translate-x-0" : "translate-x-full"
            }`
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h2 className="font-semibold">Create Post</h2>

        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" onClick={() => setFull(!full)}>
            {full ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </Button>

          <Button size="icon" variant="ghost" onClick={handleCloseModel}>
            <X size={16} />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="h-[calc(100%-56px)] overflow-hidden">
        <CreatePostPage full={full} />
      </div>
    </div>
  );
}
