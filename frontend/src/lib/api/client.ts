import type {
  AdminSettings,
  Post,
  PostAdminSummary,
  PostEditorData,
  PostInsight
} from "../types";

const getBaseUrl = () => {
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
      const res = await fetch(buildUrl("/api/public/posts"), {
        next: { revalidate: 60 }
      });
      return handleJson<Post[]>(res);
    } catch (error) {
      console.warn("listPosts: falling back to empty list due to fetch error:", error);
      return [];
    }
  },

  async getPostBySlug(slug: string): Promise<Post | null> {
    const res = await fetch(buildUrl(`/api/public/posts/by-slug/${encodeURIComponent(slug)}`), {
      next: { revalidate: 60 }
    });
    const data = await handleJson<Post | null>(res);
    return data;
  },

  async listAdminPosts(): Promise<PostAdminSummary[]> {
    const res = await fetch(buildUrl("/api/admin/posts"));
    return handleJson<PostAdminSummary[]>(res);
  },

  async getPostEditorData(id: number | "new"): Promise<PostEditorData> {
    const path = id === "new" ? "/api/admin/posts/new/editor-data" : `/api/admin/posts/${id}/editor-data`;
    const res = await fetch(buildUrl(path));
    return handleJson<PostEditorData>(res);
  },

  async getInsights(): Promise<PostInsight[]> {
    const res = await fetch(buildUrl("/api/admin/insights"));
    return handleJson<PostInsight[]>(res);
  },

  async getAdminSettings(): Promise<AdminSettings> {
    const res = await fetch(buildUrl("/api/admin/settings"));
    return handleJson<AdminSettings>(res);
  }
};
