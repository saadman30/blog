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
export class ListPublishedPostsService {
  constructor(@Inject(POST_REPOSITORY) private readonly postRepository: IPostRepository) {}

  async execute(): Promise<PublicPostView[]> {
    const posts = await this.postRepository.listPublished();
    return posts.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      body: p.body,
      tags: p.tagNames,
      publishedAt: p.publishedAt!.toISOString(),
      readingMinutesOverride: p.readingMinutesOverride,
      coverImage: p.coverImage,
    }));
  }
}
