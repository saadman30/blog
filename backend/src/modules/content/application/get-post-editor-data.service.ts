import { Inject, Injectable } from '@nestjs/common';
import { IPostRepository, POST_REPOSITORY } from '../ports/post.repository.port';

export interface PostEditorDataResult {
  post: {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    body: string;
    tags: string[];
    publishedAt: string;
    readingMinutesOverride: number | null;
    coverImage: string | null;
  } | null;
  status: 'draft' | 'scheduled' | 'published';
  scheduledFor: string | null;
  seo: { title: string; description: string; slug: string };
  previewUrl: string;
}

const statusToFrontend = (s: string): 'draft' | 'scheduled' | 'published' => {
  if (s === 'SCHEDULED') return 'scheduled';
  if (s === 'PUBLISHED') return 'published';
  return 'draft';
};

@Injectable()
export class GetPostEditorDataService {
  constructor(@Inject(POST_REPOSITORY) private readonly postRepository: IPostRepository) {}

  async execute(id: number | 'new'): Promise<PostEditorDataResult> {
    if (id === 'new') {
      return {
        post: null,
        status: 'draft',
        scheduledFor: null,
        seo: { title: '', description: '', slug: '' },
        previewUrl: '/blog/preview',
      };
    }

    const post = await this.postRepository.findById(id);
    if (!post) {
      return {
        post: null,
        status: 'draft',
        scheduledFor: null,
        seo: { title: '', description: '', slug: '' },
        previewUrl: '/blog/preview',
      };
    }

    const status = statusToFrontend(post.status);
    return {
      post: {
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        body: post.body,
        tags: post.tagNames,
        publishedAt: post.publishedAt ? post.publishedAt.toISOString() : '',
        readingMinutesOverride: post.readingMinutesOverride,
        coverImage: post.coverImage,
      },
      status,
      scheduledFor: post.scheduledFor ? post.scheduledFor.toISOString() : null,
      seo: {
        title: post.title,
        description: post.excerpt,
        slug: post.slug,
      },
      previewUrl: `/blog/${post.slug}`,
    };
  }
}
