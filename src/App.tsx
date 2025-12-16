import * as React from "react";
import { useEffect } from "react";
import { IAppProps } from "./IAppProps";
import AppRouter from "./approuter";
import { ThemeSettingsService } from "./services/ThemeSettingsService";
import "./App.css";

export const spContext = React.createContext<any>(null);

export const App: React.FC<IAppProps> = ({ sp, context }) => {

  useEffect(() => {
    loadTheme();
  }, [sp]);

  const loadTheme = async () => {
    try {
      const theme = await ThemeSettingsService(sp).getTheme();

      // ✅ Apply global theme variables
      document.documentElement.style.setProperty(
        "--primary",
        theme.PrimaryColor
      );
      document.documentElement.style.setProperty(
        "--secondary",
        theme.SecondaryColor
      );
      // ✅ Optional: expose logo URL globally if needed later
      if (theme.LogoUrl) {
        document.documentElement.style.setProperty(
          "--logo-url",
          `url(${theme.LogoUrl})`
        );
      }
    } catch (err) {
      console.error("Theme load failed", err);
    }
  };

  return (
    <spContext.Provider value={{ sp, context }}>
      <AppRouter />
    </spContext.Provider>
  );
};

export default App;
