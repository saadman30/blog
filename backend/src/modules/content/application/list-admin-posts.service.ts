import { Inject, Injectable } from '@nestjs/common';
import { IPostRepository, POST_REPOSITORY } from '../ports/post.repository.port';

function seoHealthFromCtr(ctr: number): 'poor' | 'needs_attention' | 'healthy' {
  if (ctr >= 0.18) return 'healthy';
  if (ctr >= 0.08) return 'needs_attention';
  return 'poor';
}

function statusToFrontend(
  s: string,
): 'draft' | 'scheduled' | 'published' {
  if (s === 'SCHEDULED') return 'scheduled';
  if (s === 'PUBLISHED') return 'published';
  return 'draft';
}

export interface PostAdminSummaryView {
  id: number;
  slug: string;
  title: string;
  status: 'draft' | 'scheduled' | 'published';
  lastUpdatedAt: string;
  viewsLast30Days: number;
  clickThroughRate: number;
  seoHealth: 'poor' | 'needs_attention' | 'healthy';
  publishedAt: string | null;
}

@Injectable()
export class ListAdminPostsService {
  constructor(@Inject(POST_REPOSITORY) private readonly postRepository: IPostRepository) {}

  async execute(): Promise<PostAdminSummaryView[]> {
    const posts = await this.postRepository.listAllWithAnalytics();
    return posts.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      status: statusToFrontend(p.status),
      lastUpdatedAt: p.updatedAt.toISOString(),
      viewsLast30Days: p.viewsLast30Days,
      clickThroughRate: p.clickThroughRate,
      seoHealth: seoHealthFromCtr(p.clickThroughRate),
      publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
    }));
  }
}
