"use client";

import { useCallback, useEffect, useState } from "react";
import { DemoProvider } from "@/lib/store";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { CommandPalette } from "./command-palette";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const onKey = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      setPaletteOpen((v) => !v);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onKey]);

  return (
    <DemoProvider>
      <div className="dark flex min-h-svh bg-background text-foreground">
        <Sidebar open={navOpen} onClose={() => setNavOpen(false)} collapsed={collapsed} onCollapsedChange={setCollapsed} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar onMenu={() => setNavOpen(true)} onPalette={() => setPaletteOpen(true)} />
          <main className="mx-auto w-full max-w-[1200px] flex-1 px-3 py-4 sm:px-5 sm:py-5">{children}</main>
          <footer className="border-t border-white/[0.06] px-4 py-2.5">
            <p className="sc-mono mx-auto max-w-[1200px] text-[10px] tracking-wide text-muted-foreground/70">
              CHANGE → IMPACT → PEOPLE → ACTION → VALIDATION → INTEGRATION <span className="float-right hidden sm:inline">SyncCode engine · deterministic demo</span>
            </p>
          </footer>
        </div>
        <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      </div>
    </DemoProvider>
  );
}
