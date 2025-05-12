import { create } from "zustand";

const useUserStore = create((set) => ({
    user: undefined,
    setUser: (user) => set({ user }),
    logout: () => set({ user: null }),
}));

export default useUserStore;