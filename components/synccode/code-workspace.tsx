"use client";

import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertTriangle, Check, ChevronDown, ChevronRight, CircleDot,
  Code2, FileCode2, FileJson2, FileText, Folder, FolderOpen, GitBranch,
  GitCommitHorizontal, LoaderCircle, PanelBottomClose, PanelBottomOpen,
  PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, Play,
  Search, Sparkles, TestTube2, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, Kbd, SectionLabel } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";
import { useDemo } from "@/lib/store";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

type SyncState = "SYNCED" | "MODIFIED" | "OUT_OF_SYNC" | "AI_FIX_READY" | "VALIDATED";
type FileStatus = "clean" | "modified" | "affected";
type PanelTab = "Context" | "AI" | "Agent" | "Impact";
type BottomTab = "PROBLEMS" | "OUTPUT" | "TESTS" | "CHANGES" | "TERMINAL";

type WorkspaceFile = {
  id: string;
  name: string;
  path: string;
  language: "typescript" | "json" | "markdown";
  content: string;
  status?: FileStatus;
};

type TreeEntry = string | { label: string; children: TreeEntry[] };

const tree: TreeEntry[] = [
  { label: "src", children: [
    { label: "components", children: ["profile", "checkout", "header"] },
    { label: "services", children: ["user-service", "order-service"] },
    { label: "types", children: ["user-type", "order-type"] },
    { label: "pages", children: ["dashboard", "profile-page"] },
  ] },
  { label: "tests", children: ["user-service-test", "profile-test"] },
  "package", "readme",
];

function fileIcon(file: WorkspaceFile) {
  if (file.name.endsWith(".json")) return <FileJson2 className="size-3.5 text-amber-200/80" />;
  if (file.name.endsWith(".md")) return <FileText className="size-3.5 text-slate-300/80" />;
  return <FileCode2 className="size-3.5 text-sky-300/85" />;
}

function statusDot(status?: FileStatus) {
  if (status === "modified") return <span className="size-1.5 rounded-full bg-amber-300" aria-label="Modified" />;
  if (status === "affected") return <AlertTriangle className="size-3 text-amber-300" aria-label="Affected by upstream change" />;
  return null;
}

function SyncStatus({ state }: { state: SyncState }) {
  const map = {
    SYNCED: { text: "Synchronized", color: "bg-emerald-400", tone: "text-emerald-200" },
    MODIFIED: { text: "Local changes", color: "bg-amber-300", tone: "text-amber-200" },
    OUT_OF_SYNC: { text: "Out of sync", color: "bg-amber-300", tone: "text-amber-200" },
    AI_FIX_READY: { text: "AI fix ready", color: "bg-violet-300", tone: "text-violet-200" },
    VALIDATED: { text: "Synchronized", color: "bg-emerald-300", tone: "text-emerald-100" },
  }[state];
  return <span className={cn("inline-flex items-center gap-1.5 text-[11px] font-medium", map.tone)}><span className={cn("size-1.5 rounded-full", map.color)} />{map.text}</span>;
}

function Modal({ children, onClose, label }: { children: React.ReactNode; onClose: () => void; label: string }) {
  return <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true" aria-label={label}>
    <button className="absolute inset-0 cursor-default" onClick={onClose} aria-label="Close dialog" />
    <section className="sc-rise relative w-full max-w-[460px] rounded-lg border border-white/10 bg-[#151517] shadow-2xl">{children}</section>
  </div>;
}

