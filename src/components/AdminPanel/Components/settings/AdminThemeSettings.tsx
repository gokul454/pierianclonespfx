import * as React from "react";
import { useEffect, useState, useContext } from "react";
import { spContext } from "../../../../App";
import { ThemeSettingsService, ThemeSettings } from "../../../../services/ThemeSettingsService";

const AdminThemeSettings: React.FC = () => {
  const { sp } = useContext(spContext);
  const service = ThemeSettingsService(sp);

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  const [form, setForm] = useState<ThemeSettings>({
    PrimaryColor: "#0066ff",
    SecondaryColor: "#ff6600",
    AccentColor: "#00cc99",
    BackgroundColor: "#ffffff",
    LogoUrl: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const theme = await service.getTheme();
        if (theme) setForm(theme);
      } catch (err) {
        console.error("Failed to load theme settings:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const updateField = (key: keyof ThemeSettings, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const uploadLogo = async (file?: File) => {
    if (!file) return;
    setSaving(true);
    try {
      const url = await service.uploadLogo(file);
      updateField("LogoUrl", url);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Logo upload failed.");
    }
    setSaving(false);
  };

  const saveTheme = async () => {
    setSaving(true);
    try {
      await service.updateTheme(form);
      alert("Theme updated successfully.");
    } catch (err) {
      console.error("Save failed:", err);
      alert("Save failed.");
    }
    setSaving(false);
  };

  if (loading) return <div>Loading theme settings…</div>;

  return (
    <div style={{ padding: 20, maxWidth: 760 }}>
      <h2>Theme Settings</h2>

      <div style={{ marginTop: 16 }}>
        <label>Primary Color</label>
        <input
          type="color"
          value={form.PrimaryColor}
          onChange={(e) => updateField("PrimaryColor", e.target.value)}
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <label>Secondary Color</label>
        <input
          type="color"
          value={form.SecondaryColor}
          onChange={(e) => updateField("SecondaryColor", e.target.value)}
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <label>Accent Color</label>
        <input
          type="color"
          value={form.AccentColor}
          onChange={(e) => updateField("AccentColor", e.target.value)}
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <label>Background Color</label>
        <input
          type="color"
          value={form.BackgroundColor}
          onChange={(e) => updateField("BackgroundColor", e.target.value)}
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <label>Upload Logo</label><br/>
        <input type="file" accept="image/*"
          onChange={(e) => uploadLogo(e.target.files?.[0])}
        />
        {form.LogoUrl && (
          <div style={{ marginTop: 10 }}>
            <img src={form.LogoUrl} alt="Logo" style={{ height: 60 }} />
          </div>
        )}
      </div>

      <button
        onClick={saveTheme}
        disabled={saving}
        style={{
          marginTop: 20,
          background: form.PrimaryColor,
          color: "#fff",
          padding: "10px 20px",
          borderRadius: 5,
          border: "none",
          cursor: "pointer",
        }}
      >
        {saving ? "Saving…" : "Save Settings"}
      </button>
    </div>
  );
};

export default AdminThemeSettings;
