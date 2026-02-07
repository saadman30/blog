/** Matches Prisma schema enum PostStatus (avoids depending on generated client). */
export type PostStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED';

export interface PostEntity {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  status: PostStatus;
  publishedAt: Date | null;
  scheduledFor: Date | null;
  readingMinutesOverride: number | null;
  coverImage: string | null;
  createdAt: Date;
  updatedAt: Date;
  tagNames: string[];
}

export interface PostCreateInput {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  status: PostStatus;
  publishedAt?: Date | null;
  scheduledFor?: Date | null;
  readingMinutesOverride?: number | null;
  coverImage?: string | null;
  tagNames: string[];
}

export interface PostUpdateInput {
  slug?: string;
  title?: string;
  excerpt?: string;
  body?: string;
  status?: PostStatus;
  publishedAt?: Date | null;
  scheduledFor?: Date | null;
  readingMinutesOverride?: number | null;
  coverImage?: string | null;
  tagNames?: string[];
}

export interface IPostRepository {
  create(data: PostCreateInput): Promise<PostEntity>;
  update(id: number, data: PostUpdateInput): Promise<PostEntity>;
  findById(id: number): Promise<PostEntity | null>;
  findBySlug(slug: string): Promise<PostEntity | null>;
  listAll(): Promise<PostEntity[]>;
  listPublished(): Promise<PostEntity[]>;
  listAllWithAnalytics(): Promise<(PostEntity & { viewsLast30Days: number; clickThroughRate: number })[]>;
}

export const POST_REPOSITORY = Symbol('POST_REPOSITORY');
