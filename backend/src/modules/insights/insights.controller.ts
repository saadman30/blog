import { Get, Controller } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetInsightsService } from './application/get-insights.service';

@ApiTags('admin')
@Controller('api/admin/insights')
export class InsightsController {
  constructor(private readonly getInsightsService: GetInsightsService) {}

  @Get()
  @ApiOperation({ summary: 'Get actionable writing insights' })
  @ApiResponse({ status: 200, description: 'List of insights (top posts, decaying, high traffic low CTR).' })
  async getInsights() {
    return this.getInsightsService.execute();
  }
}
