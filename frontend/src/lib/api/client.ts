import type {
  AdminSettings,
  MediaItem,
  Post,
  PostAdminSummary,
  PostEditorData,
  PostInsight
} from "../types";
import { mockPosts } from "../mockData";

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
  },

  /**
   * Admin-only: list posts with workflow + analytics metadata for the Posts screen.
   * For now this is populated entirely from mockPosts so the admin can run
   * without a dedicated backend.
   */
  async listAdminPosts(): Promise<PostAdminSummary[]> {
    // Derive simple admin summaries from the existing mock posts.
    return mockPosts.map((post, index): PostAdminSummary => {
      const viewsLast30Days = 1200 - index * 220;
      const clickThroughRate = index === 0 ? 0.22 : index === 1 ? 0.09 : 0.04;
      const seoHealth =
        clickThroughRate >= 0.18
          ? "healthy"
          : clickThroughRate >= 0.08
            ? "needs_attention"
            : "poor";

      return {
        id: post.id,
        slug: post.slug,
        title: post.title,
        status: index === 2 ? "draft" : "published",
        lastUpdatedAt: post.publishedAt,
        viewsLast30Days,
        clickThroughRate,
        seoHealth,
        publishedAt: index === 2 ? null : post.publishedAt
      };
    });
  },

  /**
   * Admin-only: fetch editor-focused data for a single post (or a new draft).
   * For now this is resolved entirely from mockPosts and does not call the API.
   */
  async getPostEditorData(id: number | "new"): Promise<PostEditorData> {
    if (id === "new") {
      return {
        post: null,
        status: "draft",
        scheduledFor: null,
        seo: {
          title: "",
          description: "",
          slug: ""
        },
        previewUrl: "/blog/preview"
      };
    }

    const existing = mockPosts.find((post) => post.id === id) ?? null;

    if (!existing) {
      return {
        post: null,
        status: "draft",
        scheduledFor: null,
        seo: {
          title: "",
          description: "",
          slug: ""
        },
        previewUrl: "/blog/preview"
      };
    }

    return {
      post: existing,
      status: "published",
      scheduledFor: null,
      seo: {
        title: existing.title,
        description: existing.excerpt,
        slug: existing.slug
      },
      previewUrl: `/blog/${existing.slug}`
    };
  },

  /**
   * Admin-only: fetch aggregated insights that directly drive actions.
   * Currently derived from the mock admin posts without hitting an API.
   */
  async getInsights(): Promise<PostInsight[]> {
    const adminPosts = await this.listAdminPosts();
    const sortedByViews = [...adminPosts].sort(
      (a, b) => b.viewsLast30Days - a.viewsLast30Days
    );

    const topPosts = sortedByViews.slice(0, 3);
    const decaying = sortedByViews.slice(-2);
    const highTrafficLowCtr = sortedByViews.filter(
      (post) => post.viewsLast30Days >= 800 && post.clickThroughRate < 0.1
    );

    const mapPosts = (posts: PostAdminSummary[]) => posts;

    return [
      {
        id: "top-posts-30d",
        kind: "topPosts",
        title: "Top posts (last 30 days)",
        description:
          "These posts are carrying most of your traffic. Keep them fresh and aligned with your current thinking.",
        posts: mapPosts(topPosts),
        action: {
          label: "Update post",
          href: topPosts[0] ? `/app/write?postId=${topPosts[0].id}` : "/app/write"
        }
      },
      {
        id: "decaying-posts",
        kind: "decayingPosts",
        title: "Decaying posts",
        description:
          "Once-strong posts that are slowly fading. A small refresh can often revive them.",
        posts: mapPosts(decaying),
        action: {
          label: "Refresh content",
          href: decaying[0] ? `/app/write?postId=${decaying[0].id}` : "/app/write"
        }
      },
      {
        id: "high-read-low-share",
        kind: "highReadLowShare",
        title: "High-read, low-commitment posts",
        description:
          "Readers are interested but not clicking deeper. Consider adding a stronger follow-up or CTA.",
        posts: mapPosts(highTrafficLowCtr),
        action: {
          label: "Write follow-up",
          href: "/app/write"
        }
      }
    ];
  },

  /**
   * Admin-only: list media assets for the Media screen.
   * Returns a small mock library for now.
   */
  async listMedia(): Promise<MediaItem[]> {
    return [
      {
        id: "hero-1",
        url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
        alt: "Laptop on a desk in a calm workspace",
        type: "image",
        usageCount: 2,
        createdAt: new Date("2025-01-10T10:00:00.000Z").toISOString()
      },
      {
        id: "whiteboard-1",
        url: "https://images.unsplash.com/photo-1553877522-43269d4ea984",
        alt: "Whiteboard with product diagrams",
        type: "image",
        usageCount: 1,
        createdAt: new Date("2025-02-01T12:00:00.000Z").toISOString()
      }
    ];
  },

  /**
   * Admin-only: fetch current admin/settings values.
   * Simple, boring defaults suitable for a solo writer.
   */
  async getAdminSettings(): Promise<AdminSettings> {
    return {
      seoDefaults: {
        defaultTitleSuffix: "• Minimalist Studio",
        defaultDescription:
          "Long-form writing on product, engineering, and design.",
        defaultOgImageUrl: "https://example.com/og/default.png"
      },
      authorName: "Minimalist Studio",
      authorBio:
        "Solo technical writer exploring the edges of product, engineering, and calm tooling.",
      integrations: {
        rssEnabled: true,
        emailDigestEnabled: false
      }
    };
  }
};

