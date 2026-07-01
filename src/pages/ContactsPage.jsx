import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { customers } from '../data/mockData';
import AIInsightCard from '../components/AIInsightCard';

const tagColor = { VIP: '#F5A623', Elite: '#6366F1', Regular: '#8A9AAA', New: '#00B4A0' };
const statusColor = { Active: '#00B4A0', Inactive: '#E05C5C' };
const fmt = v => new Intl.NumberFormat('en-IN').format(v);

export default function ContactsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterGroup, setFilterGroup] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortKey, setSortKey] = useState('name');
  const [sortDir, setSortDir] = useState('asc');

  const groups = ['All', ...new Set(customers.map(c => c.group))];
  const statuses = ['All', 'Active', 'Inactive'];

  const filtered = useMemo(() => {
    let data = customers.filter(c => {
      const q = search.toLowerCase();
      return (
        (c.name.toLowerCase().includes(q) || c.email.includes(q) || c.city.toLowerCase().includes(q)) &&
        (filterGroup === 'All' || c.group === filterGroup) &&
        (filterStatus === 'All' || c.status === filterStatus)
      );
    });
    data.sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey];
      if (typeof av === 'string') av = av.toLowerCase(), bv = bv.toLowerCase();
      return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
    return data;
  }, [search, filterGroup, filterStatus, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <i className="ti ti-selector" style={{ fontSize: '11px', color: '#CBD5E1', marginLeft: 3 }}></i>;
    return <i className={`ti ${sortDir === 'asc' ? 'ti-chevron-up' : 'ti-chevron-down'}`} style={{ fontSize: '11px', color: '#00B4A0', marginLeft: 3 }}></i>;
  };

  return (
    <div className="page-body">
      {/* Summary Cards */}
      <div className="stats-row">
        {[
          { label: 'Total Customers', value: customers.length, icon: 'ti-users', color: '#00B4A0' },
          { label: 'Active', value: customers.filter(c => c.status === 'Active').length, icon: 'ti-user-check', color: '#6366F1' },
          { label: 'VIP / Elite', value: customers.filter(c => c.tag === 'VIP' || c.tag === 'Elite').length, icon: 'ti-star', color: '#F5A623' },
          { label: 'Avg. CLV', value: `₹${fmt(Math.round(customers.reduce((s, c) => s + c.clv, 0) / customers.length))}`, icon: 'ti-coin-rupee', color: '#E05C5C' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-label"><i className={`ti ${s.icon}`} style={{ fontSize: '14px', color: s.color }}></i>{s.label}</div>
            <div className="stat-value" style={{ fontSize: '24px' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* AI Insight */}
      <AIInsightCard
        title="Customer Intelligence"
        dataContext={{
          customers: customers.map(c => ({
            name: c.name, group: c.group, tag: c.tag, status: c.status,
            totalSpend: c.totalSpend, transactions: c.transactions,
            lastPurchase: c.lastPurchase, city: c.city,
          })),
          summary: {
            total: customers.length,
            active: customers.filter(c => c.status === 'Active').length,
            inactive: customers.filter(c => c.status === 'Inactive').length,
            vipElite: customers.filter(c => c.tag === 'VIP' || c.tag === 'Elite').length,
            avgSpend: Math.round(customers.reduce((s, c) => s + c.totalSpend, 0) / customers.length),
          },
        }}
        prompt="Analyze this customer list — segment by tag/status/spend. Highlight churn risks (Inactive customers with high past spend) and top growth opportunities. Identify any patterns in purchasing behavior."
      />

      {/* Filters */}
      <div className="panel">
        <div style={{ padding: '14px 18px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', borderBottom: '1px solid #E2E8F0' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <i className="ti ti-search" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#8A9AAA', fontSize: '14px' }}></i>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email, city..."
              style={{ width: '100%', padding: '8px 10px 8px 32px', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '13px', fontFamily: 'inherit', outline: 'none', color: '#1A2A3A' }}
            />
          </div>
          <select className="select-sm" value={filterGroup} onChange={e => setFilterGroup(e.target.value)} style={{ padding: '8px 28px 8px 10px' }}>
            {groups.map(g => <option key={g}>{g}</option>)}
          </select>
          <select className="select-sm" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: '8px 28px 8px 10px' }}>
            {statuses.map(s => <option key={s}>{s}</option>)}
          </select>
          <span style={{ fontSize: '12px', color: '#8A9AAA', marginLeft: 'auto' }}>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                {[
                  { key: 'name', label: 'Customer' },
                  { key: 'group', label: 'Group' },
                  { key: 'city', label: 'City' },
                  { key: 'transactions', label: 'Txns' },
                  { key: 'totalSpend', label: 'Total Spend' },
                  { key: 'lastPurchase', label: 'Last Purchase' },
                  { key: 'status', label: 'Status' },
                  { key: null, label: 'Action' },
                ].map(col => (
                  <th key={col.label}
                    onClick={() => col.key && toggleSort(col.key)}
                    style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: '0.5px', cursor: col.key ? 'pointer' : 'default', whiteSpace: 'nowrap', userSelect: 'none' }}>
                    {col.label}{col.key && <SortIcon col={col.key} />}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.id} style={{ borderTop: '1px solid #F1F5F9', transition: 'background 0.15s', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'white' : '#FAFCFF'}
                  onClick={() => navigate(`/contacts/${c.id}`)}>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#00B4A0,#0096a6)', color: 'white', fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{c.initials}</div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A2A3A' }}>{c.name}</div>
                        <div style={{ fontSize: '11px', color: '#8A9AAA' }}>{c.id}</div>
                      </div>
                      <span style={{ background: tagColor[c.tag] + '20', color: tagColor[c.tag], fontSize: '9.5px', fontWeight: 700, padding: '2px 7px', borderRadius: '10px' }}>{c.tag}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: '12.5px', color: '#5A6A7A' }}>{c.group}</td>
                  <td style={{ padding: '12px 14px', fontSize: '12.5px', color: '#5A6A7A' }}>{c.city}</td>
                  <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 600, color: '#1A2A3A' }}>{c.transactions}</td>
                  <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 700, color: '#1A2A3A' }}>₹{fmt(c.totalSpend)}</td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: '#5A6A7A' }}>{c.lastPurchase}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ background: statusColor[c.status] + '18', color: statusColor[c.status], fontSize: '10.5px', fontWeight: 700, padding: '3px 9px', borderRadius: '20px' }}>{c.status}</span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <button onClick={e => { e.stopPropagation(); navigate(`/contacts/${c.id}`); }}
                      style={{ background: '#F1F5F9', border: 'none', borderRadius: '5px', padding: '5px 12px', fontSize: '11.5px', fontWeight: 600, color: '#1A2A3A', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <i className="ti ti-eye" style={{ fontSize: '13px' }}></i> View
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: '#8A9AAA', fontSize: '13px' }}>
                  <i className="ti ti-search-off" style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}></i>
                  No customers match your search
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
