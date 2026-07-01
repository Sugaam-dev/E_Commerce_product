import { statsData } from '../data/mockData';

export default function StatsRow() {
  return (
    <div className="stats-row">
      {statsData.map((stat) => (
        <div key={stat.id} className="stat-card" id={`stat-${stat.id}`}>
          <div className="stat-label">
            <i className={`ti ${stat.icon}`} style={{ fontSize: '14px', color: '#00B4A0' }}></i>
            {stat.label}
          </div>
          <div className="stat-value">
            {stat.id === 'freq' ? (
              <>
                <span style={{ fontSize: '28px', fontWeight: 800 }}>{stat.value}</span>
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#5A6A7A', marginLeft: '5px' }}>Days</span>
              </>
            ) : (
              stat.value
            )}
          </div>
          {stat.sub && <div className="stat-sub">{stat.sub}</div>}
          <div className="stat-chip">
            <i className="ti ti-arrow-up-right" style={{ fontSize: '10px' }}></i>
            {stat.chip}
          </div>
        </div>
      ))}
    </div>
  );
}
