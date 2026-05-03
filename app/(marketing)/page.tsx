import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function MarketingHome() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-background px-6 py-16">
      <main className="flex max-w-lg flex-col items-center gap-8 text-center">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">PresenceHub</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Plan and publish your social presence
          </h1>
          <p className="text-muted-foreground">
            Queue posts, manage channels, and stay consistent—without the tab chaos.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard">Open dashboard</Link>
        </Button>
      </main>
    </div>
  );
}
