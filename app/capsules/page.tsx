"use client";
import { ChangeCapsule } from "@/components/synccode/change-capsule";
import { useDemo } from "@/lib/store";

export default function CapsulesPage() {
  const { changes } = useDemo();
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-[19px] font-semibold tracking-tight">Change Capsules</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">Each capsule answers: what changed, what is affected, who is affected, what AI did, what happens next.</p>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {changes.map((c) => (
          <ChangeCapsule key={c.id} change={c} featured={c.num === 1042} />
        ))}
      </div>
    </div>
  );
}
