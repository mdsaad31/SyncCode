import { Clock3, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const RUNS = [
  { id: "run_9f31", change: "#1042", agent: "Impact Analyzer", result: "3 consumers identified", time: "09:43", duration: "2.4s", tone: "ai" as const },
  { id: "run_9f32", change: "#1042", agent: "Patch Agent", result: "2 downstream patches generated", time: "09:43", duration: "8.1s", tone: "low" as const },
  { id: "run_9f33", change: "#1042", agent: "Risk Agent", result: "Medium · human approval required", time: "09:44", duration: "1.2s", tone: "medium" as const },
];

export default function RunsPage() { return <div className="space-y-4"><header><h1 className="text-[19px] font-semibold tracking-tight">Automation runs</h1><p className="mt-1 text-[13px] text-muted-foreground">A compact audit trail of agent work. Explanations and results, never hidden reasoning.</p></header><section className="sc-panel overflow-hidden">{RUNS.map((run) => <div key={run.id} className="flex items-center gap-3 border-b border-white/[0.05] px-3.5 py-3 last:border-0"><span className="flex size-8 items-center justify-center rounded-md border border-violet-400/20 bg-violet-400/[0.07]"><Sparkles className="size-3.5 text-violet-200" /></span><div className="min-w-0 flex-1"><p className="text-[13px] font-medium">{run.agent} <span className="sc-mono text-[11px] text-muted-foreground">{run.id}</span></p><p className="mt-0.5 text-xs text-muted-foreground">Change {run.change} · {run.result}</p></div><Badge variant={run.tone}>Completed</Badge><span className="hidden items-center gap-1 text-[11px] text-muted-foreground sm:flex"><Clock3 className="size-3" /> {run.duration} · {run.time}</span></div>)}</section></div>; }
