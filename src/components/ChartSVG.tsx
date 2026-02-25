import React from "react";
import { ChartData, MONTHS, Period } from "@/types/chart";

interface Props {
  data: ChartData;
  svgRef: React.RefObject<SVGSVGElement>;
}

const LEFT = 160;
const RIGHT = 1160;
const CHART_WIDTH = RIGHT - LEFT;
const ROW_HEIGHT = 60;
const BAR_HEIGHT = 28;
const TOP = 60;
const MONTH_LABEL_Y_OFFSET = 30;

function monthToX(month: number): number {
  // month 1 (Jan start) -> LEFT, month 13 (Dec end) -> RIGHT
  return LEFT + ((month - 1) / 12) * CHART_WIDTH;
}

function renderHatch(id: string) {
  return (
    <pattern id={id} patternUnits="userSpaceOnUse" width="8" height={BAR_HEIGHT}>
      <rect width="8" height={BAR_HEIGHT} fill="rgba(139,0,0,0.35)" />
      <rect x="0" y="0" width="3" height={BAR_HEIGHT} fill="rgba(139,0,0,0.7)" />
    </pattern>
  );
}

function darkenColor(hex: string, amount = 0.25): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, ((num >> 16) & 0xff) * (1 - amount));
  const g = Math.max(0, ((num >> 8) & 0xff) * (1 - amount));
  const b = Math.max(0, (num & 0xff) * (1 - amount));
  return `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
}

function renderPeriod(period: Period, y: number, color: string, catIdx: number, pIdx: number) {
  const x = monthToX(period.startMonth);
  const w = monthToX(period.endMonth + 1) - x;

  if (period.type === "critical") {
    return (
      <g key={`${catIdx}-${pIdx}`}>
        <rect x={x} y={y} width={w} height={BAR_HEIGHT} fill={`url(#hatch-${catIdx})`} rx="3" />
        <rect x={x + 4} y={y} width={Math.max(0, w - 8)} height={BAR_HEIGHT} fill={color} rx="2" opacity="0.85" />
      </g>
    );
  }
  // revision — solid lighter bar
  return (
    <rect
      key={`${catIdx}-${pIdx}`}
      x={x}
      y={y}
      width={w}
      height={BAR_HEIGHT}
      fill={color}
      rx="3"
      opacity="0.65"
    />
  );
}

const ChartSVG: React.FC<Props> = ({ data, svgRef }) => {
  const rowCount = data.categories.length;
  const axisY = TOP + rowCount * ROW_HEIGHT;
  const totalHeight = axisY + 100; // legend space

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 1240 ${totalHeight}`}
      xmlns="http://www.w3.org/2000/svg"
      fontFamily="'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
      style={{ width: "100%", height: "auto", minWidth: 700, background: "#fff" }}
    >
      <defs>
        {data.categories.map((_, i) => renderHatch(`hatch-${i}`))}
      </defs>

      {/* Title */}
      <text x="620" y="32" textAnchor="middle" fontSize="18" fontWeight="700" fill="#1B5E20">
        {data.title}
      </text>

      {/* Axes */}
      <line x1={LEFT} y1={TOP} x2={LEFT} y2={axisY} stroke="#555" strokeWidth="1.5" />
      <line x1={LEFT} y1={axisY} x2={RIGHT} y2={axisY} stroke="#555" strokeWidth="1.5" />

      {/* Month labels + ticks */}
      {MONTHS.map((m, i) => {
        const cx = monthToX(i + 1) + CHART_WIDTH / 12 / 2;
        return (
          <g key={m}>
            <line x1={monthToX(i + 1)} y1={axisY - 4} x2={monthToX(i + 1)} y2={axisY + 4} stroke="#555" strokeWidth="1" />
            <text x={cx} y={axisY + MONTH_LABEL_Y_OFFSET} textAnchor="middle" fontSize="13" fill="#333" fontWeight="500">
              {m}
            </text>
          </g>
        );
      })}
      {/* last tick */}
      <line x1={RIGHT} y1={axisY - 4} x2={RIGHT} y2={axisY + 4} stroke="#555" strokeWidth="1" />

      {/* Grid lines (light) */}
      {MONTHS.map((_, i) => (
        <line key={i} x1={monthToX(i + 1)} y1={TOP} x2={monthToX(i + 1)} y2={axisY} stroke="#e0e0e0" strokeWidth="0.5" />
      ))}

      {/* Categories */}
      {data.categories.map((cat, catIdx) => {
        const rowY = TOP + catIdx * ROW_HEIGHT;
        const barY = rowY + (ROW_HEIGHT - BAR_HEIGHT) / 2;

        return (
          <g key={cat.id}>
            {/* Category label */}
            <text
              x={LEFT - 12}
              y={rowY + ROW_HEIGHT / 2 + 5}
              textAnchor="end"
              fontSize="14"
              fontWeight="600"
              fill={darkenColor(cat.color, 0.3)}
            >
              {cat.name}
            </text>

            {/* Periods — render revisions first so critical overlays */}
            {[...cat.periods]
              .sort((a, b) => (a.type === "revision" ? -1 : 1))
              .map((p, pIdx) => renderPeriod(p, barY, cat.color, catIdx, pIdx))}
          </g>
        );
      })}

      {/* Legend */}
      {(() => {
        const legendY = axisY + 55;
        return (
          <g>
            <rect x={LEFT} y={legendY - 15} width={CHART_WIDTH} height="36" rx="6" fill="#F1F8E9" />
            {/* Critical */}
            <rect x={LEFT + 40} y={legendY - 5} width="50" height="16" fill="rgba(139,0,0,0.4)" rx="3" />
            <rect x={LEFT + 46} y={legendY - 5} width="38" height="16" fill="#4CAF50" rx="2" opacity="0.85" />
            <text x={LEFT + 100} y={legendY + 8} fontSize="13" fill="#2E7D32" fontWeight="500">Período Crítico</text>

            {/* Revision */}
            <rect x={LEFT + 300} y={legendY - 5} width="50" height="16" fill="#66BB6A" rx="3" opacity="0.65" />
            <text x={LEFT + 360} y={legendY + 8} fontSize="13" fill="#2E7D32" fontWeight="500">Revisão do PlaCon</text>
          </g>
        );
      })()}
    </svg>
  );
};

export default ChartSVG;
