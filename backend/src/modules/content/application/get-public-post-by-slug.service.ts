import { Inject, Injectable } from '@nestjs/common';
import { IPostRepository, POST_REPOSITORY } from '../ports/post.repository.port';

export interface PublicPostView {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  tags: string[];
  publishedAt: string;
  readingMinutesOverride: number | null;
  coverImage: string | null;
}

@Injectable()
export class GetPublicPostBySlugService {
  constructor(@Inject(POST_REPOSITORY) private readonly postRepository: IPostRepository) {}

  async execute(slug: string): Promise<PublicPostView | null> {
    const post = await this.postRepository.findBySlug(slug);
    if (!post || post.status !== 'PUBLISHED' || !post.publishedAt) {
      return null;
    }
    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      body: post.body,
      tags: post.tagNames,
      publishedAt: post.publishedAt.toISOString(),
      readingMinutesOverride: post.readingMinutesOverride,
      coverImage: post.coverImage,
    };
  }
}
