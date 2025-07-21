import { createContext, useContext, useState, useEffect } from "react";

const SettingsContext = createContext();
export const useSettings = () => useContext(SettingsContext);

export function SettingsProvider({ children }) {
  const [mode, setMode] = useState(localStorage.getItem("themeMode") || "light");

  const toggleMode = () => {
    setMode((prev) => {
      const newMode = prev === "light" ? "dark" : "light";
      localStorage.setItem("themeMode", newMode);
      return newMode;
    });
  };

  useEffect(() => {
    document.body.setAttribute("data-theme", mode);
  }, [mode]);

  return (
    <SettingsContext.Provider value={{ mode, toggleMode }}>
      {children}
    </SettingsContext.Provider>
  );
}
