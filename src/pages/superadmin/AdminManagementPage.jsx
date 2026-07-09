import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { admins as initialAdmins } from '../../data/mockData';
import { computeAdminStats } from '../../utils/scopedData';

const fmt = v => new Intl.NumberFormat('en-IN').format(v);

// ─── Add Admin Modal ───────────────────────────────────────────
function AddAdminModal({ onSave, onClose }) {
  const [form, setForm] = useState({ name: '', businessName: '', email: '', phone: '', city: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    onSave(form);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
        <div className="modal-header">
          <div className="modal-title"><i className="ti ti-user-plus"></i> Add New Admin</div>
          <button className="modal-close" onClick={onClose}><i className="ti ti-x"></i></button>
        </div>
        <div className="modal-body">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Arjun Mehta" />
            </div>
            <div className="form-group">
              <label className="form-label">Business Name *</label>
              <input className="form-input" value={form.businessName} onChange={e => set('businessName', e.target.value)} placeholder="e.g. Mehta Shoe Store" />
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input className="form-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="admin@business.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 98..." />
            </div>
            <div className="form-group form-group--full">
              <label className="form-label">City</label>
              <input className="form-input" value={form.city} onChange={e => set('city', e.target.value)} placeholder="Mumbai" />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave}>
            <i className="ti ti-user-plus"></i> Create Admin
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirm Dialog ─────────────────────────────────────
function DeleteConfirmDialog({ admin, stats, onConfirm, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
        <div className="modal-header">
          <div className="modal-title" style={{ color: '#E05C5C' }}>
            <i className="ti ti-trash"></i> Delete Admin
          </div>
          <button className="modal-close" onClick={onClose}><i className="ti ti-x"></i></button>
        </div>
        <div className="modal-body">
          <p style={{ fontSize: '14px', color: '#5A6A7A', lineHeight: 1.6, marginBottom: 16 }}>
            Are you sure you want to delete <strong style={{ color: '#1A2A3A' }}>{admin.name}</strong> ({admin.businessName})?
          </p>
          <div style={{ background: 'rgba(224,92,92,0.06)', border: '1px solid rgba(224,92,92,0.2)', borderRadius: '8px', padding: '12px 14px' }}>
            <p style={{ fontSize: '12.5px', color: '#E05C5C', fontWeight: 600, marginBottom: 6 }}>⚠ This will affect:</p>
            <ul style={{ fontSize: '12px', color: '#5A6A7A', paddingLeft: '16px', lineHeight: 1.8 }}>
              <li>{stats.productCount} product{stats.productCount !== 1 ? 's' : ''} will be removed</li>
              <li>{stats.orderCount} order{stats.orderCount !== 1 ? 's' : ''} will be unlinked</li>
              <li>{stats.customerCount} customer{stats.customerCount !== 1 ? 's' : ''} will be affected</li>
            </ul>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-danger" onClick={onConfirm}>
            <i className="ti ti-trash"></i> Delete Admin
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminManagementPage() {
  const navigate = useNavigate();
  const [adminList, setAdminList] = useState(() =>
    initialAdmins.map(a => ({ ...a, ...computeAdminStats(a.id) }))
  );
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return adminList.filter(a =>
      (a.name.toLowerCase().includes(q) || a.businessName.toLowerCase().includes(q) || a.email.toLowerCase().includes(q)) &&
      (filterStatus === 'All' || a.status === filterStatus)
    );
  }, [adminList, search, filterStatus]);

  const toggleStatus = (id) => {
    setAdminList(prev => prev.map(a =>
      a.id === id ? { ...a, status: a.status === 'Active' ? 'Suspended' : 'Active' } : a
    ));
  };

  const handleAddAdmin = (form) => {
    const newAdmin = {
      ...form,
      id: `ADM-${String(Date.now()).slice(-3)}`,
      status: 'Active',
      joined: new Date().toISOString().split('T')[0],
      avatarInitials: form.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
      role: 'admin',
      productCount: 0,
      orderCount: 0,
      customerCount: 0,
      revenue: 0,
    };
    setAdminList(prev => [newAdmin, ...prev]);
    setShowAddModal(false);
  };

  const handleDelete = () => {
    setAdminList(prev => prev.filter(a => a.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const SortIcon = () => <i className="ti ti-selector" style={{ fontSize: '11px', color: '#CBD5E1', marginLeft: 3 }}></i>;

  return (
    <div className="page-body">
      {/* Stats */}
      <div className="stats-row">
        {[
          { label: 'Total Admins', value: adminList.length, icon: 'ti-users-group', color: '#00B4A0' },
          { label: 'Active', value: adminList.filter(a => a.status === 'Active').length, icon: 'ti-user-check', color: '#6366F1' },
          { label: 'Suspended', value: adminList.filter(a => a.status === 'Suspended').length, icon: 'ti-user-off', color: '#E05C5C' },
          { label: 'Platform Revenue', value: `₹${fmt(adminList.reduce((s, a) => s + (a.revenue || 0), 0))}`, icon: 'ti-coin-rupee', color: '#F5A623' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-label"><i className={`ti ${s.icon}`} style={{ fontSize: '14px', color: s.color }}></i>{s.label}</div>
            <div className="stat-value" style={{ fontSize: s.label === 'Platform Revenue' ? '18px' : '28px' }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="panel">
        {/* Toolbar */}
        <div style={{ padding: '14px 18px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', borderBottom: '1px solid #E2E8F0' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <i className="ti ti-search" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#8A9AAA', fontSize: '14px' }}></i>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, business, email..."
              style={{ width: '100%', padding: '8px 10px 8px 32px', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '13px', fontFamily: 'inherit', outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['All', 'Active', 'Suspended'].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid', fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                  borderColor: filterStatus === s ? '#00B4A0' : '#E2E8F0',
                  background: filterStatus === s ? 'rgba(0,180,160,0.1)' : 'white',
                  color: filterStatus === s ? '#00B4A0' : '#5A6A7A' }}>
                {s}
              </button>
            ))}
          </div>
          <span style={{ fontSize: '12px', color: '#8A9AAA' }}>{filtered.length} admin{filtered.length !== 1 ? 's' : ''}</span>
          <button className="btn-primary" onClick={() => setShowAddModal(true)} id="btn-add-admin" style={{ marginLeft: 'auto' }}>
            <i className="ti ti-user-plus"></i> Add Admin
          </button>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                {['Admin', 'Business', 'Email', 'Products', 'Revenue', 'Status', 'Joined', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id}
                  style={{ borderTop: '1px solid #F1F5F9', transition: 'background 0.15s', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                  onMouseLeave={e => e.currentTarget.style.background = 'white'}
                  onClick={() => navigate(`/superadmin/admins/${a.id}`)}>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#0F1A2E,#00B4A0)', color: 'white', fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {a.avatarInitials}
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A2A3A' }}>{a.name}</div>
                        <div style={{ fontSize: '11px', color: '#8A9AAA' }}>{a.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: '12.5px', color: '#5A6A7A' }}>{a.businessName}</td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: '#5A6A7A' }}>{a.email}</td>
                  <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 600, color: '#1A2A3A', textAlign: 'center' }}>{a.productCount}</td>
                  <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 700, color: '#1A2A3A' }}>₹{fmt(a.revenue)}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span className={`admin-status-badge ${a.status === 'Active' ? 'badge-active' : 'badge-suspended'}`}>{a.status}</span>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: '#5A6A7A' }}>{a.joined}</td>
                  <td style={{ padding: '12px 14px' }} onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <button
                        onClick={() => navigate(`/superadmin/admins/${a.id}`)}
                        style={{ padding: '5px 10px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '5px', fontSize: '11px', fontWeight: 600, color: '#1A2A3A', cursor: 'pointer' }}
                        title="View">
                        <i className="ti ti-eye"></i>
                      </button>
                      <button
                        onClick={() => toggleStatus(a.id)}
                        style={{ padding: '5px 10px', borderRadius: '5px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', border: '1px solid',
                          background: a.status === 'Active' ? 'rgba(245,166,35,0.08)' : 'rgba(0,180,160,0.08)',
                          borderColor: a.status === 'Active' ? 'rgba(245,166,35,0.3)' : 'rgba(0,180,160,0.3)',
                          color: a.status === 'Active' ? '#D97706' : '#00B4A0' }}
                        title={a.status === 'Active' ? 'Suspend' : 'Activate'}>
                        <i className={`ti ${a.status === 'Active' ? 'ti-ban' : 'ti-check'}`}></i>
                      </button>
                      <button
                        onClick={() => setDeleteTarget(a)}
                        style={{ padding: '5px 10px', background: 'rgba(224,92,92,0.08)', border: '1px solid rgba(224,92,92,0.2)', borderRadius: '5px', fontSize: '11px', fontWeight: 600, color: '#E05C5C', cursor: 'pointer' }}
                        title="Delete">
                        <i className="ti ti-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: '#8A9AAA', fontSize: '13px' }}>
                  <i className="ti ti-users-group" style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}></i>
                  No admins match your search
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && <AddAdminModal onSave={handleAddAdmin} onClose={() => setShowAddModal(false)} />}
      {deleteTarget && (
        <DeleteConfirmDialog
          admin={deleteTarget}
          stats={deleteTarget}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
