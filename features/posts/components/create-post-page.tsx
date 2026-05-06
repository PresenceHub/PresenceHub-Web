import React from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";


const platforms = [
    "X",
    "Facebook",
    "Instagram",
    "LinkedIn",
    "TikTok",
    "Twitch",
    "YouTube",
    "Threads",
    "Pinterest",
  ];

export function CreatePostPage({ full }: { full: boolean }) {
    const [selected, setSelected] = React.useState<string[]>([]);
  
    const togglePlatform = (p: string) => {
      setSelected((prev) =>
        prev.includes(p) ? prev.filter((i) => i !== p) : [...prev, p]
      );
    };
  
    return (
        <div
        className={`h-full grid ${
          full ? "md:grid-cols-3" : "grid-cols-1"
        }`}
      >
        {/* LEFT */}
        <div className={`${full ? "md:col-span-2" : "col-span-1"} flex flex-col border-r`}>
          {/* Top actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-4 border-b">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">Tags</Button>
            </div>
  
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">Templates</Button>
              <Button variant="ghost" size="sm">AI Assistant</Button>
              <Button size="sm">Preview</Button>
            </div>
          </div>
  
          {/* Platforms */}
          <div className="px-4 py-3 border-b flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground mr-2">Select</span>
            {platforms.map((p) => (
              <button
                key={p}
                onClick={() => togglePlatform(p)}
                className={`rounded-lg border p-1 transition ${
                  selected.includes(p)
                    ? "border-primary bg-primary/10"
                    : "hover:bg-muted"
                }`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{p[0]}</AvatarFallback>
                </Avatar>
              </button>
            ))}
          </div>
  
          {/* Editor */}
          <div className="flex-1 p-4 overflow-auto space-y-4">
            <Textarea
              placeholder="Start writing or get inspired with Templates"
              className="min-h-[120px] resize-none"
            />
  
            <div className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-sm text-muted-foreground hover:bg-muted/40 transition cursor-pointer">
              <Upload className="mb-2" size={18} />
              <p>
                Drag & drop or <span className="text-primary">select a file</span>
              </p>
            </div>
          </div>
        </div>
  
        {/* RIGHT */}
        {full && (
  <div className="flex flex-col border-l">
    <div className="p-4 border-b">
      <h3 className="text-sm font-medium">Post Preview</h3>
    </div>

    <ScrollArea className="flex-1 p-4">
      <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
        Preview will appear here
      </div>
    </ScrollArea>

    <div className="p-4 border-t">
      <Button className="w-full">Connect a Channel</Button>
    </div>
  </div>
)}
      </div>
    );
  }