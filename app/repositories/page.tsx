"use client";

import { useState } from "react";
import Link from "next/link";
import { FolderGit2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/lib/store";
import { cn } from "@/lib/utils";

const FILTERS = ["All", "Healthy", "Needs attention", "TypeScript"] as const;

export default function ReposPage() {
  const { repositories } = useDemo();
  const [f, setF] = useState<(typeof FILTERS)[number]>("All");
  const rows = repositories.filter((r) => {
    if (f === "All") return true;
    if (f === "Healthy") return r.status === "healthy" || r.status === "patched";
    if (f === "Needs attention") return r.status === "breaking" || r.status === "awaiting";
    return r.stack.includes("TypeScript");
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-2">
        <div>
          <h1 className="text-[19px] font-semibold tracking-tight">Repositories</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">4 connected · dependency graph synced 2 minutes ago.</p>
        </div>
        <div className="ml-auto flex gap-1.5" role="group" aria-label="Repository filters">
          {FILTERS.map((x) => (
            <Button key={x} size="xs" variant={f === x ? "default" : "outline"} onClick={() => setF(x)}>{x}</Button>
          ))}
        </div>
      </div>
      <section className="sc-panel overflow-hidden" aria-label="Repositories">
        <ul className="divide-y divide-white/[0.05]">
          {rows.map((r) => (
            <li key={r.name} className="flex items-center gap-3 px-3.5 py-3">
              <span className="flex size-8 items-center justify-center rounded-md border border-white/10 bg-white/[0.04]"><FolderGit2 className="size-4 text-muted-foreground" /></span>
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2">
                  <span className="sc-mono text-[13px] font-semibold">{r.name}</span>
                  <Badge variant="muted">{r.lang}</Badge>
                  {r.status === "breaking" && <Badge variant="breaking">Contract change</Badge>}
                  {r.status === "awaiting" && <Badge variant="medium">Awaiting approval</Badge>}
                  {r.status === "patched" && <Badge variant="low">Patched</Badge>}
                  {r.status === "healthy" && <Badge variant="low">Healthy</Badge>}
                </p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{r.stack} · {r.owner} · {r.commits.toLocaleString()} commits · {r.note}</p>
              </div>
              <span className={cn("hidden size-2 rounded-full sm:block", r.status === "healthy" || r.status === "patched" ? "bg-emerald-400" : r.status === "awaiting" ? "bg-amber-300" : "bg-red-400")} title={r.status} />
              <Link href="/graph" className="hidden text-[11px] text-muted-foreground hover:text-foreground sm:block">impact →</Link>
            </li>
          ))}
        </ul>
        {rows.length === 0 && (
          <p className="px-3.5 py-8 text-center text-xs text-muted-foreground">No repositories match this filter.</p>
        )}
      </section>
    </div>
  );
}
