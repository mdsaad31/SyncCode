"use client";

import { cn } from "@/lib/utils";
import { TEAM } from "@/lib/data";
import { useDemo } from "@/lib/store";

interface NodeState {
  lit: boolean;
  tone: "source" | "affected" | "ok" | "idle";
}

export function ImpactGraph({ active = true, mini = false }: { active?: boolean; mini?: boolean }) {
  const { activeStage, phase, kind } = useDemo();
  const running = active && phase === "running";
  const done = phase === "done";
  const blocked = phase === "blocked";

  // propagation level 0..4
  const level = running ? Math.min(4, activeStage + 1) : done ? 4 : blocked ? 4 : 3;

  const node = (needs: number, tone: NodeState["tone"]): NodeState => ({
    lit: level >= needs,
    tone: level >= needs ? tone : "idle",
  });

  const toneCls = (n: NodeState) =>
    !n.lit
      ? "border-white/10 bg-white/[0.02] text-muted-foreground/60"
      : n.tone === "source"
        ? "border-red-400/40 bg-red-400/[0.08] text-foreground"
        : n.tone === "affected"
          ? blocked && kind === "high-risk"
            ? "border-red-400/40 bg-red-400/[0.08] text-foreground"
            : "border-amber-400/35 bg-amber-400/[0.07] text-foreground"
          : n.tone === "ok"
            ? "border-emerald-400/35 bg-emerald-400/[0.07] text-foreground"
            : "border-white/10";

  const edgeCls = (needs: number) =>
    cn("transition-colors duration-700", level >= needs ? "stroke-violet-400/70 sc-flow-line" : "stroke-white/10");

  const s = {
    rahul: node(0, "source"),
    api: node(1, "source"),
    fe: node(2, "ok"),
    mob: node(2, blocked ? "affected" : "affected"),
    an: node(2, "ok"),
    aqib: node(3, "ok"),
    sara: node(3, blocked ? "affected" : "affected"),
  };

  const person = (name: string) => TEAM.find((t) => t.name === name);

  const Person = ({ name, small = false }: { name: string; small?: boolean }) => {
    const p = person(name)!;
    const lit = name === "Rahul" ? s.rahul.lit : name === "Aqib" ? s.aqib.lit : s.sara.lit;
    return (
      <div className={cn("flex items-center gap-1.5 rounded-full border px-2 py-1 transition-all duration-500", lit ? "border-white/15 bg-white/[0.05]" : "border-white/[0.07] bg-transparent opacity-50")}>
        <span className="flex size-4 items-center justify-center rounded-full text-[8px] font-bold" style={{ background: `${p.color}26`, color: p.color }}>
          {p.initials}
        </span>
        {!small && <span className="text-[10px] font-medium text-foreground/85">{name}</span>}
      </div>
    );
  };

  const Node = ({ title, sub, n, mono = true }: { title: string; sub: string; n: NodeState; mono?: boolean }) => (
    <div className={cn("rounded-lg border px-2.5 py-1.5 text-center shadow-sm transition-all duration-500", toneCls(n), mini ? "min-w-[86px]" : "min-w-[104px]")}>
      <p className={cn("text-[11px] font-semibold", mono && "sc-mono")}>{title}</p>
      <p className="mt-px text-[9px] tracking-wide text-muted-foreground uppercase">{sub}</p>
    </div>
  );

  return (
    <div className={cn("sc-grid-bg relative overflow-hidden rounded-lg border border-border bg-[#0d0d0f]", mini ? "p-3" : "p-4")} role="img" aria-label="Software dependency impact graph">
      <div className="relative flex flex-col items-center gap-0">
        <Person name="Rahul" />
        <p className="sc-mono mt-1 text-[9px] tracking-[0.14em] text-muted-foreground/70 uppercase">backend · changed</p>
        <svg width="2" height="18" aria-hidden><line x1="1" y1="0" x2="1" y2="18" className={edgeCls(1)} strokeWidth="2" /></svg>
        <Node title="User API" sub="backend-api" n={s.api} />
        <svg width="220" height="26" viewBox="0 0 220 26" aria-hidden className="overflow-visible">
          <line x1="110" y1="0" x2="110" y2="10" className={edgeCls(2)} strokeWidth="1.5" />
          <line x1="30" y1="10" x2="190" y2="10" className={edgeCls(2)} strokeWidth="1.5" />
          <line x1="30" y1="10" x2="30" y2="26" className={edgeCls(2)} strokeWidth="1.5" />
          <line x1="110" y1="10" x2="110" y2="26" className={edgeCls(2)} strokeWidth="1.5" />
          <line x1="190" y1="10" x2="190" y2="26" className={edgeCls(2)} strokeWidth="1.5" />
        </svg>
        <div className="flex items-start gap-2 sm:gap-3">
          <div className="flex flex-col items-center gap-1.5">
            <Node title="Frontend" sub="frontend-web" n={s.fe} />
            <svg width="2" height="14" aria-hidden><line x1="1" y1="0" x2="1" y2="14" className={edgeCls(3)} strokeWidth="1.5" /></svg>
            <Person name="Aqib" small={mini} />
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Node title="Mobile" sub="mobile-app" n={s.mob} />
            <svg width="2" height="14" aria-hidden><line x1="1" y1="0" x2="1" y2="14" className={edgeCls(3)} strokeWidth="1.5" /></svg>
            <Person name="Sara" small={mini} />
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Node title="Analytics" sub="worker" n={s.an} />
            <span className="sc-mono mt-1 hidden text-[9px] text-emerald-300/80 sm:block">healthy</span>
          </div>
        </div>
      </div>
      <div className="relative mt-3 flex items-center gap-3 border-t border-white/[0.06] pt-2.5 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1"><span className="size-1.5 rounded-full bg-red-400" /> source</span>
        <span className="flex items-center gap-1"><span className="size-1.5 rounded-full bg-amber-300" /> affected</span>
        <span className="flex items-center gap-1"><span className="size-1.5 rounded-full bg-emerald-400" /> patched</span>
        <span className="sc-mono ml-auto hidden sm:block">{running ? "propagating…" : done ? "3 consumers · 2 owners" : "3 consumers · 2 owners"}</span>
      </div>
    </div>
  );
}
