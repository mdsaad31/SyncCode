import Link from "next/link";
import { GitPullRequest } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionLabel } from "@/components/ui/primitives";
import { RiskBadge } from "@/components/synccode/risk";
import { CHANGES } from "@/lib/data";
import { cn } from "@/lib/utils";

const statusLabel: Record<string, { text: string; cls: string }> = {
  "awaiting-approval": { text: "Awaiting approval", cls: "bg-amber-400/10 text-amber-300" },
  integrated: { text: "Integrated", cls: "bg-emerald-400/10 text-emerald-300" },
  blocked: { text: "Blocked", cls: "bg-red-400/10 text-red-300" },
  validating: { text: "Validating", cls: "bg-violet-400/10 text-violet-200" },
};

export default function ChangesPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-[19px] font-semibold tracking-tight">Changes</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">Every meaningful change, with its downstream consequence attached.</p>
      </div>
      <section className="sc-panel overflow-hidden" aria-label="All changes">
        <div className="flex items-center gap-2 border-b border-white/[0.06] px-3.5 py-2">
          <GitPullRequest className="size-3.5 text-muted-foreground" />
          <span className="text-xs font-medium">3 changes · 1 breaking · 1 blocked</span>
          <div className="ml-auto flex gap-1.5">
            <Badge variant="muted">backend-api</Badge>
            <Badge variant="muted">all repos</Badge>
          </div>
        </div>
        <ul className="divide-y divide-white/[0.05]">
          {CHANGES.map((c) => {
            const s = statusLabel[c.status] ?? statusLabel["validating"];
            return (
              <li key={c.id}>
                <Link href={`/changes/${c.id}`} className="block px-3.5 py-3 transition-colors hover:bg-white/[0.025]">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="sc-mono text-[11px] text-muted-foreground">#{c.num} · {c.sha}</span>
                    {c.breaking ? <Badge variant="breaking">Breaking</Badge> : <Badge variant="low">Routine</Badge>}
                    <RiskBadge risk={c.risk} />
                    <span className={cn("rounded px-1.5 py-px text-[10px] font-medium", s.cls)}>{s.text}</span>
                    <span className="ml-auto text-[11px] text-muted-foreground">{c.time}</span>
                  </div>
                  <p className="sc-mono mt-1.5 text-[13px] font-semibold text-foreground">{c.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {c.author} · {c.repo} · {c.consumers.length} consumers · {c.tests.passed}/{c.tests.total} tests · {c.files.length} files
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
      <p className="text-xs text-muted-foreground"><SectionLabel>No active changes?</SectionLabel><span className="mt-1 block text-xs normal-case tracking-normal">When your team pushes a meaningful change, SyncCode will build its impact map here.</span></p>
    </div>
  );
}
