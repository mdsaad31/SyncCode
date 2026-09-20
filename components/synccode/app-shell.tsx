"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { usePathname } from "next/navigation";
import { DemoProvider } from "@/lib/store";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { CommandPalette } from "./command-palette";
import { SyncAgentPanel } from "./agent-panel";
import { WorkspaceContextDrawer } from "./workspace-context-drawer";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [agentOpen, setAgentOpen] = useState(false);
  const [workspaceContextOpen, setWorkspaceContextOpen] = useState(false);

  const onKey = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && (e.key.toLowerCase() === "k" || (e.shiftKey && e.key.toLowerCase() === "p"))) {
      e.preventDefault();
      setPaletteOpen((v) => !v);
    }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "j") {
      e.preventDefault();
      setAgentOpen((v) => !v);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onKey]);

  return (
    <DemoProvider>
      <div
        className="dark h-dvh min-h-0 bg-background text-foreground lg:grid lg:grid-cols-[var(--sc-sidebar-width)_minmax(0,1fr)]"
        style={{ "--sc-sidebar-width": collapsed ? "64px" : "244px" } as CSSProperties}
      >
        <Sidebar open={navOpen} onClose={() => setNavOpen(false)} collapsed={collapsed} onCollapsedChange={setCollapsed} />
        <div className="flex min-w-0 min-h-0 flex-col">
          <Topbar onMenu={() => setNavOpen(true)} onPalette={() => setPaletteOpen(true)} onAgent={() => setAgentOpen(true)} onWorkspaceContext={() => setWorkspaceContextOpen(true)} />
          <main className={pathname.startsWith("/code") ? "min-h-0 w-full flex-1 overflow-hidden" : "mx-auto min-h-0 w-full max-w-[1280px] flex-1 overflow-y-auto px-4 py-6 sm:px-6"}>{children}</main>
          {!pathname.startsWith("/code") && <footer className="border-t border-white/[0.06] px-4 py-2.5">
            <p className="sc-mono mx-auto max-w-[1280px] text-[10px] tracking-wide text-muted-foreground/70">
              CHANGE → IMPACT → PEOPLE → ACTION → VALIDATION → INTEGRATION <span className="float-right hidden sm:inline">SyncCode engine · deterministic demo</span>
            </p>
          </footer>}
        </div>
        <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
        <SyncAgentPanel open={agentOpen} onClose={() => setAgentOpen(false)} />
        <WorkspaceContextDrawer open={workspaceContextOpen} onClose={() => setWorkspaceContextOpen(false)} />
      </div>
    </DemoProvider>
  );
}
