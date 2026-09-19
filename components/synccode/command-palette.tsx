"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Boxes, Code2, FolderGit2, GitPullRequest, Layers, Network, Play, Search, Sparkles, TestTube2, Users } from "lucide-react";
import { Kbd } from "@/components/ui/primitives";
import { useDemo } from "@/lib/store";
import { CHANGES, REPOS, TEAM } from "@/lib/data";

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const { runDemo } = useDemo();
  const [q, setQ] = useState("");

  useEffect(() => {
    if (open) setQ("");
  }, [open ]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const commands = useMemo(() => {
    const list = [
      { group: "Code workspace", icon: Code2, label: "Open file", hint: "⌘ P", run: () => router.push("/code?action=search-files") },
      { group: "Code workspace", icon: Search, label: "Search files", hint: "⌘ P", run: () => router.push("/code?action=search-files") },
      { group: "Code workspace", icon: TestTube2, label: "Run validation", hint: "⌘ Enter", run: () => router.push("/code?action=run-validation") },
      { group: "Code workspace", icon: GitPullRequest, label: "Review changes", hint: "frontend-web", run: () => router.push("/code?action=review-changes") },
      { group: "Code workspace", icon: Network, label: "View impact", hint: "User API", run: () => router.push("/code?action=view-impact") },
      { group: "Code workspace", icon: Sparkles, label: "Ask Sync AI", hint: "contract migration", run: () => router.push("/code?action=ask-ai") },
      { group: "Code workspace", icon: Sparkles, label: "Apply AI fix", hint: "suggested", run: () => router.push("/code?action=apply-fix") },
      { group: "Code workspace", icon: GitPullRequest, label: "Commit changes", hint: "main", run: () => router.push("/code?action=commit") },
      { group: "Code workspace", icon: FolderGit2, label: "Switch repository", hint: "frontend-web", run: () => router.push("/code") },
      { group: "Navigate", icon: GitPullRequest, label: "Search changes", hint: "3 active", run: () => router.push("/changes") },
      { group: "Navigate", icon: Layers, label: "Open Change Capsule #1042", hint: "#1042", run: () => router.push("/capsules") },
      { group: "Navigate", icon: Network, label: "View impact graph", hint: "graph", run: () => router.push("/impact") },
      { group: "Navigate", icon: Boxes, label: "View approvals", hint: "1 pending", run: () => router.push("/approvals") },
      { group: "Navigate", icon: Users, label: "View team", hint: "4 members", run: () => router.push("/team") },
      { group: "Run", icon: Play, label: "Run demo — breaking change", hint: "demo", run: () => { router.push("/"); runDemo("breaking"); } },
      { group: "Run", icon: Play, label: "Run demo — high-risk change", hint: "blocked", run: () => { router.push("/"); runDemo("high-risk"); } },
      ...CHANGES.map((c) => ({ group: "Changes", icon: GitPullRequest, label: `Change #${c.num} — ${c.title}`, hint: c.repo, run: () => router.push(`/changes/${c.id}`) })),
      ...REPOS.map((r) => ({ group: "Repositories", icon: FolderGit2, label: `Open repository ${r.name}`, hint: r.stack, run: () => router.push("/repositories") })),
      ...TEAM.map((t) => ({ group: "People", icon: Users, label: `${t.name} — ${t.role}`, hint: t.current, run: () => router.push("/team") })),
    ];
    if (!q.trim()) return list.slice(0, 9);
    const needle = q.toLowerCase();
    return list.filter((c) => (c.label + c.hint + c.group).toLowerCase().includes(needle)).slice(0, 10);
  }, [q, router, runDemo]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center px-3 pt-[12vh]" role="dialog" aria-modal="true" aria-label="Command palette">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" onClick={onClose} />
      <div className="sc-rise relative w-full max-w-[560px] overflow-hidden rounded-xl border border-white/10 bg-[#141416] shadow-2xl">
        <div className="flex items-center gap-2 border-b border-white/[0.07] px-3.5">
          <Search className="size-4 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Type a command or search…"
            className="h-11 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
            aria-label="Command search"
          />
          <Kbd>esc</Kbd>
        </div>
        <div className="max-h-[340px] overflow-y-auto p-1.5">
          {commands.length === 0 && (
            <p className="px-3 py-6 text-center text-xs text-muted-foreground">No results for “{q}”. Try “approval”, “graph”, or “demo”.</p>
          )}
          {commands.map((c, i) => (
            <button
              key={`${c.label}-${i}`}
              onClick={() => { c.run(); onClose(); }}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] hover:bg-white/[0.06] focus-visible:bg-white/[0.06]"
            >
              <span className="flex size-7 items-center justify-center rounded-md border border-white/10 bg-white/[0.04]"><c.icon className="size-3.5 text-muted-foreground" /></span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-foreground/90">{c.label}</span>
                <span className="sc-mono block truncate text-[10px] text-muted-foreground">{c.group} · {c.hint}</span>
              </span>
              <ArrowUpRight className="size-3.5 text-muted-foreground/60" />
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 border-t border-white/[0.07] px-3.5 py-2 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><Kbd>↑↓</Kbd> navigate</span>
          <span className="flex items-center gap-1"><Kbd>↵</Kbd> run</span>
          <span className="ml-auto sc-mono">CHANGE → IMPACT → PEOPLE → ACTION</span>
        </div>
      </div>
    </div>
  );
}
