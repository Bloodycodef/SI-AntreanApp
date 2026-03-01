import { create } from "zustand";
import api from "@/api/axios";
import type { LoginInput, RegisterInput, MeResponse } from "@/types";

interface AuthState {
  user: MeResponse | null;
  loading: boolean;
  login: (data: LoginInput) => Promise<MeResponse>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  getMe: () => Promise<MeResponse>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,

  login: async (data) => {
    await api.post("/auth/login", data);

    // After cookie is set, fetch user
    const res = await api.get<MeResponse>("/auth/me");

    set({ user: res.data });

    return res.data; // ✅ return user
  },

  register: async (data) => {
    await api.post("/auth/register", data);
  },

  logout: async () => {
    await api.post("/auth/logout");
    set({ user: null });
  },

  getMe: async () => {
    const res = await api.get<MeResponse>("/auth/me");
    set({ user: res.data });
    return res.data; //
  },
}));
