import { useState } from 'react';
import { settingsData } from '../data/mockData';

const fmt = v => new Intl.NumberFormat('en-IN').format(v);

const statusColor = {
  Open: { bg: 'rgba(0,180,160,0.12)', text: '#00B4A0' },
  Closed: { bg: 'rgba(224,92,92,0.12)', text: '#E05C5C' },
  Active: { bg: 'rgba(0,180,160,0.12)', text: '#00B4A0' },
  Inactive: { bg: 'rgba(224,92,92,0.12)', text: '#E05C5C' },
};

const roleColor = {
  'CRM Admin': { bg: 'rgba(99,102,241,0.12)', text: '#6366F1' },
  'Store Manager': { bg: 'rgba(245,166,35,0.12)', text: '#D97706' },
};

const TABS = ['Company', 'Stores', 'Users'];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Company');
  const { company, stores, users } = settingsData;
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ ...company });

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <div className="page-body">
      {/* KPI Row */}
      <div className="stats-row">
        {[
          { label: 'Total Stores', value: stores.length, icon: 'ti-building-store', color: '#00B4A0' },
          { label: 'Open Stores', value: stores.filter(s => s.status === 'Open').length, icon: 'ti-door-enter', color: '#6366F1' },
          { label: 'Team Members', value: users.length, icon: 'ti-users', color: '#F5A623' },
          { label: 'Active Users', value: users.filter(u => u.status === 'Active').length, icon: 'ti-user-check', color: '#E05C5C' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-label"><i className={`ti ${s.icon}`} style={{ fontSize: '14px', color: s.color }}></i>{s.label}</div>
            <div className="stat-value" style={{ fontSize: '28px' }}>{s.value}</div>
          </div>
        ))}
      </div>


      <div className="panel">
        {/* Tabs */}
        <div style={{ padding: '0 18px', display: 'flex', borderBottom: '1px solid #E2E8F0', overflowX: 'auto' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              style={{ padding: '13px 20px', border: 'none', background: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s',
                color: activeTab === t ? '#00B4A0' : '#5A6A7A',
                borderBottom: `2px solid ${activeTab === t ? '#00B4A0' : 'transparent'}`,
                marginBottom: '-1px' }}>
              {t}
            </button>
          ))}
        </div>

        {/* Company Tab */}
        {activeTab === 'Company' && (
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#1A2A3A' }}>Company Information</div>
              <button onClick={() => setEditMode(e => !e)}
                style={{ padding: '7px 18px', background: editMode ? '#00B4A0' : '#0F1A2E', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <i className={`ti ${editMode ? 'ti-check' : 'ti-pencil'}`}></i>
                {editMode ? 'Save Changes' : 'Edit'}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
              {[
                { key: 'name', label: 'Company Name', icon: 'ti-building' },
                { key: 'gstin', label: 'GSTIN', icon: 'ti-id-badge' },
                { key: 'pan', label: 'PAN', icon: 'ti-file-certificate' },
                { key: 'phone', label: 'Phone', icon: 'ti-phone' },
                { key: 'email', label: 'Email', icon: 'ti-mail' },
                { key: 'website', label: 'Website', icon: 'ti-world' },
                { key: 'currency', label: 'Currency', icon: 'ti-currency-rupee' },
                { key: 'timezone', label: 'Timezone', icon: 'ti-clock' },
              ].map(({ key, label, icon }) => (
                <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '10.5px', fontWeight: 600, color: '#8A9AAA', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <i className={`ti ${icon}`} style={{ color: '#00B4A0', fontSize: '13px' }}></i>{label}
                  </label>
                  {editMode ? (
                    <input name={key} value={form[key]} onChange={handleChange}
                      style={{ padding: '8px 12px', border: '1px solid #00B4A0', borderRadius: '6px', fontSize: '13px', fontFamily: 'inherit', outline: 'none', color: '#1A2A3A', background: 'rgba(0,180,160,0.03)' }} />
                  ) : (
                    <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#1A2A3A', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>{form[key]}</div>
                  )}
                </div>
              ))}
            </div>

            {/* Address — full width */}
            <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '10.5px', fontWeight: 600, color: '#8A9AAA', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <i className="ti ti-map-pin" style={{ color: '#00B4A0', fontSize: '13px' }}></i>Address
              </label>
              {editMode ? (
                <input name="address" value={form.address} onChange={handleChange}
                  style={{ padding: '8px 12px', border: '1px solid #00B4A0', borderRadius: '6px', fontSize: '13px', fontFamily: 'inherit', outline: 'none', color: '#1A2A3A', background: 'rgba(0,180,160,0.03)' }} />
              ) : (
                <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#1A2A3A', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>{form.address}</div>
              )}
            </div>
          </div>
        )}

        {/* Stores Tab */}
        {activeTab === 'Stores' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC' }}>
                  {['Store ID', 'Store Name', 'City', 'Manager', 'Phone', 'Status'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '10.5px', fontWeight: 700, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stores.map((s, i) => {
                  const sc = statusColor[s.status] || { bg: '#F1F5F9', text: '#5A6A7A' };
                  return (
                    <tr key={s.id} style={{ borderTop: '1px solid #F1F5F9', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                      onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                      <td style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 700, color: '#00B4A0' }}>{s.id}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: 32, height: 32, borderRadius: '7px', background: 'rgba(0,180,160,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <i className="ti ti-building-store" style={{ color: '#00B4A0', fontSize: '16px' }}></i>
                          </div>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: '#1A2A3A' }}>{s.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '12.5px', color: '#5A6A7A' }}>{s.city}</td>
                      <td style={{ padding: '12px 16px', fontSize: '12.5px', color: '#1A2A3A', fontWeight: 500 }}>{s.manager}</td>
                      <td style={{ padding: '12px 16px', fontSize: '12px', color: '#5A6A7A' }}>{s.phone}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ background: sc.bg, color: sc.text, fontSize: '10.5px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' }}>{s.status}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'Users' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC' }}>
                  {['User', 'Role', 'Email', 'Store', 'Status'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '10.5px', fontWeight: 700, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => {
                  const sc = statusColor[u.status] || { bg: '#F1F5F9', text: '#5A6A7A' };
                  const rc = roleColor[u.role] || { bg: '#F1F5F9', text: '#5A6A7A' };
                  return (
                    <tr key={u.id} style={{ borderTop: '1px solid #F1F5F9', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                      onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#00B4A0,#0096a6)', color: 'white', fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {u.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A2A3A' }}>{u.name}</div>
                            <div style={{ fontSize: '10.5px', color: '#8A9AAA' }}>{u.id}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ background: rc.bg, color: rc.text, fontSize: '10.5px', fontWeight: 700, padding: '3px 9px', borderRadius: '10px' }}>{u.role}</span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '12px', color: '#5A6A7A' }}>{u.email}</td>
                      <td style={{ padding: '12px 16px', fontSize: '12.5px', color: '#1A2A3A', fontWeight: 500 }}>{u.store}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ background: sc.bg, color: sc.text, fontSize: '10.5px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' }}>{u.status}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}