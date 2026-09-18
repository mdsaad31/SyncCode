"use client";

import Link from "next/link";
import { ImpactGraph } from "@/components/synccode/impact-graph";
import { Avatar, SectionLabel } from "@/components/ui/primitives";
import { TEAM, CHANGES } from "@/lib/data";
import { useDemo } from "@/lib/store";

export default function GraphPage() {
  const { phase } = useDemo();
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-2">
        <div>
          <h1 className="text-[19px] font-semibold tracking-tight">Impact Graph</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">A software architecture map — component, repository, owner, and state. {phase === "running" ? "Propagation is live." : "Readable first, decorative never."}</p>
        </div>
        <span className="sc-mono ml-auto rounded border border-white/10 px-2 py-1 text-[10px] text-muted-foreground">backend-api → 3 consumers → 2 owners</span>
      </div>
      <ImpactGraph />
      <div className="grid gap-4 md:grid-cols-2">
        <section className="sc-panel p-3.5" aria-label="Nodes">
          <SectionLabel>Nodes · state + risk</SectionLabel>
          <ul className="mt-2 space-y-1.5 text-xs">
            {[
              { n: "User API", s: "backend-api · source · breaking", c: "text-red-300" },
              { n: "Frontend / UserService", s: "frontend-web · patched · Aqib", c: "text-emerald-300" },
              { n: "Mobile / UserService", s: "mobile-app · awaiting approval · Sara", c: "text-amber-300" },
              { n: "ETL mapper", s: "analytics-worker · healthy · Mina", c: "text-muted-foreground" },
            ].map((r) => (
              <li key={r.n} className="flex items-center gap-2">
                <span className={`size-1.5 rounded-full ${r.c === "text-red-300" ? "bg-red-400" : r.c === "text-emerald-300" ? "bg-emerald-400" : r.c === "text-amber-300" ? "bg-amber-300" : "bg-white/25"}`} />
                <span className="sc-mono font-medium text-foreground/90">{r.n}</span>
                <span className="sc-mono truncate text-[11px] text-muted-foreground">· {r.s}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="sc-panel p-3.5" aria-label="Owners on graph">
          <SectionLabel>Owners on this path</SectionLabel>
          <ul className="mt-2 space-y-2">
            {TEAM.slice(0, 3).map((t) => (
              <li key={t.name} className="flex items-center gap-2.5 text-xs">
                <Avatar initials={t.initials} color={t.color} />
                <div className="min-w-0">
                  <p className="font-medium text-foreground/90">{t.name} <span className="font-normal text-muted-foreground">· {t.role}</span></p>
                  <p className="sc-mono truncate text-[10px] text-muted-foreground">{t.owns[0]}</p>
                </div>
                <Link href="/team" className="sc-mono ml-auto text-[10px] text-muted-foreground hover:text-foreground">profile →</Link>
              </li>
            ))}
          </ul>
          <p className="sc-mono mt-2.5 border-t border-white/[0.06] pt-2 text-[10px] text-muted-foreground">source change: #{CHANGES[0].num} · {CHANGES[0].sha} · {CHANGES[0].time}</p>
        </section>
      </div>
    </div>
  );
}
