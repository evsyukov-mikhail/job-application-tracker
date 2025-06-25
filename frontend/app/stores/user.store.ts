import { create } from "zustand";
import type { AuthResult } from "~/interfaces/auth-result.interface";

interface UserState {
  user: AuthResult;

  setUser: (user: AuthResult) => void;
}

export const useUserStore = create<UserState>()(set => ({
  user: { username: '', email: '', token: '' },
  
  setUser: (user: AuthResult) => set(() => ({ user })),
}))