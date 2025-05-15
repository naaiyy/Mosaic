'use client';

import { type ReactNode } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

// Simple props definition with children and any additional props
type ThemeProviderProps = {
  children: ReactNode;
  [key: string]: any; // Allow any additional props to be passed through
};

/**
 * Theme provider wrapper around next-themes
 * This component allows theme switching functionality throughout the application
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
