import type { Post } from "../types";

const getBaseUrl = () => {
  // Server-side (e.g. Docker): use API_BASE_URL so Next.js can reach the api service by hostname
  if (typeof window === "undefined" && process.env.API_BASE_URL) {
    return process.env.API_BASE_URL;
  }
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  return "http://localhost:4000";
};

const buildUrl = (path: string) => {
  const base = getBaseUrl().replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
};

async function handleJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as T;
}

export const api = {
  async listPosts(): Promise<Post[]> {
    try {
      const res = await fetch(buildUrl("/posts"), {
        next: { revalidate: 60 }
      });
      return handleJson<Post[]>(res);
    } catch (error) {
      // During build (e.g. in Docker), the JSON server might not be running.
      // In that case, gracefully fall back to an empty list instead of failing the build.
      console.warn("listPosts: falling back to empty list due to fetch error:", error);
      return [];
    }
  },

  async getPostBySlug(slug: string): Promise<Post | null> {
    const res = await fetch(buildUrl(`/posts?slug=${encodeURIComponent(slug)}`), {
      next: { revalidate: 60 }
    });
    const list = await handleJson<Post[]>(res);
    return list[0] ?? null;
  }
};

