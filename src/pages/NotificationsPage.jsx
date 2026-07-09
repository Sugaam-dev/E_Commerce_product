import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useScopedNotifications } from '../utils/scopedData';
import AIInsightCard from '../components/AIInsightCard';

const typeIcons = {
  order: { icon: 'ti-shopping-cart', color: '#00B4A0', bg: 'rgba(0,180,160,0.1)' },
  return: { icon: 'ti-arrow-back-up', color: '#E05C5C', bg: 'rgba(224,92,92,0.1)' },
  payment: { icon: 'ti-credit-card', color: '#6366F1', bg: 'rgba(99,102,241,0.1)' },
  stock: { icon: 'ti-alert-triangle', color: '#F0884A', bg: 'rgba(240,136,74,0.1)' },
  customer: { icon: 'ti-user', color: '#F5A623', bg: 'rgba(245,166,35,0.1)' },
  report: { icon: 'ti-file-analytics', color: '#8A9AAA', bg: 'rgba(138,154,170,0.1)' },
};

const priorityColor = { high: '#E05C5C', medium: '#F5A623', low: '#8A9AAA' };

export default function NotificationsPage() {
  const { currentUser } = useAuth();
  const baseNotifs = useScopedNotifications(currentUser?.id);

  const [notifs, setNotifs] = useState(baseNotifs);
  const [filter, setFilter] = useState('All');

  const types = ['All', 'order', 'return', 'payment', 'stock', 'customer', 'report'];
  const unread = notifs.filter(n => !n.read).length;

  const filtered = notifs.filter(n => filter === 'All' || n.type === filter);

  const markAllRead = () => setNotifs(notifs.map(n => ({ ...n, read: true })));
  const markRead = (id) => setNotifs(notifs.map(n => n.id === id ? { ...n, read: true } : n));
  const dismiss = (id) => setNotifs(notifs.filter(n => n.id !== id));

  return (
    <div className="page-body">
      {/* Stats */}
      <div className="stats-row">
        {[
          { label: 'Total Notifications', value: notifs.length, icon: 'ti-bell', color: '#00B4A0' },
          { label: 'Unread', value: unread, icon: 'ti-bell-ringing', color: '#E05C5C' },
          { label: 'High Priority', value: notifs.filter(n => n.priority === 'high').length, icon: 'ti-alert-circle', color: '#F0884A' },
          { label: 'Read', value: notifs.filter(n => n.read).length, icon: 'ti-check', color: '#6366F1' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-label"><i className={`ti ${s.icon}`} style={{ fontSize: '14px', color: s.color }}></i>{s.label}</div>
            <div className="stat-value" style={{ fontSize: '28px' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* AI Insight */}
      <AIInsightCard
        title="Notification Prioritisation"
        dataContext={{
          notifications: notifs.map(n => ({
            title: n.title, message: n.message, type: n.type,
            priority: n.priority, read: n.read, time: n.time,
          })),
          unread: notifs.filter(n => !n.read).length,
          highPriority: notifs.filter(n => n.priority === 'high').map(n => ({ title: n.title, type: n.type, read: n.read })),
        }}
        prompt="Prioritize these notifications by business urgency and financial impact. Identify which 2 need immediate action and explain why. Flag any that suggest a systemic issue (e.g., multiple returns, stock crisis)."
      />

      <div className="panel">
        {/* Header + Controls */}
        <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {types.map(t => (
              <button key={t} onClick={() => setFilter(t)}
                style={{ padding: '5px 13px', borderRadius: '20px', border: '1px solid', fontSize: '11.5px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', textTransform: 'capitalize',
                  borderColor: filter === t ? '#00B4A0' : '#E2E8F0',
                  background: filter === t ? 'rgba(0,180,160,0.1)' : 'white',
                  color: filter === t ? '#00B4A0' : '#5A6A7A' }}>
                {t}
              </button>
            ))}
          </div>
          {unread > 0 && (
            <button onClick={markAllRead}
              style={{ padding: '7px 16px', background: '#0F1A2E', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <i className="ti ti-checks"></i> Mark all read
            </button>
          )}
        </div>

        {/* Notification List */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {filtered.length === 0 && (
            <div style={{ padding: '60px', textAlign: 'center', color: '#8A9AAA' }}>
              <i className="ti ti-bell-off" style={{ fontSize: '40px', display: 'block', marginBottom: '10px' }}></i>
              No notifications in this category
            </div>
          )}
          {filtered.map((n, i) => {
            const ti = typeIcons[n.type] || typeIcons.report;
            return (
              <div key={n.id}
                style={{ display: 'flex', gap: '14px', padding: '16px 18px', borderBottom: i < filtered.length - 1 ? '1px solid #F1F5F9' : 'none', background: n.read ? 'white' : 'rgba(0,180,160,0.03)', transition: 'background 0.15s', cursor: n.read ? 'default' : 'pointer', position: 'relative' }}
                onClick={() => !n.read && markRead(n.id)}
                onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                onMouseLeave={e => e.currentTarget.style.background = n.read ? 'white' : 'rgba(0,180,160,0.03)'}>

                {/* Unread indicator */}
                {!n.read && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: '#00B4A0', borderRadius: '0 2px 2px 0' }}></div>}

                {/* Icon */}
                <div style={{ width: 42, height: 42, borderRadius: '10px', background: ti.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className={`ti ${ti.icon}`} style={{ fontSize: '18px', color: ti.color }}></i>
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '3px' }}>
                    <div style={{ fontWeight: n.read ? 500 : 700, fontSize: '13px', color: '#1A2A3A' }}>{n.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: priorityColor[n.priority], display: 'inline-block' }}></span>
                      <span style={{ fontSize: '10.5px', color: '#8A9AAA', whiteSpace: 'nowrap' }}>{n.time}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#5A6A7A', lineHeight: 1.5 }}>{n.message}</div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                    {!n.read && (
                      <button onClick={e => { e.stopPropagation(); markRead(n.id); }}
                        style={{ fontSize: '11px', color: '#00B4A0', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                        Mark as read
                      </button>
                    )}
                    <button onClick={e => { e.stopPropagation(); dismiss(n.id); }}
                      style={{ fontSize: '11px', color: '#8A9AAA', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
