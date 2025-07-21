import { ThemeProvider, CssBaseline } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { getTheme } from "@theme/muiTheme";
import { AuthProvider } from "@/context/AuthContext"; // ✅ Ensure this path is correct
import { ToastProvider } from "@/components/feedback/ToastProvider"; // ✅ Corrected import path
import { SettingsProvider, useSettings } from "@/context/SettingsContext";
import AppRoutes from "@/routes/AppRoutes";

function ThemedApp() {
  const { mode } = useSettings();

  return (
    <ThemeProvider theme={getTheme(mode)}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <ThemedApp />
    </SettingsProvider>
  );
}
