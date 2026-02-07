import { Module } from '@nestjs/common';
import { ContentModule } from './modules/content/content.module';
import { PublicModule } from './modules/public/public.module';
import { InsightsModule } from './modules/insights/insights.module';
import { SettingsModule } from './modules/settings/settings.module';
import { TaxonomyModule } from './modules/taxonomy/taxonomy.module';
import { PrismaModule } from './common/prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    TaxonomyModule,
    ContentModule,
    PublicModule,
    InsightsModule,
    SettingsModule,
  ],
})
export class AppModule {}
