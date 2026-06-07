import { create } from 'zustand';

interface SelectState {
  openSelectId: string | null;
  toggleSelect: (id: string) => void;
  closeSelect: () => void;
}

export const useSelectStore = create<SelectState>((set) => ({
  openSelectId: null,

  toggleSelect: (id) =>
    set((state) => ({
      openSelectId: state.openSelectId === id ? null : id,
    })),

  closeSelect: () => set({ openSelectId: null }),
}));
