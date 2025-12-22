import * as React from "react";
import { useEffect, useState, useContext, useMemo } from "react";
import { spContext } from "../../../../App";
import {
  ThemeSettingsService,
  ThemeSettings,
} from "../../../../services/ThemeSettingsService";

const AdminThemeSettings: React.FC = () => {
  const { sp } = useContext(spContext);
  const service = useMemo(() => ThemeSettingsService(sp), [sp]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<ThemeSettings>({
    PrimaryColor: "#0066ff",
    SecondaryColor: "#1f2937",
    BackgroundColor: "#ffffff",
    TextColor: "#111827",
    LogoUrl: "",
  });
  const logoUrlRef = React.useRef<string>("");


  useEffect(() => {
    const load = async () => {
      try {
        const data = await service.getTheme();
        setForm(data);
      } catch (e) {
        console.error("Failed to load theme settings", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [service]);

  const update = (k: keyof ThemeSettings, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const uploadLogo = async (file?: File) => {
    if (!file) return;

    setSaving(true);
    try {
      const url = await service.uploadLogo(file);

      // ✅ store synchronously
      logoUrlRef.current = url;

      // UI preview only
      setForm(prev => ({ ...prev, LogoUrl: url }));
    } catch (e) {
      console.error("Logo upload failed", e);
      alert("Logo upload failed");
    } finally {
      setSaving(false);
    }
  };


  const save = async () => {
    setSaving(true);
    try {
      const payload: ThemeSettings = {
        PrimaryColor: form.PrimaryColor,
        SecondaryColor: form.SecondaryColor,
        BackgroundColor: form.BackgroundColor,
        TextColor: form.TextColor,
        LogoUrl: logoUrlRef.current || "" // ✅ GUARANTEED VALUE
      };

      await service.updateTheme(payload);

      // apply instantly
      document.documentElement.style.setProperty("--primary", payload.PrimaryColor);
      document.documentElement.style.setProperty("--secondary", payload.SecondaryColor);
      document.documentElement.style.setProperty("--bg", payload.BackgroundColor);
      document.documentElement.style.setProperty("--text", payload.TextColor);

      if (payload.LogoUrl) {
        document.documentElement.style.setProperty(
          "--app-logo",
          `url(${payload.LogoUrl})`
        );
      }

      alert("Theme updated successfully");
    } catch (err) {
      console.error("Theme save failed", err);
    } finally {
      setSaving(false);
    }
  };


  if (loading) return <div>Loading…</div>;

  return (
    <div style={{ padding: 24, maxWidth: 700 }}>
      <h2>Theme Settings</h2>

      {[
        ["PrimaryColor", "Primary Color"],
        ["SecondaryColor", "Secondary Color"],
        ["BackgroundColor", "Background Color"],
        ["TextColor", "Text Color"],
      ].map(([key, label]) => (
        <div key={key} style={{ marginTop: 12 }}>
          <label>{label}</label><br />
          <input
            type="color"
            value={form[key as keyof ThemeSettings] as string}
            onChange={(e) =>
              update(key as keyof ThemeSettings, e.target.value)
            }
          />
        </div>
      ))}

      <div style={{ marginTop: 16 }}>
        <label>Upload Logo</label><br />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => uploadLogo(e.target.files?.[0])}
        />
        {form.LogoUrl && (
          <img
            src={form.LogoUrl}
            alt="Logo"
            style={{ height: 60, marginTop: 10 }}
          />
        )}
      </div>

      <button
        onClick={save}
        disabled={saving}
        style={{
          marginTop: 20,
          padding: "10px 20px",
          background: form.PrimaryColor,
          color: "#fff",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        {saving ? "Saving…" : "Save Theme"}
      </button>
    </div>
  );
};

export default AdminThemeSettings;
