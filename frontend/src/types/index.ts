export type PostTag = string;

export interface Post {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  tags: PostTag[];
  publishedAt: string;
  readingMinutesOverride: number | null;
  coverImage?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin-facing types for the writer console
// These are intentionally separate from the public-facing Post shape so that
// analytics and workflow metadata do not leak into the marketing surface.
// ─────────────────────────────────────────────────────────────────────────────

export type PostStatus = "draft" | "scheduled" | "published";

export type SeoHealth = "poor" | "needs_attention" | "healthy";

/** Summary row used in the Posts management view. */
export interface PostAdminSummary {
  id: number;
  slug: string;
  title: string;
  status: PostStatus;
  /** ISO string representing the last content update (not just metadata). */
  lastUpdatedAt: string;
  /** Total views for this post over the last 30 days. */
  viewsLast30Days: number;
  /**
   * Click-through rate for this post in list contexts (email, homepage, etc.).
   * Expressed as a 0–1 fraction (e.g. 0.24 → 24%).
   */
  clickThroughRate: number;
  /** High-level SEO health signal used to drive decisions in the table. */
  seoHealth: SeoHealth;
  /** When null, the post is not yet published. */
  publishedAt: string | null;
}

export interface PostSeoMeta {
  title: string;
  description: string;
  slug: string;
}

/** Shape used by the Write screen to edit a single post. */
export interface PostEditorData {
  post: Post | null;
  status: PostStatus;
  scheduledFor: string | null;
  seo: PostSeoMeta;
  /** Canonical preview URL for this post on the public site. */
  previewUrl: string;
}

export type InsightKind = "topPosts" | "decayingPosts" | "highReadLowShare";

export interface InsightAction {
  label: string;
  href: string;
}

/** A single actionable insight surfaced in the Insights screen. */
export interface PostInsight {
  id: string;
  kind: InsightKind;
  title: string;
  description: string;
  posts: PostAdminSummary[];
  action: InsightAction;
}

export interface SeoDefaults {
  defaultTitleSuffix: string;
  defaultDescription: string;
  defaultOgImageUrl: string;
}

export interface AdminSettings {
  seoDefaults: SeoDefaults;
  authorName: string;
  authorBio: string;
  /** RSS / email or other outbound integrations that affect publishing. */
  integrations: {
    rssEnabled: boolean;
    emailDigestEnabled: boolean;
  };
}
