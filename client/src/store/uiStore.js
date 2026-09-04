import { create } from "zustand";

const useUiStore = create((set) => ({
  activeSpaceId: null,
  toasts: [],
  setActiveSpaceId: (id) => set({ activeSpaceId: id }),
  addToast: (toast) => set((state) => ({ toasts: [...state.toasts, toast] })),
  removeToast: (toastId) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== toastId),
    })),
}));

export default useUiStore;