function FileExplorer({ files, activeId, search, setSearch, onOpen, hidden, setHidden }: {
  files: WorkspaceFile[]; activeId: string; search: string; setSearch: (value: string) => void; onOpen: (id: string) => void; hidden: boolean; setHidden: (value: boolean) => void;
}) {
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({ src: true, components: true, services: true, types: true, pages: true, tests: true });
  const lookup = (id: string) => files.find((f) => f.id === id)!;
  const show = (file: WorkspaceFile) => !search || `${file.name} ${file.path}`.toLowerCase().includes(search.toLowerCase());
  const renderItem = (item: TreeEntry, depth = 0): React.ReactNode => {
    if (typeof item === "string") {
      const file = lookup(item);
      if (!show(file)) return null;
      return <button key={file.id} onClick={() => onOpen(file.id)} title={`Owner: Aqib\nRepository: frontend-web\nDependencies: User API`} className={cn("group flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-left text-[11px] transition-colors", activeId === file.id ? "bg-white/[0.08] text-foreground" : "text-muted-foreground hover:bg-white/[0.045] hover:text-foreground")} style={{ paddingLeft: 8 + depth * 13 }}>
        {fileIcon(file)}<span className="min-w-0 flex-1 truncate">{file.name}</span>{statusDot(file.status)}
      </button>;
    }
    const isOpen = openFolders[item.label] ?? true;
    return <div key={item.label}>
      <button onClick={() => setOpenFolders((p) => ({ ...p, [item.label]: !isOpen }))} className="flex w-full items-center gap-1 py-1 text-left text-[11px] font-medium text-foreground/80 hover:text-foreground" style={{ paddingLeft: 6 + depth * 13 }}>
        {isOpen ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}{isOpen ? <FolderOpen className="size-3.5 text-violet-200/80" /> : <Folder className="size-3.5 text-violet-200/70" />}<span>{item.label}</span>
      </button>
      {isOpen && item.children.map((child) => renderItem(child, depth + 1))}
    </div>;
  };
  if (hidden) return <aside className="flex h-full w-full items-start justify-center border-r border-white/[0.07] pt-2"><button onClick={() => setHidden(false)} className="rounded p-1.5 text-muted-foreground hover:bg-white/[0.06] hover:text-foreground" title="Show files"><PanelLeftOpen className="size-3.5" /></button></aside>;
  return <aside className="flex h-full min-h-0 flex-col border-r border-white/[0.07] bg-[#0e0e10]">
    <div className="flex h-9 items-center border-b border-white/[0.06] px-2.5"><span className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">Explorer</span><button className="ml-auto rounded p-1 text-muted-foreground hover:bg-white/[0.06] hover:text-foreground" onClick={() => setHidden(true)} title="Hide files"><PanelLeftClose className="size-3.5" /></button></div>
    <div className="px-2 py-2"><div className="flex h-7 items-center gap-1.5 rounded border border-white/[0.09] bg-black/15 px-2 focus-within:border-white/20"><Search className="size-3 text-muted-foreground" /><input id="file-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search files..." className="min-w-0 flex-1 bg-transparent text-[11px] outline-none placeholder:text-muted-foreground/70" /><Kbd className="h-4 text-[8px]">⌘ P</Kbd></div></div>
    <div className="flex h-8 items-center gap-1 border-y border-white/[0.05] px-2.5"><ChevronDown className="size-3 text-muted-foreground" /><span className="text-[10px] font-semibold tracking-[0.06em] text-foreground/85">SHOPX-FRONTEND</span></div>
    <div className="min-h-0 flex-1 overflow-y-auto px-1.5 py-1.5">{tree.map((item) => renderItem(item))}</div>
    <div className="border-t border-white/[0.06] px-2.5 py-2 text-[10px] text-muted-foreground"><span className="text-emerald-300">●</span> frontend-web <span className="float-right sc-mono">main</span></div>
  </aside>;
}

