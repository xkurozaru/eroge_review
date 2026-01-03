import { cn } from "@/lib/utils";

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function CircularGauge(props: {
  /** 0.0〜1.0 (達成率) */
  value: number | null;
  className?: string;
  size?: "sm" | "md";
}) {
  const size = props.size ?? "sm";

  const rawPercent =
    props.value == null || !Number.isFinite(props.value)
      ? null
      : props.value * 100;

  const label = rawPercent == null ? "-" : `${rawPercent.toFixed(1)}%`;

  const boxClass =
    size === "md" ? "h-14 w-14 text-xs" : "h-10 w-10 text-[10px]";

  // Using pathLength=100 makes strokeDasharray use percent directly.
  // 0-100% is the first lap (primary). Overflow (100%+) is drawn as a second lap
  // using a different color to represent the amount beyond 100.
  const baseDash = rawPercent == null ? 0 : clamp(rawPercent, 0, 100);
  const overflowDash =
    rawPercent == null ? 0 : clamp(Math.max(0, rawPercent - 100), 0, 100);

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        boxClass,
        props.className
      )}
      aria-label={label}
      title={label}
    >
      <svg
        viewBox="0 0 36 36"
        className="absolute inset-0 -rotate-90"
        role="img"
        aria-hidden="true"
      >
        <circle
          cx="18"
          cy="18"
          r="16"
          pathLength={100}
          fill="none"
          strokeWidth="4"
          className="text-muted-foreground/20"
          stroke="currentColor"
        />
        <circle
          cx="18"
          cy="18"
          r="16"
          pathLength={100}
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${baseDash} 100`}
          className="text-primary"
          stroke="currentColor"
        />
        {overflowDash > 0 ? (
          <circle
            cx="18"
            cy="18"
            r="16"
            pathLength={100}
            fill="none"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${overflowDash} 100`}
            className="text-destructive"
            stroke="currentColor"
          />
        ) : null}
      </svg>

      <span className="font-medium tabular-nums text-foreground">{label}</span>
    </div>
  );
}
