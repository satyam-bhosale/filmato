export const palette = {
    black: "#000000",
    white: "#FFFFFF",

    primary: {
        100: "#EDE0FF",
        200: "#D4ADFF",
        300: "#B87FFF",
        400: "#9B52FF",
        500: "#7B2FFF",
        600: "#5C0FE0",
        700: "#3D2460",
        800: "#1F1035",
        900: "#170B28",
        950: "#0C001A",
    },

    secondary: {
        100: "#FFF9E0",
        200: "#FFF0A3",
        300: "#FFE566",
        400: "#FFD52E",
        500: "#FFCC00",
        600: "#CC9F00",
        700: "#BF9500",
        800: "#997800",
        900: "#735A00",
    },
} as const;

export const colors = {
    dark: {
        background: palette.black,
        surface: palette.primary[900],
        surfaceElevated: palette.primary[800],
        border: palette.primary[700],
        borderFocus: palette.primary[500],
        borderSubtle: palette.primary[950],

        textPrimary: palette.white,
        textSecondary: palette.primary[200],
        textTertiary: palette.primary[300],
        textPlaceholder: palette.primary[600],
        textOnAccent: palette.primary[900],

        accent: palette.secondary[500],
        accentLight: palette.secondary[400],
        accentDark: palette.secondary[600],
        accentMuted: palette.secondary[700],

        success: "#22C55E",
        error: "#FF3B30",
        warning: "#FF9500",
        info: "#0A84FF",
    },

    light: {
        background: palette.white,
        surface: palette.primary[100],
        surfaceElevated: palette.primary[200],
        border: palette.primary[300],
        borderFocus: palette.primary[700],
        borderSubtle: palette.primary[100],

        textPrimary: palette.black,
        textSecondary: palette.primary[900],
        textTertiary: palette.primary[700],
        textPlaceholder: palette.primary[400],
        textOnAccent: palette.primary[900],

        accent: palette.secondary[500],
        accentLight: palette.secondary[400],
        accentDark: palette.secondary[600],
        accentMuted: palette.secondary[700],

        success: "#16A34A",
        error: "#DC2626",
        warning: "#D97706",
        info: "#2563EB",
    }
} as const;

export type ColorScheme = typeof colors.dark | typeof colors.light;
export type ThemeMode = keyof typeof colors;