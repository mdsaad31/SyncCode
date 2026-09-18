"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity, Boxes, CheckSquare, GitPullRequest, LayoutDashboard, Network,
  Plug, Settings, Users, FolderGit2, Layers, X, AppWindow, Braces, PlayCircle,
  PanelLeftClose, PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDemo } from "@/lib/store";

const GROUPS: { label: string; items: { href: string; label: string; icon: typeof LayoutDashboard; badge?: string; alert?: boolean }[] }[] = [
  {
    label: "Overview",
    items: [
      { href: "/", label: "Overview", icon: LayoutDashboard },
    ],
  },
  {
    label: "Development",
    items: [
      { href: "/changes", label: "Changes", icon: GitPullRequest, badge: "3" },
      { href: "/capsules", label: "Change Capsules", icon: Layers },
      { href: "/impact", label: "Impact Graph", icon: Network },
      { href: "/integrations", label: "Integrations", icon: Plug },
    ],
  },
  {
    label: "Project",
    items: [
      { href: "/repositories", label: "Repositories", icon: FolderGit2 },
      { href: "/components", label: "Components", icon: AppWindow },
      { href: "/apis", label: "APIs", icon: Braces },
      { href: "/team", label: "Team", icon: Users },
    ],
  },
  {
    label: "AI & automation",
    items: [
      { href: "/ai", label: "AI Activity", icon: Activity },
      { href: "/approvals", label: "Approvals", icon: Boxes, badge: "1", alert: true },
      { href: "/runs", label: "Runs", icon: PlayCircle },
    ],
  },
];

export function Sidebar({ open, onClose, collapsed, onCollapsedChange }: { open: boolean; onClose: () => void; collapsed: boolean; onCollapsedChange: (value: boolean) => void }) {
  const path = usePathname();
  const { phase } = useDemo();
  const isActive = (href: string) => (href === "/" ? path === "/" : path === href || path.startsWith(href + "/"));

  const body = (
    <div className="flex h-full flex-col">
      <div className={cn("flex h-12 items-center gap-2 border-b border-white/[0.06]", collapsed ? "justify-center px-2" : "px-3.5")}>
        <span className="flex size-6 items-center justify-center rounded-md bg-white text-[11px] font-black text-black">S</span>
        {!collapsed && <span className="text-[13px] font-semibold tracking-tight">SyncCode</span>}
        {!collapsed && <span className="sc-mono ml-auto rounded border border-white/10 px-1 text-[9px] text-muted-foreground">v2.4</span>}
        <button className="hidden rounded p-1 text-muted-foreground hover:text-foreground lg:block" onClick={() => onCollapsedChange(!collapsed)} aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}>
          {collapsed ? <PanelLeftOpen className="size-3.5" /> : <PanelLeftClose className="size-3.5" />}
        </button>
        <button className="ml-1 rounded p-1 text-muted-foreground hover:text-foreground lg:hidden" onClick={onClose} aria-label="Close navigation">
          <X className="size-4" />
        </button>
      </div>

      <nav className={cn("flex-1 space-y-4 overflow-y-auto py-3", collapsed ? "px-2" : "px-2.5")} aria-label="Primary">
        {GROUPS.map((g) => (
          <div key={g.label}>
            {!collapsed && <p className="px-1.5 pb-1.5 text-[9px] font-semibold tracking-[0.16em] text-muted-foreground/70 uppercase">{g.label}</p>}
            <ul className="space-y-0.5">
              {g.items.map((it) => {
                const active = isActive(it.href);
                return (
                  <li key={it.href}>
                    <Link
                      href={it.href}
                      onClick={onClose}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group flex items-center gap-2.5 rounded-md px-2 py-[7px] text-[13px] transition-colors",
                        collapsed && "justify-center px-0",
                        active ? "bg-white/[0.07] font-medium text-foreground" : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
                      )}
                    >
                      <it.icon className={cn("size-3.5", active ? "text-foreground" : "text-muted-foreground/80 group-hover:text-foreground/80")} />
                      {!collapsed && <span className="flex-1">{it.label}</span>}
                      {!collapsed && it.badge && (
                        <span className={cn(
                          "sc-mono rounded px-1.5 py-px text-[10px]",
                          it.alert ? "bg-amber-400/15 text-amber-300" : "bg-white/[0.07] text-muted-foreground"
                        )}>{it.badge}</span>
                      )}
                      {active && !collapsed && <span className="h-3.5 w-px rounded bg-white/60" aria-hidden />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        <Link href="/settings" title={collapsed ? "Settings" : undefined} className={cn("flex items-center gap-2.5 rounded-md px-2 py-[7px] text-[13px]", collapsed && "justify-center px-0", path === "/settings" ? "bg-white/[0.07] text-foreground" : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground")}>
          <Settings className="size-3.5" /> {!collapsed && "Settings"}
        </Link>
      </nav>

      <div className={cn("border-t border-white/[0.06] p-2.5", collapsed && "p-2")}>
        <div className={cn("sc-inset flex items-center gap-2 p-2", collapsed && "justify-center p-1.5")}>
          <span className={cn("size-2 rounded-full", phase === "running" ? "sc-pulse-dot bg-violet-400" : phase === "blocked" ? "bg-red-400" : "bg-emerald-400")} aria-hidden />
          {!collapsed && <div className="min-w-0">
            <p className="text-[11px] font-medium text-foreground/90">{phase === "running" ? "Sync engine · running" : phase === "blocked" ? "Sync engine · blocked" : "production · synced"}</p>
            <p className="sc-mono truncate text-[10px] text-muted-foreground">4 repos · eu-west</p>
          </div>}
        </div>
        {!collapsed && <div className="mt-2 flex items-center gap-2 px-1">
          <span className="flex size-6 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-white">AQ</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium">Aqib</p>
            <p className="truncate text-[10px] text-muted-foreground">Frontend · owner</p>
          </div>
        </div>}
      </div>
    </div>
  );

  return (
    <>
      <aside className={cn("sticky top-0 hidden h-svh shrink-0 border-r border-white/[0.06] bg-[#0e0e10] transition-[width] duration-200 lg:block", collapsed ? "w-[58px]" : "w-[228px]")} aria-label="Sidebar">
        {body}
      </aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />
          <aside className="absolute inset-y-0 left-0 w-[260px] border-r border-white/10 bg-[#0e0e10]">{body}</aside>
        </div>
      )}
    </>
  );
}
