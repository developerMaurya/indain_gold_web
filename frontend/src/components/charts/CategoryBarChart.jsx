import React from 'react';

export default function CategoryBarChart({ data }) {
  if (!data || data.length === 0) return <div style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '20px' }}>No category data available</div>;

  const width = 500;
  const height = 240;
  const paddingLeft = 50;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 35;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxVal = Math.max(...data.map(d => d.stock), 10);
  const limitValue = maxVal * 1.1;

  const barWidth = Math.min(45, (chartWidth / data.length) * 0.6);
  const gap = (chartWidth - (barWidth * data.length)) / (data.length - 1 || 1);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', background: 'transparent' }}>
      <defs>
        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(265, 80%, 65%)" />
          <stop offset="100%" stopColor="hsl(280, 80%, 45%)" />
        </linearGradient>
      </defs>

      {[0, 1, 2, 3, 4].map((i) => {
        const value = (limitValue / 4) * i;
        const y = paddingTop + chartHeight - (i * (chartHeight / 4));
        return (
          <g key={i}>
            <line
              x1={paddingLeft}
              y1={y}
              x2={width - paddingRight}
              y2={y}
              stroke="rgba(255, 255, 255, 0.05)"
              strokeDasharray="4 4"
            />
            <text
              x={paddingLeft - 8}
              y={y + 4}
              fill="var(--text-muted)"
              fontSize="10"
              textAnchor="end"
              fontWeight="600"
            >
              {Math.round(value)}
            </text>
          </g>
        );
      })}

      {data.map((d, i) => {
        const x = paddingLeft + (i * (barWidth + gap)) + (gap / 2);
        const barHeight = (d.stock / limitValue) * chartHeight;
        const y = paddingTop + chartHeight - barHeight;

        return (
          <g key={i} style={{ cursor: 'pointer' }}>
            <title>{`${d.category}: ${d.stock} units in stock`}</title>
            <rect
              x={x}
              y={paddingTop}
              width={barWidth}
              height={chartHeight}
              rx={4}
              fill="rgba(255, 255, 255, 0.015)"
            />
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx={4}
              fill="url(#barGrad)"
            />
            <text
              x={x + barWidth / 2}
              y={y - 6}
              fill="var(--text-main)"
              fontSize="9"
              fontWeight="700"
              textAnchor="middle"
            >
              {d.stock}
            </text>
            <text
              x={x + barWidth / 2}
              y={height - 8}
              fill="var(--text-muted)"
              fontSize="9"
              fontWeight="600"
              textAnchor="middle"
            >
              {d.category.length > 8 ? `${d.category.slice(0, 7)}.` : d.category}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
