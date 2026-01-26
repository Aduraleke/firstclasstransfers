import { create } from "zustand";
import { AuthAdmin } from "../types";

interface AuthState {
  admin: AuthAdmin | null;
  token: string | null;
  hydrated: boolean;

  login: (payload: { token: string; admin: AuthAdmin }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  admin: null,
  token: null,
  hydrated: false,

  login: ({ token, admin }) => {
    localStorage.setItem("admin_token", token);
    localStorage.setItem("admin_auth", JSON.stringify(admin));
    set({ token, admin });
  },

  logout: () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_auth");
    set({ token: null, admin: null });
  },
}));

// hydrate
if (typeof window !== "undefined") {
  const token = localStorage.getItem("admin_token");
  const raw = localStorage.getItem("admin_auth");

  useAuthStore.setState({
    token,
    admin: raw ? JSON.parse(raw) : null,
    hydrated: true,
  });
}
