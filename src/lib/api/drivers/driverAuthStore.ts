import { create } from "zustand";

export interface DriverAuth {
  role: "driver";
  email: string;
}

interface DriverAuthState {
  driver: DriverAuth | null;
  token: string | null;
  hydrated: boolean;

  login: (payload: { token: string; driver: DriverAuth }) => void;
  logout: () => void;
}

export const useDriverAuthStore = create<DriverAuthState>((set) => ({
  driver: null,
  token: null,
  hydrated: false,

  login: ({ token, driver }) => {
    localStorage.setItem("driver_token", token);
    localStorage.setItem("driver_auth", JSON.stringify(driver));
    set({ token, driver });
  },

  logout: () => {
    localStorage.removeItem("driver_token");
    localStorage.removeItem("driver_auth");
    set({ token: null, driver: null });
  },
}));

// hydrate
if (typeof window !== "undefined") {
  const token = localStorage.getItem("driver_token");
  const raw = localStorage.getItem("driver_auth");

  useDriverAuthStore.setState({
    token,
    driver: raw ? JSON.parse(raw) : null,
    hydrated: true,
  });
}
