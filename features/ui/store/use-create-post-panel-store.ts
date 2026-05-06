import { create } from "zustand"

type CreatePostPanelState = {
  open: boolean
  full: boolean

  openPanel: () => void
  closePanel: () => void
  togglePanel: () => void

  setFull: (value: boolean) => void
  toggleFull: () => void
}

export const useCreatePostPanelStore = create<CreatePostPanelState>((set) => ({
  open: false,
  full: false,

  openPanel: () => set({ open: true }),
  closePanel: () => set({ open: false, full: false }),
  togglePanel: () => set((state) => ({ open: !state.open })),

  setFull: (value) => set({ full: value }),
  toggleFull: () => set((state) => ({ full: !state.full })),
}))