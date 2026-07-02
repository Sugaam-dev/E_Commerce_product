import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../assests/logo.png';

const pageTitles = {
  '/': 'Dashboard',
  '/contacts': 'Contacts',
  '/contacts/profile': 'Customer Profile',
  '/orders': 'Orders',
  '/products': 'Products',
  '/reports': 'Reports',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
  '/notifications': 'Notifications',
};

export default function TopHeader({ onToggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isProfile = location.pathname.startsWith('/contacts/');
  const current = isProfile ? 'Customer Profile' : (pageTitles[location.pathname] || 'Page');

  return (
    <header className="top-header">
      <div className="header-left">
        <button className="menu-toggle-btn" onClick={onToggleSidebar} aria-label="Toggle Sidebar">
          <i className="ti ti-menu-2"></i>
        </button>
        <nav className="breadcrumb" aria-label="breadcrumb">
          <img src={logo} alt="PMRG India" className="header-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }} />
          <span className="sep breadcrumb-logo-sep">›</span>
          {isProfile && <><span style={{ cursor: 'pointer', color: '#00B4A0' }} onClick={() => navigate('/contacts')}>Contacts</span><span className="sep">›</span></>}
          <span className="current">{current}</span>
        </nav>
      </div>

      <div className="header-actions">
        {isProfile && (
          <button className="btn-back" id="btn-back-top" onClick={() => navigate('/contacts')}>
            ← BACK
          </button>
        )}
        <div className="icon-btn" id="btn-refresh" title="Refresh" onClick={() => window.location.reload()}>
          <i className="ti ti-refresh"></i>
        </div>
        <div className="icon-btn" id="btn-info" title="Information">
          <i className="ti ti-info-circle"></i>
        </div>
        <div className="icon-btn" id="btn-notifications" title="Notifications" onClick={() => navigate('/notifications')}>
          <i className="ti ti-bell"></i>
          <span className="notif-dot"></span>
        </div>
      </div>
    </header>
  );
}
