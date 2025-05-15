import { alpha } from "@mui/material";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";

// Define color palette
const primaryMain = "#0cb5bf";
const secondaryMain = "#f5f5f5";
const neutralLight = "#f8f9fa";
const neutralDark = "#212529";

// Create the base theme
let theme = createTheme({
  palette: {
    primary: {
      main: primaryMain,
      light: alpha(primaryMain, 0.85),
      dark: "#2463cc",
      contrastText: "#ffffff",
    },
    secondary: {
      main: secondaryMain,
      light: alpha(secondaryMain, 0.85),
      dark: "#0e9384",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f5f7fa",
      paper: "#ffffff",
    },
    text: {
      primary: "#2c3e50",
      secondary: "#64748b",
    },
    grey: {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a",
    },
    error: {
      main: "#ef4444",
    },
    warning: {
      main: "#f59e0b",
    },
    info: {
      main: "#3b82f6",
    },
    success: {
      main: "#10b981",
    },
  },

  typography: {
    fontFamily: "'Avenir', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    h1: {
      fontFamily: "'Avenir', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      fontSize: "2.5rem",
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: "'Avenir', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      fontSize: "2rem",
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h3: {
      fontFamily: "'Avenir', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      fontSize: "1.75rem",
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontFamily: "'Avenir', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h5: {
      fontFamily: "'Avenir', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontFamily: "'Avenir', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 500,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
    button: {
      fontFamily: "'Avenir', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      fontWeight: 600,
      textTransform: "none",
    },
  },

  shape: {
    borderRadius: 12,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#c1c1c1",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#a8a8a8",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "10px 24px",
          boxShadow: "none",
          textTransform: "none",
          fontSize: "0.9rem",
          fontWeight: 500,
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            transform: "translateY(-1px)",
          },
        },
        contained: {
          boxShadow: "0px 4px 10px rgba(12, 181, 191, 0.2)",
          "&:hover": {
            boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
          },
        },
        containedPrimary: {
          backgroundImage: `linear-gradient(to right, ${primaryMain}, #4c8dff)`,
          "&:hover": {
            backgroundImage: `linear-gradient(to right, #2463cc, #3a7ff5)`,
          },
        },
        containedSecondary: {
          backgroundImage: `linear-gradient(to right, ${secondaryMain}, #20d0bb)`,
          "&:hover": {
            backgroundImage: `linear-gradient(to right, #0e9384, ${secondaryMain})`,
          },
        },
        outlined: {
          borderWidth: 2,
          "&:hover": {
            borderWidth: 2,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          fontFamily:
            "'Avenir', 'Helvetica Neue', Helvetica, Arial, sans-serif",
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            transition: "all 0.2s ease-in-out",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: alpha(primaryMain, 0.7),
            },
            "&.Mui-focused": {
              boxShadow: `0 0 0 3px ${alpha(primaryMain, 0.15)}`,
            },
          },
          "& .MuiInputLabel-root": {
            "&.Mui-focused": {
              color: primaryMain,
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        },
        elevation2: {
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        },
        elevation3: {
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          border: "none",
          backgroundImage: "none",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: "4px 10px",
          padding: "10px 12px",
          "&.Mui-selected": {
            backgroundColor: alpha(primaryMain, 0.1),
            "&:hover": {
              backgroundColor: alpha(primaryMain, 0.15),
            },
          },
          "&:hover": {
            backgroundColor: alpha(primaryMain, 0.05),
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 40,
          color: "inherit",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          margin: "16px 0",
        },
      },
    },
  },
});

// Make fonts responsive
theme = responsiveFontSizes(theme);

export default theme;
