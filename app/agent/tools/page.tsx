"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { AvailableCapabilities } from "@/components/synccode/agent-panel";
import { CAPABILITIES } from "@/lib/agent";

export default function ToolboxPage() {
  const [query, setQuery] = useState("");
  const totals = useMemo(() => CAPABILITIES.reduce((count, capability) => count + Number(capability.status === "connected"), 0), []);
  return <div className="space-y-4"><header className="flex flex-wrap items-end gap-3"><div><h1 className="text-[19px] font-semibold tracking-tight">Toolbox</h1><p className="mt-1 text-[13px] text-muted-foreground">Capabilities available to Sync Agent in this developer environment.</p></div><span className="ml-auto text-[11px] text-emerald-200"><span className="mr-1 inline-block size-1.5 rounded-full bg-emerald-400" />{totals} connected</span></header><div className="relative max-w-[420px]"><Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search capabilities…" className="h-9 w-full rounded-md border border-white/[0.09] bg-white/[0.025] pl-8 pr-3 text-xs outline-none focus:border-violet-300/40" /></div><div className="grid gap-4 xl:grid-cols-2"><ToolboxGroup title="Connected" query={query} capabilities={CAPABILITIES.filter((item) => item.status === "connected")} /><ToolboxGroup title="Available" query={query} capabilities={CAPABILITIES.filter((item) => item.status === "available")} /></div><div className="max-w-[560px]"><AvailableCapabilities compact /></div></div>;
}

function ToolboxGroup({ title, capabilities, query }: { title: string; capabilities: typeof CAPABILITIES; query: string }) {
  const filtered = capabilities.filter((item) => `${item.name} ${item.source} ${item.capabilities.join(" ")}`.toLowerCase().includes(query.toLowerCase()));
  return <section className="sc-panel overflow-hidden"><div className="border-b border-white/[0.06] px-3.5 py-3"><p className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">{title}</p></div>{filtered.length ? <div className="divide-y divide-white/[0.05]">{filtered.map((item) => <div key={item.id} className="flex items-center gap-3 px-3.5 py-3"><span className={`size-2 rounded-full ${item.status === "connected" ? "bg-emerald-400" : "bg-white/35"}`} /><div className="min-w-0 flex-1"><p className="text-[13px] font-medium">{item.name}</p><p className="mt-0.5 text-[11px] text-muted-foreground">{item.source} · {item.capabilities.slice(0, 2).join(" · ")}</p></div><span className={item.availableToAgent ? "text-[10px] text-emerald-200" : "text-[10px] text-muted-foreground"}>{item.availableToAgent ? "Agent can use" : "Connect"}</span></div>)}</div> : <p className="px-3.5 py-8 text-center text-xs text-muted-foreground">No capabilities match “{query}”.</p>}</section>;
}
