import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { admins } from '../../data/mockData';
import { computeAdminStats } from '../../utils/scopedData';
import AIInsightCard from '../../components/AIInsightCard';

const fmt = v => new Intl.NumberFormat('en-IN').format(v);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="tt-label">{label}</div>
      {payload.map(p => (
        <div className="tt-row" key={p.dataKey}>
          <span className="tt-dot" style={{ background: p.fill }}></span>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>{p.name}:</span>
          <span className="tt-val">₹{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

export default function SuperAdminDashboard() {
  const navigate = useNavigate();

  // Compute stats for each admin
  const adminStats = admins.map(a => ({
    ...a,
    ...computeAdminStats(a.id),
  }));

  const totalAdmins = admins.length;
  const activeAdmins = admins.filter(a => a.status === 'Active').length;
  const totalProducts = adminStats.reduce((s, a) => s + a.productCount, 0);
  const totalRevenue = adminStats.reduce((s, a) => s + a.revenue, 0);

  // Top 5 admins by revenue for bar chart
  const top5 = [...adminStats]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
    .map(a => ({ name: a.name.split(' ')[0], revenue: a.revenue, business: a.businessName }));

  // Recently joined (sort by joined date desc)
  const recentAdmins = [...admins].sort((a, b) => new Date(b.joined) - new Date(a.joined)).slice(0, 4);

  return (
    <div className="page-body">
      {/* Platform Stats */}
      <div className="stats-row">
        {[
          { label: 'Total Admins', value: totalAdmins, icon: 'ti-users-group', color: '#00B4A0' },
          { label: 'Active Admins', value: activeAdmins, icon: 'ti-user-check', color: '#6366F1' },
          { label: 'Platform Products', value: totalProducts, icon: 'ti-box', color: '#F5A623' },
          { label: 'Platform Revenue', value: `₹${fmt(totalRevenue)}`, icon: 'ti-coin-rupee', color: '#E05C5C' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-label"><i className={`ti ${s.icon}`} style={{ fontSize: '14px', color: s.color }}></i>{s.label}</div>
            <div className="stat-value" style={{ fontSize: s.label === 'Platform Revenue' ? '18px' : '28px' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Platform AI Insight — NOT scoped (Super Admin sees everything) */}
      <AIInsightCard
        title="Platform Overview"
        dataContext={{
          totalAdmins,
          activeAdmins,
          suspendedAdmins: totalAdmins - activeAdmins,
          totalProducts,
          totalRevenue,
          topAdmins: top5.map(a => ({ name: a.name, revenue: a.revenue })),
          adminList: adminStats.map(a => ({ id: a.id, name: a.name, status: a.status, revenue: a.revenue, products: a.productCount, orders: a.orderCount })),
        }}
        prompt="Analyze the platform health: total admins, revenue distribution, suspended accounts, and top performers. Identify any admins that need attention (low activity, high suspension rate). Give 3 platform-level insights and 1 action for the Super Admin."
      />

      {/* Charts Row */}
      <div className="mid-row">
        {/* Top 5 Admins Bar Chart */}
        <div className="panel" style={{ flex: 2 }}>
          <div className="panel-header">
            <div className="panel-title">
              <i className="ti ti-chart-bar"></i> Top Admins by Revenue
            </div>
            <button
              onClick={() => navigate('/superadmin/admins')}
              style={{ fontSize: '12px', color: '#00B4A0', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
              View All →
            </button>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={top5} margin={{ top: 10, right: 16, left: 10, bottom: 0 }} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#5A6A7A' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={v => `₹${v >= 1000 ? `${(v/1000).toFixed(0)}K` : v}`} tick={{ fontSize: 10, fill: '#8A9AAA' }} axisLine={false} tickLine={false} width={56} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" name="Revenue" fill="#00B4A0" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recently Joined Panel */}
        <div className="panel" style={{ flex: 1, minWidth: 220 }}>
          <div className="panel-header">
            <div className="panel-title">
              <i className="ti ti-user-plus"></i> Recently Joined
            </div>
          </div>
          <div style={{ padding: '8px 0' }}>
            {recentAdmins.map((a, i) => {
              const stats = computeAdminStats(a.id);
              return (
                <div
                  key={a.id}
                  onClick={() => navigate(`/superadmin/admins/${a.id}`)}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 18px', borderBottom: i < recentAdmins.length - 1 ? '1px solid #F1F5F9' : 'none', cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                  onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#0F1A2E,#1e2e4a)', color: 'white', fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {a.avatarInitials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#1A2A3A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.name}</div>
                    <div style={{ fontSize: '11px', color: '#8A9AAA' }}>{a.businessName}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span className={`admin-status-badge ${a.status === 'Active' ? 'badge-active' : 'badge-suspended'}`}>{a.status}</span>
                    <div style={{ fontSize: '10px', color: '#8A9AAA', marginTop: '2px' }}>{a.joined}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* All Admins Summary Table */}
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">
            <i className="ti ti-table"></i> All Admins Summary
          </div>
          <button
            onClick={() => navigate('/superadmin/admins')}
            style={{ fontSize: '12px', color: '#00B4A0', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
            Manage Admins →
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                {['Admin', 'Business', 'Products', 'Orders', 'Revenue', 'Status', ''].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {adminStats.map(a => (
                <tr key={a.id}
                  style={{ borderTop: '1px solid #F1F5F9', cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                  onMouseLeave={e => e.currentTarget.style.background = 'white'}
                  onClick={() => navigate(`/superadmin/admins/${a.id}`)}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#0F1A2E,#00B4A0)', color: 'white', fontWeight: 700, fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {a.avatarInitials}
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A2A3A' }}>{a.name}</div>
                        <div style={{ fontSize: '11px', color: '#8A9AAA' }}>{a.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '12.5px', color: '#5A6A7A' }}>{a.businessName}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#1A2A3A' }}>{a.productCount}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#1A2A3A' }}>{a.orderCount}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 700, color: '#1A2A3A' }}>₹{fmt(a.revenue)}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`admin-status-badge ${a.status === 'Active' ? 'badge-active' : 'badge-suspended'}`}>{a.status}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button
                      onClick={e => { e.stopPropagation(); navigate(`/superadmin/admins/${a.id}`); }}
                      style={{ background: '#F1F5F9', border: 'none', borderRadius: '5px', padding: '5px 12px', fontSize: '11.5px', fontWeight: 600, color: '#1A2A3A', cursor: 'pointer' }}>
                      <i className="ti ti-eye" style={{ fontSize: '12px', marginRight: 4 }}></i>View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
