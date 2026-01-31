import { create } from "zustand";

export type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "light",
  setTheme: (theme) => {
    set({ theme });
    if (typeof window !== "undefined") {
      window.localStorage.setItem("theme", theme);
      document.documentElement.setAttribute("data-theme", theme);
    }
  },
  toggleTheme: () =>
    set((state) => {
      const nextTheme: Theme = state.theme === "light" ? "dark" : "light";
      if (typeof window !== "undefined") {
        window.localStorage.setItem("theme", nextTheme);
        document.documentElement.setAttribute("data-theme", nextTheme);
      }
      return { theme: nextTheme };
    })
}));

export const hydrateInitialTheme = () => {
  if (typeof window === "undefined") return;
  const initial = getInitialTheme();
  document.documentElement.setAttribute("data-theme", initial);
  window.localStorage.setItem("theme", initial);
}

