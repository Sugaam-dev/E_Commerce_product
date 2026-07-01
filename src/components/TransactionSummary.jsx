import { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { transactionSummaryData } from '../data/mockData';

const formatY = (value) => {
  if (value >= 100000) return `${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return value;
};

const formatINR = (v) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="tt-label">{label}</div>
      {payload.map((p) => (
        <div className="tt-row" key={p.dataKey}>
          <span className="tt-dot" style={{ background: p.color }}></span>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>{p.name}:</span>
          <span className="tt-val" style={{ color: 'white' }}>{formatINR(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

export default function TransactionSummary() {
  const [period, setPeriod] = useState('Last 12 Months');

  return (
    <div className="panel">
      <div className="panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div className="panel-title">
            <i className="ti ti-chart-area-line"></i>
            Transaction Summary
            <i className="ti ti-info-circle" style={{ fontSize: '13px', color: '#8A9AAA' }}></i>
          </div>
          <div className="legend">
            <div className="legend-item">
              <span className="legend-dot" style={{ background: '#00B4A0' }}></span>
              Billed
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: '#E05C5C' }}></span>
              Returned
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: '#F0884A' }}></span>
              Cancelled
            </div>
          </div>
        </div>
        <div className="chart-controls">
          <select
            className="select-sm"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            id="txn-period-select"
            aria-label="Select time period"
          >
            <option>Last 12 Months</option>
            <option>Last 6 Months</option>
            <option>Last 3 Months</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      <div className="chart-body">
        <ResponsiveContainer width="100%" height={230}>
          <AreaChart
            data={transactionSummaryData}
            margin={{ top: 10, right: 16, left: 10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gradBilled" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00B4A0" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00B4A0" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gradReturned" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E05C5C" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#E05C5C" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gradCancelled" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F0884A" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#F0884A" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fill: '#8A9AAA', fontFamily: 'Inter' }}
              axisLine={{ stroke: '#E2E8F0' }}
              tickLine={false}
              dy={4}
            />
            <YAxis
              tickFormatter={formatY}
              tick={{ fontSize: 10, fill: '#8A9AAA', fontFamily: 'Inter' }}
              axisLine={false}
              tickLine={false}
              width={42}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="Billed"
              stroke="#00B4A0"
              strokeWidth={2.5}
              fill="url(#gradBilled)"
              dot={false}
              activeDot={{ r: 5, fill: '#00B4A0', stroke: 'white', strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="Returned"
              stroke="#E05C5C"
              strokeWidth={2}
              fill="url(#gradReturned)"
              dot={false}
              activeDot={{ r: 4, fill: '#E05C5C', stroke: 'white', strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="Cancelled"
              stroke="#F0884A"
              strokeWidth={2}
              fill="url(#gradCancelled)"
              dot={false}
              activeDot={{ r: 4, fill: '#F0884A', stroke: 'white', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
        <div style={{ textAlign: 'center', fontSize: '10px', color: '#8A9AAA', marginTop: '4px', letterSpacing: '0.3px' }}>
          Year 2024–2025
        </div>
      </div>
    </div>
  );
}
