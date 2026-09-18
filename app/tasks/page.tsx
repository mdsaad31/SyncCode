import Link from "next/link";
import { CheckSquare } from "lucide-react";
import { SectionLabel } from "@/components/ui/primitives";

const TASKS = [
  { t: "Review mobile-app UserService patch", owner: "Sara", due: "today", state: "open", from: "#1042" },
  { t: "Verify frontend-web regression suite", owner: "Aqib", due: "today", state: "done", from: "#1042" },
  { t: "Draft charge() v2 migration guide", owner: "Rahul", due: "tomorrow", state: "open", from: "#1040" },
  { t: "Confirm analytics ETL field mapping", owner: "Mina", due: "this week", state: "open", from: "#1042" },
];

export default function TasksPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-[19px] font-semibold tracking-tight">Tasks</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">Work generated from change impact — never manually triaged.</p>
      </div>
      <section className="sc-panel overflow-hidden" aria-label="Tasks">
        <div className="flex items-center gap-2 border-b border-white/[0.06] px-3.5 py-2">
          <CheckSquare className="size-3.5 text-muted-foreground" /><span className="text-xs font-medium">4 tasks · 1 done · all linked to capsules</span>
        </div>
        <ul className="divide-y divide-white/[0.05]">
          {TASKS.map((t) => (
            <li key={t.t} className="flex items-center gap-3 px-3.5 py-2.5 text-[13px]">
              <span className={`flex size-4 items-center justify-center rounded border text-[10px] ${t.state === "done" ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300" : "border-white/15 text-transparent"}`}>✓</span>
              <span className={t.state === "done" ? "text-muted-foreground line-through" : "text-foreground/90"}>{t.t}</span>
              <span className="sc-mono ml-auto hidden text-[10px] text-muted-foreground sm:block">{t.from}</span>
              <span className="text-[11px] text-muted-foreground">{t.owner} · {t.due}</span>
            </li>
          ))}
        </ul>
      </section>
      <p className="text-xs text-muted-foreground"><Link href="/capsules" className="underline underline-offset-4">Open the capsule</Link> to see where each task originated.</p>
    </div>
  );
}
