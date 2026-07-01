import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { feedbackData } from '../data/mockData';

const TOTAL = feedbackData.reduce((s, d) => s + d.value, 0);

const CustomLabel = ({ cx, cy }) => (
  <>
    <text x={cx} y={cy - 8} className="donut-center-label" style={{ fontFamily: 'Inter', fontSize: '18px', fontWeight: 800, fill: '#1A2A3A', textAnchor: 'middle' }}>
      {TOTAL}
    </text>
    <text x={cx} y={cy + 12} className="donut-center-sub" style={{ fontFamily: 'Inter', fontSize: '10px', fill: '#8A9AAA', textAnchor: 'middle' }}>
      Total
    </text>
  </>
);

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="custom-tooltip">
      <div className="tt-row">
        <span className="tt-dot" style={{ background: d.payload.color }}></span>
        <span style={{ color: 'rgba(255,255,255,0.8)' }}>{d.name}:</span>
        <span className="tt-val">{d.value} ({d.payload.pct})</span>
      </div>
    </div>
  );
};

export default function CustomerFeedback() {
  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <i className="ti ti-mood-smile"></i>
          Customer Feedback
          <i className="ti ti-info-circle" style={{ fontSize: '13px', color: '#8A9AAA' }}></i>
        </div>
        <a className="show-all-link" id="feedback-show-all" href="#" aria-label="Show all feedback">
          SHOW ALL
        </a>
      </div>

      <div className="donut-body">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={feedbackData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              labelLine={false}
              label={CustomLabel}
            >
              {feedbackData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={entry.color}
                  stroke="white"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="donut-legend">
          {feedbackData.map((item) => (
            <div className="donut-legend-item" key={item.name}>
              <div className="donut-legend-left">
                <div className="donut-legend-color" style={{ background: item.color }}></div>
                <span className="donut-legend-label">{item.name}</span>
              </div>
              <div>
                <span className="donut-legend-count">{item.value}</span>
                <span className="donut-legend-pct">({item.pct})</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
