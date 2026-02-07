import { Get, Param, Controller } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PostResponseDto } from '../content/dto/post-response.dto';
import { ListPublishedPostsService } from '../content/application/list-published-posts.service';
import { GetPublicPostBySlugService } from '../content/application/get-public-post-by-slug.service';

@ApiTags('public')
@Controller('api/public/posts')
export class PublicController {
  constructor(
    private readonly listPublished: ListPublishedPostsService,
    private readonly getBySlugService: GetPublicPostBySlugService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all published posts' })
  @ApiResponse({ status: 200, description: 'Published posts (newest first).', type: [PostResponseDto] })
  async listPosts(): Promise<PostResponseDto[]> {
    return this.listPublished.execute();
  }

  @Get('by-slug/:slug')
  @ApiOperation({ summary: 'Get a single published post by slug' })
  @ApiResponse({ status: 200, description: 'The post.', type: PostResponseDto })
  @ApiResponse({ status: 404, description: 'Not found.' })
  async getBySlug(@Param('slug') slug: string): Promise<PostResponseDto | null> {
    return this.getBySlugService.execute(slug);
  }
}
