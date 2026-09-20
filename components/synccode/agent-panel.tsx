"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronRight, CircleDot, GitBranch, Send, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/primitives";
import { CAPABILITIES, type Capability } from "@/lib/agent";
import { useDemo } from "@/lib/store";
import { cn } from "@/lib/utils";

const suggestions = ["Analyze this file", "Find affected consumers", "Fix the current API mismatch", "Run validation", "Review recent changes", "Prepare commit"];

function CapabilityDetail({ capability, onClose }: { capability: Capability; onClose: () => void }) {
  return <div className="fixed inset-0 z-[90] flex justify-end bg-black/50" role="dialog" aria-modal="true" aria-label={`${capability.name} capability details`}>
    <button className="absolute inset-0" onClick={onClose} aria-label="Close capability details" />
    <section className="sc-rise relative flex h-full w-full max-w-[390px] flex-col border-l border-white/10 bg-[#141416] shadow-2xl">
      <header className="flex items-start border-b border-white/[0.07] px-4 py-4"><div><p className="text-sm font-semibold">{capability.name}</p><p className="mt-1 text-[11px] text-muted-foreground">{capability.status === "connected" ? `Connected via ${capability.source}` : `Available from ${capability.source}`}</p></div><button onClick={onClose} className="ml-auto rounded p-1 text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"><X className="size-4" /></button></header>
      <div className="space-y-5 p-4"><div><SectionLabel>Capabilities</SectionLabel><ul className="mt-2 space-y-2">{capability.capabilities.map((item) => <li key={item} className="flex items-center gap-2 text-[12px]"><Check className="size-3.5 text-emerald-300" />{item}</li>)}</ul></div><div className="sc-inset p-3"><SectionLabel>Status</SectionLabel><p className="mt-1.5 flex items-center gap-2 text-[12px] font-medium"><span className={cn("size-1.5 rounded-full", capability.availableToAgent ? "bg-emerald-400" : "bg-white/35")} />{capability.availableToAgent ? "Available to Sync Agent" : "Available to connect"}</p></div></div>
    </section>
  </div>;
}

export function AvailableCapabilities({ compact = false }: { compact?: boolean }) {
  const [selected, setSelected] = useState<Capability | null>(null);
  const displayed = compact ? CAPABILITIES.slice(0, 5) : CAPABILITIES;
  return <><section className={compact ? "" : "sc-panel overflow-hidden"} aria-label="Available capabilities"><div className={compact ? "" : "border-b border-white/[0.06] px-3.5 py-3"}><SectionLabel>Available capabilities</SectionLabel>{!compact && <p className="mt-1 text-xs text-muted-foreground">Sync Agent uses capabilities available in your workspace.</p>}</div><div className={compact ? "mt-2 space-y-1" : "divide-y divide-white/[0.05]"}>{displayed.map((capability) => <button key={capability.id} onClick={() => setSelected(capability)} className={cn("flex w-full items-center gap-2 text-left hover:bg-white/[0.035]", compact ? "rounded px-1 py-1.5" : "px-3.5 py-2.5")}><span className={cn("size-1.5 rounded-full", capability.status === "connected" ? "bg-emerald-400" : "bg-white/35")} /><span className="min-w-0 flex-1"><span className="block text-[12px] font-medium">{capability.name}</span>{!compact && <span className="block text-[10px] text-muted-foreground">{capability.status === "connected" ? "Connected" : "Available"} · {capability.source}</span>}</span>{capability.availableToAgent && <span className="text-[10px] text-emerald-200">Agent ready</span>}<ChevronRight className="size-3.5 text-muted-foreground" /></button>)}</div>{!compact && <Link href="/agent/tools" className="flex items-center gap-1 border-t border-white/[0.06] px-3.5 py-2.5 text-[11px] text-muted-foreground hover:text-foreground">+ Add capability <ChevronRight className="ml-auto size-3" /></Link>}</section>{selected && <CapabilityDetail capability={selected} onClose={() => setSelected(null)} />}</>;
}

