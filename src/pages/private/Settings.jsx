import React, { useState } from "react";
import { useAuth } from "../../providers/AuthPrpvider";
import Loader from "../../components/Loader";

const supportedThemes = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
];

const Settings = () => {
  const { user: auth, setUser, loader } = useAuth();
  const user = auth?.get;
  const settings = user?.settings;
  const userInfo = user?.personalInfo;

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [notifications, setNotifications] = useState(
    localStorage.getItem("notifications") 
  );
  const [language, setLanguage] = useState(localStorage.getItem("lang") || "en");

  if (loader) return <Loader />;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">⚙️ Settings</h1>

      {/* Theme */}
      <div className="form-control mb-4 ">
        <label className="label">
          <span className="label-text pr-2">Theme</span>
        </label>
        <select
          className="select select-bordered"
          value={theme}
          data-choose-theme
          onChange={(e) => {
            document.querySelector("html").setAttribute("data-theme", e.target.value);
            setTheme(e.target.value);
          }}
        >
          {supportedThemes.map((th) => (
            <option key={th} value={th}>
              {th}
            </option>
          ))}
        </select>
      </div>

      {/* Notifications */}
      <div className="form-control mb-4">
        <label className="cursor-pointer label">
          <span className="label-text">Enable Notifications</span>
          <input
            type="checkbox"
            className="toggle toggle-primary"
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
          />
        </label>
      </div>

      {/* Language */}
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text pr-2">Language</span>
        </label>
        <select
          className="select select-bordered"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="mr">Marathi</option>
        </select>
      </div>

      {/* Save Button */}
      <button
        className="btn btn-primary w-full"
        onClick={() => {
          // Here you would update backend or context
          setUser((prev) => ({
            ...prev,
            get: {
              ...prev.get,
              settings: { theme, notifications, language },
            },
          }));
          localStorage.setItem("theme", theme);
          localStorage.setItem("lang", language);
          localStorage.setItem("notifications", notifications)
          document.querySelector("html").setAttribute("data-theme", theme);
        }}
      >
        Save Changes
      </button>
    </div>
  );
};

export default Settings;
