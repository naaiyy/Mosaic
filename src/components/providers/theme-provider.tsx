"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

// Simple props definition with children and any additional props
type ThemeProviderProps = {
  children: ReactNode;
  // Use a more specific type instead of any
  [key: string]: ReactNode | string | boolean | undefined;
};

/**
 * Theme provider wrapper around next-themes
 * This component allows theme switching functionality throughout the application
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
