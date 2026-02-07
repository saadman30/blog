import { Module } from '@nestjs/common';
import { ContentModule } from '../content/content.module';
import { GetInsightsService } from './application/get-insights.service';
import { InsightsController } from './insights.controller';

@Module({
  imports: [ContentModule],
  controllers: [InsightsController],
  providers: [GetInsightsService],
})
export class InsightsModule {}
