import { Injectable } from '@nestjs/common';
import { ListAdminPostsService, PostAdminSummaryView } from '../../content/application/list-admin-posts.service';

export interface PostInsightResult {
  id: string;
  kind: 'topPosts' | 'decayingPosts' | 'highReadLowShare';
  title: string;
  description: string;
  posts: PostAdminSummaryView[];
  action: { label: string; href: string };
}

@Injectable()
export class GetInsightsService {
  constructor(private readonly listAdminPosts: ListAdminPostsService) {}

  async execute(): Promise<PostInsightResult[]> {
    const posts = await this.listAdminPosts.execute();
    const sortedByViews = [...posts].sort(
      (a, b) => b.viewsLast30Days - a.viewsLast30Days,
    );

    const topPosts = sortedByViews.slice(0, 3);
    const decaying = sortedByViews.slice(-2);
    const highTrafficLowCtr = sortedByViews.filter(
      (p) => p.viewsLast30Days >= 800 && p.clickThroughRate < 0.1,
    );

    return [
      {
        id: 'top-posts-30d',
        kind: 'topPosts',
        title: 'Top posts (last 30 days)',
        description:
          'These posts are carrying most of your traffic. Keep them fresh and aligned with your current thinking.',
        posts: topPosts,
        action: {
          label: 'Update post',
          href: topPosts[0] ? `/app/write?postId=${topPosts[0].id}` : '/app/write',
        },
      },
      {
        id: 'decaying-posts',
        kind: 'decayingPosts',
        title: 'Decaying posts',
        description:
          'Once-strong posts that are slowly fading. A small refresh can often revive them.',
        posts: decaying,
        action: {
          label: 'Refresh content',
          href: decaying[0] ? `/app/write?postId=${decaying[0].id}` : '/app/write',
        },
      },
      {
        id: 'high-read-low-share',
        kind: 'highReadLowShare',
        title: 'High-read, low-commitment posts',
        description:
          'Readers are interested but not clicking deeper. Consider adding a stronger follow-up or CTA.',
        posts: highTrafficLowCtr,
        action: { label: 'Write follow-up', href: '/app/write' },
      },
    ];
  }
}
