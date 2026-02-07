import { Inject, Injectable } from '@nestjs/common';
import { ISettingsRepository, SETTINGS_REPOSITORY } from '../ports/settings.repository.port';
import { AdminSettingsView } from './get-settings.service';

@Injectable()
export class UpdateSettingsService {
  constructor(
    @Inject(SETTINGS_REPOSITORY) private readonly settings: ISettingsRepository,
  ) {}

  async execute(input: AdminSettingsView): Promise<AdminSettingsView> {
    await this.settings.update({
      seoTitleSuffix: input.seoDefaults.defaultTitleSuffix,
      seoDefaultDescription: input.seoDefaults.defaultDescription,
      seoDefaultOgImageUrl: input.seoDefaults.defaultOgImageUrl,
      authorName: input.authorName,
      authorBio: input.authorBio,
      rssEnabled: input.integrations.rssEnabled,
      emailDigestEnabled: input.integrations.emailDigestEnabled,
    });
    return input;
  }
}
