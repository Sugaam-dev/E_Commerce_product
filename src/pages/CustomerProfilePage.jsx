import { useParams, useNavigate } from 'react-router-dom';
import { customers, orders, transactionsData } from '../data/mockData';
import StatsRow from '../components/StatsRow';
import TransactionSummary from '../components/TransactionSummary';
import CustomerFeedback from '../components/CustomerFeedback';
import VoucherRow from '../components/VoucherRow';
import TransactionHistory from '../components/TransactionHistory';
import AIInsightCard from '../components/AIInsightCard';

export default function CustomerProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const customer = customers.find(c => c.id === id);

  if (!customer) {
    return (
      <div className="page-body" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '60px', color: '#8A9AAA' }}>
          <i className="ti ti-user-off" style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}></i>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#1A2A3A', marginBottom: '8px' }}>Customer not found</div>
          <div style={{ fontSize: '13px', marginBottom: '20px' }}>No customer exists with ID: {id}</div>
          <button onClick={() => navigate('/contacts')}
            style={{ padding: '8px 20px', background: '#0F1A2E', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
            ← Back to Contacts
          </button>
        </div>
      </div>
    );
  }

  const customerOrders = orders.filter(o => o.customerId === customer.id);
  const returnRate = customer.transactions > 0
    ? ((customer.returns / customer.transactions) * 100).toFixed(1)
    : 0;

  return (
    <main className="page-body" id="main-page-body">
      <StatsRow />

      {/* ── AI Customer Intelligence ── */}
      <AIInsightCard
        title={`${customer.name} — Customer Intelligence`}
        dataContext={{
          customer: {
            name: customer.name,
            tag: customer.tag,
            group: customer.group,
            status: customer.status,
            joined: customer.joined,
            lastPurchase: customer.lastPurchase,
            totalSpend: customer.totalSpend,
            transactions: customer.transactions,
            returns: customer.returns,
            returnRate: `${returnRate}%`,
            clv: customer.clv,
            purchaseFrequency: `${customer.freq} days avg`,
            city: customer.city,
            store: customer.store,
          },
          recentOrders: customerOrders.map(o => ({
            id: o.id, product: o.product, amount: o.amount,
            status: o.status, date: o.date,
          })),
          recentTransactions: transactionsData.slice(0, 4).map(t => ({
            type: t.type, product: t.productName, amount: t.amount, date: t.date,
          })),
        }}
        prompt={`Based on ${customer.name}'s purchase frequency (${customer.freq} days), CLV (₹${new Intl.NumberFormat('en-IN').format(customer.clv)}), return rate (${returnRate}%), tag (${customer.tag}), and recent transactions: predict their next likely purchase window and suggest 1 targeted retention action. Also flag any churn risk.`}
      />

      <div className="mid-row">
        <TransactionSummary />
        <CustomerFeedback />
      </div>
      <VoucherRow />
      <TransactionHistory />
    </main>
  );
}