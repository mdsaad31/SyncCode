import type { Metadata } from "next";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AppShell } from "@/components/synccode/app-shell";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "SyncCode — When code changes, consequences coordinate",
  description: "AI-powered change propagation: detect, understand impact, identify owners, generate fixes, validate, integrate.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("antialiased dark")}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
