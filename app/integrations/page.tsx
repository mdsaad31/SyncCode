"use client";
import { Plug } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/primitives";
import { useDemo } from "@/lib/store";

const INTEG = [
  { n: "GitHub", d: "Push webhooks · PR status checks", s: "Connected", ok: true },
  { n: "Vercel", d: "Preview deploys gated on validation", s: "Connected", ok: true },
  { n: "Slack", d: "#sync-feed · owner pings only", s: "Connected", ok: true },
  { n: "Linear", d: "Tasks auto-created from capsules", s: "Paused", ok: false },
];

export default function IntegrationsPage() {
  const { integrations, startIntegration, completeIntegration, failIntegration } = useDemo();
  const integration = integrations.find((item) => item.changeId === "1042")!;
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
      <section className="sc-panel p-3.5" aria-label="Change integration">
        <SectionLabel>Change #1042 integration</SectionLabel>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs"><Badge variant={integration.status === "integrated" ? "ok" : integration.status === "failed" ? "high" : "medium"}>{integration.status}</Badge><span className="text-muted-foreground">Integration state is shared with approvals, capsules, activity, and the graph.</span></div>
        <div className="mt-3 flex gap-2"><Button size="sm" onClick={startIntegration} disabled={integration.status !== "approved"}>Start integration</Button><Button size="sm" variant="outline" onClick={completeIntegration} disabled={integration.status !== "integrating"}>Complete</Button><Button size="sm" variant="destructive" onClick={failIntegration} disabled={integration.status !== "integrating"}>Fail</Button></div>
      </section>
      <p className="text-xs text-muted-foreground"><SectionLabel>AI integrations · 12</SectionLabel><span className="mt-1 block">Patch writer, test generator, contract differ, risk classifier, and 8 repo-scoped reviewers ran in the last 24h.</span></p>
    </div>
  );
}
