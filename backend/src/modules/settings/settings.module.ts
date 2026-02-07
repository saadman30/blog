import { Module } from '@nestjs/common';
import { SETTINGS_REPOSITORY } from './ports/settings.repository.port';
import { PrismaSettingsRepository } from './adapters/prisma-settings.repository';
import { GetSettingsService } from './application/get-settings.service';
import { UpdateSettingsService } from './application/update-settings.service';
import { SettingsController } from './settings.controller';

@Module({
  controllers: [SettingsController],
  providers: [
    { provide: SETTINGS_REPOSITORY, useClass: PrismaSettingsRepository },
    GetSettingsService,
    UpdateSettingsService,
  ],
})
export class SettingsModule {}
