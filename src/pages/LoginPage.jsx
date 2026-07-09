import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { admins } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import logo from '../assests/logo.png';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState('admin'); // 'admin' | 'superadmin'
  const [selectedAdminId, setSelectedAdminId] = useState(admins[0]?.id || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    // Simulated async delay
    await new Promise(r => setTimeout(r, 400));

    const userId = tab === 'superadmin' ? 'superadmin' : selectedAdminId;
    const result = login(userId);

    setLoading(false);
    if (!result.success) {
      setError(result.error);
    } else {
      if (tab === 'superadmin') {
        navigate('/superadmin');
      } else {
        navigate('/');
      }
    }
  };

  const selectedAdmin = admins.find(a => a.id === selectedAdminId);

  return (
    <div className="login-page">
      {/* Background decorative circles */}
      <div className="login-bg-circle login-bg-circle--1" />
      <div className="login-bg-circle login-bg-circle--2" />

      <div className="login-card">
        {/* Logo & Branding */}
        <div className="login-logo-wrap">
          <img src={logo} alt="PMRG" className="login-logo" />
          <div className="login-brand">
            <div className="login-brand-name">PMRG Customer 360</div>
            <div className="login-brand-sub">Admin Portal</div>
          </div>
        </div>

        <div className="login-divider" />

        <h2 className="login-title">Welcome back</h2>
        <p className="login-sub">Select your role to continue</p>

        {/* Role Tabs */}
        <div className="login-tabs">
          <button
            className={`login-tab ${tab === 'admin' ? 'login-tab--active' : ''}`}
            onClick={() => { setTab('admin'); setError(''); }}
            id="tab-admin"
          >
            <i className="ti ti-user-check" />
            Admin
          </button>
          <button
            className={`login-tab ${tab === 'superadmin' ? 'login-tab--active' : ''}`}
            onClick={() => { setTab('superadmin'); setError(''); }}
            id="tab-superadmin"
          >
            <i className="ti ti-shield-check" />
            Super Admin
          </button>
        </div>

        {/* Admin login form */}
        {tab === 'admin' && (
          <div className="login-form">
            <label className="login-label">Select Admin Account</label>
            <select
              className="login-select"
              value={selectedAdminId}
              onChange={e => { setSelectedAdminId(e.target.value); setError(''); }}
              id="select-admin"
            >
              {admins.map(a => (
                <option key={a.id} value={a.id}>
                  {a.name} — {a.businessName} {a.status === 'Suspended' ? '⚠ Suspended' : ''}
                </option>
              ))}
            </select>

            {selectedAdmin && (
              <div className="login-admin-preview">
                <div className="login-admin-avatar">{selectedAdmin.avatarInitials}</div>
                <div className="login-admin-info">
                  <div className="login-admin-name">{selectedAdmin.name}</div>
                  <div className="login-admin-meta">{selectedAdmin.businessName} · {selectedAdmin.city}</div>
                </div>
                <span className={`login-admin-status ${selectedAdmin.status === 'Suspended' ? 'login-admin-status--suspended' : 'login-admin-status--active'}`}>
                  {selectedAdmin.status}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Super Admin info */}
        {tab === 'superadmin' && (
          <div className="login-form">
            <div className="login-sa-card">
              <div className="login-sa-icon">
                <i className="ti ti-shield-check" />
              </div>
              <div className="login-sa-info">
                <div className="login-sa-name">PMRG Super Admin</div>
                <div className="login-sa-meta">Platform-wide access · All stores · All admins</div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="login-error" id="login-error-msg">
            <i className="ti ti-alert-circle" />
            {error}
          </div>
        )}

        {/* Login Button */}
        <button
          className="login-btn"
          onClick={handleLogin}
          disabled={loading}
          id="btn-login"
        >
          {loading ? (
            <>
              <span className="ai-typing-dots-inline"><span /><span /><span /></span>
              Signing in…
            </>
          ) : (
            <>
              <i className="ti ti-login" />
              {tab === 'superadmin' ? 'Enter Super Admin' : 'Login as Admin'}
            </>
          )}
        </button>

        <p className="login-footer-note">
          <i className="ti ti-info-circle" />
          This is a mock auth portal for development. No real credentials required.
        </p>
      </div>
    </div>
  );
}
