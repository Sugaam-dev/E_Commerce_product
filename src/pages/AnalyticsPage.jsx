import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { monthlySales, weeklyTraffic, storePerformance, categoryBreakdown } from '../data/mockData';
import { PieChart, Pie, Cell } from 'recharts';
import AIInsightCard from '../components/AIInsightCard';

const fmt = v => new Intl.NumberFormat('en-IN').format(v);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="tt-label">{label}</div>
      {payload.map(p => (
        <div className="tt-row" key={p.dataKey}>
          <span className="tt-dot" style={{ background: p.color }}></span>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>{p.name}:</span>
          <span className="tt-val">{typeof p.value === 'number' && p.value > 10000 ? `₹${fmt(p.value)}` : p.value}</span>
        </div>
      ))}
    </div>
  );
};

const radarData = storePerformance.slice(0, 6).map(s => ({
  store: s.store.replace('PMRG ', ''),
  revenue: Math.round(s.revenue / 100000),
  orders: Math.round(s.orders / 10),
  customers: Math.round(s.customers / 5),
}));

export default function AnalyticsPage() {
  const [metric, setMetric] = useState('revenue');

  const convRate = weeklyTraffic.map(d => ({
    ...d,
    rate: parseFloat(((d.conversions / d.visits) * 100).toFixed(1)),
  }));

  const totalVisits = weeklyTraffic.reduce((s, d) => s + d.visits, 0);
  const totalConv = weeklyTraffic.reduce((s, d) => s + d.conversions, 0);
  const avgConvRate = ((totalConv / totalVisits) * 100).toFixed(1);
  const totalRev = monthlySales.reduce((s, m) => s + m.revenue, 0);
  const growth = ((monthlySales[11].revenue / monthlySales[0].revenue - 1) * 100).toFixed(1);

  return (
    <div className="page-body">
      {/* KPI */}
      <div className="stats-row">
        {[
          { label: 'Annual Revenue', value: `₹${(totalRev / 10000000).toFixed(2)}Cr`, sub: `${growth}% growth`, icon: 'ti-trending-up', color: '#00B4A0' },
          { label: 'Weekly Visits', value: fmt(totalVisits), sub: 'This week', icon: 'ti-users', color: '#6366F1' },
          { label: 'Avg Conv. Rate', value: `${avgConvRate}%`, sub: 'Visits → Sales', icon: 'ti-percentage', color: '#F5A623' },
          { label: 'Peak Month', value: 'Nov', sub: '₹49,00,000 revenue', icon: 'ti-star', color: '#E05C5C' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-label"><i className={`ti ${s.icon}`} style={{ fontSize: '14px', color: s.color }}></i>{s.label}</div>
            <div className="stat-value" style={{ fontSize: '20px' }}>{s.value}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* AI Insight */}
      <AIInsightCard
        title="Analytics Interpretation"
        dataContext={{
          monthlyRevenue: monthlySales.map(m => ({ month: m.month, revenue: m.revenue, orders: m.orders, returns: m.returns, target: m.target })),
          weeklyConversionRate: weeklyTraffic.map(d => ({ day: d.day, visits: d.visits, conversions: d.conversions, rate: `${((d.conversions/d.visits)*100).toFixed(1)}%` })),
          storeRadar: storePerformance.slice(0, 6).map(s => ({ store: s.store.replace('PMRG ', ''), revenue: s.revenue, target: s.target, gap: s.revenue - s.target })),
          categoryBreakdown,
        }}
        prompt="Interpret the monthly revenue trend, weekly conversion rate patterns, and store radar data. Explain WHY trends are happening (seasonal patterns, store underperformance, conversion gaps), not just what the numbers show."
      />

      {/* Revenue trend + category */}
      <div className="mid-row">
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title"><i className="ti ti-chart-area-line"></i> Revenue & Orders Trend</div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['revenue','orders'].map(m => (
                <button key={m} onClick={() => setMetric(m)}
                  style={{ padding: '5px 12px', borderRadius: '20px', border: '1px solid', fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                    borderColor: metric === m ? '#00B4A0' : '#E2E8F0',
                    background: metric === m ? 'rgba(0,180,160,0.1)' : 'white',
                    color: metric === m ? '#00B4A0' : '#5A6A7A' }}>
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlySales} margin={{ top: 10, right: 16, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00B4A0" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#00B4A0" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#8A9AAA' }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} />
                <YAxis tickFormatter={v => metric === 'revenue' ? `${(v/100000).toFixed(0)}L` : v} tick={{ fontSize: 10, fill: '#8A9AAA' }} axisLine={false} tickLine={false} width={36} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey={metric} name={metric === 'revenue' ? 'Revenue' : 'Orders'} stroke="#00B4A0" strokeWidth={2.5} fill="url(#gA)" dot={false} activeDot={{ r: 5, fill: '#00B4A0', stroke: 'white', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div className="panel-title"><i className="ti ti-chart-pie"></i> Category Distribution</div>
          </div>
          <div className="donut-body">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={categoryBreakdown} cx="50%" cy="50%" outerRadius={80} paddingAngle={2} dataKey="value" startAngle={90} endAngle={-270}>
                  {categoryBreakdown.map(e => <Cell key={e.name} fill={e.color} stroke="white" strokeWidth={2} />)}
                </Pie>
                <Tooltip formatter={v => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="donut-legend">
              {categoryBreakdown.map(c => (
                <div className="donut-legend-item" key={c.name}>
                  <div className="donut-legend-left">
                    <div className="donut-legend-color" style={{ background: c.color }}></div>
                    <span className="donut-legend-label">{c.name}</span>
                  </div>
                  <span className="donut-legend-count">{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Weekly traffic + Radar */}
      <div className="mid-row">
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title"><i className="ti ti-activity"></i> Weekly Traffic & Conversions</div>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={convRate} margin={{ top: 5, right: 16, left: 10, bottom: 0 }} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#8A9AAA' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#8A9AAA' }} axisLine={false} tickLine={false} width={36} />
                <YAxis yAxisId="right" orientation="right" tickFormatter={v => `${v}%`} tick={{ fontSize: 10, fill: '#8A9AAA' }} axisLine={false} tickLine={false} width={36} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar yAxisId="left" dataKey="visits" name="Visits" fill="#6366F1" radius={[4,4,0,0]} barSize={14} />
                <Bar yAxisId="left" dataKey="conversions" name="Conversions" fill="#00B4A0" radius={[4,4,0,0]} barSize={14} />
                <Line yAxisId="right" type="monotone" dataKey="rate" name="Conv. Rate" stroke="#F5A623" strokeWidth={2} dot={{ fill: '#F5A623', r: 4 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div className="panel-title"><i className="ti ti-radar"></i> Store Radar Analysis</div>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={230}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="store" tick={{ fontSize: 10, fill: '#5A6A7A' }} />
                <PolarRadiusAxis tick={{ fontSize: 9, fill: '#8A9AAA' }} />
                <Radar name="Revenue (L)" dataKey="revenue" stroke="#00B4A0" fill="#00B4A0" fillOpacity={0.2} />
                <Radar name="Orders (×10)" dataKey="orders" stroke="#6366F1" fill="#6366F1" fillOpacity={0.2} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
