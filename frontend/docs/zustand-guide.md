# Zustand: A Beginner's Guide (Using This Project's Examples)

This guide explains **Zustand** (German for “state”) and how it’s used in this blog project. No prior state-management experience is required.

---

## What is Zustand?

**Zustand** is a small library for managing **shared state** in React apps. “State” is data that can change over time (e.g. search text, theme, bookmarks). “Shared” means many components can read and update the same data without passing it through every layer via props.

### Why use it here?

- **Simple API** — You create a store with `create()` and use it with a hook.
- **No boilerplate** — No providers, actions, or reducers unless you want them.
- **Works well with React** — Components re-render only when the slice of state they use changes.

In this project, Zustand is used for:

1. **Blog filters** — search query and selected tag
2. **Bookmarks** — which post IDs are bookmarked
3. **Theme** — light vs dark mode

---

## Core idea: “Store” and “Hook”

1. **Store** — A single place that holds some state and functions to change it.
2. **Hook** — `useXxxStore()`: what you call inside React components to read that state and those functions.

You *create* the store once (in a file like `store/blogFiltersStore.ts`). You *use* the hook in any component that needs that state.

---

## How a store is created

Every Zustand store in this project follows the same pattern:

```ts
import { create } from "zustand";

interface MyState {
  someValue: string;
  setSomeValue: (value: string) => void;
}

export const useMyStore = create<MyState>((set) => ({
  someValue: "",
  setSomeValue: (value) => set({ someValue: value })
}));
```

What this does:

- **`create`** — Builds a new store.
- **`(set) => ({ ... })`** — A function that receives `set` and returns the initial state and updater functions.  
  - **`set({ ... })`** — Merges the object you pass into the current state and triggers re-renders for components that use that state.
- **`useMyStore`** — The hook you’ll use in components. The name is a convention: “use” + “Store name”.

Next we’ll see this pattern in the three real stores in this project.

---

## Example 1: Blog filters store (simplest)

**File:** `src/store/blogFiltersStore.ts`

```ts
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
```

### What’s in the store?

| Piece        | Role |
|-------------|------|
| `query`     | Current search text. |
| `tag`       | Currently selected tag or `null`. |
| `setQuery`  | Updates `query`. |
| `setTag`    | Updates `tag`. |
| `clear`     | Resets both to `""` and `null`. |

### How `set` works

- `set({ query: value })` — Replace `query` with `value`; leave everything else as is.
- `set({ query: "", tag: null })` — Update both at once.

You never mutate state by hand; you always call `set` with the new (or partial) state.

### Using it in a component

**File:** `src/components/molecules/SearchBar/SearchBar.tsx`

```tsx
import { useBlogFiltersStore } from "../../../store/blogFiltersStore";

export const SearchBar = ({ placeholder = "Search articles" }: Props) => {
  const { query, setQuery, clear } = useBlogFiltersStore();

  return (
    <div>
      <TextInput
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      {query ? (
        <Button type="button" onClick={clear}>Clear</Button>
      ) : null}
    </div>
  );
};
```

- **`const { query, setQuery, clear } = useBlogFiltersStore();`** — The component “subscribes” to `query`, `setQuery`, and `clear`. When `query` changes (via `set`), this component re-renders.
- The search box is controlled by `query`; typing calls `setQuery`, which updates the store and thus the UI.

Another component (e.g. the blog page content) can use `tag` and `setTag` from the same store. All of them share the same `query` and `tag`.

---

## Example 2: Bookmarks store (`set` + `get`)

**File:** `src/store/bookmarksStore.ts`

```ts
import { create } from "zustand";

interface BookmarksState {
  ids: number[];
  isBookmarked: (id: number) => boolean;
  toggleBookmark: (id: number) => void;
}

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
```

### New idea: `get`

The store creator receives **`(set, get)`**:

- **`set`** — Same as before: update state.
- **`get`** — Returns the *current* state at the time it’s called, without subscribing. Useful inside functions that need to read state but must not subscribe (e.g. `isBookmarked`).

Here, **`isBookmarked(id)`** is implemented as `get().ids.includes(id)`. If it used state from the closure, it could be stale. Using `get()` always reads the latest `ids`.

### New idea: `set` with a function

Sometimes you need the *previous* state to compute the next one. You can call `set` with a function:

```ts
set((state) => {
  const next = /* compute from state */;
  return { ids: next };
});
```

Zustand calls your function with the current `state`; you return the slice of state that changes (here `ids`). That’s exactly what `toggleBookmark` does: it adds or removes `id` from `ids` and returns `{ ids: next }`.

### Using it in a component

**File:** `src/components/organisms/PostCard/PostCard.tsx`

