import { NavLink, useLocation } from 'react-router-dom';
import { navItems, customerData } from '../data/mockData';
import logo from '../assests/logo.png';

export default function Sidebar() {
  const location = useLocation();
  const isContactProfile = location.pathname.startsWith('/contacts/');

  return (
    <aside className="sidebar-wrap">
      {/* Narrow icon-only nav rail */}
      <div className="nav-rail">
        <div className="rail-logo">
          <img src={logo} alt="PMRG Logo" className="rail-logo-img" />
        </div>
        <nav className="rail-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `rail-item${isActive || (item.path === '/contacts' && isContactProfile) ? ' rail-active' : ''}`
              }
              title={item.label}
            >
              <i className={`ti ${item.icon}`}></i>
              {item.badge && <span className="rail-badge">{item.badge}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="rail-bottom">
          <div className="rail-item" title="Settings">
            <i className="ti ti-settings"></i>
          </div>
          <div className="rail-item" title="Help">
            <i className="ti ti-help-circle"></i>
          </div>
        </div>
      </div>

      {/* Customer detail panel — shown on contact profile pages */}
      {isContactProfile && (
        <div className="detail-panel">
          {/* Customer Avatar & Name */}
          <div className="dp-profile">
            <div className="dp-avatar-wrap">
              <div className="dp-avatar">{customerData.initials}</div>
              <span className="dp-lead-badge">Lead</span>
            </div>
            <div className="dp-name">{customerData.name}</div>
            <div className="dp-sub">{customerData.id}</div>
          </div>

          <div className="dp-divider" />

          {/* Contact rows */}
          <div className="dp-rows">
            <div className="dp-row">
              <i className="ti ti-phone dp-icon"></i>
              <div>
                <div className="dp-label">Phone</div>
                <div className="dp-val">{customerData.phone}</div>
              </div>
            </div>
            <div className="dp-row">
              <i className="ti ti-mail dp-icon"></i>
              <div>
                <div className="dp-label">Email</div>
                <div className="dp-val" style={{fontSize:'10.5px'}}>{customerData.email}</div>
              </div>
            </div>
            <div className="dp-row">
              <i className="ti ti-calendar dp-icon"></i>
              <div>
                <div className="dp-label">Registered Since</div>
                <div className="dp-val">{customerData.registeredSince} / {customerData.registeredDays}</div>
              </div>
            </div>
            <div className="dp-row" style={{alignItems:'flex-start'}}>
              <i className="ti ti-building-store dp-icon" style={{marginTop:2}}></i>
              <div>
                <div className="dp-label">Purchases From</div>
                {customerData.purchasesFrom.map((s,i) => (
                  <div key={i} className="dp-val" style={{lineHeight:1.7}}>{s}</div>
                ))}
              </div>
            </div>
            <div className="dp-row">
              <i className="ti ti-clock dp-icon"></i>
              <div>
                <div className="dp-label">Last Purchase</div>
                <div className="dp-val">{customerData.lastPurchase}</div>
              </div>
            </div>
            <div className="dp-row">
              <i className="ti ti-arrow-back-up dp-icon"></i>
              <div>
                <div className="dp-label">Total Returns Value / Qty</div>
                <div className="dp-val">{customerData.totalReturnsValue} / {customerData.totalReturnsQty}</div>
              </div>
            </div>
          </div>

          <div className="dp-section-label">Other Info</div>

          <div className="dp-rows">
            {[
              { icon: 'ti-users-group', label: 'Customer Group', val: customerData.otherInfo.customerGroup },
              { icon: 'ti-gender-bigender', label: 'Gender', val: customerData.otherInfo.gender },
              { icon: 'ti-id-badge', label: 'Customer Type', val: customerData.otherInfo.customerType },
              { icon: 'ti-cake', label: 'DOB', val: customerData.otherInfo.dob },
              { icon: 'ti-heart', label: 'Marital Status', val: customerData.otherInfo.maritalStatus },
              { icon: 'ti-confetti', label: 'Wedding Anniversary', val: customerData.otherInfo.weddingAnniversary },
              { icon: 'ti-user-check', label: 'Sales Person', val: customerData.otherInfo.salesPerson },
            ].map(r => (
              <div className="dp-row" key={r.label}>
                <i className={`ti ${r.icon} dp-icon`}></i>
                <div>
                  <div className="dp-label">{r.label}</div>
                  <div className="dp-val">{r.val}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}