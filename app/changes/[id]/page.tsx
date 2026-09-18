import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, CircleDashed, ShieldAlert, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, SectionLabel, Separator } from "@/components/ui/primitives";
import { ChangePipeline } from "@/components/synccode/pipeline";
import { ImpactGraph } from "@/components/synccode/impact-graph";
import { DiffView, AIExecutionLog } from "@/components/synccode/ai-log";
import { RiskBadge } from "@/components/synccode/risk";
import { CHANGES, TEAM } from "@/lib/data";

export default async function ChangeDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const change = CHANGES.find((c) => c.id === id);
  if (!change) return notFound();
  const ownerOf = (name: string) => TEAM.find((t) => t.name === name);

  return (
    <div className="space-y-4">
      <Link href="/changes" className="flex w-fit items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" /> All changes
      </Link>

      {/* Header */}
      <header className="sc-panel p-4" aria-label="Change header">
        <div className="flex flex-wrap items-center gap-2">
          <span className="sc-mono text-[11px] text-muted-foreground">Change #{change.num} · {change.sha}</span>
          {change.breaking ? <Badge variant="breaking">Breaking change</Badge> : <Badge variant="low">Routine</Badge>}
          <RiskBadge risk={change.risk} />
        </div>
        <h1 className="sc-mono mt-2 text-[20px] font-semibold tracking-tight">{change.title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="sc-mono">{change.repo}</span>
          <span className="flex items-center gap-1.5">
            {change.author && ownerOf(change.author) && <Avatar initials={ownerOf(change.author)!.initials} color={ownerOf(change.author)!.color} className="size-5 text-[9px]" />}
            {change.author} · {change.authorRole}
          </span>
          <span>{change.time}</span>
          <span className="sc-mono">{change.files.join(" · ")}</span>
        </div>
      </header>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="min-w-0 space-y-4">
          {/* Diff + AI interpretation */}
          <section className="sc-panel p-3.5" aria-label="Diff and interpretation">
            <SectionLabel>Diff · response contract</SectionLabel>
            <div className="mt-2 space-y-2">
              {change.diff.map((d) => (
                <DiffView key={d.file} file={d.file} removed={d.removed} added={d.added} />
              ))}
            </div>
            <div className="mt-2.5 flex items-start gap-2 rounded-lg border border-violet-400/25 bg-violet-400/[0.06] p-2.5">
              <Sparkles className="mt-0.5 size-3.5 shrink-0 text-violet-200" />
              <p className="text-xs leading-relaxed text-violet-100/90">
                This appears to be a breaking response-contract modification. Three downstream consumers were identified —{" "}
                {change.consumers.map((c) => c.repo).join(", ")}. Frontend patch is generated; mobile requires approval.
              </p>
            </div>
          </section>

          {/* Ownership */}
          <section className="sc-panel p-3.5" aria-label="Ownership">
            <SectionLabel>Ownership · technical + human impact</SectionLabel>
            <ul className="mt-2 divide-y divide-white/[0.05] overflow-hidden rounded-lg border border-white/[0.07]">
              {change.consumers.map((c) => {
                const o = ownerOf(c.owner);
                return (
                  <li key={c.repo} className="flex items-center gap-3 bg-white/[0.015] px-3 py-2.5">
                    {o && <Avatar initials={o.initials} color={o.color} />}
                    <div className="min-w-0 flex-1">
                      <p className="sc-mono text-xs font-medium text-foreground">{c.repo} <span className="text-muted-foreground">/ {c.component}</span></p>
                      <p className="text-[11px] text-muted-foreground">Owned by {c.owner} · {c.files} files</p>
                    </div>
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${c.state === "patched" ? "bg-emerald-400/10 text-emerald-300" : c.state === "awaiting" ? "bg-amber-400/10 text-amber-300" : c.state === "blocked" ? "bg-red-400/10 text-red-300" : "bg-white/[0.06] text-muted-foreground"}`}>
                      {c.state}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* AI actions + validation */}
          <section className="sc-panel p-3.5" aria-label="AI actions and validation">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <SectionLabel>AI actions</SectionLabel>
                <ul className="mt-2 space-y-1.5">
                  {change.aiActions.map((a) => (
                    <li key={a.label} className="flex items-center gap-2 text-xs">
                      {a.state === "done" ? <Check className="size-3.5 text-emerald-300" /> : a.state === "active" ? <CircleDashed className="size-3.5 animate-spin text-violet-300" /> : <ShieldAlert className="size-3.5 text-red-300" />}
                      <span className="text-foreground/85">{a.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <SectionLabel>Validation</SectionLabel>
                <p className="sc-mono mt-2 text-2xl font-semibold tabular-nums">{change.tests.passed}<span className="text-sm text-muted-foreground">/{change.tests.total}</span></p>
                <p className="text-[11px] text-muted-foreground">tests passing · types clean · contract snapshot verified</p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                  <div className="h-full rounded-full bg-emerald-400/80" style={{ width: `${(change.tests.passed / change.tests.total) * 100}%` }} />
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="min-w-0 space-y-4">
          <section className="sc-panel p-3.5" aria-label="Pipeline state">
            <SectionLabel>Pipeline</SectionLabel>
            <div className="mt-2.5">
              <ChangePipeline activeStage={change.status === "integrated" ? 5 : change.status === "blocked" ? 4 : 4} completed={change.status === "integrated" ? [0, 1, 2, 3, 4, 5] : [0, 1, 2, 3]} compact />
            </div>
          </section>
          <section aria-label="Impact map"><ImpactGraph mini /></section>
          <section className="sc-panel p-3.5" aria-label="Risk and integration">
            <SectionLabel>Risk · {change.risk}</SectionLabel>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{change.reason}</p>
            <Separator className="my-2.5 opacity-60" />
            <div className="flex gap-2">
              <Button size="sm" asChild><Link href="/approvals">Approve integration</Link></Button>
              <Button size="sm" variant="outline">Reject</Button>
            </div>
          </section>
          <section className="sc-panel p-3.5" aria-label="Log"><AIExecutionLog compact /></section>
        </div>
      </div>
    </div>
  );
}
