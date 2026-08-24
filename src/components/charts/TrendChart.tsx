"use client";

import { useMemo } from "react";

interface TrendChartProps {
  data: { month: string; score: number }[];
  width?: number;
  height?: number;
  color?: string;
  label?: string;
}

export default function TrendChart({
  data,
  width = 600,
  height = 200,
  color = "#8B5CF6",
  label = "Economy Health Score",
}: TrendChartProps) {
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const { pathD, areaD, dots, yTicks } = useMemo(() => {
    if (data.length === 0) return { pathD: "", areaD: "", dots: [], yTicks: [] };

    const minScore = Math.floor(Math.min(...data.map((d) => d.score)) / 5) * 5;
    const maxScore = Math.ceil(Math.max(...data.map((d) => d.score)) / 5) * 5;
    const range = maxScore - minScore || 1;

    const points = data.map((d, i) => ({
      x: padding.left + (i / (data.length - 1)) * chartW,
      y: padding.top + chartH - ((d.score - minScore) / range) * chartH,
    }));

    const pathD = points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
      .join(" ");

    const areaD = `${pathD} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`;

    const dots = points.map((p, i) => ({
      x: p.x,
      y: p.y,
      label: data[i].month,
      score: data[i].score,
    }));

    const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => ({
      y: padding.top + chartH - t * chartH,
      value: Math.round(minScore + t * range),
    }));

    return { pathD, areaD, dots, yTicks };
  }, [data, chartW, chartH, padding.top, padding.left, padding.right, padding.bottom]);

  return (
    <div className="relative" role="img" aria-label={`${label} trend chart`}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {yTicks.map((tick, i) => (
          <g key={i}>
            <line
              x1={padding.left}
              y1={tick.y}
              x2={width - padding.right}
              y2={tick.y}
              stroke="#E2E8F0"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <text
              x={padding.left - 8}
              y={tick.y}
              textAnchor="end"
              dominantBaseline="middle"
              className="fill-muted-foreground text-[10px] font-body tabular-nums"
            >
              {tick.value}
            </text>
          </g>
        ))}

        {/* Area fill */}
        <path d={areaD} fill="url(#trendGradient)" />

        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dots */}
        {dots.map((dot, i) => (
          <g key={i}>
            <circle
              cx={dot.x}
              cy={dot.y}
              r="4"
              fill="white"
              stroke={color}
              strokeWidth="2"
              className="transition-all duration-200"
            />
            {/* X-axis labels */}
            <text
              x={dot.x}
              y={height - 10}
              textAnchor="middle"
              className="fill-muted-foreground text-[10px] font-body"
            >
              {dot.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
