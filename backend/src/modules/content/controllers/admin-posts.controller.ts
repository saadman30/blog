import {
  Body,
  Get,
  Param,
  Post,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SaveDraftBodyDto } from '../dto/save-draft.dto';
import {
  PostAdminSummaryResponseDto,
  PostEditorDataResponseDto,
} from '../dto/post-response.dto';
import { SaveDraftService } from '../application/save-draft.service';
import { GetPostEditorDataService } from '../application/get-post-editor-data.service';
import { ListAdminPostsService } from '../application/list-admin-posts.service';

@ApiTags('admin')
@Controller('api/admin/posts')
export class AdminPostsController {
  constructor(
    private readonly saveDraftService: SaveDraftService,
    private readonly getPostEditorData: GetPostEditorDataService,
    private readonly listAdminPosts: ListAdminPostsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all posts (admin view with analytics)' })
  @ApiResponse({ status: 200, description: 'List of post summaries.', type: [PostAdminSummaryResponseDto] })
  async listPosts(): Promise<PostAdminSummaryResponseDto[]> {
    return this.listAdminPosts.execute();
  }

  @Get('new/editor-data')
  @ApiOperation({ summary: 'Get editor data for a new post' })
  @ApiResponse({ status: 200, description: 'Empty editor state.', type: PostEditorDataResponseDto })
  async getNewEditorData(): Promise<PostEditorDataResponseDto> {
    return this.getPostEditorData.execute('new');
  }

  @Get(':id/editor-data')
  @ApiOperation({ summary: 'Get editor data for an existing post' })
  @ApiResponse({ status: 200, description: 'Editor state for the post.', type: PostEditorDataResponseDto })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  async getEditorData(
    @Param('id') id: string,
  ): Promise<PostEditorDataResponseDto> {
    if (id === 'new') {
      return this.getPostEditorData.execute('new');
    }
    const numId = parseInt(id, 10);
    if (Number.isNaN(numId)) {
      throw new BadRequestException('Invalid post id');
    }
    return this.getPostEditorData.execute(numId);
  }

  @Post('save-draft')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create or update a draft (autosave)' })
  @ApiResponse({ status: 200, description: 'Saved; returns post id.' })
  @ApiResponse({ status: 400, description: 'Validation or business rule error.' })
  async saveDraft(@Body() body: SaveDraftBodyDto): Promise<{ id: number }> {
    try {
      const result = await this.saveDraftService.execute({
        id: body.id ?? null,
        title: body.title,
        body: body.body,
        slug: body.slug,
        description: body.description,
        status: body.status,
        scheduledFor: body.scheduledFor ?? null,
      });
      return result;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Save failed';
      if (msg.includes('not found')) throw new NotFoundException(msg);
      throw new BadRequestException(msg);
    }
  }
}
