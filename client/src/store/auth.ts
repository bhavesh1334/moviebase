"use client";
import { create } from "zustand";
import { AuthAPI, AuthResponse } from "@/lib/api";

type User = AuthResponse["user"] | null;

type AuthState = {
  user: User;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  hydrate: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,
  hydrate: () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("mb_token");
    const user = localStorage.getItem("mb_user");
    if (token && user) set({ token, user: JSON.parse(user) });
  },
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await AuthAPI.login({ email, password });
      localStorage.setItem("mb_token", res.token);
      localStorage.setItem("mb_user", JSON.stringify(res.user));
      set({ user: res.user, token: res.token, loading: false });
    } catch (e: any) {
      set({
        error: e?.response?.data?.message || "Login failed",
        loading: false,
      });
    }
  },
  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await AuthAPI.register({ name, email, password });
      localStorage.setItem("mb_token", res.token);
      localStorage.setItem("mb_user", JSON.stringify(res.user));
      set({ user: res.user, token: res.token, loading: false });
    } catch (e: any) {
      set({
        error: e?.response?.data?.message || "Registration failed",
        loading: false,
      });
    }
  },
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("mb_token");
      localStorage.removeItem("mb_user");
    }
    set({ user: null, token: null });
  },
}));
