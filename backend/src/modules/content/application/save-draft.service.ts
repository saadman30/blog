import { Inject, Injectable } from '@nestjs/common';
import { PostStatus } from '@prisma/client';
import { IPostRepository, POST_REPOSITORY } from '../ports/post.repository.port';

export interface SaveDraftCommand {
  id: number | null;
  title: string;
  body: string;
  slug: string;
  description: string;
  status: 'draft' | 'scheduled' | 'published';
  scheduledFor: string | null;
}

const statusMap = {
  draft: 'DRAFT' as const,
  scheduled: 'SCHEDULED' as const,
  published: 'PUBLISHED' as const,
};

@Injectable()
export class SaveDraftService {
  constructor(@Inject(POST_REPOSITORY) private readonly postRepository: IPostRepository) {}

  async execute(cmd: SaveDraftCommand): Promise<{ id: number }> {
    const status = statusMap[cmd.status];
    const publishedAt =
      status === 'PUBLISHED' ? new Date() : null;
    const scheduledFor = cmd.scheduledFor ? new Date(cmd.scheduledFor) : null;

    if (cmd.id != null) {
      const existing = await this.postRepository.findById(cmd.id);
      if (!existing) {
        throw new Error(`Post ${cmd.id} not found`);
      }
      await this.postRepository.update(cmd.id, {
        title: cmd.title,
        excerpt: cmd.description,
        body: cmd.body,
        slug: cmd.slug,
        status,
        publishedAt: status === 'PUBLISHED' ? publishedAt : existing.publishedAt,
        scheduledFor,
      });
      return { id: cmd.id };
    }

    const slugExists = await this.postRepository.findBySlug(cmd.slug);
    if (slugExists) {
      throw new Error(`Slug already in use: ${cmd.slug}`);
    }

    const post = await this.postRepository.create({
      slug: cmd.slug,
      title: cmd.title,
      excerpt: cmd.description,
      body: cmd.body,
      status,
      publishedAt,
      scheduledFor,
      tagNames: [],
    });
    return { id: post.id };
  }
}
