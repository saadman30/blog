import { create } from "zustand";

interface BlogFiltersState {
  query: string;
  tag: string | null;
  setQuery: (value: string) => void;
  setTag: (tag: string | null) => void;
  clear: () => void;
}

export const useBlogFiltersStore = create<BlogFiltersState>((set) => ({
  query: "",
  tag: null,
  setQuery: (value) => set({ query: value }),
  setTag: (tag) => set({ tag }),
  clear: () => set({ query: "", tag: null })
}));

