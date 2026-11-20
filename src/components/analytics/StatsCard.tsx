import clsx from "clsx";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: "blue" | "green" | "amber" | "cyan";
}

const colorMap = {
  blue: "text-accent-blue bg-accent-blue/15",
  green: "text-accent-green bg-accent-green/15",
  amber: "text-accent-amber bg-accent-amber/15",
  cyan: "text-accent-cyan bg-accent-cyan/15",
};

export default function StatsCard({
  label,
  value,
  icon: Icon,
  trend,
  color = "blue",
}: StatsCardProps) {
  return (
    <div className="glass rounded-xl p-5 fade-up">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-text-secondary font-medium">{label}</span>
        <div
          className={clsx(
            "flex items-center justify-center w-9 h-9 rounded-lg",
            colorMap[color]
          )}
        >
          <Icon className="w-[18px] h-[18px]" />
        </div>
      </div>
      <div className="text-2xl font-bold text-text-primary">{value}</div>
      {trend && (
        <span className="text-xs text-text-muted mt-1 block">{trend}</span>
      )}
    </div>
  );
}
