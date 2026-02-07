import { Module } from '@nestjs/common';
import { POST_REPOSITORY } from './ports/post.repository.port';
import { PrismaPostRepository } from './adapters/prisma-post.repository';
import { SaveDraftService } from './application/save-draft.service';
import { GetPostEditorDataService } from './application/get-post-editor-data.service';
import { ListAdminPostsService } from './application/list-admin-posts.service';
import { ListPublishedPostsService } from './application/list-published-posts.service';
import { GetPublicPostBySlugService } from './application/get-public-post-by-slug.service';
import { AdminPostsController } from './controllers/admin-posts.controller';

@Module({
  controllers: [AdminPostsController],
  providers: [
    { provide: POST_REPOSITORY, useClass: PrismaPostRepository },
    SaveDraftService,
    GetPostEditorDataService,
    ListAdminPostsService,
    ListPublishedPostsService,
    GetPublicPostBySlugService,
  ],
  exports: [
    ListPublishedPostsService,
    GetPublicPostBySlugService,
    ListAdminPostsService,
  ],
})
export class ContentModule {}
