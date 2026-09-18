"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity, Boxes, CheckSquare, GitPullRequest, LayoutDashboard, Network,
  Plug, Settings, Users, FolderGit2, Layers, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDemo } from "@/lib/store";

const GROUPS: { label: string; items: { href: string; label: string; icon: typeof LayoutDashboard; badge?: string; alert?: boolean }[] }[] = [
  {
    label: "Workspace",
    items: [
      { href: "/", label: "Overview", icon: LayoutDashboard },
      { href: "/changes", label: "Changes", icon: GitPullRequest, badge: "3" },
      { href: "/capsules", label: "Change Capsules", icon: Layers },
      { href: "/graph", label: "Impact Graph", icon: Network },
      { href: "/integrations", label: "Integrations", icon: Plug },
    ],
  },
  {
    label: "Coordination",
    items: [
      { href: "/team", label: "Team", icon: Users },
      { href: "/repositories", label: "Repositories", icon: FolderGit2 },
      { href: "/tasks", label: "Tasks", icon: CheckSquare },
    ],
  },
  {
    label: "Control",
    items: [
      { href: "/approvals", label: "Approvals", icon: Boxes, badge: "1", alert: true },
      { href: "/ai", label: "AI Activity", icon: Activity },
    ],
  },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const path = usePathname();
  const { phase } = useDemo();
  const isActive = (href: string) => (href === "/" ? path === "/" : path === href || path.startsWith(href + "/"));

  const body = (
    <div className="flex h-full flex-col">
      <div className="flex h-12 items-center gap-2 border-b border-white/[0.06] px-3.5">
        <span className="flex size-6 items-center justify-center rounded-md bg-white text-[11px] font-black text-black">S</span>
        <span className="text-[13px] font-semibold tracking-tight">SyncCode</span>
        <span className="sc-mono ml-auto rounded border border-white/10 px-1 text-[9px] text-muted-foreground">v2.4</span>
        <button className="ml-1 rounded p-1 text-muted-foreground hover:text-foreground lg:hidden" onClick={onClose} aria-label="Close navigation">
          <X className="size-4" />
        </button>
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto px-2.5 py-3" aria-label="Primary">
        {GROUPS.map((g) => (
          <div key={g.label}>
            <p className="px-1.5 pb-1.5 text-[9px] font-semibold tracking-[0.16em] text-muted-foreground/70 uppercase">{g.label}</p>
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
                        active ? "bg-white/[0.07] font-medium text-foreground" : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
                      )}
                    >
                      <it.icon className={cn("size-3.5", active ? "text-foreground" : "text-muted-foreground/80 group-hover:text-foreground/80")} />
                      <span className="flex-1">{it.label}</span>
                      {it.badge && (
                        <span className={cn(
                          "sc-mono rounded px-1.5 py-px text-[10px]",
                          it.alert ? "bg-amber-400/15 text-amber-300" : "bg-white/[0.07] text-muted-foreground"
                        )}>{it.badge}</span>
                      )}
                      {active && <span className="h-3.5 w-px rounded bg-white/60" aria-hidden />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        <Link href="/settings" className={cn("flex items-center gap-2.5 rounded-md px-2 py-[7px] text-[13px]", path === "/settings" ? "bg-white/[0.07] text-foreground" : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground")}>
          <Settings className="size-3.5" /> Settings
        </Link>
      </nav>

      <div className="border-t border-white/[0.06] p-2.5">
        <div className="sc-inset flex items-center gap-2 p-2">
          <span className={cn("size-2 rounded-full", phase === "running" ? "sc-pulse-dot bg-violet-400" : phase === "blocked" ? "bg-red-400" : "bg-emerald-400")} aria-hidden />
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-foreground/90">{phase === "running" ? "Sync engine · running" : phase === "blocked" ? "Sync engine · blocked" : "production · synced"}</p>
            <p className="sc-mono truncate text-[10px] text-muted-foreground">4 repos · eu-west</p>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2 px-1">
          <span className="flex size-6 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-white">AQ</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium">Aqib</p>
            <p className="truncate text-[10px] text-muted-foreground">Frontend · owner</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="sticky top-0 hidden h-svh w-[228px] shrink-0 border-r border-white/[0.06] bg-[#0e0e10] lg:block" aria-label="Sidebar">
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
