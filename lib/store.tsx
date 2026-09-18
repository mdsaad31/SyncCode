"use client";

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { DEMO_SEQUENCE, HIGH_RISK_SEQUENCE } from "./data";

export type DemoKind = "breaking" | "high-risk" | null;
export type DemoPhase = "idle" | "running" | "done" | "blocked";

interface LogLine {
  id: number;
  text: string;
  time: string;
  tone: "info" | "ai" | "ok" | "warn" | "err";
}

interface DemoContextValue {
  kind: DemoKind;
  phase: DemoPhase;
  activeStage: number; // -1 idle, 0..5 pipeline
  completedStages: number[];
  logs: LogLine[];
  progress: number;
  runDemo: (kind: Exclude<DemoKind, null>) => void;
  reset: () => void;
  approveMobile: boolean;
  setApproveMobile: (v: boolean) => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

function toneFor(text: string): LogLine["tone"] {
  if (/BLOCKED|failing|High-risk/i.test(text)) return "err";
  if (/passed|completed|generated|found|identified|ready/i.test(text)) return "ok";
  if (/Sync AI|generating|Validation|Risk classified|Impact|Owners/i.test(text)) return "ai";
  if (/awaiting|approval/i.test(text)) return "warn";
  return "info";
}

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [kind, setKind] = useState<DemoKind>(null);
  const [phase, setPhase] = useState<DemoPhase>("idle");
  const [activeStage, setActiveStage] = useState(-1);
  const [completedStages, setCompletedStages] = useState<number[]>([0, 1, 2, 3]);
  const [logs, setLogs] = useState<LogLine[]>([
    { id: 0, text: "Sync engine idle · listening for pushes on 4 repositories", time: "now", tone: "info" },
    { id: 1, text: "Change #1041 auto-integrated · 12/12 tests passed", time: "2h", tone: "ok" },
  ]);
  const [progress, setProgress] = useState(34);
  const [approveMobile, setApproveMobile] = useState(false);
  const timers = useRef<number[]>([]);
  const idRef = useRef(10);

  const clear = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);

  const reset = useCallback(() => {
    clear();
    setKind(null);
    setPhase("idle");
    setActiveStage(-1);
    setProgress(34);
  }, [clear]);

  const runDemo = useCallback(
    (k: Exclude<DemoKind, null>) => {
      clear();
      const seq = k === "breaking" ? DEMO_SEQUENCE : HIGH_RISK_SEQUENCE;
      setKind(k);
      setPhase("running");
      setActiveStage(0);
      setCompletedStages([]);
      setProgress(4);
      const base = Date.now();
      seq.forEach((step, i) => {
        const t = window.setTimeout(() => {
          idRef.current += 1;
          const elapsed = `${((Date.now() - base) / 1000).toFixed(1)}s`;
          setLogs((prev) =>
            [...prev, { id: idRef.current, text: step.log, time: elapsed, tone: toneFor(step.log) }].slice(-30)
          );
          setActiveStage(step.stage);
          setCompletedStages((prev) => Array.from(new Set([...prev, ...Array.from({ length: step.stage }, (_, s) => s)])));
          setProgress(Math.round(((i + 1) / seq.length) * 100));
          if (i === seq.length - 1) {
            setPhase(k === "breaking" ? "done" : "blocked");
            setCompletedStages((prev) =>
              k === "breaking" ? [0, 1, 2, 3, 4, 5] : [0, 1, 2, 3, 4]
            );
            setActiveStage(k === "breaking" ? 5 : 5);
          }
        }, step.t);
        timers.current.push(t);
      });
    },
    [clear]
  );

  const value = useMemo(
    () => ({ kind, phase, activeStage, completedStages, logs, progress, runDemo, reset, approveMobile, setApproveMobile }),
    [kind, phase, activeStage, completedStages, logs, progress, runDemo, reset, approveMobile]
  );
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used within DemoProvider");
  return ctx;
}
