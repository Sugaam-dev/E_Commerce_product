import { useState, useEffect } from 'react';

// ─── Skeleton shimmer ─────────────────────────────────────────────────────────
function Shimmer() {
  return (
    <div className="ai-insight-shimmer">
      <div className="ai-shimmer-line ai-shimmer-line--80" />
      <div className="ai-shimmer-line ai-shimmer-line--60" />
      <div className="ai-shimmer-line ai-shimmer-line--70" />
      <div className="ai-shimmer-line ai-shimmer-line--50" style={{ marginTop: 12 }} />
    </div>
  );
}

// ─── Mock insights database based on prompt / title keywords ─────────────────
const INSIGHTS_DB = {
  dashboard: {
    bullets: [
      "Revenue peaked in November (₹49,00,000) due to festive shopping campaigns, followed by a seasonal dip in July (₹18,00,000).",
      "PMRG Andheri is the highest performing store with ₹42,00,000 in revenue, whereas Hazratganj is falling short of targets by 11%.",
      "Bata Power X is the best-selling product overall, contributing ₹12.66 Lakhs in revenue."
    ],
    action: "Implement a targeted mid-season discount campaign for the Lucknow (Hazratganj) store and restock Nike Air Max 270."
  },
  contacts: {
    bullets: [
      "Anjali Verma (Lucknow) and Sneha Patel (Ahmedabad) are high-value customers flagged as Inactive, representing a high churn risk.",
      "Vikram Singh (Jaipur) is the top growth customer with ₹21.8 Lakhs lifetime spend and an outstanding 410 transactions.",
      "Premium and Elite segments contribute 82% of total Customer Lifetime Value (CLV) despite representing only 37% of the customer base."
    ],
    action: "Launch an win-back campaign with a 15% discount code specifically targeting inactive VIP/Premium members."
  },
  orders: {
    bullets: [
      "UPI is the preferred payment method, accounting for 50% of recent transactions, reflecting high digital adoption.",
      "Returns are currently at 8.3% of total orders (1 returned out of 12), which is within the acceptable safety threshold.",
      "Average processing time is 1.4 days, but 2 orders are in 'Processing' status for more than 48 hours."
    ],
    action: "Transition COD customers to UPI by offering a small incentive (e.g. free shipping) to reduce return-to-origin risks."
  },
  products: {
    bullets: [
      "New Balance 574 is completely OUT OF STOCK, causing an estimated revenue leakage of ₹15,000/week based on recent demand.",
      "Reebok Classic Leather is at critical risk of stockout with only 5 units remaining in inventory.",
      "Bata Power X is the velocity leader with 634 units sold and a strong 3.9/5 rating, representing stable mass-market demand."
    ],
    action: "Immediately place a reorder of 100 units for New Balance 574 and 50 units for Reebok Classic Leather."
  },
  analytics: {
    bullets: [
      "Average conversion rate peaks on weekends (Saturdays at 31.2%), coinciding with highest footfall across physical stores.",
      "Category contribution is heavily dominated by Running shoes (42%), followed by Casual shoes (28%). Walking and Lifestyle show growth potential.",
      "Revenue targets were missed by more than 10% in January and July, indicating post-festive demand drops that need off-season promos."
    ],
    action: "Allocate 15% more marketing budget to the Running category and launch weekend-only flash sales to boost conversion rate."
  },
  notifications: {
    bullets: [
      "Urgent priority order ORD-2025-8841 from VIP customer Rahul Mehta (₹8,340) requires immediate shipment validation.",
      "A return request has been raised for Woodland Sneakers (ORD-2025-8835) by Meera Iyer, representing a potential quality dispute.",
      "Low stock alert for Reebok Classic Leather (5 units left) needs procurement approval."
    ],
    action: "Assign a dedicated associate to process the VIP order and approve the restock request immediately."
  },
  // Reports page tabs
  sales_summary: {
    bullets: [
      "Annual revenue stands at ₹3.82 Cr with a healthy 12.4% year-on-year growth rate.",
      "Peak sales occurred in November (₹49L), while July was the lowest month (₹18L).",
      "Return rate remains stable at 1.8% of total lifetime sales volume."
    ],
    action: "Plan inventory stocking schedules 3 months in advance of the Q4 festive spike."
  },
  store_performance: {
    bullets: [
      "PMRG Andheri leads with ₹42L revenue, representing 11% of total sales.",
      "PMRG Connaught is currently closed, showing zero sales activity for the current period.",
      "PMRG SG Highway and PMRG Hazratganj missed targets by 12% and 11% respectively."
    ],
    action: "Conduct an audit of the Hazratganj store's conversion strategy."
  },
  product_performance: {
    bullets: [
      "Bata Power X is the highest revenue contributor at ₹12.66L.",
      "Nike Air Max 270 has generated ₹13.01L in revenue from 312 sales due to premium pricing.",
      "Campus Force shows strong volume sales (398 units) but lower revenue yield due to high discounts."
    ],
    action: "Optimize pricing for Campus Force by reducing discounts by 5%."
  },
  order_status: {
    bullets: [
      "Delivered orders account for 75% of total orders in the current period.",
      "Processing orders are at 16.7%, and Cancelled/Returned orders stand at 8.3%.",
      "Card payments are dominant for high-ticket orders, while UPI is used for lower-ticket items."
    ],
    action: "Streamline the processing queue to convert pending orders to shipped status within 12 hours."
  }
};

