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
