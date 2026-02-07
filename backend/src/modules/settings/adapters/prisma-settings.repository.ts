import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import {
  AdminSettingsEntity,
  AdminSettingsUpdate,
  ISettingsRepository,
} from '../ports/settings.repository.port';

@Injectable()
export class PrismaSettingsRepository implements ISettingsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async get(): Promise<AdminSettingsEntity | null> {
    const row = await this.prisma.adminSettings.findFirst();
    return row ? this.toEntity(row) : null;
  }

  async getOrCreate(defaults: AdminSettingsEntity): Promise<AdminSettingsEntity> {
    const existing = await this.get();
    if (existing) return existing;
    const row = await this.prisma.adminSettings.create({
      data: {
        seoTitleSuffix: defaults.seoTitleSuffix,
        seoDefaultDescription: defaults.seoDefaultDescription,
        seoDefaultOgImageUrl: defaults.seoDefaultOgImageUrl,
        authorName: defaults.authorName,
        authorBio: defaults.authorBio,
        rssEnabled: defaults.rssEnabled,
        emailDigestEnabled: defaults.emailDigestEnabled,
      },
    });
    return this.toEntity(row);
  }

  async update(data: AdminSettingsUpdate): Promise<AdminSettingsEntity> {
    const existing = await this.prisma.adminSettings.findFirst();
    if (!existing) {
      throw new Error('Settings not initialized');
    }
    const row = await this.prisma.adminSettings.update({
      where: { id: existing.id },
      data: {
        ...(data.seoTitleSuffix != null && { seoTitleSuffix: data.seoTitleSuffix }),
        ...(data.seoDefaultDescription != null && {
          seoDefaultDescription: data.seoDefaultDescription,
        }),
        ...(data.seoDefaultOgImageUrl != null && {
          seoDefaultOgImageUrl: data.seoDefaultOgImageUrl,
        }),
        ...(data.authorName != null && { authorName: data.authorName }),
        ...(data.authorBio != null && { authorBio: data.authorBio }),
        ...(data.rssEnabled != null && { rssEnabled: data.rssEnabled }),
        ...(data.emailDigestEnabled != null && {
          emailDigestEnabled: data.emailDigestEnabled,
        }),
      },
    });
    return this.toEntity(row);
  }

  private toEntity(row: {
    id: number;
    seoTitleSuffix: string;
    seoDefaultDescription: string;
    seoDefaultOgImageUrl: string;
    authorName: string;
    authorBio: string;
    rssEnabled: boolean;
    emailDigestEnabled: boolean;
    updatedAt: Date;
  }): AdminSettingsEntity {
    return {
      id: row.id,
      seoTitleSuffix: row.seoTitleSuffix,
      seoDefaultDescription: row.seoDefaultDescription,
      seoDefaultOgImageUrl: row.seoDefaultOgImageUrl,
      authorName: row.authorName,
      authorBio: row.authorBio,
      rssEnabled: row.rssEnabled,
      emailDigestEnabled: row.emailDigestEnabled,
      updatedAt: row.updatedAt,
    };
  }
}