export function SyncAgentPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [task, setTask] = useState("");
  const [stage, setStage] = useState<"idle" | "working" | "ready">("idle");
  const { workspace } = useDemo();

  if (!open) return null;
  const start = (value = task) => { setTask(value); setStage("working"); window.setTimeout(() => setStage("ready"), 900); };
  return <div className="fixed inset-0 z-[80] flex justify-end bg-black/45" role="dialog" aria-modal="true" aria-label="Sync Agent">
    <button className="absolute inset-0" onClick={onClose} aria-label="Close Sync Agent" />
    <section className="sc-rise relative flex h-full w-full max-w-[440px] flex-col border-l border-white/10 bg-[#141416] shadow-2xl">
      <header className="flex items-start border-b border-white/[0.07] px-4 py-3.5"><span className="mr-2 flex size-7 items-center justify-center rounded-md border border-violet-300/20 bg-violet-400/[0.10]"><Sparkles className="size-3.5 text-violet-200" /></span><div><SectionLabel>Sync Agent</SectionLabel><p className="mt-0.5 text-sm font-semibold">Workspace operator</p></div><button onClick={onClose} className="ml-auto rounded p-1 text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"><X className="size-4" /></button></header>
      <div className="min-h-0 flex-1 overflow-y-auto p-4"><div className="sc-inset p-3 text-[11px]"><p><span className="text-muted-foreground">Project:</span> <span className="float-right">{workspace.project}</span></p><p className="mt-1.5"><span className="text-muted-foreground">Repository:</span> <span className="float-right">{workspace.repository} · {workspace.branch}</span></p><p className="mt-1.5"><span className="text-muted-foreground">Current file:</span> <span className="float-right truncate max-w-[160px]">{workspace.currentFile.split("/").pop()}</span></p><p className="mt-2 border-t border-white/[0.06] pt-2 text-muted-foreground">Dependencies · ownership · recent changes · {workspace.capabilities.filter((item) => item.availableToAgent).length} tools ready</p></div>
        {stage !== "idle" && <div className="mt-3 rounded-md border border-violet-300/20 bg-violet-400/[0.06] p-3"><p className="text-[12px] font-semibold">{stage === "working" ? "Analyzing workspace…" : "Patch plan ready"}</p><ul className="mt-2 space-y-1.5 text-[11px] text-foreground/85">{["Found affected references", "Inspected User API dependency", "Identified Aqib as owner", "Generated downstream patch"].map((line, i) => <li key={line} className="flex items-center gap-2">{stage === "working" && i === 3 ? <CircleDot className="size-3.5 animate-spin text-violet-300" /> : <Check className="size-3.5 text-emerald-300" />}{line}</li>)}</ul>{stage === "ready" && <><div className="mt-3 grid grid-cols-3 gap-1.5 text-center text-[10px]"><span className="sc-inset py-1.5">2 files</span><span className="sc-inset py-1.5">1 test</span><span className="rounded border border-emerald-400/20 bg-emerald-400/[0.06] py-1.5 text-emerald-200">LOW risk</span></div><Button size="xs" className="mt-3" asChild><Link href="/code?action=ask-ai" onClick={onClose}>Preview fix</Link></Button></>}</div>}
        <div className="mt-4"><SectionLabel>Suggested actions</SectionLabel><div className="mt-2 flex flex-wrap gap-1.5">{suggestions.map((item) => <button key={item} onClick={() => start(item)} className="rounded border border-white/[0.09] bg-white/[0.025] px-2 py-1.5 text-[11px] text-muted-foreground transition-colors hover:border-violet-300/35 hover:text-foreground">{item}</button>)}</div></div><div className="mt-5"><AvailableCapabilities compact /></div><div className="mt-4 flex items-center gap-2 rounded-md border border-white/[0.07] bg-white/[0.025] px-2.5 py-2 text-[11px]"><GitBranch className="size-3.5 text-muted-foreground" /><span className="text-muted-foreground">GitHub</span><span className="ml-auto">shopx-frontend · 2 modified files</span></div></div>
      <form className="border-t border-white/[0.07] p-3" onSubmit={(event) => { event.preventDefault(); if (task.trim()) start(); }}><label className="sr-only" htmlFor="agent-task">Describe a task</label><div className="flex items-center gap-2 rounded-md border border-white/[0.10] bg-black/15 px-2 focus-within:border-violet-300/45"><input id="agent-task" value={task} onChange={(event) => setTask(event.target.value)} placeholder="Describe a task…" className="h-9 min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground" /><button className="rounded p-1 text-muted-foreground hover:text-foreground" aria-label="Run task"><Send className="size-3.5" /></button></div><p className="mt-2 text-[10px] text-muted-foreground">Knows your current repository, dependencies, ownership and changes.</p></form>
    </section>
  </div>;
}
