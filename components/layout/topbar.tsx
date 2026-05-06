import { pageTitleForPathname } from "@/config/nav"
import { useCreatePostPanelStore } from "@/features/ui/store/use-create-post-panel-store"
import { usePathname } from "next/navigation"
import { SidebarTrigger } from "../ui/sidebar"
import { Button } from "../ui/button"
import { Plus } from "lucide-react"

export function Topbar() {
  const pathname = usePathname()
  const title = pageTitleForPathname(pathname)
  const openPanel = useCreatePostPanelStore((state) => state.openPanel)

  return (
    <header className="relative flex h-14 items-center border-b px-4">

      {/* Floating Sidebar Trigger */}
      <SidebarTrigger
  // className="
  //   absolute
  //   left-0
  //   top-1/2
  //   z-[100]
  //   -translate-x-[40%]
  //   -translate-y-1/2
  //   h-8
  //   w-8
  //   rounded-full
  //   border
  //   bg-background
  //   shadow-md
  // "
/>

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
  )
}