```tsx
import { useBookmarksStore } from "../../../store/bookmarksStore";

export const PostCard = ({ post, onTagClick }: Props) => {
  const { isBookmarked, toggleBookmark } = useBookmarksStore();
  const bookmarked = isBookmarked(post.id);

  return (
    <article>
      <button
        type="button"
        onClick={() => toggleBookmark(post.id)}
        aria-pressed={bookmarked}
      >
        <BookmarkIcon filled={bookmarked} />
      </button>
      {/* ... */}
    </article>
  );
};
```

- **`isBookmarked(post.id)`** — Uses the store’s `ids` (via `get()`) to decide if this post is bookmarked.
- **`toggleBookmark(post.id)`** — Adds or removes `post.id` from `ids` and syncs to `localStorage`.

Many `PostCard`s and the blog post page can all use `useBookmarksStore()` and stay in sync.

---

## Example 3: Theme store (side effects)

**File:** `src/store/themeStore.ts`

```ts
import { create } from "zustand";

export type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

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
```

### Side effects inside the store

Theme must:

1. Update Zustand state.
2. Persist to `localStorage`.
3. Update the DOM (`data-theme`) so CSS can switch light/dark.

So **`setTheme`** and **`toggleTheme`** do more than `set(...)`: they also run “side effects” (localStorage + `document.documentElement`). That’s a common pattern: keep all logic for a given concern inside the store, and components only call `setTheme` / `toggleTheme`.

### Using it in a component

**File:** `src/components/layout/RootLayoutShell.tsx`

```tsx
import { useThemeStore, hydrateInitialTheme } from "../../store/themeStore";

export const RootLayoutShell = ({ children }: Props) => {
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    hydrateInitialTheme();
  }, []);

  return (
    <div>
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={`Activate ${theme === "light" ? "dark" : "light"} mode`}
      >
        {theme === "light" ? "Dark" : "Light"}
      </button>
      {children}
    </div>
  );
};
```

- **`theme`** — Drives label and aria.
- **`toggleTheme`** — Handles flip, persistence, and DOM update inside the store.
- **`hydrateInitialTheme()`** — Runs once on the client to apply the saved or system theme before the first paint. “Hydration” here means “load stored/OS theme into the app when it boots in the browser.”

---

## Hydration (loading stored data on app load)

Stores that persist to `localStorage` start with default state (e.g. `theme: "light"`, `ids: []`). On the client, we want to “fill” the store with data from `localStorage` once. That’s **hydration**.

### Theme

**File:** `src/store/themeStore.ts`

```ts
export const hydrateInitialTheme = () => {
  if (typeof window === "undefined") return;
  const initial = getInitialTheme();  // from localStorage or system preference
  document.documentElement.setAttribute("data-theme", initial);
  window.localStorage.setItem("theme", initial);
};
```

The layout runs this inside `useEffect` so it runs only in the browser. The theme store’s initial state is still `"light"`; the layout (or similar) can also call `useThemeStore.setState({ theme: initial })` if you want Zustand’s state to match. The exact pattern in this project is in `RootLayoutShell` + `hydrateInitialTheme`.

### Bookmarks

**File:** `src/store/bookmarksStore.ts`

```ts
export const hydrateBookmarksStore = () => {
  if (typeof window === "undefined") return;
  const initial = loadInitial();  // from localStorage
  useBookmarksStore.setState({ ids: initial });
};
```

**`useBookmarksStore.setState({ ids: initial })`** — Updates the store from *outside* React (e.g. in a bootstrap script or layout `useEffect`). No need to go through `toggleBookmark`; you’re just setting the initial `ids` from disk.

You’d call `hydrateBookmarksStore()` once when the app mounts (e.g. in a layout or root client component), similar to `hydrateInitialTheme()`.

---

## Cheat sheet

| You want to…                | Use this                                      |
|-----------------------------|-----------------------------------------------|
| Create a store              | `create((set) => ({ ... }))` or `(set, get)`  |
| Update state (simple)       | `set({ key: newValue })`                      |
| Update state from old state | `set((state) => ({ key: compute(state) }))`   |
| Read state in an updater    | Use the `state` argument in `set((state)=>…)`|
| Read state in a getter      | `get().someKey`                               |
| Use the store in a component| `const { x, setX } = useMyStore();`           |
| Set state from outside React| `useMyStore.setState({ ... })`                |

---

## Summary

- **Zustand** = small state library: you create stores with `create()` and use them via hooks.
- **Store** = state + functions that call `set` (and optionally use `get`).
- **Components** call `useXxxStore()` and use the returned state and functions. They re-render when the slice they use changes.
- This project uses three stores: **blog filters** (query/tag), **bookmarks** (ids + toggle), and **theme** (light/dark + persistence). Each is a good example of reading, updating, and optionally hydrating from `localStorage`.

If you trace one flow (e.g. “typing in the search bar” or “clicking the theme button”) from the component through the store and back to the UI, you’ll see the same pattern: **component calls a store function → function calls `set` (and maybe does side effects) → components using that state re-render.**
