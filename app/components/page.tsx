import Link from "next/link";
import { AppWindow, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const COMPONENTS = [
  { name: "UserService", repo: "shopx-frontend", owner: "Aqib", dependencies: "12 dependencies", state: "Healthy", tone: "low" as const },
  { name: "Checkout", repo: "shopx-frontend", owner: "Aqib", dependencies: "7 dependencies", state: "Incoming change", tone: "medium" as const },
  { name: "User API", repo: "shopx-backend", owner: "Rahul", dependencies: "3 consumers", state: "Contract change", tone: "breaking" as const },
  { name: "ProfileScreen", repo: "shopx-mobile", owner: "Sara", dependencies: "5 dependencies", state: "Awaiting approval", tone: "medium" as const },
];

export default function ComponentsPage() {
  return <div className="space-y-4"><header><h1 className="text-[19px] font-semibold tracking-tight">Components</h1><p className="mt-1 text-[13px] text-muted-foreground">The software assets SyncCode maps to owners, contracts, and change paths.</p></header>
    <section className="sc-panel overflow-hidden" aria-label="Components">
      {COMPONENTS.map((c) => <div key={c.name} className="flex items-center gap-3 border-b border-white/[0.05] px-3.5 py-3 last:border-0">
        <span className="flex size-8 items-center justify-center rounded-md border border-white/10 bg-white/[0.04]"><AppWindow className="size-3.5 text-muted-foreground" /></span>
        <div className="min-w-0 flex-1"><p className="sc-mono text-[13px] font-semibold">{c.name}</p><p className="mt-0.5 text-xs text-muted-foreground">{c.repo} · Owner: {c.owner} · {c.dependencies}</p></div>
        <Badge variant={c.tone}>{c.state}</Badge><Link className="hidden text-[11px] text-muted-foreground hover:text-foreground sm:block" href="/graph"><ArrowUpRight className="size-3.5" /></Link>
      </div>)}
    </section>
  </div>;
}
