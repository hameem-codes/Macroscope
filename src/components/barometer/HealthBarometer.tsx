"use client";

import { useEffect, useState, useRef } from "react";
import { getScoreLabel, getScoreColor } from "@/lib/types";

interface HealthBarometerProps {
  score: number;
  previousScore: number;
  countryName: string;
  size?: number;
}

export default function HealthBarometer({
  score,
  previousScore,
  countryName,
  size = 320,
}: HealthBarometerProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const [needleRotation, setNeedleRotation] = useState(-90);
  const animRef = useRef<number>();
  const prefersReduced = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      prefersReduced.current = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
    }

    if (prefersReduced.current) {
      setDisplayScore(score);
      setNeedleRotation(-90 + (score / 100) * 180);
      return;
    }

    const startTime = performance.now();
    const duration = 1500;

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Cubic bezier approx
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * score));
      setNeedleRotation(-90 + eased * (score / 100) * 180);
      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      }
    }
    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [score]);

  const r = (size - 40) / 2;
  const cx = size / 2;
  const cy = size / 2 + 20;
  const circumference = Math.PI * r;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  // Zone colors for the arc segments
  const zones = [
    { start: 0, end: 20, color: "#EF4444" },
    { start: 20, end: 40, color: "#F97316" },
    { start: 40, end: 60, color: "#EAB308" },
    { start: 60, end: 80, color: "#22C55E" },
    { start: 80, end: 100, color: "#10B981" },
  ];

  const scoreColor = getScoreColor(score);
  const label = getScoreLabel(score);
  const change = score - previousScore;
  const changeStr =
    change > 0 ? `↑ +${change.toFixed(1)} pts` : change < 0 ? `↓ ${change.toFixed(1)} pts` : "→ No change";

  return (
    <div className="relative flex flex-col items-center" role="img" aria-label={`Economy Health Score: ${score} out of 100, ${label}`}>
      {/* Geometric decoration behind */}
      <div
        className="absolute -top-8 -left-8 w-40 h-40 rounded-full opacity-20"
        style={{ backgroundColor: scoreColor }}
      />
      <div className="absolute -bottom-4 -right-12 w-20 h-20 rotate-45 border-4 border-tertiary/30" />

      <svg
        width={size}
        height={size * 0.65}
        viewBox={`0 0 ${size} ${size * 0.75}`}
        className="overflow-visible"
      >
        {/* Background arc segments */}
        {zones.map((zone) => {
          const startAngle = (zone.start / 100) * Math.PI;
          const endAngle = (zone.end / 100) * Math.PI;
          const x1 = cx + r * Math.cos(Math.PI - startAngle);
          const y1 = cy - r * Math.sin(Math.PI - startAngle);
          const x2 = cx + r * Math.cos(Math.PI - endAngle);
          const y2 = cy - r * Math.sin(Math.PI - endAngle);
          const largeArc = endAngle - startAngle > Math.PI / 2 ? 1 : 0;
          return (
            <path
              key={zone.start}
              d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 0 ${x2} ${y2}`}
              fill="none"
              stroke={zone.color}
              strokeWidth="12"
              strokeLinecap="butt"
              opacity="0.2"
            />
          );
        })}

        {/* Active arc */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke={scoreColor}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: prefersReduced.current ? "none" : undefined }}
        />

        {/* Tick marks */}
        {[0, 20, 40, 60, 80, 100].map((tick) => {
          const angle = Math.PI - (tick / 100) * Math.PI;
          const innerR = r - 18;
          const outerR = r + 18;
          return (
            <g key={tick}>
              <line
                x1={cx + innerR * Math.cos(angle)}
                y1={cy - innerR * Math.sin(angle)}
                x2={cx + outerR * Math.cos(angle)}
                y2={cy - outerR * Math.sin(angle)}
                stroke="#CBD5E1"
                strokeWidth="1.5"
              />
              <text
                x={cx + (outerR + 12) * Math.cos(angle)}
                y={cy - (outerR + 12) * Math.sin(angle)}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-muted-foreground text-[10px] font-body font-medium"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* Needle */}
        <g
          transform={`rotate(${needleRotation}, ${cx}, ${cy})`}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        >
          <line
            x1={cx}
            y1={cy}
            x2={cx - r + 30}
            y2={cy}
            stroke="#1E293B"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx={cx} cy={cy} r="6" fill="#1E293B" />
          <circle cx={cx} cy={cy} r="3" fill="white" />
        </g>

        {/* Center score */}
        <text
          x={cx}
          y={cy - 16}
          textAnchor="middle"
          className="fill-foreground font-heading"
          style={{ fontSize: "42px", fontWeight: 800 }}
        >
          {displayScore}
        </text>
        <text
          x={cx}
          y={cy + 6}
          textAnchor="middle"
          className="fill-muted-foreground text-xs font-body font-medium"
        >
          / 100
        </text>

        {/* Scale labels */}
        <text
          x={cx - r - 20}
          y={cy + 4}
          textAnchor="middle"
          className="fill-muted-foreground text-[9px] font-body"
        >
          0
        </text>
        <text
          x={cx + r + 20}
          y={cy + 4}
          textAnchor="middle"
          className="fill-muted-foreground text-[9px] font-body"
        >
          100
        </text>
      </svg>

      {/* Score label */}
      <div className="mt-2 text-center">
        <span
          className="inline-block px-4 py-1.5 rounded-full border-2 font-heading font-bold text-sm tracking-wide uppercase"
          style={{
            borderColor: scoreColor,
            color: scoreColor,
            backgroundColor: `${scoreColor}10`,
          }}
        >
          {label}
        </span>
        <p className="text-sm text-muted-foreground mt-2 font-body">
          {changeStr} vs previous period
        </p>
      </div>
    </div>
  );
}
