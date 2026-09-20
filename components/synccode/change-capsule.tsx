"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, CircleDashed, GitBranch, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, SectionLabel, Separator } from "@/components/ui/primitives";
import { RiskBadge } from "./risk";
import type { SyncChange } from "@/lib/domain";
import { cn } from "@/lib/utils";
import { useDemo } from "@/lib/store";

export function ChangeCapsule({ change, featured = false }: { change: SyncChange; featured?: boolean }) {
  const { phase, team } = useDemo();
  const owner = team.find((member) => member.name === change.author);
  const live = phase === "running" && change.num === 1042;
  return (
    <article
      className={cn(
        "sc-panel sc-rise relative overflow-hidden",
        featured && "border-white/[0.12]"
      )}
      aria-label={`Change capsule ${change.num}`}
    >
      {/* top hairline: propagation motif */}
      <div className="flex h-7 items-center gap-2 border-b border-border bg-white/[0.015] px-3.5" aria-hidden>
        <span className="flex items-center gap-1.5">
          <span className={cn("size-1.5 rounded-full", live ? "sc-pulse-dot bg-violet-400" : change.breaking ? "bg-red-400" : "bg-emerald-400")} />
          <span className="sc-mono text-[10px] tracking-[0.12em] text-muted-foreground">
            CAPSULE #{change.num} · {change.sha}
          </span>
        </span>
        <span className="sc-mono ml-auto hidden items-center gap-1 text-[10px] text-muted-foreground/70 sm:flex">
          <GitBranch className="size-3" /> {change.repo}
        </span>
      </div>

      <div className="p-3.5 sm:p-4">
        {/* WHAT CHANGED */}
        <div className="flex flex-wrap items-center gap-2">
          {change.breaking ? <Badge variant="breaking">Breaking change</Badge> : <Badge variant="low">Non-breaking</Badge>}
          <RiskBadge risk={change.risk} />
          {live && <Badge variant="ai">Live · propagating</Badge>}
        </div>
        <h3 className="sc-mono mt-2 text-[15px] font-semibold tracking-tight text-foreground">
          {change.from} <span className="text-muted-foreground">→</span> {change.to}
        </h3>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Avatar initials={owner?.initials ?? change.author.slice(0, 2).toUpperCase()} color={owner?.color ?? "#9b9ba1"} className="size-5 text-[9px]" />
          <span><strong className="font-medium text-foreground/90">{change.author}</strong> changed the {change.repo === "backend-api" ? "User response contract" : "contract"} · {change.time}</span>
        </p>

        <Separator className="my-3 opacity-60" />

        {/* IMPACT */}
        <SectionLabel>Impact</SectionLabel>
        <div className="mt-2 flex items-stretch gap-2.5" aria-label="Impact map">
          <div className="flex flex-col items-center pt-1" aria-hidden>
            <span className="flex size-5 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-[9px] font-bold text-foreground/80">BE</span>
            <span className="w-px flex-1 bg-gradient-to-b from-white/20 via-white/10 to-transparent" />
          </div>
          <div className="min-w-0 flex-1 space-y-1.5">
            <p className="sc-mono text-[11px] text-foreground/80">{change.repo} <span className="text-muted-foreground">· source</span></p>
            {change.consumers.map((c) => (
              <div key={c.repo} className="flex items-center gap-2">
                <span className="sc-mono text-[11px] text-white/25" aria-hidden>├──</span>
                <span className="sc-mono text-[11px] text-foreground/85">{c.repo}</span>
                <span className="hidden text-[11px] text-muted-foreground sm:inline">· {c.component}</span>
                <span
                  className={cn(
                    "ml-auto rounded px-1 py-px text-[10px] font-medium",
                    c.state === "patched" && "bg-emerald-400/10 text-emerald-300",
                    c.state === "awaiting" && "bg-amber-400/10 text-amber-300",
                    c.state === "blocked" && "bg-red-400/10 text-red-300",
                    (c.state === "affected" || c.state === "healthy") && "bg-white/[0.05] text-muted-foreground"
                  )}
                >
                  {c.state === "patched" ? "patched" : c.state === "awaiting" ? "awaiting approval" : c.state}
                </span>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          {change.consumers.length} repositories · {new Set(change.consumers.map((c) => c.owner)).size} developers · {change.consumers.reduce((a, c) => a + c.files, 0)} files touched
        </p>

        <Separator className="my-3 opacity-60" />

        {/* AI ACTIONS */}
        <SectionLabel>AI actions</SectionLabel>
        <ul className="mt-2 space-y-1.5">
          {change.aiActions.map((a) => (
            <li key={a.label} className="flex items-center gap-2 text-xs">
              {a.state === "done" ? <Check className="size-3.5 text-emerald-300" /> :
               a.state === "blocked" ? <ShieldAlert className="size-3.5 text-red-300" /> :
               a.state === "active" ? <CircleDashed className="size-3.5 animate-spin text-violet-300" /> :
               <span className="size-3.5 rounded-full border border-white/20" />}
              <span className={a.state === "done" ? "text-foreground/85" : a.state === "blocked" ? "text-red-200/90" : "text-muted-foreground"}>{a.label}</span>
            </li>
          ))}
        </ul>

        {change.num === 1042 && <div className="mt-3 grid grid-cols-[1fr_auto] gap-3 border-t border-white/[0.06] pt-3 text-[11px]"><div><SectionLabel>Capabilities used</SectionLabel><p className="mt-1 text-muted-foreground">Git · TypeScript · Test Runner</p></div><div className="text-right"><SectionLabel>Decision</SectionLabel><p className="mt-1 font-medium text-emerald-200">Safe to integrate</p></div></div>}

        <Separator className="my-3 opacity-60" />

        {/* RISK */}
        <div className="sc-inset flex items-start gap-2.5 p-2.5">
          <ShieldAlert className={cn("mt-0.5 size-4", change.risk === "LOW" ? "text-emerald-300" : change.risk === "MEDIUM" ? "text-amber-300" : "text-red-300")} />
          <div className="min-w-0">
            <p className="text-[11px] font-semibold tracking-wide text-foreground/90">RISK · {change.risk}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{change.reason}</p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <Button size="sm" asChild>
            <Link href={`/changes/${change.id}`}>Review changes <ArrowRight className="size-3.5" /></Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href="/approvals">Approve integration</Link>
          </Button>
          <Link href={`/changes/${change.id}`} className="ml-auto hidden items-center gap-0.5 text-[11px] text-muted-foreground hover:text-foreground sm:flex">
            Open workspace <ArrowUpRight className="size-3" />
          </Link>
        </div>
      </div>
    </article>
  );
}
