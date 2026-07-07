import React from 'react';

export default function AreaTrendChart({ data }) {
  if (!data || data.length === 0) return <div style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '20px' }}>No trend data available</div>;

  const width = 500;
  const height = 240;
  const paddingLeft = 50;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxSales = Math.max(...data.map(d => d.sales), 100);
  const maxProfit = Math.max(...data.map(d => d.profit), 100);
  const maxValue = Math.max(maxSales, maxProfit) * 1.1;

  const pointsSales = data.map((d, i) => {
    const x = paddingLeft + (i * (chartWidth / (data.length - 1 || 1)));
    const y = paddingTop + chartHeight - ((d.sales / maxValue) * chartHeight);
    return { x, y };
  });

  const pointsProfit = data.map((d, i) => {
    const x = paddingLeft + (i * (chartWidth / (data.length - 1 || 1)));
    const y = paddingTop + chartHeight - ((d.profit / maxValue) * chartHeight);
    return { x, y };
  });

  const pathSalesD = pointsSales.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaSalesD = pointsSales.length > 0 ? `${pathSalesD} L ${pointsSales[pointsSales.length - 1].x} ${paddingTop + chartHeight} L ${pointsSales[0].x} ${paddingTop + chartHeight} Z` : '';

  const pathProfitD = pointsProfit.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaProfitD = pointsProfit.length > 0 ? `${pathProfitD} L ${pointsProfit[pointsProfit.length - 1].x} ${paddingTop + chartHeight} L ${pointsProfit[0].x} ${paddingTop + chartHeight} Z` : '';

  const yTicks = 4;
  const gridLines = [];
  for (let i = 0; i <= yTicks; i++) {
    const value = (maxValue / yTicks) * i;
    const y = paddingTop + chartHeight - (i * (chartHeight / yTicks));
    gridLines.push({ y, value });
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', background: 'transparent' }}>
      <defs>
        <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(200, 85%, 55%)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="hsl(200, 85%, 55%)" stopOpacity="0.0" />
        </linearGradient>
        <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(145, 80%, 50%)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="hsl(145, 80%, 50%)" stopOpacity="0.0" />
        </linearGradient>
      </defs>

      {gridLines.map((line, idx) => (
        <g key={idx}>
          <line
            x1={paddingLeft}
            y1={line.y}
            x2={width - paddingRight}
            y2={line.y}
            stroke="rgba(255, 255, 255, 0.05)"
            strokeDasharray="4 4"
          />
          <text
            x={paddingLeft - 8}
            y={line.y + 4}
            fill="var(--text-muted)"
            fontSize="10"
            textAnchor="end"
            fontWeight="600"
          >
            ₹{line.value >= 1000 ? `${(line.value / 1000).toFixed(1)}k` : Math.round(line.value)}
          </text>
        </g>
      ))}

      <path d={areaSalesD} fill="url(#salesGrad)" />
      <path d={areaProfitD} fill="url(#profitGrad)" />

      <path d={pathSalesD} fill="none" stroke="hsl(200, 85%, 55%)" strokeWidth="2.5" strokeLinecap="round" />
      <path d={pathProfitD} fill="none" stroke="hsl(145, 80%, 50%)" strokeWidth="2.5" strokeLinecap="round" />

      {pointsSales.map((p, idx) => (
        <g key={`sales-pt-${idx}`}>
          <circle
            cx={p.x}
            cy={p.y}
            r="4"
            fill="#fff"
            stroke="hsl(200, 85%, 55%)"
            strokeWidth="2"
          />
          <circle
            cx={p.x}
            cy={p.y}
            r="12"
            fill="transparent"
            style={{ cursor: 'pointer' }}
          />
          <title>Sales: ₹{data[idx].sales.toFixed(2)}</title>
        </g>
      ))}

      {pointsProfit.map((p, idx) => (
        <g key={`profit-pt-${idx}`}>
          <circle
            cx={p.x}
            cy={p.y}
            r="4"
            fill="#fff"
            stroke="hsl(145, 80%, 50%)"
            strokeWidth="2"
          />
          <circle
            cx={p.x}
            cy={p.y}
            r="12"
            fill="transparent"
            style={{ cursor: 'pointer' }}
          />
          <title>Profit: ₹{data[idx].profit.toFixed(2)}</title>
        </g>
      ))}

      {data.map((d, i) => {
        const x = paddingLeft + (i * (chartWidth / (data.length - 1 || 1)));
        return (
          <text
            key={`x-${i}`}
            x={x}
            y={height - 8}
            fill="var(--text-muted)"
            fontSize="9"
            textAnchor="middle"
            fontWeight="600"
          >
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}
