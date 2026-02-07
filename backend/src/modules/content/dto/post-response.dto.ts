import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PostResponseDto {
  @ApiProperty()
  id!: number;
  @ApiProperty()
  slug!: string;
  @ApiProperty()
  title!: string;
  @ApiProperty()
  excerpt!: string;
  @ApiProperty()
  body!: string;
  @ApiProperty({ type: [String], example: ['design', 'product'] })
  tags!: string[];
  @ApiProperty({ example: '2026-01-15T10:00:00.000Z' })
  publishedAt!: string;
  @ApiPropertyOptional({ nullable: true })
  readingMinutesOverride!: number | null;
  @ApiPropertyOptional({ nullable: true })
  coverImage!: string | null;
}

export class PostAdminSummaryResponseDto {
  @ApiProperty()
  id!: number;
  @ApiProperty()
  slug!: string;
  @ApiProperty()
  title!: string;
  @ApiProperty({ enum: ['draft', 'scheduled', 'published'] })
  status!: 'draft' | 'scheduled' | 'published';
  @ApiProperty({ description: 'Last content update (ISO string).' })
  lastUpdatedAt!: string;
  @ApiProperty()
  viewsLast30Days!: number;
  @ApiProperty({ description: 'CTR as 0–1 fraction.', example: 0.22 })
  clickThroughRate!: number;
  @ApiProperty({ enum: ['poor', 'needs_attention', 'healthy'] })
  seoHealth!: 'poor' | 'needs_attention' | 'healthy';
  @ApiProperty({ nullable: true, description: 'When published; null if draft/scheduled.' })
  publishedAt!: string | null;
}

export class PostEditorDataResponseDto {
  @ApiPropertyOptional({ nullable: true })
  post!: PostResponseDto | null;
  @ApiProperty({ enum: ['draft', 'scheduled', 'published'] })
  status!: 'draft' | 'scheduled' | 'published';
  @ApiPropertyOptional({ nullable: true, description: 'Scheduled publish time (ISO).' })
  scheduledFor!: string | null;
  @ApiProperty({
    type: 'object',
    properties: { title: { type: 'string' }, description: { type: 'string' }, slug: { type: 'string' } },
  })
  seo!: { title: string; description: string; slug: string };
  @ApiProperty({ description: 'Canonical preview URL.' })
  previewUrl!: string;
}
