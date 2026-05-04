import { create } from "zustand";

type AssistantState = { open: boolean; setOpen: (v: boolean) => void; toggle: () => void };

export const useAssistant = create<AssistantState>((set) => ({
  open: false,
  setOpen: (v) => set({ open: v }),
  toggle: () => set((s) => ({ open: !s.open })),
}));
