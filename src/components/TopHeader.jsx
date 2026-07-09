import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  '/superadmin': 'Super Admin · Overview',
  '/superadmin/admins': 'Super Admin · Manage Admins',
};

export default function TopHeader({ onToggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, isSuperAdmin, logout } = useAuth();

  const isProfile = location.pathname.startsWith('/contacts/') && location.pathname !== '/contacts/';
  const isAdminDetail = location.pathname.match(/^\/superadmin\/admins\/[^/]+$/);

  let current = pageTitles[location.pathname] || 'Page';
  if (isProfile) current = 'Customer Profile';
  if (isAdminDetail) current = 'Admin Detail';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="top-header">
      <div className="header-left">
        <button className="menu-toggle-btn" onClick={onToggleSidebar} aria-label="Toggle Sidebar">
          <i className="ti ti-menu-2"></i>
        </button>
        <nav className="breadcrumb" aria-label="breadcrumb">
          <img
            src={logo}
            alt="PMRG India"
            className="header-logo"
            onClick={() => navigate(isSuperAdmin ? '/superadmin' : '/')}
            style={{ cursor: 'pointer' }}
          />
          <span className="sep breadcrumb-logo-sep">›</span>
          {isProfile && (
            <>
              <span style={{ cursor: 'pointer', color: '#00B4A0' }} onClick={() => navigate('/contacts')}>Contacts</span>
              <span className="sep">›</span>
            </>
          )}
          {isAdminDetail && (
            <>
              <span style={{ cursor: 'pointer', color: '#00B4A0' }} onClick={() => navigate('/superadmin/admins')}>Admins</span>
              <span className="sep">›</span>
            </>
          )}
          <span className="current">{current}</span>
        </nav>
      </div>

      <div className="header-actions">
        {isProfile && (
          <button className="btn-back" id="btn-back-top" onClick={() => navigate('/contacts')}>
            ← BACK
          </button>
        )}
        {isAdminDetail && (
          <button className="btn-back" id="btn-back-admin" onClick={() => navigate('/superadmin/admins')}>
            ← BACK
          </button>
        )}
        <div className="icon-btn" id="btn-refresh" title="Refresh" onClick={() => window.location.reload()}>
          <i className="ti ti-refresh"></i>
        </div>
        <div className="icon-btn" id="btn-info" title="Information">
          <i className="ti ti-info-circle"></i>
        </div>
        {!isSuperAdmin && (
          <div className="icon-btn" id="btn-notifications" title="Notifications" onClick={() => navigate('/notifications')}>
            <i className="ti ti-bell"></i>
            <span className="notif-dot"></span>
          </div>
        )}

        {/* Current user display */}
        {currentUser && (
          <div className="header-user" title={`${currentUser.name} — ${currentUser.businessName || 'Super Admin'}`}>
            <div className="header-user-avatar">
              {currentUser.avatarInitials || currentUser.name?.charAt(0)}
            </div>
            <div className="header-user-info">
              <div className="header-user-name">{currentUser.name}</div>
              {currentUser.businessName && (
                <div className="header-user-biz">{currentUser.businessName}</div>
              )}
            </div>
          </div>
        )}

        <button
          className="icon-btn header-logout-btn"
          id="btn-logout-header"
          title="Logout"
          onClick={handleLogout}
        >
          <i className="ti ti-logout"></i>
        </button>
      </div>
    </header>
  );
}
