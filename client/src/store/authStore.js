import { create } from "zustand";

const initialUser = (() => {
  try {
    const stored = localStorage.getItem("huddle_user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
})();

const useAuthStore = create((set) => ({
  user: initialUser,
  accessToken: null,
  setAuth: (user, accessToken) => {
    if (user) {
      try {
        localStorage.setItem("huddle_user", JSON.stringify(user));
      } catch {}
    }
    set((state) => ({ user: user || state.user, accessToken }));
  },
  clearAuth: () => {
    try {
      localStorage.removeItem("huddle_user");
    } catch {}
    set({ user: null, accessToken: null });
  },
}));

export default useAuthStore;
