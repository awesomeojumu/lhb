import { createTheme, responsiveFontSizes } from "@mui/material/styles";

// Define base palettes for light & dark modes
const lightPalette = {
  mode: "light",
  primary: {
    main: "#c2741bff", // Blue
    contrastText: "#fff",
  },
  secondary: {
    main: "#30662bff", // Purple
    contrastText: "#fff",
  },
  background: {
    default: "#f5f5f5",
    paper: "#ffffff",
  },
  text: {
    primary: "#000000ff",
    secondary: "#757575",
  },
};

const darkPalette = {
  mode: "dark",
  primary: {
    main: "#000000ff", // Light blue for dark mode
    contrastText: "#000",
  },
  secondary: {
    main: "#758108ff", // Light purple
    contrastText: "#000",
  },
  background: {
    default: "#121212",
    paper: "#000000ff",
  },
  text: {
    primary: "#ffffff",
    secondary: "#bdbdbd",
  },
};

// Global typography settings
const typography = {
  fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
  h1: { fontSize: "2.2rem", fontWeight: 600 },
  h2: { fontSize: "1.8rem", fontWeight: 600 },
  h3: { fontSize: "1.6rem", fontWeight: 500 },
  body1: { fontSize: "1rem" },
  body2: { fontSize: "0.875rem", color: "#616161" },
  button: { textTransform: "none", fontWeight: 600 },
};

// Global shape & shadows
const shape = { borderRadius: 8 };

const components = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        padding: "6px 16px",
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
      },
    },
  },
};

// ✅ Function to get theme by mode
export const getTheme = (mode = "light") => {
  const palette = mode === "dark" ? darkPalette : lightPalette;
  let theme = createTheme({
    palette,
    typography,
    shape,
    components,
  });
  return responsiveFontSizes(theme);
};
