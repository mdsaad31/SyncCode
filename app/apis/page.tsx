"use client";

import { useState } from "react";
import { Braces, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const APIS = [
  { name: "User API", version: "v2", owner: "Rahul", provider: "shopx-backend", consumers: ["shopx-frontend", "shopx-mobile", "analytics-worker"], status: "Breaking change", tone: "breaking" as const, change: "#1042 · User.name → User.full_name" },
  { name: "Orders API", version: "v1", owner: "Rahul", provider: "shopx-backend", consumers: ["shopx-frontend", "shopx-mobile"], status: "Healthy", tone: "low" as const, change: "#1039 · 1h ago" },
  { name: "Auth API", version: "v3", owner: "Rahul", provider: "shopx-backend", consumers: ["shopx-frontend", "shopx-mobile"], status: "Healthy", tone: "low" as const, change: "#1041 · integrated" },
];

export default function APIsPage() {
  const [selected, setSelected] = useState(APIS[0]);
  return <div className="space-y-4"><header><h1 className="text-[19px] font-semibold tracking-tight">APIs & contracts</h1><p className="mt-1 text-[13px] text-muted-foreground">Provider contracts and the code paths that depend on them.</p></header>
    <div className="grid gap-4 xl:grid-cols-[1fr_340px]"><section className="sc-panel overflow-hidden" aria-label="API contracts">{APIS.map((api) => <button onClick={() => setSelected(api)} key={api.name} className="flex w-full items-center gap-3 border-b border-white/[0.05] px-3.5 py-3 text-left last:border-0 hover:bg-white/[0.025]">
      <span className="flex size-8 items-center justify-center rounded-md border border-white/10 bg-white/[0.04]"><Braces className="size-4 text-muted-foreground" /></span><div className="min-w-0 flex-1"><p className="sc-mono text-[13px] font-semibold">{api.name} <span className="text-muted-foreground">{api.version}</span></p><p className="mt-0.5 text-xs text-muted-foreground">{api.provider} · {api.consumers.length} consumers · owner {api.owner}</p></div><Badge variant={api.tone}>{api.status}</Badge><ChevronRight className="size-3.5 text-muted-foreground" />
    </button>)}</section>
    <aside className="sc-panel p-3.5" aria-live="polite"><p className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">Selected contract</p><h2 className="sc-mono mt-2 text-[15px] font-semibold">{selected.name} <span className="text-muted-foreground">{selected.version}</span></h2><dl className="mt-3 space-y-2 text-xs"><div><dt className="text-muted-foreground">Provider</dt><dd className="sc-mono mt-0.5">{selected.provider}</dd></div><div><dt className="text-muted-foreground">Owner</dt><dd className="mt-0.5">{selected.owner}</dd></div><div><dt className="text-muted-foreground">Consumers</dt><dd className="sc-mono mt-0.5 text-foreground/85">{selected.consumers.join(" · ")}</dd></div><div><dt className="text-muted-foreground">Recent change</dt><dd className="sc-mono mt-0.5 text-amber-200">{selected.change}</dd></div></dl></aside></div>
  </div>;
}
