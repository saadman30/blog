import { create } from "zustand";

interface BookmarksState {
  ids: number[];
  isBookmarked: (id: number) => boolean;
  toggleBookmark: (id: number) => void;
}

const STORAGE_KEY = "blog-bookmarks";

const loadInitial = (): number[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // ignore
  }
  return [];
};

export const useBookmarksStore = create<BookmarksState>((set, get) => ({
  ids: [],
  isBookmarked: (id) => get().ids.includes(id),
  toggleBookmark: (id) =>
    set((state) => {
      const exists = state.ids.includes(id);
      const next = exists
        ? state.ids.filter((value) => value !== id)
        : [...state.ids, id];
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
      return { ids: next };
    })
}));

// Hydrate in a client effect
export const hydrateBookmarksStore = () => {
  if (typeof window === "undefined") return;
  const initial = loadInitial();
  useBookmarksStore.setState({ ids: initial });
};

