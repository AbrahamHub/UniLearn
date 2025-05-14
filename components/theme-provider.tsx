"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// Sin cambios necesarios en este archivo, ya que no contiene texto visible para la IU.

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
