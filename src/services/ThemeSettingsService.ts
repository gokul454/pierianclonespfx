import { SPFI } from "@pnp/sp";

export interface ThemeSettings {
  PrimaryColor: string;
  SecondaryColor: string;
  AccentColor: string;
  BackgroundColor: string;
  LogoUrl: string;
}

const LIST_NAME = "ThemeSettings";

export const ThemeSettingsService = (sp: SPFI) => ({
  async getTheme(): Promise<ThemeSettings | null> {
    const items = await sp.web.lists
      .getByTitle(LIST_NAME)
      .items.filter(`Title eq 'global'`)
      .top(1)();

    return items.length > 0 ? items[0] : null;
  },

  async updateTheme(updated: Partial<ThemeSettings>) {
    const items = await sp.web.lists
      .getByTitle(LIST_NAME)
      .items.filter(`Title eq 'global'`)
      .top(1)();

    if (items.length === 0) throw new Error("ThemeSettings row not found.");

    const id = items[0].Id;

    return sp.web.lists.getByTitle(LIST_NAME).items.getById(id).update(updated);
  },

  async uploadLogo(file: File): Promise<string> {
    const folder = sp.web.getFolderByServerRelativePath("SiteAssets");

    const uploaded = await folder.files.addUsingPath(
      file.name,
      file,
      { Overwrite: true }
    );

    return uploaded.data.ServerRelativeUrl;
  }
});
