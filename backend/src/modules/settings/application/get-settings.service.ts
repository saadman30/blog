import { Inject, Injectable } from '@nestjs/common';
import { ISettingsRepository, SETTINGS_REPOSITORY } from '../ports/settings.repository.port';

const DEFAULTS = {
  seoTitleSuffix: '• Minimalist Studio',
  seoDefaultDescription:
    'Long-form writing on product, engineering, and design.',
  seoDefaultOgImageUrl: 'https://example.com/og/default.png',
  authorName: 'Minimalist Studio',
  authorBio:
    'Solo technical writer exploring the edges of product, engineering, and calm tooling.',
  rssEnabled: true,
  emailDigestEnabled: false,
};

export interface AdminSettingsView {
  seoDefaults: {
    defaultTitleSuffix: string;
    defaultDescription: string;
    defaultOgImageUrl: string;
  };
  authorName: string;
  authorBio: string;
  integrations: { rssEnabled: boolean; emailDigestEnabled: boolean };
}

@Injectable()
export class GetSettingsService {
  constructor(
    @Inject(SETTINGS_REPOSITORY) private readonly settings: ISettingsRepository,
  ) {}

  async execute(): Promise<AdminSettingsView> {
    const entity = await this.settings.getOrCreate({
      id: 0,
      updatedAt: new Date(),
      ...DEFAULTS,
    });
    return {
      seoDefaults: {
        defaultTitleSuffix: entity.seoTitleSuffix,
        defaultDescription: entity.seoDefaultDescription,
        defaultOgImageUrl: entity.seoDefaultOgImageUrl,
      },
      authorName: entity.authorName,
      authorBio: entity.authorBio,
      integrations: {
        rssEnabled: entity.rssEnabled,
        emailDigestEnabled: entity.emailDigestEnabled,
      },
    };
  }
}
