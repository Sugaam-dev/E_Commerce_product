import { voucherData } from '../data/mockData';

export default function VoucherRow() {
  return (
    <div className="voucher-row">
      {voucherData.map((v) => (
        <div key={v.id} className="voucher-card" id={`voucher-${v.id}`}>
          <div>
            <div className="voucher-label">
              <i className={`ti ${v.icon}`} style={{ marginRight: '4px' }}></i>
              {v.label}
            </div>
            <div className="voucher-count">{v.count}</div>
            <div className="voucher-amount">{v.amount}</div>
          </div>
          <div className="voucher-arrow" aria-label={`View ${v.label}`}>
            <i className="ti ti-arrow-right"></i>
          </div>
        </div>
      ))}
    </div>
  );
}
