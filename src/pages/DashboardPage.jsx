import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  BarChart, Bar,
} from 'recharts';
import {
  statsData, transactionSummaryData, feedbackData,
  voucherData, transactionsData, monthlySales, storePerformance,
} from '../data/mockData';
import { useScopedOrders, useScopedProducts } from '../utils/scopedData';
import { useAuth } from '../context/AuthContext';
import AIInsightCard from '../components/AIInsightCard';

const fmt = (v) => new Intl.NumberFormat('en-IN').format(v);
const fmtINR = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

/* ── Custom Tooltip ── */
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="tt-label">{label}</div>
      {payload.map(p => (
        <div className="tt-row" key={p.dataKey}>
          <span className="tt-dot" style={{ background: p.color }}></span>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>{p.name}:</span>
          <span className="tt-val">{fmtINR(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

/* ── Feedback Tooltip ── */
const FeedbackTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="custom-tooltip">
      <div className="tt-row">
        <span className="tt-dot" style={{ background: d.payload.color }}></span>
        <span style={{ color: 'rgba(255,255,255,0.8)' }}>{d.name}:</span>
        <span className="tt-val">{d.value} ({d.payload.pct})</span>
      </div>
    </div>
  );
};

const TOTAL_FEEDBACK = (feedbackData || []).reduce((s, d) => s + d.value, 0);

const badgeClass = (type) => {
  if (type === 'blue') return 'discount-badge badge-blue';
  if (type === 'green') return 'discount-badge badge-green';
  return 'discount-badge badge-orange';
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [txnPeriod, setTxnPeriod] = useState('Last 12 Months');

  // Scoped data
  const scopedOrders = useScopedOrders(currentUser?.id);
  const scopedProducts = useScopedProducts(currentUser?.id);
  const scopedTransactions = transactionsData.filter(t => t.adminId === currentUser?.id);

  return (
    <div className="page-body">

      {/* ── KPI Stats Row ── */}
      <div className="stats-row">
        {(statsData || []).map((stat) => (
          <div key={stat.id} className="stat-card">
            <div className="stat-label">
              <i className={`ti ${stat.icon}`} style={{ fontSize: '14px', color: '#1a73e8' }}></i>
              {stat.label}
            </div>
            <div className="stat-value">
              {stat.id === 'freq' ? (
                <>{stat.value}<span style={{ fontSize: '14px', fontWeight: 500, color: '#5A6A7A', marginLeft: 4 }}>Days</span></>
              ) : stat.value}
            </div>
            {stat.sub && <div className="stat-sub">{stat.sub}</div>}
            <div className="stat-chip">
              <i className="ti ti-arrow-up-right" style={{ fontSize: '10px' }}></i>
              {stat.chip}
            </div>
          </div>
        ))}
      </div>

      {/* ── AI Insight — scoped to this admin ── */}
      <AIInsightCard
        autoLoad={true}
        title="Dashboard Overview"
        dataContext={{
          monthlyRevenue: monthlySales.map(m => ({ month: m.month, revenue: m.revenue, orders: m.orders, returns: m.returns, target: m.target })),
          storePerformance: storePerformance.map(s => ({ store: s.store, revenue: s.revenue, orders: s.orders, target: s.target })),
          currentMonth: monthlySales[monthlySales.length - 1],
          previousMonth: monthlySales[monthlySales.length - 2],
          scopedOrderCount: scopedOrders.length,
          scopedProductCount: scopedProducts.length,
          adminId: currentUser?.id,
        }}
        prompt="Analyze this month's revenue, order trend across all months, and store performance vs targets. Give 3 sharp business insights and 1 concrete action item for the store owner. Focus on what's notable — peaks, dips, gaps vs target."
      />

      {/* ── Transaction Summary + Customer Feedback ── */}
      <div className="mid-row">
        {/* Transaction Summary chart */}
        <div className="panel">
          <div className="panel-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <div className="panel-title">
                <i className="ti ti-chart-area-line"></i>
                Transaction Summary
                <i className="ti ti-info-circle" style={{ fontSize: 13, color: '#8A9AAA' }}></i>
              </div>
              <div className="legend">
                <div className="legend-item"><span className="legend-dot" style={{ background: '#00B4A0' }}></span>Billed</div>
                <div className="legend-item"><span className="legend-dot" style={{ background: '#E05C5C' }}></span>Returned</div>
                <div className="legend-item"><span className="legend-dot" style={{ background: '#F0884A' }}></span>Cancelled</div>
              </div>
            </div>
            <select className="select-sm" value={txnPeriod} onChange={e => setTxnPeriod(e.target.value)}>
              <option>Last 12 Months</option>
              <option>Last 6 Months</option>
              <option>Last 3 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={230}>
              <AreaChart data={transactionSummaryData || []} margin={{ top: 10, right: 16, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gBilled" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00B4A0" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00B4A0" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gReturned" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E05C5C" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#E05C5C" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gCancelled" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F0884A" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#F0884A" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#8A9AAA' }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} dy={4} />
                <YAxis tickFormatter={v => v >= 100000 ? `${(v/100000).toFixed(1)}L` : v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} tick={{ fontSize: 10, fill: '#8A9AAA' }} axisLine={false} tickLine={false} width={42} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="Billed" stroke="#00B4A0" strokeWidth={2.5} fill="url(#gBilled)" dot={false} activeDot={{ r: 5, fill: '#00B4A0', stroke: 'white', strokeWidth: 2 }} />
                <Area type="monotone" dataKey="Returned" stroke="#E05C5C" strokeWidth={2} fill="url(#gReturned)" dot={false} activeDot={{ r: 4, fill: '#E05C5C', stroke: 'white', strokeWidth: 2 }} />
                <Area type="monotone" dataKey="Cancelled" stroke="#F0884A" strokeWidth={2} fill="url(#gCancelled)" dot={false} activeDot={{ r: 4, fill: '#F0884A', stroke: 'white', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
            <div style={{ textAlign: 'center', fontSize: 10, color: '#8A9AAA', marginTop: 4 }}>Year 2024–2025</div>
          </div>
        </div>

        {/* Customer Feedback donut */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">
              <i className="ti ti-mood-smile"></i>
              Customer Feedback
              <i className="ti ti-info-circle" style={{ fontSize: 13, color: '#8A9AAA' }}></i>
            </div>
            <a className="show-all-link" href="#">SHOW ALL</a>
          </div>
          <div className="donut-body">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={feedbackData || []}
                  cx="50%" cy="50%"
                  innerRadius={60} outerRadius={88}
                  paddingAngle={2} dataKey="value"
                  startAngle={90} endAngle={-270}
                  labelLine={false}
                  label={({ cx, cy }) => (
                    <>
                      <text x={cx} y={cy - 8} style={{ fontFamily: 'Inter', fontSize: 18, fontWeight: 800, fill: '#1A2A3A', textAnchor: 'middle' }}>{TOTAL_FEEDBACK}</text>
                      <text x={cx} y={cy + 12} style={{ fontFamily: 'Inter', fontSize: 10, fill: '#8A9AAA', textAnchor: 'middle' }}>Total</text>
                    </>
                  )}
                >
                  {(feedbackData || []).map(e => <Cell key={e.name} fill={e.color} stroke="white" strokeWidth={2} />)}
                </Pie>
                <Tooltip content={<FeedbackTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="donut-legend">
              {(feedbackData || []).map(item => (
                <div className="donut-legend-item" key={item.name}>
                  <div className="donut-legend-left">
                    <div className="donut-legend-color" style={{ background: item.color }}></div>
                    <span className="donut-legend-label">{item.name}</span>
                  </div>
                  <div>
                    <span className="donut-legend-count">{item.value}</span>
                    <span className="donut-legend-pct"> ({item.pct})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Voucher Row ── */}
      <div className="voucher-row">
        {(voucherData || []).map(v => (
          <div key={v.id} className="voucher-card">
            <div>
              <div className="voucher-label"><i className={`ti ${v.icon}`} style={{ marginRight: 4 }}></i>{v.label}</div>
              <div className="voucher-count">{v.count}</div>
              <div className="voucher-amount">{v.amount}</div>
            </div>
            <div className="voucher-arrow"><i className="ti ti-arrow-right"></i></div>
          </div>
        ))}
      </div>

      {/* ── Transaction History ── */}
      <div className="txn-section">
        <div className="txn-header">
          <div className="txn-title"><i className="ti ti-receipt-2"></i> Transaction History</div>
          <a className="show-all-link" href="#">SHOW ALL</a>
        </div>
        <div className="txn-grid">
          {(scopedTransactions.length > 0 ? scopedTransactions : transactionsData).map(txn => (
            <div key={txn.id} className="txn-card" id={`txn-${txn.id}`}>
              <div className="txn-top-row">
                <div className="txn-tag">
                  <span className="bill-pill">{txn.type}</span>
                  <span className="trn-id">/ {txn.trn}</span>
                </div>
                <div className="txn-amount">{txn.amount}</div>
              </div>
              <div className="txn-product-row">
                <img src={txn.image} alt={txn.productName} className="product-thumb" loading="lazy"
                  onError={e => { e.target.src = `https://via.placeholder.com/60x60/E2E8F0/8A9AAA?text=IMG`; }} />
                <div className="product-info">
                  <div className="product-name">{txn.productName}</div>
                  <div className="product-sku">{txn.sku}</div>
                  <div className="product-meta">
                    <span className="qty-price">{txn.qty} &nbsp;<span className="price-val">{txn.price}</span></span>
                    <span className={badgeClass(txn.discountType)}>{txn.discountBadge}</span>
                  </div>
                </div>
              </div>
              <div className="txn-footer">
                <div className="store-date">
                  <i className="ti ti-building-store"></i>{txn.store}&nbsp;·&nbsp;
                  <i className="ti ti-calendar"></i>{txn.date}
                </div>
                <a href="#" className="view-invoice" onClick={e => e.preventDefault()}>View Invoice ›</a>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}