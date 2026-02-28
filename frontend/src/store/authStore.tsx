import { create } from "zustand";
import api from "@/api/axios";
import type { LoginInput, RegisterInput, AuthResponse } from "@/types";

interface AuthState {
  user: AuthResponse["user"] | null;
  token: string | null;
  login: (data: LoginInput) => Promise<AuthResponse>;
  register: (data: RegisterInput) => Promise<AuthResponse>;
  logout: () => void;
  setAuth: (user: AuthResponse["user"], token: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem("token"),

  setAuth: (user, token) => {
    localStorage.setItem("token", token);
    set({ user, token });
  },

  login: async (data) => {
    const res = await api.post<AuthResponse>("/auth/login", data);
    const { user, token } = res.data;

    localStorage.setItem("token", token);
    set({ user, token });

    return res.data;
  },

  register: async (data) => {
    const res = await api.post<AuthResponse>("/auth/register", data);
    return res.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
}));
