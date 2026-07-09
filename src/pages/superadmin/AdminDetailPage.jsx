import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { admins } from '../../data/mockData';
import { filterProductsByAdmin, filterOrdersByAdmin, filterCustomersByAdmin, computeAdminStats } from '../../utils/scopedData';

const fmt = v => new Intl.NumberFormat('en-IN').format(v);

const statusColors = {
  Delivered: { bg: 'rgba(0,180,160,0.12)', text: '#00B4A0' },
  Processing: { bg: 'rgba(99,102,241,0.12)', text: '#6366F1' },
  Shipped: { bg: 'rgba(245,166,35,0.12)', text: '#D97706' },
  Cancelled: { bg: 'rgba(224,92,92,0.12)', text: '#E05C5C' },
  Returned: { bg: 'rgba(240,136,74,0.12)', text: '#F0884A' },
};
const productStatusColors = {
  Active: { bg: 'rgba(0,180,160,0.12)', text: '#00B4A0' },
  'Low Stock': { bg: 'rgba(245,166,35,0.12)', text: '#D97706' },
  'Out of Stock': { bg: 'rgba(224,92,92,0.12)', text: '#E05C5C' },
};

export default function AdminDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [adminStatus, setAdminStatus] = useState(null); // null = use data status

  const admin = admins.find(a => a.id === id);

  if (!admin) {
    return (
      <div className="page-body">
        <div className="empty-state-hero">
          <div className="empty-state-icon"><i className="ti ti-user-off"></i></div>
          <h2 className="empty-state-title">Admin not found</h2>
          <p className="empty-state-desc">This admin does not exist or has been removed.</p>
          <button className="btn-primary" onClick={() => navigate('/superadmin/admins')}>
            ← Back to Admins
          </button>
        </div>
      </div>
    );
  }

  const currentStatus = adminStatus || admin.status;
  const stats = computeAdminStats(admin.id);
  const products = filterProductsByAdmin(admin.id);
  const orders = filterOrdersByAdmin(admin.id);
  const customers = filterCustomersByAdmin(admin.id);

  const toggleStatus = () => {
    setAdminStatus(s => {
      const current = s || admin.status;
      return current === 'Active' ? 'Suspended' : 'Active';
    });
  };

  return (
    <div className="page-body">
      {/* Admin Header Card */}
      <div className="panel" style={{ marginBottom: 0 }}>
        <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg,#0F1A2E,#00B4A0)', color: 'white', fontWeight: 700, fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {admin.avatarInitials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1A2A3A', margin: 0 }}>{admin.name}</h2>
              <span className={`admin-status-badge ${currentStatus === 'Active' ? 'badge-active' : 'badge-suspended'}`}>
                {currentStatus}
              </span>
            </div>
            <div style={{ fontSize: '13px', color: '#5A6A7A', marginTop: '4px' }}>
              <i className="ti ti-building-store" style={{ marginRight: 4 }}></i>{admin.businessName}
              &nbsp;·&nbsp;
              <i className="ti ti-mail" style={{ marginRight: 4 }}></i>{admin.email}
              &nbsp;·&nbsp;
              <i className="ti ti-map-pin" style={{ marginRight: 4 }}></i>{admin.city}
            </div>
            <div style={{ fontSize: '11.5px', color: '#8A9AAA', marginTop: '2px' }}>
              Joined: {admin.joined} · ID: {admin.id}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            <button
              onClick={toggleStatus}
              className={currentStatus === 'Active' ? 'btn-warning' : 'btn-primary'}
              id={`btn-toggle-status-${admin.id}`}>
              <i className={`ti ${currentStatus === 'Active' ? 'ti-ban' : 'ti-check'}`}></i>
              {currentStatus === 'Active' ? 'Suspend Admin' : 'Activate Admin'}
            </button>
            <button className="btn-secondary" onClick={() => navigate('/superadmin/admins')}>
              <i className="ti ti-arrow-left"></i> Back
            </button>
          </div>
        </div>
      </div>

      {/* Scoped Stats */}
      <div className="stats-row">
        {[
          { label: 'Products', value: stats.productCount, icon: 'ti-box', color: '#00B4A0' },
          { label: 'Orders', value: stats.orderCount, icon: 'ti-shopping-cart', color: '#6366F1' },
          { label: 'Customers', value: stats.customerCount, icon: 'ti-users', color: '#F5A623' },
          { label: 'Revenue (Delivered)', value: `₹${fmt(stats.revenue)}`, icon: 'ti-coin-rupee', color: '#E05C5C' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-label"><i className={`ti ${s.icon}`} style={{ fontSize: '14px', color: s.color }}></i>{s.label}</div>
            <div className="stat-value" style={{ fontSize: s.label === 'Revenue (Delivered)' ? '18px' : '28px' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '0', background: 'white', padding: '4px', borderRadius: '8px', border: '1px solid #E2E8F0', width: 'fit-content' }}>
        {['products', 'orders', 'customers'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ padding: '8px 20px', borderRadius: '6px', border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', textTransform: 'capitalize',
              background: activeTab === tab ? '#0F1A2E' : 'transparent',
              color: activeTab === tab ? 'white' : '#5A6A7A' }}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)} ({tab === 'products' ? products.length : tab === 'orders' ? orders.length : customers.length})
          </button>
        ))}
      </div>

      {/* Products Tab — Read Only */}
      {activeTab === 'products' && (
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title"><i className="ti ti-box"></i> Products (Read-Only)</div>
            <span style={{ fontSize: '11px', color: '#8A9AAA', background: '#F1F5F9', padding: '3px 10px', borderRadius: '10px' }}>View Only</span>
          </div>
          {products.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#8A9AAA' }}>
              <i className="ti ti-box-off" style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}></i>
              No products for this admin
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC' }}>
                    {['Product', 'Brand', 'Category', 'Price', 'Stock', 'Sold', 'Status'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => {
                    const sc = productStatusColors[p.status] || { bg: '#F1F5F9', text: '#5A6A7A' };
                    return (
                      <tr key={p.id} style={{ borderTop: '1px solid #F1F5F9', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                        onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                        <td style={{ padding: '11px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img src={p.image} alt={p.name} style={{ width: 34, height: 34, borderRadius: '6px', objectFit: 'cover', border: '1px solid #E2E8F0', flexShrink: 0 }} onError={e => e.target.src = 'https://via.placeholder.com/34x34/E2E8F0/8A9AAA?text=IMG'} />
                            <div>
                              <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#1A2A3A' }}>{p.name}</div>
                              <div style={{ fontSize: '10.5px', color: '#8A9AAA' }}>{p.sku}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '11px 14px', fontSize: '12px', color: '#5A6A7A' }}>{p.brand}</td>
                        <td style={{ padding: '11px 14px', fontSize: '12px', color: '#5A6A7A' }}>{p.category}</td>
                        <td style={{ padding: '11px 14px', fontSize: '13px', fontWeight: 700, color: '#1A2A3A' }}>₹{fmt(p.price)}</td>
                        <td style={{ padding: '11px 14px', fontSize: '13px', fontWeight: 600, color: p.stock < 10 ? '#E05C5C' : '#1A2A3A' }}>{p.stock}</td>
                        <td style={{ padding: '11px 14px', fontSize: '13px', fontWeight: 600, color: '#1A2A3A' }}>{p.sold}</td>
                        <td style={{ padding: '11px 14px' }}><span style={{ background: sc.bg, color: sc.text, fontSize: '10.5px', fontWeight: 700, padding: '3px 9px', borderRadius: '20px' }}>{p.status}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Orders Tab — Read Only */}
      {activeTab === 'orders' && (
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title"><i className="ti ti-shopping-cart"></i> Orders (Read-Only)</div>
            <span style={{ fontSize: '11px', color: '#8A9AAA', background: '#F1F5F9', padding: '3px 10px', borderRadius: '10px' }}>View Only</span>
          </div>
          {orders.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#8A9AAA' }}>
              <i className="ti ti-inbox" style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}></i>
              No orders for this admin
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC' }}>
                    {['Order ID', 'Customer', 'Product', 'Amount', 'Date', 'Payment', 'Status'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => {
                    const sc = statusColors[o.status] || { bg: '#F1F5F9', text: '#5A6A7A' };
                    return (
                      <tr key={o.id} style={{ borderTop: '1px solid #F1F5F9', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                        onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                        <td style={{ padding: '11px 14px', fontSize: '12.5px', fontWeight: 700, color: '#00B4A0' }}>{o.id}</td>
                        <td style={{ padding: '11px 14px', fontSize: '12.5px', fontWeight: 600, color: '#1A2A3A' }}>{o.customer}</td>
                        <td style={{ padding: '11px 14px', fontSize: '12px', color: '#5A6A7A', maxWidth: '160px' }}>
                          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.product}</div>
                        </td>
                        <td style={{ padding: '11px 14px', fontSize: '13px', fontWeight: 700, color: '#1A2A3A' }}>₹{fmt(o.amount)}</td>
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
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Customers Tab — Read Only */}
      {activeTab === 'customers' && (
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title"><i className="ti ti-users"></i> Customers (Read-Only)</div>
            <span style={{ fontSize: '11px', color: '#8A9AAA', background: '#F1F5F9', padding: '3px 10px', borderRadius: '10px' }}>View Only</span>
          </div>
          {customers.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#8A9AAA' }}>
              <i className="ti ti-users" style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}></i>
              No customers for this admin
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC' }}>
                    {['Customer', 'Group', 'City', 'Total Spend', 'Transactions', 'Last Purchase', 'Status'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {customers.map(c => (
                    <tr key={c.id} style={{ borderTop: '1px solid #F1F5F9', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                      onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#00B4A0,#0096a6)', color: 'white', fontWeight: 700, fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{c.initials}</div>
                          <div>
                            <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#1A2A3A' }}>{c.name}</div>
                            <div style={{ fontSize: '11px', color: '#8A9AAA' }}>{c.id}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: '12px', color: '#5A6A7A' }}>{c.group}</td>
                      <td style={{ padding: '12px 14px', fontSize: '12px', color: '#5A6A7A' }}>{c.city}</td>
                      <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 700, color: '#1A2A3A' }}>₹{fmt(c.totalSpend)}</td>
                      <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 600, color: '#1A2A3A', textAlign: 'center' }}>{c.transactions}</td>
                      <td style={{ padding: '12px 14px', fontSize: '12px', color: '#5A6A7A' }}>{c.lastPurchase}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ background: c.status === 'Active' ? 'rgba(0,180,160,0.12)' : 'rgba(224,92,92,0.12)', color: c.status === 'Active' ? '#00B4A0' : '#E05C5C', fontSize: '10.5px', fontWeight: 700, padding: '3px 9px', borderRadius: '20px' }}>{c.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
