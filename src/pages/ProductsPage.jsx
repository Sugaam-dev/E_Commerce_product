import { useState, useMemo } from 'react';
import { products } from '../data/mockData';
import AIInsightCard from '../components/AIInsightCard';

const statusColors = {
  Active: { bg: 'rgba(0,180,160,0.12)', text: '#00B4A0' },
  'Low Stock': { bg: 'rgba(245,166,35,0.12)', text: '#D97706' },
  'Out of Stock': { bg: 'rgba(224,92,92,0.12)', text: '#E05C5C' },
};

const fmt = v => new Intl.NumberFormat('en-IN').format(v);

function StarRating({ rating }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
      {[1,2,3,4,5].map(i => (
        <i key={i} className={`ti ${i <= Math.round(rating) ? 'ti-star-filled' : 'ti-star'}`}
          style={{ fontSize: '11px', color: i <= Math.round(rating) ? '#F5A623' : '#CBD5E1' }}></i>
      ))}
      <span style={{ fontSize: '11px', color: '#5A6A7A', marginLeft: '3px' }}>{rating}</span>
    </div>
  );
}

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCat, setFilterCat] = useState('All');
  const [view, setView] = useState('grid'); // 'grid' | 'list'
  const [sortKey, setSortKey] = useState('sold');
  const [sortDir, setSortDir] = useState('desc');

  const categories = ['All', ...new Set(products.map(p => p.category))];
  const statuses = ['All', 'Active', 'Low Stock', 'Out of Stock'];

  const filtered = useMemo(() => {
    let data = products.filter(p =>
      (p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())) &&
      (filterStatus === 'All' || p.status === filterStatus) &&
      (filterCat === 'All' || p.category === filterCat)
    );
    data.sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey];
      if (typeof av === 'string') av = av.toLowerCase(), bv = bv.toLowerCase();
      return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
    return data;
  }, [search, filterStatus, filterCat, sortKey, sortDir]);

  return (
    <div className="page-body">
      {/* Stats */}
      <div className="stats-row">
        {[
          { label: 'Total Products', value: products.length, icon: 'ti-box', color: '#00B4A0' },
          { label: 'Active', value: products.filter(p => p.status === 'Active').length, icon: 'ti-check', color: '#6366F1' },
          { label: 'Low / Out of Stock', value: products.filter(p => p.status !== 'Active').length, icon: 'ti-alert-triangle', color: '#F5A623' },
          { label: 'Total Units Sold', value: products.reduce((s, p) => s + p.sold, 0), icon: 'ti-trending-up', color: '#E05C5C' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-label"><i className={`ti ${s.icon}`} style={{ fontSize: '14px', color: s.color }}></i>{s.label}</div>
            <div className="stat-value" style={{ fontSize: '24px' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* AI Insight */}
      <AIInsightCard
        title="Product Intelligence"
        dataContext={{
          products: products.map(p => ({
            name: p.name, brand: p.brand, category: p.category,
            price: p.price, mrp: p.mrp, stock: p.stock, sold: p.sold,
            rating: p.rating, status: p.status,
          })),
          summary: {
            totalProducts: products.length,
            activeProducts: products.filter(p => p.status === 'Active').length,
            lowStock: products.filter(p => p.status === 'Low Stock').map(p => ({ name: p.name, stock: p.stock })),
            outOfStock: products.filter(p => p.status === 'Out of Stock').map(p => p.name),
            bestseller: [...products].sort((a, b) => b.sold - a.sold)[0]?.name,
            slowMover: [...products].sort((a, b) => a.sold - b.sold)[0]?.name,
          },
        }}
        prompt="Identify products at risk of stockout (low/zero stock + high sales velocity), slow movers vs bestsellers, and any pricing or discount opportunities. Flag items needing urgent restock."
      />

      <div className="panel">
        {/* Toolbar */}
        <div style={{ padding: '14px 18px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', borderBottom: '1px solid #E2E8F0' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
            <i className="ti ti-search" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#8A9AAA', fontSize: '14px' }}></i>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products, brands, SKU..." style={{ width: '100%', padding: '8px 10px 8px 32px', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '13px', fontFamily: 'inherit', outline: 'none' }} />
          </div>
          <select className="select-sm" value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ padding: '8px 28px 8px 10px' }}>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
          <select className="select-sm" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: '8px 28px 8px 10px' }}>
            {statuses.map(s => <option key={s}>{s}</option>)}
          </select>
          <select className="select-sm" value={`${sortKey}-${sortDir}`} onChange={e => { const [k,d] = e.target.value.split('-'); setSortKey(k); setSortDir(d); }} style={{ padding: '8px 28px 8px 10px' }}>
            <option value="sold-desc">Top Selling</option>
            <option value="price-asc">Price: Low→High</option>
            <option value="price-desc">Price: High→Low</option>
            <option value="stock-asc">Stock: Low→High</option>
            <option value="rating-desc">Best Rated</option>
          </select>
          <div style={{ display: 'flex', border: '1px solid #E2E8F0', borderRadius: '6px', overflow: 'hidden' }}>
            {['grid','list'].map(v => (
              <button key={v} onClick={() => setView(v)}
                style={{ padding: '7px 11px', border: 'none', cursor: 'pointer', fontSize: '14px', transition: 'all 0.15s', background: view === v ? '#0F1A2E' : 'white', color: view === v ? 'white' : '#5A6A7A' }}>
                <i className={`ti ${v === 'grid' ? 'ti-layout-grid' : 'ti-list'}`}></i>
              </button>
            ))}
          </div>
        </div>

        {/* Grid View */}
        {view === 'grid' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(210px,1fr))', gap: '1px', background: '#E2E8F0' }}>
            {filtered.map(p => {
              const sc = statusColors[p.status] || { bg: '#F1F5F9', text: '#5A6A7A' };
              const discount = Math.round(((p.mrp - p.price) / p.mrp) * 100);
              return (
                <div key={p.id} style={{ background: 'white', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', transition: 'box-shadow 0.15s', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = 'inset 0 0 0 2px #00B4A0'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <img src={p.image} alt={p.name} style={{ width: 60, height: 60, borderRadius: '8px', objectFit: 'cover', border: '1px solid #E2E8F0' }} onError={e => e.target.src = 'https://via.placeholder.com/60x60/E2E8F0/8A9AAA?text=IMG'} />
                    <span style={{ background: sc.bg, color: sc.text, fontSize: '9.5px', fontWeight: 700, padding: '3px 8px', borderRadius: '10px' }}>{p.status}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#1A2A3A', lineHeight: 1.35, marginBottom: '2px' }}>{p.name}</div>
                    <div style={{ fontSize: '10.5px', color: '#8A9AAA' }}>{p.brand} · {p.sku}</div>
                  </div>
                  <StarRating rating={p.rating} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#1A2A3A' }}>₹{fmt(p.price)}</div>
                      <div style={{ fontSize: '11px', color: '#8A9AAA', textDecoration: 'line-through' }}>₹{fmt(p.mrp)}</div>
                    </div>
                    <span style={{ background: 'rgba(0,180,160,0.12)', color: '#00B4A0', fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px' }}>{discount}% off</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#5A6A7A', borderTop: '1px solid #F1F5F9', paddingTop: '8px' }}>
                    <span>Stock: <strong style={{ color: p.stock < 10 ? '#E05C5C' : '#1A2A3A' }}>{p.stock}</strong></span>
                    <span>Sold: <strong style={{ color: '#00B4A0' }}>{p.sold}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* List View */}
        {view === 'list' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC' }}>
                  {['Product','Brand','Category','Price','MRP','Discount','Stock','Sold','Rating','Status'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#5A6A7A', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => {
                  const sc = statusColors[p.status] || { bg: '#F1F5F9', text: '#5A6A7A' };
                  const discount = Math.round(((p.mrp - p.price) / p.mrp) * 100);
                  return (
                    <tr key={p.id} style={{ borderTop: '1px solid #F1F5F9', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                      onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                      <td style={{ padding: '11px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img src={p.image} alt={p.name} style={{ width: 36, height: 36, borderRadius: '6px', objectFit: 'cover', border: '1px solid #E2E8F0', flexShrink: 0 }} onError={e => e.target.src = 'https://via.placeholder.com/36x36/E2E8F0/8A9AAA?text=IMG'} />
                          <div>
                            <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#1A2A3A' }}>{p.name}</div>
                            <div style={{ fontSize: '10.5px', color: '#8A9AAA' }}>{p.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '11px 14px', fontSize: '12px', color: '#5A6A7A' }}>{p.brand}</td>
                      <td style={{ padding: '11px 14px', fontSize: '12px', color: '#5A6A7A' }}>{p.category}</td>
                      <td style={{ padding: '11px 14px', fontSize: '13px', fontWeight: 700, color: '#1A2A3A' }}>₹{fmt(p.price)}</td>
                      <td style={{ padding: '11px 14px', fontSize: '12px', color: '#8A9AAA', textDecoration: 'line-through' }}>₹{fmt(p.mrp)}</td>
                      <td style={{ padding: '11px 14px' }}><span style={{ background: 'rgba(0,180,160,0.12)', color: '#00B4A0', fontSize: '10.5px', fontWeight: 700, padding: '2px 7px', borderRadius: '4px' }}>{discount}%</span></td>
                      <td style={{ padding: '11px 14px', fontSize: '13px', fontWeight: 600, color: p.stock < 10 ? '#E05C5C' : '#1A2A3A' }}>{p.stock}</td>
                      <td style={{ padding: '11px 14px', fontSize: '13px', fontWeight: 600, color: '#1A2A3A' }}>{p.sold}</td>
                      <td style={{ padding: '11px 14px' }}><StarRating rating={p.rating} /></td>
                      <td style={{ padding: '11px 14px' }}><span style={{ background: sc.bg, color: sc.text, fontSize: '10.5px', fontWeight: 700, padding: '3px 9px', borderRadius: '20px' }}>{p.status}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#8A9AAA' }}>
            <i className="ti ti-box-off" style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}></i>No products found
          </div>
        )}
      </div>
    </div>
  );
}
