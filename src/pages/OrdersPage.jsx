import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { orders } from '../data/mockData';
import AIInsightCard from '../components/AIInsightCard';

const statusColors = {
  Delivered: { bg: 'rgba(0,180,160,0.12)', text: '#00B4A0' },
  Processing: { bg: 'rgba(99,102,241,0.12)', text: '#6366F1' },
  Shipped: { bg: 'rgba(245,166,35,0.12)', text: '#D97706' },
  Cancelled: { bg: 'rgba(224,92,92,0.12)', text: '#E05C5C' },
  Returned: { bg: 'rgba(240,136,74,0.12)', text: '#F0884A' },
};

const fmt = v => new Intl.NumberFormat('en-IN').format(v);

export default function OrdersPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortKey, setSortKey] = useState('date');
  const [sortDir, setSortDir] = useState('desc');

  const statuses = ['All', 'Delivered', 'Processing', 'Shipped', 'Cancelled', 'Returned'];

  const filtered = useMemo(() => {
    let data = orders.filter(o =>
      (o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.customer.toLowerCase().includes(search.toLowerCase()) ||
        o.product.toLowerCase().includes(search.toLowerCase())) &&
      (filterStatus === 'All' || o.status === filterStatus)
    );
    data.sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey];
      if (typeof av === 'string') av = av.toLowerCase(), bv = bv.toLowerCase();
      return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
    return data;
  }, [search, filterStatus, sortKey, sortDir]);

  const toggleSort = key => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <i className="ti ti-selector" style={{ fontSize: '11px', color: '#CBD5E1', marginLeft: 3 }}></i>;
    return <i className={`ti ${sortDir === 'asc' ? 'ti-chevron-up' : 'ti-chevron-down'}`} style={{ fontSize: '11px', color: '#00B4A0', marginLeft: 3 }}></i>;
  };

  const totalRevenue = filtered.filter(o => o.status === 'Delivered').reduce((s, o) => s + o.amount, 0);

  return (
    <div className="page-body">
      {/* Stats */}
      <div className="stats-row">
        {[
          { label: 'Total Orders', value: orders.length, icon: 'ti-shopping-cart', color: '#00B4A0' },
          { label: 'Delivered', value: orders.filter(o => o.status === 'Delivered').length, icon: 'ti-package', color: '#6366F1' },
          { label: 'Processing', value: orders.filter(o => o.status === 'Processing').length, icon: 'ti-clock', color: '#F5A623' },
          { label: 'Cancelled / Returned', value: orders.filter(o => ['Cancelled','Returned'].includes(o.status)).length, icon: 'ti-x', color: '#E05C5C' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-label"><i className={`ti ${s.icon}`} style={{ fontSize: '14px', color: s.color }}></i>{s.label}</div>
            <div className="stat-value" style={{ fontSize: '24px' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* AI Insight */}
      <AIInsightCard
        title="Order Intelligence"
        dataContext={{
          statusBreakdown: {
            delivered: orders.filter(o => o.status === 'Delivered').length,
            processing: orders.filter(o => o.status === 'Processing').length,
            shipped: orders.filter(o => o.status === 'Shipped').length,
            cancelled: orders.filter(o => o.status === 'Cancelled').length,
            returned: orders.filter(o => o.status === 'Returned').length,
          },
          paymentMethods: orders.reduce((acc, o) => { acc[o.payment] = (acc[o.payment] || 0) + 1; return acc; }, {}),
          recentOrders: orders.slice(0, 8).map(o => ({ id: o.id, customer: o.customer, amount: o.amount, status: o.status, date: o.date, payment: o.payment })),
          totalRevenue: orders.filter(o => o.status === 'Delivered').reduce((s, o) => s + o.amount, 0),
        }}
        prompt="Analyze order statuses, payment methods, and recent trends. Flag any anomaly (e.g., spike in cancellations/returns, COD vs digital payment ratio) and suggest a specific fix for the store owner."
      />

      <div className="panel">
        {/* Toolbar */}
        <div style={{ padding: '14px 18px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', borderBottom: '1px solid #E2E8F0' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <i className="ti ti-search" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#8A9AAA', fontSize: '14px' }}></i>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders, customers, products..." style={{ width: '100%', padding: '8px 10px 8px 32px', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '13px', fontFamily: 'inherit', outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {statuses.map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid', fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                  borderColor: filterStatus === s ? '#00B4A0' : '#E2E8F0',
                  background: filterStatus === s ? 'rgba(0,180,160,0.1)' : 'white',
                  color: filterStatus === s ? '#00B4A0' : '#5A6A7A' }}>
                {s}
              </button>
            ))}
          </div>
          <span style={{ fontSize: '12px', color: '#8A9AAA', marginLeft: 'auto' }}>
            {filtered.length} orders · Revenue: <strong style={{ color: '#1A2A3A' }}>₹{fmt(totalRevenue)}</strong>
          </span>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                {[
                  { key: 'id', label: 'Order ID' },
                  { key: 'customer', label: 'Customer' },
                  { key: 'product', label: 'Product' },
                  { key: 'qty', label: 'Qty' },
                  { key: 'amount', label: 'Amount' },
                  { key: 'store', label: 'Store' },
                  { key: 'date', label: 'Date' },
                  { key: 'payment', label: 'Payment' },
                  { key: 'status', label: 'Status' },
                ].map(col => (
                  <th key={col.label} onClick={() => toggleSort(col.key)}
                    style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: '0.5px', cursor: 'pointer', whiteSpace: 'nowrap', userSelect: 'none' }}>
                    {col.label}<SortIcon col={col.key} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => {
                const sc = statusColors[o.status] || { bg: '#F1F5F9', text: '#5A6A7A' };
                return (
                  <tr key={o.id} style={{ borderTop: '1px solid #F1F5F9', transition: 'background 0.15s', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}
                    onClick={() => navigate(`/contacts/${o.customerId}`)}>
                    <td style={{ padding: '11px 14px', fontSize: '12.5px', fontWeight: 700, color: '#00B4A0' }}>{o.id}</td>
                    <td style={{ padding: '11px 14px', fontSize: '12.5px', fontWeight: 600, color: '#1A2A3A' }}>{o.customer}</td>
                    <td style={{ padding: '11px 14px', fontSize: '12px', color: '#5A6A7A', maxWidth: '160px' }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.product}</div>
                      <div style={{ fontSize: '10.5px', color: '#8A9AAA' }}>{o.sku}</div>
                    </td>
                    <td style={{ padding: '11px 14px', fontSize: '13px', fontWeight: 600, color: '#1A2A3A', textAlign: 'center' }}>{o.qty}</td>
                    <td style={{ padding: '11px 14px', fontSize: '13px', fontWeight: 700, color: '#1A2A3A' }}>₹{fmt(o.amount)}</td>
                    <td style={{ padding: '11px 14px', fontSize: '12px', color: '#5A6A7A' }}>{o.store}</td>
                    <td style={{ padding: '11px 14px', fontSize: '12px', color: '#5A6A7A' }}>{o.date}</td>
                    <td style={{ padding: '11px 14px' }}>
                      <span style={{ fontSize: '11px', background: '#F1F5F9', padding: '3px 8px', borderRadius: '4px', fontWeight: 600, color: '#5A6A7A' }}>{o.payment}</span>
                    </td>
                    <td style={{ padding: '11px 14px' }}>
                      <span style={{ background: sc.bg, color: sc.text, fontSize: '10.5px', fontWeight: 700, padding: '3px 9px', borderRadius: '20px' }}>{o.status}</span>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: '#8A9AAA' }}>
                  <i className="ti ti-inbox" style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}></i>No orders found
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
