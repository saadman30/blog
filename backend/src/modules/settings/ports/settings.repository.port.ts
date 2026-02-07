export interface AdminSettingsEntity {
  id: number;
  seoTitleSuffix: string;
  seoDefaultDescription: string;
  seoDefaultOgImageUrl: string;
  authorName: string;
  authorBio: string;
  rssEnabled: boolean;
  emailDigestEnabled: boolean;
  updatedAt: Date;
}

export interface AdminSettingsUpdate {
  seoTitleSuffix?: string;
  seoDefaultDescription?: string;
  seoDefaultOgImageUrl?: string;
  authorName?: string;
  authorBio?: string;
  rssEnabled?: boolean;
  emailDigestEnabled?: boolean;
}

export interface ISettingsRepository {
  get(): Promise<AdminSettingsEntity | null>;
  getOrCreate(defaults: AdminSettingsEntity): Promise<AdminSettingsEntity>;
  update(data: AdminSettingsUpdate): Promise<AdminSettingsEntity>;
}

export const SETTINGS_REPOSITORY = Symbol('SETTINGS_REPOSITORY');
