import { transactionsData } from '../data/mockData';

const badgeClass = (type) => {
  if (type === 'blue') return 'discount-badge badge-blue';
  if (type === 'green') return 'discount-badge badge-green';
  return 'discount-badge badge-orange';
};

function TxnCard({ txn }) {
  return (
    <div className="txn-card" id={`txn-${txn.id}`}>
      {/* Top Row */}
      <div className="txn-top-row">
        <div className="txn-tag">
          <span className="bill-pill">{txn.type}</span>
          <span className="trn-id">/ {txn.trn}</span>
        </div>
        <div className="txn-amount">{txn.amount}</div>
      </div>

      {/* Product Row */}
      <div className="txn-product-row">
        <img
          src={txn.image}
          alt={txn.productName}
          className="product-thumb"
          loading="lazy"
          onError={(e) => {
            e.target.src = `https://via.placeholder.com/60x60/E2E8F0/8A9AAA?text=IMG`;
          }}
        />
        <div className="product-info">
          <div className="product-name">{txn.productName}</div>
          <div className="product-sku">{txn.sku}</div>
          <div className="product-meta">
            <span className="qty-price">
              {txn.qty} &nbsp;
              <span className="price-val">{txn.price}</span>
            </span>
            <span className={badgeClass(txn.discountType)}>
              {txn.discountBadge}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="txn-footer">
        <div className="store-date">
          <i className="ti ti-building-store"></i>
          {txn.store}
          &nbsp;·&nbsp;
          <i className="ti ti-calendar"></i>
          {txn.date}
        </div>
        <a
          href="#"
          className="view-invoice"
          aria-label={`View invoice for ${txn.trn}`}
          onClick={(e) => e.preventDefault()}
        >
          View Invoice ›
        </a>
      </div>
    </div>
  );
}

export default function TransactionHistory() {
  return (
    <div className="txn-section">
      <div className="txn-header">
        <div className="txn-title">
          <i className="ti ti-receipt-2"></i>
          Transaction History
        </div>
        <a className="show-all-link" id="txn-show-all" href="#" aria-label="Show all transactions">
          SHOW ALL
        </a>
      </div>
      <div className="txn-grid">
        {transactionsData.map((txn) => (
          <TxnCard key={txn.id} txn={txn} />
        ))}
      </div>
    </div>
  );
}
