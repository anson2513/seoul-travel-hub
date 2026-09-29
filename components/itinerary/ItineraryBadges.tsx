import { AlertTriangle, Circle, CircleDot, LockKeyhole } from "lucide-react";
import type { TimePriority } from "@/lib/seoul-2026-master";

const priorityCopy: Record<
  TimePriority,
  { label: string; className: string; icon: typeof LockKeyhole }
> = {
  HARD: {
    label: "時間鎖定",
    className: "bg-neutral-950 text-white",
    icon: LockKeyhole,
  },
  RECOMMENDED: {
    label: "建議時間",
    className: "bg-amber-50 text-amber-800",
    icon: CircleDot,
  },
  FLEXIBLE: {
    label: "彈性安排",
    className: "bg-neutral-100 text-neutral-600",
    icon: Circle,
  },
};

export function TimePriorityBadge({ priority }: { priority?: TimePriority }) {
  if (!priority) return null;
  const config = priorityCopy[priority];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${config.className}`}
    >
      <Icon size={12} />
      {config.label}
    </span>
  );
}

export function RecheckBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-700">
      <AlertTriangle size={12} />
      出發前再次確認
    </span>
  );
}
