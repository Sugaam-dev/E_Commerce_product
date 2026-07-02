import { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { monthlySales, storePerformance, topProducts, orders } from '../data/mockData';
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
          <span className="tt-val">{p.name.includes('Revenue') || p.name.includes('Target') ? `₹${fmt(p.value)}` : p.value}</span>
        </div>
      ))}
    </div>
  );
};

const REPORTS = ['Sales Summary', 'Store Performance', 'Product Performance', 'Order Status'];

export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState('Sales Summary');
  const [period, setPeriod] = useState('This Year');

  const totalRevenue = monthlySales.reduce((s, m) => s + m.revenue, 0);
  const totalOrders = monthlySales.reduce((s, m) => s + m.orders, 0);
  const totalReturns = monthlySales.reduce((s, m) => s + m.returns, 0);

  const orderStatusData = [
    { name: 'Delivered', value: orders.filter(o => o.status === 'Delivered').length, fill: '#00B4A0' },
    { name: 'Processing', value: orders.filter(o => o.status === 'Processing').length, fill: '#6366F1' },
    { name: 'Shipped', value: orders.filter(o => o.status === 'Shipped').length, fill: '#F5A623' },
    { name: 'Cancelled', value: orders.filter(o => o.status === 'Cancelled').length, fill: '#E05C5C' },
    { name: 'Returned', value: orders.filter(o => o.status === 'Returned').length, fill: '#F0884A' },
  ];

  return (
    <div className="page-body">
      {/* KPI row */}
      <div className="stats-row">
        {[
          { label: 'Total Revenue', value: `₹${fmt(totalRevenue)}`, icon: 'ti-coin-rupee', color: '#00B4A0' },
          { label: 'Total Orders', value: fmt(totalOrders), icon: 'ti-shopping-cart', color: '#6366F1' },
          { label: 'Total Returns', value: fmt(totalReturns), icon: 'ti-arrow-back-up', color: '#E05C5C' },
          { label: 'Return Rate', value: `${((totalReturns / totalOrders) * 100).toFixed(1)}%`, icon: 'ti-percentage', color: '#F0884A' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-label"><i className={`ti ${s.icon}`} style={{ fontSize: '14px', color: s.color }}></i>{s.label}</div>
            <div className="stat-value" style={{ fontSize: '18px' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* AI Insight — context-aware to active report tab */}
      <AIInsightCard
        key={activeReport}
        title={`${activeReport} Analysis`}
        dataContext={
          activeReport === 'Sales Summary' ? { monthlySales, totalRevenue, totalOrders, totalReturns, returnRate: `${((totalReturns / totalOrders) * 100).toFixed(1)}%` } :
          activeReport === 'Store Performance' ? { storePerformance } :
          activeReport === 'Product Performance' ? { topProducts } :
          { orderStatus: orderStatusData }
        }
        prompt={`Summarize the "${activeReport}" data in plain English for a non-technical store owner. Give 3 key takeaways and 1 recommended action. Use ₹ for currency.`}
      />

      {/* Report Type Tabs */}
      <div className="panel">
        <div style={{ padding: '0 18px', display: 'flex', gap: '0', borderBottom: '1px solid #E2E8F0', overflowX: 'auto' }}>
          {REPORTS.map(r => (
            <button key={r} onClick={() => setActiveReport(r)}
              style={{ padding: '13px 18px', border: 'none', background: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s',
                color: activeReport === r ? '#00B4A0' : '#5A6A7A',
                borderBottom: `2px solid ${activeReport === r ? '#00B4A0' : 'transparent'}`,
                marginBottom: '-1px' }}>
              {r}
            </button>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', paddingRight: '4px' }}>
            <select className="select-sm" value={period} onChange={e => setPeriod(e.target.value)}>
              <option>This Year</option><option>Last 6 Months</option><option>Q1 2025</option>
            </select>
          </div>
        </div>

        {activeReport === 'Sales Summary' && (
          <div className="chart-body">
            <div style={{ marginBottom: '12px', padding: '0 8px' }}>
              <div style={{ fontSize: '12px', color: '#8A9AAA', marginBottom: '4px' }}>Monthly Revenue vs Target</div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlySales} margin={{ top: 5, right: 16, left: 10, bottom: 0 }} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#8A9AAA' }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} />
                <YAxis tickFormatter={v => `${(v/100000).toFixed(0)}L`} tick={{ fontSize: 10, fill: '#8A9AAA' }} axisLine={false} tickLine={false} width={36} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="revenue" name="Revenue" fill="#00B4A0" radius={[4,4,0,0]} barSize={16} />
                <Bar dataKey="target" name="Target" fill="#E2E8F0" radius={[4,4,0,0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ height: '1px', background: '#E2E8F0', margin: '16px 0' }}></div>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={monthlySales} margin={{ top: 5, right: 16, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#8A9AAA' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#8A9AAA' }} axisLine={false} tickLine={false} width={36} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="orders" name="Orders" stroke="#6366F1" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                <Line type="monotone" dataKey="returns" name="Returns" stroke="#E05C5C" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeReport === 'Store Performance' && (
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={storePerformance} layout="vertical" margin={{ top: 5, right: 80, left: 20, bottom: 0 }} barSize={12}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                <XAxis type="number" tickFormatter={v => `${(v/100000).toFixed(0)}L`} tick={{ fontSize: 10, fill: '#8A9AAA' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="store" tick={{ fontSize: 11, fill: '#5A6A7A' }} axisLine={false} tickLine={false} width={140} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="revenue" name="Revenue" fill="#00B4A0" radius={[0,4,4,0]} />
                <Bar dataKey="target" name="Target" fill="#E2E8F0" radius={[0,4,4,0]} />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ overflowX: 'auto', marginTop: '16px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC' }}>
                    {['Store','Revenue','Target','Achievement','Orders','Customers'].map(h => (
                      <th key={h} style={{ padding: '9px 14px', textAlign: 'left', fontSize: '10.5px', fontWeight: 700, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {storePerformance.map(s => {
                    const ach = Math.round((s.revenue / s.target) * 100);
                    return (
                      <tr key={s.store} style={{ borderTop: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '10px 14px', fontSize: '12.5px', fontWeight: 600, color: '#1A2A3A' }}>{s.store}</td>
                        <td style={{ padding: '10px 14px', fontSize: '12.5px', fontWeight: 700, color: '#1A2A3A' }}>₹{fmt(s.revenue)}</td>
                        <td style={{ padding: '10px 14px', fontSize: '12.5px', color: '#5A6A7A' }}>₹{fmt(s.target)}</td>
                        <td style={{ padding: '10px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ flex: 1, height: 5, background: '#F1F5F9', borderRadius: 4 }}>
                              <div style={{ height: '100%', width: `${Math.min(ach,100)}%`, background: ach >= 100 ? '#00B4A0' : ach >= 80 ? '#F5A623' : '#E05C5C', borderRadius: 4 }}></div>
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: ach >= 100 ? '#00B4A0' : ach >= 80 ? '#D97706' : '#E05C5C', minWidth: '36px' }}>{ach}%</span>
                          </div>
                        </td>
                        <td style={{ padding: '10px 14px', fontSize: '12.5px', color: '#1A2A3A' }}>{s.orders}</td>
                        <td style={{ padding: '10px 14px', fontSize: '12.5px', color: '#1A2A3A' }}>{s.customers}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeReport === 'Product Performance' && (
          <div className="chart-body">
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC' }}>
                    {['#','Product','Units Sold','Revenue','Share'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10.5px', fontWeight: 700, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((p, i) => {
                    const maxSales = topProducts[0].sales;
                    const pct = Math.round((p.sales / maxSales) * 100);
                    return (
                      <tr key={p.name} style={{ borderTop: '1px solid #F1F5F9', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                        onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ width: 24, height: 24, borderRadius: '50%', background: i === 0 ? '#F5A623' : i === 1 ? '#8A9AAA' : i === 2 ? '#F0884A' : '#F1F5F9', color: i < 3 ? 'white' : '#5A6A7A', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i+1}</div>
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 600, color: '#1A2A3A' }}>{p.name}</td>
                        <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 700, color: '#1A2A3A' }}>{p.sales}</td>
                        <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 700, color: '#1A2A3A' }}>₹{fmt(p.revenue)}</td>
                        <td style={{ padding: '12px 14px', minWidth: '160px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ flex: 1, height: 5, background: '#F1F5F9', borderRadius: 4 }}>
                              <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#00B4A0,#6366F1)', borderRadius: 4 }}></div>
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#00B4A0', minWidth: '32px' }}>{pct}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeReport === 'Order Status' && (
          <div className="chart-body">
            <div className="grid-responsive-2" style={{ alignItems: 'center' }}>
              <div>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={orderStatusData} margin={{ top: 5, right: 16, left: 0, bottom: 0 }} barSize={28}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#8A9AAA' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#8A9AAA' }} axisLine={false} tickLine={false} width={28} />
                    <Tooltip />
                    {orderStatusData.map(s => (
                      <Bar key={s.name} dataKey="value" data={[s]} name={s.name} fill={s.fill} radius={[4,4,0,0]} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {orderStatusData.map(s => (
                  <div key={s.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#F8FAFC', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.fill }}></div>
                      <span style={{ fontSize: '12.5px', color: '#5A6A7A', fontWeight: 500 }}>{s.name}</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '15px', fontWeight: 800, color: '#1A2A3A' }}>{s.value}</span>
                      <span style={{ fontSize: '11px', color: '#8A9AAA', marginLeft: '6px' }}>({Math.round((s.value / orders.length) * 100)}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
