import { create } from 'zustand';

interface UserState {
  user: { id: string; email: string; name?: string } | null;
  token: string | null;
  setUser: (user: { id: string; email: string; name?: string }, token: string) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  token: null,
  setUser: (user, token) => set({ user, token }),
  clearUser: () => set({ user: null, token: null }),
}));