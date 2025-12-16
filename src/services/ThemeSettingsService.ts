import { SPFI } from "@pnp/sp";



export interface ThemeSettings {
  PrimaryColor: string;
  SecondaryColor: string;
  BackgroundColor: string;
  TextColor: string;
  LogoUrl: string;
}

export const ThemeSettingsService = (sp: SPFI) => {

  // Get latest theme
  const getTheme = async (): Promise<ThemeSettings> => {
    const items = await sp.web.lists
      .getByTitle("ThemeSettings")
      .items
      .orderBy("Created", false)
      .top(1)();

    if (!items.length) throw new Error("No theme found");

    const i = items[0];

    return {
      PrimaryColor: i.PrimaryColor,
      SecondaryColor: i.SecondaryColor,
      BackgroundColor: i.BackgroundColor,
      TextColor: i.TextColor,
      LogoUrl: i.LogoUrl || ""
    };
  };

  // Create new row every save
  const updateTheme = async (data: ThemeSettings) => {
    await sp.web.lists.getByTitle("ThemeSettings").items.add({
      PrimaryColor: data.PrimaryColor,
      SecondaryColor: data.SecondaryColor,
      BackgroundColor: data.BackgroundColor,
      TextColor: data.TextColor,
      LogoUrl: data.LogoUrl || ""
    });
  };

 const uploadLogo = async (file: File): Promise<string> => {
  const upload = await sp.web.lists
    .getByTitle("ThemeSettingsImages")
    .rootFolder
    .files
    .addUsingPath(
      `theme-logo-${Date.now()}-${file.name}`,
      file,
      { Overwrite: true }
    );

  return upload.data.ServerRelativeUrl;
};



  return { getTheme, updateTheme, uploadLogo };
};
