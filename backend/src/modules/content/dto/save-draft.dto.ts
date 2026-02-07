import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsIn, IsISO8601, MinLength, MaxLength } from 'class-validator';

export class SaveDraftBodyDto {
  @ApiPropertyOptional({ description: 'Post id when updating an existing draft.', example: 1 })
  @IsOptional()
  @IsInt()
  id?: number | null;

  @ApiProperty({ description: 'Post title.', example: 'My post title' })
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  title!: string;

  @ApiProperty({ description: 'Raw body (e.g. Markdown).' })
  @IsString()
  body!: string;

  @ApiProperty({ description: 'URL slug.', example: 'my-post-title' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  slug!: string;

  @ApiProperty({ description: 'Short description (SEO/social).' })
  @IsString()
  description!: string;

  @ApiProperty({ enum: ['draft', 'scheduled', 'published'], description: 'Current workflow status.' })
  @IsIn(['draft', 'scheduled', 'published'])
  status!: 'draft' | 'scheduled' | 'published';

  @ApiPropertyOptional({ description: 'When to publish (ISO 8601). Required if status is scheduled.' })
  @IsOptional()
  @IsISO8601()
  scheduledFor?: string | null;
}
