import { Body, Get, Put, Controller } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  AdminSettingsBodyDto,
  AdminSettingsResponseDto,
} from './dto/settings.dto';
import { GetSettingsService } from './application/get-settings.service';
import { UpdateSettingsService } from './application/update-settings.service';

@ApiTags('admin')
@Controller('api/admin/settings')
export class SettingsController {
  constructor(
    private readonly getSettings: GetSettingsService,
    private readonly updateSettings: UpdateSettingsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get admin/site settings' })
  @ApiResponse({ status: 200, description: 'Current settings.', type: AdminSettingsResponseDto })
  async get(): Promise<AdminSettingsResponseDto> {
    return this.getSettings.execute();
  }

  @Put()
  @ApiOperation({ summary: 'Update admin/site settings' })
  @ApiResponse({ status: 200, description: 'Updated settings.', type: AdminSettingsResponseDto })
  async update(@Body() body: AdminSettingsBodyDto): Promise<AdminSettingsResponseDto> {
    const view = {
      seoDefaults: body.seoDefaults,
      authorName: body.authorName,
      authorBio: body.authorBio,
      integrations: body.integrations,
    };
    return this.updateSettings.execute(view);
  }
}
