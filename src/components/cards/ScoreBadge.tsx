import { getScoreRange, getScoreLabel, getScoreColor } from "@/lib/types";

interface ScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export default function ScoreBadge({ score, size = "md", showLabel = true }: ScoreBadgeProps) {
  const color = getScoreColor(score);
  const label = getScoreLabel(score);
  const range = getScoreRange(score);

  const sizeClasses = {
    sm: "text-sm font-bold",
    md: "text-xl font-bold",
    lg: "text-3xl font-extrabold",
  };

  return (
    <div className="flex items-baseline gap-2">
      <span
        className={`font-heading tabular-nums ${sizeClasses[size]}`}
        style={{ color }}
      >
        {score}
      </span>
      {size !== "sm" && (
        <span className="text-muted-foreground text-sm font-body">/ 100</span>
      )}
      {showLabel && (
        <span
          className="text-[10px] font-heading font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
          style={{ borderColor: color, color, backgroundColor: `${color}10` }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
