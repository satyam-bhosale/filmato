"use client"

import { Toaster } from "@shadcn/ui/components/sonner";
import { useTheme } from "next-themes";
import { ToasterProps } from "sonner";

export function SonnerProvider() {
    const { theme } = useTheme();

    return (
        <Toaster
            richColors={true}
            theme={theme as ToasterProps["theme"]}
            position="top-right"
        />
    )
}