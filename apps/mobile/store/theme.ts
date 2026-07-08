import { colors } from "@filmato/mobile/theme/colors";
import { create } from "zustand";

type Theme = "light" | "dark";

type ColorScheme = typeof colors.dark | typeof colors.light

type ThemeStore = {
    theme: Theme;
    colors: ColorScheme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

export const useTheme = create<ThemeStore>((set) => ({
    theme: "light",
    colors: colors.dark,
    setTheme: (theme: Theme) => set({
        theme,
        colors: colors[theme]
    }),
    toggleTheme: () => set((state) => {
        const next = state.theme === "dark" ? "light" : "dark";
        return { theme: next, colors: colors[next] };
    })
}))