import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsObject, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class SeoDefaultsDto {
  @ApiProperty()
  @IsString()
  defaultTitleSuffix!: string;

  @ApiProperty()
  @IsString()
  defaultDescription!: string;

  @ApiProperty()
  @IsString()
  defaultOgImageUrl!: string;
}

export class IntegrationsDto {
  @ApiProperty()
  @IsBoolean()
  rssEnabled!: boolean;

  @ApiProperty()
  @IsBoolean()
  emailDigestEnabled!: boolean;
}

export class AdminSettingsBodyDto {
  @ApiProperty({ type: SeoDefaultsDto })
  @IsObject()
  @ValidateNested()
  @Type(() => SeoDefaultsDto)
  seoDefaults!: SeoDefaultsDto;

  @ApiProperty()
  @IsString()
  authorName!: string;

  @ApiProperty()
  @IsString()
  authorBio!: string;

  @ApiProperty({ type: IntegrationsDto })
  @IsObject()
  @ValidateNested()
  @Type(() => IntegrationsDto)
  integrations!: IntegrationsDto;
}

export class AdminSettingsResponseDto {
  @ApiProperty({ type: SeoDefaultsDto })
  seoDefaults!: SeoDefaultsDto;
  @ApiProperty()
  authorName!: string;
  @ApiProperty()
  authorBio!: string;
  @ApiProperty({ type: IntegrationsDto })
  integrations!: IntegrationsDto;
}