function ContextPanel({ tab, setTab, syncState, upstream, fixPreview, fixApplied, onPreview, onApply, onDismiss, onViewImpact, hidden, setHidden }: {
  tab: PanelTab; setTab: (tab: PanelTab) => void; syncState: SyncState; upstream: boolean; fixPreview: boolean; fixApplied: boolean; onPreview: () => void; onApply: () => void; onDismiss: () => void; onViewImpact: () => void; hidden: boolean; setHidden: (value: boolean) => void;
}) {
  if (hidden) return <aside className="flex h-full items-start justify-center border-l border-white/[0.07] bg-[#0e0e10] pt-2"><button onClick={() => setHidden(false)} className="rounded p-1.5 text-muted-foreground hover:bg-white/[0.06] hover:text-foreground" title="Show context"><PanelRightOpen className="size-3.5" /></button></aside>;
  return <aside className="flex h-full min-h-0 flex-col border-l border-white/[0.07] bg-[#101012]">
    <div className="flex h-9 items-center border-b border-white/[0.06] px-2.5"><span className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">Sync Context</span><button className="ml-auto rounded p-1 text-muted-foreground hover:bg-white/[0.06] hover:text-foreground" onClick={() => setHidden(true)} title="Hide context"><PanelRightClose className="size-3.5" /></button></div>
    <div className="flex border-b border-white/[0.06] px-2">{(["Context", "Agent", "Impact"] as PanelTab[]).map((item) => <button key={item} onClick={() => setTab(item)} className={cn("relative flex-1 py-2 text-[11px] font-medium", tab === item ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>{item}{tab === item && <span className="absolute inset-x-2 bottom-0 h-px bg-violet-300" />}</button>)}</div>
    <div className="min-h-0 flex-1 overflow-y-auto p-3">
      {tab === "Context" && <div className="space-y-3">
        <div><SectionLabel>Sync context</SectionLabel><h2 className="mt-1 text-sm font-semibold">UserService</h2><p className="mt-0.5 text-[11px] text-muted-foreground">Contract-aware service boundary</p></div>
        {upstream && <div className="rounded-md border border-amber-300/25 bg-amber-300/[0.065] p-2.5"><div className="flex gap-2"><AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-amber-300" /><div><p className="text-[11px] font-semibold text-amber-100">OUT OF SYNC</p><p className="mt-1 text-[11px] leading-relaxed text-amber-100/70">User API changed <code className="sc-mono text-amber-100">name</code> → <code className="sc-mono text-amber-100">full_name</code>. Three downstream references may be affected.</p><p className="mt-1.5 sc-mono text-[9px] text-amber-100/55">2 repositories · 3 files · 1 developer</p><div className="mt-2 flex gap-1.5"><Button size="xs" variant="outline" onClick={onViewImpact}>View impact</Button><Button size="xs" onClick={() => setTab("Agent")}>Fix with Sync Agent</Button></div></div></div></div>}
        <dl className="divide-y divide-white/[0.06] border-y border-white/[0.06] text-[11px]">{[["Repository", "frontend-web"], ["Owner", "Aqib"], ["Depends on", "GET /api/users"], ["Used by", "Profile.tsx · Dashboard.tsx"]].map(([k, v]) => <div key={k} className="grid grid-cols-[78px_1fr] gap-2 py-2"><dt className="text-muted-foreground">{k}</dt><dd className="text-foreground/90">{v}</dd></div>)}</dl>
        <div className="flex items-center gap-2 rounded-md border border-white/[0.07] bg-white/[0.025] px-2.5 py-2"><SyncStatus state={syncState} /><span className="ml-auto sc-mono text-[10px] text-muted-foreground">#a92f31</span></div>
        <div className="overflow-hidden rounded-md border border-white/[0.07] bg-white/[0.02]"><div className="flex items-center gap-1.5 border-b border-white/[0.06] px-2.5 py-1.5"><Code2 className="size-3 text-sky-300" /><span className="text-[10px] font-medium">PREVIEW</span></div><div className="p-2.5 text-[11px]"><p className="font-semibold">ShopX</p><p className="mt-3 text-muted-foreground">Hello Aqib</p><p className="mt-1 rounded border border-white/[0.07] bg-black/10 px-2 py-1.5">Profile</p></div></div>
      </div>}
      {tab === "Agent" && <div className="space-y-3"><div><SectionLabel>Sync Agent</SectionLabel><h2 className="mt-1 flex items-center gap-1.5 text-sm font-semibold"><Sparkles className="size-3.5 text-violet-200" /> Workspace operator</h2></div><div className="sc-inset space-y-1.5 p-2.5 text-[11px]"><p>Current workspace <span className="float-right">frontend-web</span></p><p>Current file <span className="float-right">UserService.ts</span></p><p className="border-t border-white/[0.06] pt-1.5 text-muted-foreground">Repository · Git state · TypeScript · dependencies · ownership</p></div><div className="rounded-md border border-white/[0.10] bg-white/[0.035] p-2.5"><p className="text-[11px] font-medium">What do you want to change?</p><div className="mt-2 flex flex-wrap gap-1"><button onClick={onPreview} className="rounded border border-white/[0.08] px-1.5 py-1 text-[10px] text-muted-foreground hover:text-foreground">Analyze this file</button><button onClick={onPreview} className="rounded border border-white/[0.08] px-1.5 py-1 text-[10px] text-muted-foreground hover:text-foreground">Find consumers</button><button onClick={onPreview} className="rounded border border-white/[0.08] px-1.5 py-1 text-[10px] text-muted-foreground hover:text-foreground">Fix mismatch</button></div></div><p className="text-[10px] text-muted-foreground">Uses the capabilities available in your workspace.</p></div>}
      {tab === "AI" && <div className="space-y-3"><div><SectionLabel>Sync Agent</SectionLabel><h2 className="mt-1 flex items-center gap-1.5 text-sm font-semibold"><Sparkles className="size-3.5 text-foreground/70" /> Contract migration</h2></div>{fixApplied ? <div className="rounded-md border border-emerald-400/25 bg-emerald-400/[0.07] p-3"><p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-100"><Check className="size-3.5" /> Fix applied</p><p className="mt-1.5 text-[11px] text-emerald-100/70">Modified: UserService.ts, Profile.test.ts</p><Button size="xs" className="mt-2" onClick={() => document.getElementById("run-validation")?.click()}>Run validation</Button></div> : fixPreview ? <div className="space-y-2"><p className="text-[11px] leading-relaxed text-muted-foreground">Using Workspace files · TypeScript · Git · Test Runner</p><pre className="overflow-x-auto rounded-md border border-white/[0.08] bg-black/25 p-2.5 sc-mono text-[10px] leading-5"><span className="text-red-300">CURRENT  return user.name;</span>{"\n"}<span className="text-emerald-300">PROPOSED return user.full_name;</span></pre><div className="grid grid-cols-3 gap-1.5 text-center text-[10px]"><span className="rounded border border-white/[0.07] bg-white/[0.025] px-1 py-1.5">2 files</span><span className="rounded border border-white/[0.07] bg-white/[0.025] px-1 py-1.5">1 test</span><span className="rounded border border-emerald-400/20 bg-emerald-400/[0.06] px-1 py-1.5 text-emerald-200">LOW risk</span></div><div className="flex gap-1.5"><Button size="xs" onClick={onApply}>Apply Fix</Button><Button size="xs" variant="outline" onClick={onDismiss}>Reject</Button></div></div> : <div className="rounded-md border border-white/[0.10] bg-white/[0.035] p-3"><p className="text-[11px] leading-relaxed text-foreground/75">{upstream ? "I detected an upstream API contract change. Your code still expects user.name; the new API returns user.full_name." : "No active contract drift detected. Sync Agent is monitoring User API dependencies."}</p>{upstream && <><p className="mt-2 text-[11px] font-medium text-foreground/90">Recommended action: update UserService and Profile tests.</p><Button size="xs" className="mt-2" onClick={onPreview}>Preview fix</Button></>}</div>}</div>}
      {tab === "Impact" && <div className="space-y-3"><div><SectionLabel>Dependency impact</SectionLabel><h2 className="mt-1 text-sm font-semibold">User API contract</h2></div><div className="sc-mono space-y-2 text-[11px] text-foreground/85"><div className="rounded border border-amber-300/20 bg-amber-300/[0.06] px-2 py-1.5 text-amber-100">GET /api/users</div><div className="pl-3 text-muted-foreground">↓</div><div className="rounded border border-white/[0.08] bg-white/[0.025] px-2 py-1.5">UserService.ts</div><div className="pl-3 text-muted-foreground">↓</div><div className="rounded border border-white/[0.08] bg-white/[0.025] px-2 py-1.5">Profile.tsx · Dashboard.tsx</div><div className="pl-3 text-muted-foreground">↓</div><div className="rounded border border-white/[0.08] bg-white/[0.025] px-2 py-1.5">Profile.test.ts</div></div><div className="flex items-center justify-between border-t border-white/[0.06] pt-2 text-[11px]"><span className="text-muted-foreground">Owner</span><span>Aqib</span></div><div className="flex items-center justify-between text-[11px]"><span className="text-muted-foreground">Risk</span><Badge variant="medium">Medium</Badge></div><Button size="xs" variant="outline" onClick={onViewImpact}>Open impact view</Button></div>}
    </div>
  </aside>;
}

export function CodeWorkspace({ action }: { action?: string }) {
  const { workspace, openFile: openWorkspaceFile, updateFile: updateWorkspaceFile, simulateBreakingChange, previewFix: publishPreviewFix, applyFix: publishFix, runValidation: publishValidation, commitWorkspace, setWorkspaceFiles, setOpenFileIds, setActiveFileId, setWorkspaceSyncState } = useDemo();
  const files = workspace.files;
  const setFiles = setWorkspaceFiles;
  const activeId = workspace.activeFileId;
  const setActiveId = setActiveFileId;
  const openIds = workspace.openFileIds;
  const setOpenIds = setOpenFileIds;
  const [search, setSearch] = useState("");
  const syncState = ({ "Synchronized": "SYNCED", "Local changes": "MODIFIED", "Out of sync": "OUT_OF_SYNC", "AI fix ready": "AI_FIX_READY", "Validated": "VALIDATED" }[workspace.syncState] ?? "SYNCED") as SyncState;
  const setSyncState = useCallback((state: SyncState) => setWorkspaceSyncState(({ SYNCED: "Synchronized", MODIFIED: "Local changes", OUT_OF_SYNC: "Out of sync", AI_FIX_READY: "AI fix ready", VALIDATED: "Validated" })[state]), [setWorkspaceSyncState]);
  const [upstream, setUpstream] = useState(false);
  const [contextTab, setContextTab] = useState<PanelTab>("Context");
  const [fixPreview, setFixPreview] = useState(false);
  const [fixApplied, setFixApplied] = useState(false);
  const [validation, setValidation] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [bottomTab, setBottomTab] = useState<BottomTab>("TESTS");
  const [bottomOpen, setBottomOpen] = useState(true);
  const [gitOpen, setGitOpen] = useState(false);
  const [commitOpen, setCommitOpen] = useState(false);
  const [committed, setCommitted] = useState(false);
  const [impactOpen, setImpactOpen] = useState(false);
  const [filesHidden, setFilesHidden] = useState(false);
  const [contextHidden, setContextHidden] = useState(false);
  const timers = useRef<number[]>([]);

  const active = files.find((f) => f.id === activeId) ?? files[0];
  const changed = files.filter((f) => f.status === "modified");
  const dirtyCount = changed.length;

  const openFile = useCallback((id: string) => { openWorkspaceFile(id); }, [openWorkspaceFile]);
  const updateContent = useCallback((value?: string) => {
    if (value === undefined) return;
    updateWorkspaceFile(activeId, value);
    if (!upstream && !fixApplied) setSyncState("MODIFIED");
  }, [activeId, fixApplied, setSyncState, upstream, updateWorkspaceFile]);
  const simulateUpstream = useCallback(() => {
    setUpstream(true); setFixApplied(false); setFixPreview(false); setContextTab("Context"); setValidation(0); simulateBreakingChange();
  }, [simulateBreakingChange]);
  const previewFix = useCallback(() => { setFixPreview(true); setContextTab("AI"); publishPreviewFix(); }, [publishPreviewFix]);
  const applyFix = useCallback(() => {
    setFiles((p) => p.map((f) => {
      if (f.id === "user-service") return { ...f, content: f.content.replace("name: string", "full_name: string").replace("return user.name", "return user.full_name"), status: "modified" };
      if (f.id === "profile-test") return { ...f, content: f.content.replace('{ name: "Aqib" }', '{ full_name: "Aqib" }'), status: "modified" };
      return { ...f, status: f.status === "affected" ? "clean" : f.status };
    }));
    setFixApplied(true); setFixPreview(false); setUpstream(false); setSyncState("MODIFIED"); setContextTab("AI"); openFile("user-service");
    publishFix();
  }, [openFile, publishFix, setFiles, setSyncState]);
  const runValidation = useCallback(() => {
    timers.current.forEach(window.clearTimeout); timers.current = [];
    setValidation(1); setBottomOpen(true); setBottomTab("TESTS");
    [2, 3, 4].forEach((stage, index) => timers.current.push(window.setTimeout(() => { setValidation(stage as 2 | 3 | 4); if (stage === 4) { setSyncState("VALIDATED"); publishValidation(); } }, 650 * (index + 1))));
  }, [publishValidation, setSyncState]);
  const save = useCallback(() => { if (syncState === "MODIFIED") commitWorkspace(); }, [syncState, commitWorkspace]);
  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);
  useEffect(() => {
    const setCompactPanes = () => {
      if (window.innerWidth < 768) {
        setFilesHidden(true);
        setContextHidden(true);
      }
    };
    setCompactPanes();
    window.addEventListener("resize", setCompactPanes);
    return () => window.removeEventListener("resize", setCompactPanes);
  }, []);
  useEffect(() => {
    if (!action) return;
    const actions: Record<string, () => void> = { "run-validation": runValidation, "review-changes": () => { setBottomOpen(true); setBottomTab("CHANGES"); }, "view-impact": () => setImpactOpen(true), "ask-ai": previewFix, "apply-fix": applyFix, "commit": () => setCommitOpen(true), "search-files": () => document.getElementById("file-search")?.focus() };
    actions[action]?.();
  }, [action, applyFix, previewFix, runValidation]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey)) return;
      const k = e.key.toLowerCase();
      if (k === "p") { e.preventDefault(); document.getElementById("file-search")?.focus(); }
      if (k === "s") { e.preventDefault(); save(); }
      if (k === "enter") { e.preventDefault(); runValidation(); }
    };
    window.addEventListener("keydown", key); return () => window.removeEventListener("keydown", key);
  }, [runValidation, save]);

  return <div className="relative flex h-full min-h-0 min-w-0 flex-col overflow-hidden bg-[#0b0b0d]">
    <div className="relative flex h-10 shrink-0 items-center gap-2 border-b border-white/[0.07] bg-[#111113] px-3">
      <div className="flex min-w-0 items-center gap-1.5 text-[12px]"><Code2 className="size-3.5 text-violet-300" /><span className="font-semibold">ShopX</span><span className="text-muted-foreground">/ Code</span><span className="hidden text-muted-foreground lg:inline">/ frontend-web / src / services /</span><span className="hidden font-medium text-foreground/80 lg:inline"> UserService.ts</span></div>
      <div className="ml-auto flex items-center gap-1.5"><div className="hidden items-center gap-1.5 border-r border-white/[0.08] pr-2.5 md:flex"><SyncStatus state={syncState} /><button className="sc-mono rounded px-1.5 py-1 text-[10px] text-muted-foreground hover:bg-white/[0.06] hover:text-foreground" onClick={() => setGitOpen((v) => !v)}><GitBranch className="mr-1 inline size-3" />main {dirtyCount ? `${dirtyCount} modified` : ""}</button></div><div className="hidden items-center -space-x-1 md:flex"><span title="Aqib · Frontend Engineer"><Avatar initials="AQ" color="#7dd3fc" /></span><span title="Rahul · Backend Engineer · editing backend-api/routes/users.ts"><Avatar initials="RH" color="#c4b5fd" /></span><span title="Sara · Mobile Engineer"><Avatar initials="SR" color="#6ee7b7" /></span></div><Button size="xs" variant="outline" onClick={runValidation}><Play className="size-3" />Run</Button><Button size="xs" variant="outline" onClick={() => setCommitOpen(true)}><GitCommitHorizontal className="size-3" />Commit</Button><Button size="xs" onClick={() => { setContextTab("AI"); if (upstream) previewFix(); }}><Sparkles className="size-3" />AI</Button></div>
      {gitOpen && <div className="sc-rise absolute right-3 top-[86px] z-30 w-[250px] rounded-lg border border-white/10 bg-[#171719] p-2.5 shadow-2xl"><div className="flex items-center gap-2"><SectionLabel>Changes</SectionLabel><button className="ml-auto text-muted-foreground hover:text-foreground" onClick={() => setGitOpen(false)}><X className="size-3" /></button></div><div className="mt-2 divide-y divide-white/[0.06] border-y border-white/[0.06]">{changed.length ? changed.map((f) => <button key={f.id} onClick={() => openFile(f.id)} className="flex w-full items-center gap-2 px-1 py-2 text-left text-[11px] hover:text-foreground"><span className="sc-mono text-amber-300">M</span><span>{f.name}</span></button>) : <p className="px-1 py-2 text-[11px] text-muted-foreground">Working tree clean</p>}</div><div className="mt-2 flex gap-1.5"><Button size="xs" variant="outline" onClick={() => { setBottomOpen(true); setBottomTab("CHANGES"); }}>Review changes</Button><Button size="xs" onClick={() => setCommitOpen(true)}>Commit</Button></div></div>}
    </div>
    <div className="flex h-8 shrink-0 items-center gap-1 border-b border-white/[0.06] bg-[#0e0e10] px-3 text-[10px]">
      <span className="mr-1 font-semibold tracking-[0.10em] text-muted-foreground">WORKSPACE</span>
      <button onClick={() => setContextTab("Agent")} className="rounded px-1.5 py-1 text-violet-200 hover:bg-violet-400/[0.10]">✦ Ask Sync Agent</button>
      <button onClick={() => setContextTab("Agent")} className="rounded px-1.5 py-1 text-muted-foreground hover:bg-white/[0.06] hover:text-foreground">Analyze</button>
      <button onClick={previewFix} className="rounded px-1.5 py-1 text-muted-foreground hover:bg-white/[0.06] hover:text-foreground">Fix</button>
      <button onClick={runValidation} className="rounded px-1.5 py-1 text-muted-foreground hover:bg-white/[0.06] hover:text-foreground">Test</button>
      <button onClick={() => setBottomTab("CHANGES")} className="rounded px-1.5 py-1 text-muted-foreground hover:bg-white/[0.06] hover:text-foreground">Review</button>
      <button onClick={() => setCommitOpen(true)} className="rounded px-1.5 py-1 text-muted-foreground hover:bg-white/[0.06] hover:text-foreground">Commit</button>
      {!upstream && <button onClick={simulateUpstream} className="ml-auto hidden items-center gap-1 rounded border border-white/[0.10] bg-white/[0.025] px-1.5 py-1 text-muted-foreground hover:border-amber-300/30 hover:text-amber-100 lg:flex"><AlertTriangle className="size-3 text-amber-300" />Simulate upstream API change</button>}
      {upstream && <button onClick={() => setContextTab("Agent")} className="ml-auto flex items-center gap-1 rounded border border-amber-300/20 bg-amber-300/[0.06] px-1.5 py-1 text-amber-100"><AlertTriangle className="size-3 text-amber-300" />2 upstream issues</button>}
    </div>
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <div className="sc-workspace-grid min-h-0 min-w-0 flex-1" style={{ display: "grid", gridTemplateColumns: `${filesHidden ? 34 : 230}px minmax(0, 1fr) ${contextHidden ? 34 : 300}px` }}>
        <FileExplorer files={files} activeId={activeId} search={search} setSearch={setSearch} onOpen={openFile} hidden={filesHidden} setHidden={setFilesHidden} />
        <section className="flex min-w-0 flex-col bg-[#0c0c0e]">
          <div className="flex h-9 shrink-0 overflow-x-auto border-b border-white/[0.07] bg-[#101012]">{openIds.map((id) => { const file = files.find((f) => f.id === id)!; return <div key={id} className={cn("group flex shrink-0 items-center gap-1.5 border-r border-white/[0.07] px-2.5 text-[11px]", activeId === id ? "bg-[#0c0c0e] text-foreground" : "text-muted-foreground hover:bg-white/[0.03]")}><button onClick={() => setActiveId(id)} className="flex items-center gap-1.5"><FileCode2 className="size-3 text-sky-300/80" /><span>{file.name}</span>{statusDot(file.status)}</button><button onClick={() => { setOpenIds((p) => p.filter((item) => item !== id)); if (activeId === id) setActiveId(openIds.find((item) => item !== id) ?? "user-service"); }} className="opacity-0 hover:text-foreground group-hover:opacity-100" aria-label={`Close ${file.name}`}><X className="size-3" /></button></div>; })}</div>
          <div className="relative min-h-0 flex-1"><MonacoEditor height="100%" language={active.language} value={active.content} onChange={updateContent} theme="vs-dark" options={{ fontSize: 13, lineHeight: 21, fontFamily: "var(--font-mono), ui-monospace, SFMono-Regular, Menlo, monospace", minimap: { enabled: true, scale: 1 }, padding: { top: 14 }, scrollBeyondLastLine: false, smoothScrolling: true, cursorBlinking: "smooth", renderLineHighlight: "all", folding: true, glyphMargin: upstream && activeId === "user-service", wordWrap: "on", automaticLayout: true }} onMount={(editor, monaco) => { if (upstream && activeId === "user-service") editor.deltaDecorations([], [{ range: new monaco.Range(10, 1, 10, 1), options: { isWholeLine: true, className: "sc-impact-line", glyphMarginClassName: "sc-impact-glyph", hoverMessage: { value: "**Potential downstream impact**\n\nUser API response changed. Affected: Profile.tsx, Dashboard.tsx, UserService.test.ts" } } }]); }} /></div>
          {upstream && activeId === "user-service" && <button onClick={() => setImpactOpen(true)} className="absolute bottom-[calc(31%+20px)] right-[calc(18%+12px)] z-10 flex items-center gap-1 rounded border border-amber-300/25 bg-[#1d1910] px-2 py-1 text-[10px] text-amber-100 shadow-lg hover:bg-[#272012]"><AlertTriangle className="size-3 text-amber-300" /> Potential downstream impact</button>}
          <div className="flex h-6 shrink-0 items-center border-t border-white/[0.06] bg-[#101012] px-2.5 text-[10px] text-muted-foreground"><span>TypeScript</span><span className="mx-2 text-white/15">|</span><span>UTF-8</span><span className="ml-auto">Ln 1, Col 1</span></div>
        </section>
        <ContextPanel tab={contextTab} setTab={setContextTab} syncState={syncState} upstream={upstream} fixPreview={fixPreview} fixApplied={fixApplied} onPreview={previewFix} onApply={applyFix} onDismiss={() => setFixPreview(false)} onViewImpact={() => setImpactOpen(true)} hidden={contextHidden} setHidden={setContextHidden} />
      </div>
      <section className={cn("shrink-0 border-t border-white/[0.08] bg-[#101012] transition-[height] duration-200", bottomOpen ? "h-[184px]" : "h-8")}>
        <div className="flex h-8 items-center border-b border-white/[0.06] px-2"><button onClick={() => setBottomOpen((v) => !v)} className="mr-1 rounded p-1 text-muted-foreground hover:text-foreground">{bottomOpen ? <PanelBottomClose className="size-3" /> : <PanelBottomOpen className="size-3" />}</button>{(["PROBLEMS", "OUTPUT", "TESTS", "CHANGES", "TERMINAL"] as BottomTab[]).map((item) => <button key={item} onClick={() => { setBottomOpen(true); setBottomTab(item); }} className={cn("relative px-2 py-2 text-[10px] font-semibold tracking-[0.07em]", bottomTab === item ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>{item}{bottomTab === item && bottomOpen && <span className="absolute inset-x-2 bottom-0 h-px bg-violet-300" />}</button>)}<button id="run-validation" onClick={runValidation} className="ml-auto flex items-center gap-1 rounded px-1.5 py-1 text-[10px] text-muted-foreground hover:bg-white/[0.06] hover:text-foreground">{validation > 0 && validation < 4 ? <LoaderCircle className="size-3 animate-spin text-violet-300" /> : <TestTube2 className="size-3" />} Run tests</button></div>
        {bottomOpen && <div className="h-[152px] overflow-y-auto px-3 py-2.5">{bottomTab === "TESTS" && <div className="max-w-[700px]"><div className="mb-2 flex items-center gap-2"><span className="sc-mono text-[10px] text-muted-foreground">{validation ? validation < 4 ? "Running validation..." : "Validation passed" : "Latest validation · 3 passed · 0 failed"}</span>{validation === 4 && <Badge variant="ok">Validated</Badge>}</div>{([{ label: "Type check", step: 1 }, { label: "Unit tests", step: 2 }, { label: "Contract tests", step: 3 }] as const).map(({ label, step }) => <div key={label} className="flex h-7 items-center gap-2 border-b border-white/[0.045] text-[11px]">{validation >= step ? <Check className="size-3.5 text-emerald-300" /> : validation === step - 1 ? <LoaderCircle className="size-3.5 animate-spin text-violet-300" /> : <CircleDot className="size-3.5 text-muted-foreground/50" />}<span>{label}</span><span className="ml-auto sc-mono text-[10px] text-muted-foreground">{validation >= step ? "passed" : validation ? "queued" : "ready"}</span></div>)}<p className="mt-2 text-[10px] text-muted-foreground">{validation === 4 ? "3 passed · 0 failed · completed in 1.8s" : "Run checks locally in this simulated workspace."}</p></div>}{bottomTab === "CHANGES" && <div className="max-w-[700px] space-y-1">{changed.length ? changed.map((f) => <button key={f.id} onClick={() => openFile(f.id)} className="flex w-full items-center gap-2 rounded px-1.5 py-1 text-left text-[11px] hover:bg-white/[0.05]"><span className="sc-mono text-amber-300">M</span>{fileIcon(f)}<span>{f.path}</span></button>) : <p className="text-[11px] text-muted-foreground">No local changes. The working tree is clean.</p>}</div>}{bottomTab === "PROBLEMS" && <div className="text-[11px] text-muted-foreground">{upstream ? <span className="flex items-center gap-2 text-amber-200"><AlertTriangle className="size-3.5" /> User API contract drift: expected <code>name</code>, received <code>full_name</code>.</span> : "No problems detected in the current file."}</div>}{bottomTab === "OUTPUT" && <pre className="sc-mono text-[10px] leading-5 text-muted-foreground">SyncCode workspace ready{validation ? "\nValidation orchestrator attached to frontend-web" : "\nWatching User API dependency graph"}</pre>}{bottomTab === "TERMINAL" && <div className="sc-mono text-[11px] text-muted-foreground"><span className="text-emerald-300">aqib@shopx</span>:<span className="text-sky-200">~/frontend-web</span>$ <span className="text-muted-foreground/60">Terminal simulation — commands are disabled in this demo.</span></div>}</div>}
      </section>
    </div>
    {impactOpen && <div className="fixed inset-0 z-[80] flex justify-end bg-black/45" role="dialog" aria-modal="true" aria-label="Impact view"><button className="absolute inset-0" onClick={() => setImpactOpen(false)} aria-label="Close impact view" /><section className="sc-rise relative flex h-full w-full max-w-[380px] flex-col border-l border-white/10 bg-[#141416] shadow-2xl"><div className="flex items-center border-b border-white/[0.07] px-4 py-3"><div><SectionLabel>Impact</SectionLabel><h2 className="mt-0.5 text-sm font-semibold">User API</h2></div><button className="ml-auto rounded p-1 text-muted-foreground hover:bg-white/[0.06] hover:text-foreground" onClick={() => setImpactOpen(false)}><X className="size-4" /></button></div><div className="p-4"><div className="sc-mono space-y-2 text-[12px]"><div className="rounded border border-amber-300/25 bg-amber-300/[0.06] p-2 text-amber-100">GET /api/users</div><div className="pl-4 text-muted-foreground">↓</div><div className="rounded border border-white/[0.08] bg-white/[0.025] p-2">UserService.ts</div><div className="pl-4 text-muted-foreground">↓</div><div className="rounded border border-white/[0.08] bg-white/[0.025] p-2">Profile.tsx</div><div className="pl-4 text-muted-foreground">↓</div><div className="rounded border border-white/[0.08] bg-white/[0.025] p-2">Profile.test.ts</div></div><div className="mt-5 space-y-2 border-t border-white/[0.06] pt-4 text-[12px]"><p><span className="text-muted-foreground">Owner</span><span className="float-right">Aqib</span></p><p><span className="text-muted-foreground">Scope</span><span className="float-right">2 repositories · 3 files · 1 developer</span></p><p><span className="text-muted-foreground">Risk</span><Badge variant="medium" className="float-right">Medium</Badge></p></div></div></section></div>}
    {commitOpen && <Modal label="Commit changes" onClose={() => setCommitOpen(false)}><div className="flex items-center border-b border-white/[0.07] px-4 py-3"><div><h2 className="text-sm font-semibold">Commit changes</h2><p className="mt-0.5 text-[11px] text-muted-foreground">{changed.length || 2} files changed</p></div><button className="ml-auto text-muted-foreground hover:text-foreground" onClick={() => setCommitOpen(false)}><X className="size-4" /></button></div><div className="p-4"><div className="mb-3 rounded-md border border-white/[0.07] bg-black/15 p-2 text-[11px] text-muted-foreground">{(changed.length ? changed : files.filter((f) => ["user-service", "profile-test"].includes(f.id))).map((f) => <p key={f.id}>{f.name}</p>)}</div><label className="text-[11px] font-medium">Commit message<input defaultValue="Update user API consumer" className="mt-1.5 h-8 w-full rounded border border-white/[0.1] bg-white/[0.035] px-2 text-xs outline-none focus:border-violet-300/60" /></label>{committed && <p className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-200"><Check className="size-3.5" /> Committed <span className="sc-mono">a92f31</span></p>}<div className="mt-4 flex justify-end gap-1.5"><Button size="sm" variant="outline" onClick={() => setCommitOpen(false)}>Cancel</Button><Button size="sm" onClick={() => { setCommitted(true); setFiles((p) => p.map((f) => ({ ...f, status: "clean" }))); setSyncState("SYNCED"); }}>Commit</Button></div></div></Modal>}
  </div>;
}
