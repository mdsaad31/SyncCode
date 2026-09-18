import { Plug } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionLabel } from "@/components/ui/primitives";

const INTEG = [
  { n: "GitHub", d: "Push webhooks · PR status checks", s: "Connected", ok: true },
  { n: "Vercel", d: "Preview deploys gated on validation", s: "Connected", ok: true },
  { n: "Slack", d: "#sync-feed · owner pings only", s: "Connected", ok: true },
  { n: "Linear", d: "Tasks auto-created from capsules", s: "Paused", ok: false },
];

export default function IntegrationsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-[19px] font-semibold tracking-tight">Integrations</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">SyncCode sits between your repos and your team rituals.</p>
      </div>
      <section className="sc-panel divide-y divide-white/[0.05]" aria-label="Integrations">
        {INTEG.map((i) => (
          <div key={i.n} className="flex items-center gap-3 px-3.5 py-3">
            <span className="flex size-8 items-center justify-center rounded-md border border-white/10 bg-white/[0.04]"><Plug className="size-4 text-muted-foreground" /></span>
            <div><p className="text-[13px] font-medium">{i.n}</p><p className="text-xs text-muted-foreground">{i.d}</p></div>
            <Badge variant={i.ok ? "low" : "muted"} className="ml-auto">{i.s}</Badge>
          </div>
        ))}
      </section>
      <p className="text-xs text-muted-foreground"><SectionLabel>AI integrations · 12</SectionLabel><span className="mt-1 block">Patch writer, test generator, contract differ, risk classifier, and 8 repo-scoped reviewers ran in the last 24h.</span></p>
    </div>
  );
}
