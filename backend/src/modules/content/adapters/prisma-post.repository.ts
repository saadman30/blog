import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import {
  IPostRepository,
  PostEntity,
  PostCreateInput,
  PostUpdateInput,
  PostStatus,
} from '../ports/post.repository.port';

function toStatus(s: PostStatus): PostStatus {
  return s;
}

function mapRow(
  p: {
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
    tags: { tag: { name: string } }[];
  },
  extra?: { viewsLast30Days: number; clickThroughRate: number },
): PostEntity | (PostEntity & { viewsLast30Days: number; clickThroughRate: number }) {
  const entity: PostEntity = {
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    body: p.body,
    status: toStatus(p.status),
    publishedAt: p.publishedAt,
    scheduledFor: p.scheduledFor,
    readingMinutesOverride: p.readingMinutesOverride,
    coverImage: p.coverImage,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    tagNames: p.tags.map((t) => t.tag.name),
  };
  if (extra) {
    return { ...entity, ...extra };
  }
  return entity;
}

@Injectable()
export class PrismaPostRepository implements IPostRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Prisma model delegates; typed as any so we don't depend on generated client module for types. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private get db(): any {
    return this.prisma;
  }

  async create(data: PostCreateInput): Promise<PostEntity> {
    const tagIds = await this.ensureTagIds(data.tagNames);
    const post = await this.db.post.create({
      data: {
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt,
        body: data.body,
        status: data.status,
        publishedAt: data.publishedAt ?? null,
        scheduledFor: data.scheduledFor ?? null,
        readingMinutesOverride: data.readingMinutesOverride ?? null,
        coverImage: data.coverImage ?? null,
        tags: { create: tagIds.map((tagId) => ({ tagId })) },
      },
      include: { tags: { include: { tag: true } } },
    });
    return mapRow(post) as PostEntity;
  }

  async update(id: number, data: PostUpdateInput): Promise<PostEntity> {
    const existing = await this.db.post.findUnique({
      where: { id },
      include: { tags: { include: { tag: true } } },
    });
    if (!existing) {
      throw new Error(`Post ${id} not found`);
    }
    const tagIds = data.tagNames != null ? await this.ensureTagIds(data.tagNames) : undefined;
    await this.db.post.update({
      where: { id },
      data: { tags: { deleteMany: {} } },
    });
    const post = await this.db.post.update({
      where: { id },
      data: {
        ...(data.slug != null && { slug: data.slug }),
        ...(data.title != null && { title: data.title }),
        ...(data.excerpt != null && { excerpt: data.excerpt }),
        ...(data.body != null && { body: data.body }),
        ...(data.status != null && { status: data.status }),
        ...(data.publishedAt !== undefined && { publishedAt: data.publishedAt }),
        ...(data.scheduledFor !== undefined && { scheduledFor: data.scheduledFor }),
        ...(data.readingMinutesOverride !== undefined && {
          readingMinutesOverride: data.readingMinutesOverride,
        }),
        ...(data.coverImage !== undefined && { coverImage: data.coverImage }),
        ...(tagIds != null && { tags: { create: tagIds.map((tagId) => ({ tagId })) } }),
      },
      include: { tags: { include: { tag: true } } },
    });
    return mapRow(post) as PostEntity;
  }

  async findById(id: number): Promise<PostEntity | null> {
    const post = await this.db.post.findUnique({
      where: { id },
      include: { tags: { include: { tag: true } } },
    });
    return post ? (mapRow(post) as PostEntity) : null;
  }

  async findBySlug(slug: string): Promise<PostEntity | null> {
    const post = await this.db.post.findUnique({
      where: { slug },
      include: { tags: { include: { tag: true } } },
    });
    return post ? (mapRow(post) as PostEntity) : null;
  }

  async listAll(): Promise<PostEntity[]> {
    const posts = await this.db.post.findMany({
      include: { tags: { include: { tag: true } } },
      orderBy: { updatedAt: 'desc' },
    });
    return posts.map((p: Parameters<typeof mapRow>[0]) => mapRow(p) as PostEntity);
  }

  async listPublished(): Promise<PostEntity[]> {
    const posts = await this.db.post.findMany({
      where: { status: 'PUBLISHED', publishedAt: { not: null } },
      include: { tags: { include: { tag: true } } },
      orderBy: { publishedAt: 'desc' },
    });
    return posts.map((p: Parameters<typeof mapRow>[0]) => mapRow(p) as PostEntity);
  }

  async listAllWithAnalytics(): Promise<
    (PostEntity & { viewsLast30Days: number; clickThroughRate: number })[]
  > {
    const posts = await this.db.post.findMany({
      include: {
        tags: { include: { tag: true } },
        postAnalytics: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
    return posts.map((p: Parameters<typeof mapRow>[0] & { postAnalytics?: { viewsLast30Days: number; clickThroughRate: number } | null }) => {
      const entity = mapRow(p) as PostEntity;
      const a = p.postAnalytics;
      return {
        ...entity,
        viewsLast30Days: a?.viewsLast30Days ?? 0,
        clickThroughRate: a?.clickThroughRate ?? 0,
      };
    });
  }

  private async ensureTagIds(names: string[]): Promise<number[]> {
    const ids: number[] = [];
    for (const name of names) {
      const tag = await this.db.tag.upsert({
        where: { name },
        create: { name },
        update: {},
      });
      ids.push(tag.id);
    }
    return ids;
  }
}
