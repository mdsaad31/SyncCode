"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, GitPullRequest, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress, SectionLabel, Separator } from "@/components/ui/primitives";
import { ChangeCapsule } from "@/components/synccode/change-capsule";
import { ChangePipeline, BlockedNotice } from "@/components/synccode/pipeline";
import { ImpactGraph } from "@/components/synccode/impact-graph";
import { AIExecutionLog } from "@/components/synccode/ai-log";
import { RiskBadge } from "@/components/synccode/risk";
import { CHANGES } from "@/lib/data";
import { useDemo } from "@/lib/store";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function Page() {
  const { activeStage, completedStages, phase, kind, progress } = useDemo();
  const capsule = CHANGES[0];

  return (
    <div className="space-y-4">
      {/* Header */}
      <section aria-label="Team status">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-0">
            <h1 className="text-[19px] font-semibold tracking-tight">{greeting()}, Aqib</h1>
            <p className="mt-1 text-[13px] text-muted-foreground">
              {phase === "running"
                ? "Sync engine is propagating a change through your team."
                : phase === "blocked"
                  ? "A high-risk change is blocked — your review is required."
                  : "Your team is synchronized. 3 changes are being processed. 1 approval needs your attention."}
            </p>
          </div>
          <div className="ml-auto flex gap-2">
            <Button variant="outline" size="sm" asChild><Link href="/changes">All changes</Link></Button>
            <Button size="sm" asChild><Link href="/approvals">Review approval <ArrowRight className="size-3.5" /></Link></Button>
          </div>
        </div>

        {/* status strip — restrained, not cards */}
        <div className="sc-panel mt-3 grid grid-cols-3 divide-x divide-white/[0.06]" role="status">
          {[
            { k: "Active changes", v: "3", sub: "1 breaking · 2 routine" },
            { k: "AI integrations", v: "12", sub: "18/18 tests passing" },
            { k: "Approvals", v: "1", sub: "mobile-app patch", alert: true },
          ].map((s) => (
            <div key={s.k} className="px-3.5 py-2.5 sm:px-4">
              <p className="text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase">{s.k}</p>
              <p className="mt-0.5 flex items-baseline gap-2">
                <span className="text-[20px] font-semibold tracking-tight tabular-nums">{s.v}</span>
                <span className={`hidden text-[11px] sm:inline ${s.alert ? "text-amber-300" : "text-muted-foreground"}`}>{s.sub}</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Main grid */}
      <div className="grid gap-4 xl:grid-cols-[1.25fr_0.9fr]">
        <div className="min-w-0 space-y-4">
          <div className="flex items-center gap-2">
            <SectionLabel>Active change capsule</SectionLabel>
            <Link href="/capsules" className="ml-auto flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground">
              All capsules <ArrowUpRight className="size-3" />
            </Link>
          </div>
          <ChangeCapsule change={capsule} featured />

          {/* change list (dense table, not cards) */}
          <section className="sc-panel overflow-hidden" aria-label="Recent changes">
            <div className="flex items-center gap-2 border-b border-white/[0.06] px-3.5 py-2">
              <GitPullRequest className="size-3.5 text-muted-foreground" />
              <span className="text-xs font-medium">Changes in flight</span>
              <Link href="/changes" className="ml-auto text-[11px] text-muted-foreground hover:text-foreground">View all</Link>
            </div>
            <ul className="divide-y divide-white/[0.05]">
              {CHANGES.map((c) => (
                <li key={c.id}>
                  <Link href={`/changes/${c.id}`} className="flex items-center gap-2.5 px-3.5 py-2 transition-colors hover:bg-white/[0.025]">
                    <span className={`size-1.5 rounded-full ${c.status === "integrated" ? "bg-emerald-400" : c.status === "blocked" ? "bg-red-400" : "bg-amber-300"}`} aria-hidden />
                    <span className="sc-mono text-[11px] text-muted-foreground">#{c.num}</span>
                    <span className="sc-mono min-w-0 flex-1 truncate text-xs text-foreground/90">{c.title}</span>
                    <span className="sc-mono hidden text-[10px] text-muted-foreground sm:block">{c.sha}</span>
                    <RiskBadge risk={c.risk} className="hidden md:inline-flex" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="min-w-0 space-y-4">
          {/* Live pipeline */}
          <section className="sc-panel p-3.5" aria-label="Live change pipeline">
            <div className="flex items-center gap-2">
              <SectionLabel>Live pipeline · #1042</SectionLabel>
              <Badge variant={phase === "blocked" ? "high" : phase === "done" ? "ok" : "ai"} className="ml-auto">
                {phase === "running" ? "Propagating" : phase === "done" ? "Integrated path ready" : phase === "blocked" ? "Blocked" : "Tracking"}
              </Badge>
            </div>
            <div className="mt-2.5">
              <ChangePipeline activeStage={phase === "idle" ? 2 : activeStage} completed={completedStages} />
            </div>
            <div className="mt-3 border-t border-white/[0.06] pt-2.5">
              <div className="mb-1.5 flex justify-between text-[10px] text-muted-foreground">
                <span className="sc-mono">{kind === "high-risk" ? "HIGH-RISK SCENARIO" : "BREAKING-CHANGE SCENARIO"}</span>
                <span className="sc-mono tabular-nums">{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
            {phase === "blocked" && <div className="mt-2.5"><BlockedNotice /></div>}
          </section>

          {/* Impact graph */}
          <section aria-label="Impact graph">
            <div className="mb-2 flex items-center gap-2">
              <SectionLabel>Impact graph</SectionLabel>
              <Link href="/graph" className="ml-auto flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground">
                Open full map <ArrowUpRight className="size-3" />
              </Link>
            </div>
            <ImpactGraph mini />
          </section>

          {/* AI log */}
          <section className="sc-panel p-3.5" aria-label="AI activity">
            <AIExecutionLog compact />
            <Separator className="my-2.5 opacity-60" />
            <div className="flex items-center gap-2 text-xs">
              <Check className="size-3.5 text-emerald-300" />
              <span className="text-foreground/85">Recommendation: <strong className="font-medium">safe to integrate</strong> after mobile approval</span>
            </div>
          </section>

          {/* Approval nudge */}
          <section className="flex items-start gap-2.5 rounded-lg border border-amber-400/25 bg-amber-400/[0.06] p-3" aria-label="Approval needed">
            <ShieldAlert className="mt-0.5 size-4 shrink-0 text-amber-300" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-amber-100">Mobile patch awaiting approval</p>
              <p className="mt-0.5 text-xs leading-relaxed text-amber-100/70">Sara owns mobile-app / UserService. Business-logic modification detected — human sign-off required.</p>
              <div className="mt-2 flex gap-1.5">
                <Button size="xs" asChild><Link href="/approvals">Review approval</Link></Button>
                <Button size="xs" variant="outline" asChild><Link href="/changes/1042">View diff</Link></Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
