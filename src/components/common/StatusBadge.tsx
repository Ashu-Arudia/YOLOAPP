import clsx from "clsx";
import type { MatchStatus } from "@/lib/api";

const labels: Record<MatchStatus, string> = {
  pending: "Pending",
  processing: "Processing",
  completed: "Completed",
  stopped: "Stopped",
};

export default function StatusBadge({ status }: { status: MatchStatus }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        `badge-${status}`
      )}
    >
      {status === "processing" && (
        <span className="mr-1.5 w-1.5 h-1.5 rounded-full bg-accent-blue pulse-dot" />
      )}
      {labels[status]}
    </span>
  );
}