function getPrebakedInsights(title = '', prompt = '', dataContext) {
  const t = title.toLowerCase();
  const p = prompt.toLowerCase();

  if (t.includes('dashboard') || p.includes('revenue (₹')) return INSIGHTS_DB.dashboard;
  if (t.includes('customer') && t.includes('profile')) {
    // Dynamic look up based on customer dataContext
    const customerName = dataContext?.customer?.name || 'Rahul Mehta';
    const returnRate = dataContext?.customer?.returnRate || '50%';
    const clv = dataContext?.customer?.clv ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(dataContext.customer.clv) : '₹12,40,500';
    return {
      bullets: [
        `Purchase frequency is high for ${customerName}, indicating brand loyalty, but the return rate is critically high at ${returnRate}.`,
        `Preferred store is ${dataContext?.customer?.store || 'PMRG Andheri'}, where most transactions are conducted.`,
        `High discount usage detected (vouchers worth ₹52,000 available), suggesting sensitivity to price promotions.`
      ],
      action: `Introduce specialized points-based rewards for ${customerName} rather than flat markdowns to preserve margins.`
    };
  }
  if (t.includes('contact') || p.includes('customer list') || t.includes('customer intelligence')) return INSIGHTS_DB.contacts;
  if (t.includes('order') || p.includes('order statuses')) return INSIGHTS_DB.orders;
  if (t.includes('product intelligence') || p.includes('stockout')) return INSIGHTS_DB.products;
  if (t.includes('analytics') || p.includes('weekly conversion')) return INSIGHTS_DB.analytics;
  if (t.includes('notification') || p.includes('unread')) return INSIGHTS_DB.notifications;

  // Reports page tabs
  if (t.includes('sales summary')) return INSIGHTS_DB.sales_summary;
  if (t.includes('store performance')) return INSIGHTS_DB.store_performance;
  if (t.includes('product performance')) return INSIGHTS_DB.product_performance;
  if (t.includes('order status')) return INSIGHTS_DB.order_status;

  return INSIGHTS_DB.dashboard;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AIInsightCard({ dataContext, prompt, title = 'AI Insight', className = '' }) {
  const [status, setStatus] = useState('loading');
  const [data, setData] = useState({ bullets: [], action: '' });
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setStatus('loading');
    const timer = setTimeout(() => {
      setData(getPrebakedInsights(title, prompt, dataContext));
      setStatus('done');
    }, 600);
    return () => clearTimeout(timer);
  }, [title, prompt, dataContext]);

  return (
    <div className={`ai-insight-card ${className}`}>
      <div className="ai-insight-header">
        <div className="ai-insight-badge">
          <i className="ti ti-sparkles" />
          AI Insight
        </div>
        <div className="ai-insight-title">{title}</div>
        {status === 'loading' && (
          <div className="ai-insight-generating">
            <span className="ai-typing-dots-inline"><span /><span /><span /></span>
            Generating…
          </div>
        )}
        {/* Minimize / Expand toggle */}
        <button
          className="ai-insight-toggle"
          onClick={() => setCollapsed(c => !c)}
          title={collapsed ? 'Expand' : 'Minimize'}
          aria-label={collapsed ? 'Expand insight' : 'Minimize insight'}
        >
          <i className={`ti ${collapsed ? 'ti-chevron-down' : 'ti-chevron-up'}`} />
        </button>
      </div>

      {!collapsed && (
        <div className="ai-insight-body">
          {status === 'loading' && <Shimmer />}

          {status === 'done' && data.bullets.length > 0 && (
            <ul className="ai-insight-bullets">
              {data.bullets.map((b, i) => (
                <li key={i} className="ai-insight-bullet">
                  <span className="ai-bullet-dot" />
                  <span>{b}</span>
                </li>
              ))}
              {data.action && (
                <li className="ai-insight-bullet ai-insight-action">
                  <i className="ti ti-arrow-right" />
                  <span><strong>Action:</strong> {data.action}</span>
                </li>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
