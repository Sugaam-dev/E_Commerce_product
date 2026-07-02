// ============================================================
// PMRG Customer 360 — Full Mock Data Store
// ============================================================

// ─── CUSTOMERS ───────────────────────────────────────────────
export const customers = [
  { id: 'C001', name: 'Rahul Mehta', initials: 'RM', phone: '+91 98****4521', email: 'r****@gmail.com', group: 'Premium', type: 'Family', gender: 'Male', city: 'Mumbai', store: 'PMRG Andheri', joined: '2021-09-06', lastPurchase: '2025-06-12', totalSpend: 1240500, transactions: 284, returns: 142, status: 'Active', tag: 'VIP', clv: 1240500, freq: '0.05' },
  { id: 'C002', name: 'Priya Sharma', initials: 'PS', phone: '+91 91****7832', email: 'p****@yahoo.com', group: 'Standard', type: 'Individual', gender: 'Female', city: 'Delhi', store: 'PMRG Connaught', joined: '2022-03-15', lastPurchase: '2025-05-30', totalSpend: 328000, transactions: 47, returns: 12, status: 'Active', tag: 'Regular', clv: 328000, freq: '0.12' },
  { id: 'C003', name: 'Arun Nair', initials: 'AN', phone: '+91 93****3311', email: 'a****@outlook.com', group: 'Premium', type: 'Corporate', gender: 'Male', city: 'Bengaluru', store: 'PMRG Koramangala', joined: '2020-11-20', lastPurchase: '2025-06-01', totalSpend: 875000, transactions: 132, returns: 31, status: 'Active', tag: 'VIP', clv: 875000, freq: '0.08' },
  { id: 'C004', name: 'Sneha Patel', initials: 'SP', phone: '+91 99****8812', email: 's****@gmail.com', group: 'Standard', type: 'Family', gender: 'Female', city: 'Ahmedabad', store: 'PMRG SG Highway', joined: '2023-01-10', lastPurchase: '2025-04-22', totalSpend: 145000, transactions: 28, returns: 8, status: 'Inactive', tag: 'Regular', clv: 145000, freq: '0.22' },
  { id: 'C005', name: 'Vikram Singh', initials: 'VS', phone: '+91 70****5544', email: 'v****@rediff.com', group: 'Elite', type: 'Individual', gender: 'Male', city: 'Jaipur', store: 'PMRG Pink City', joined: '2019-06-05', lastPurchase: '2025-06-10', totalSpend: 2180000, transactions: 410, returns: 98, status: 'Active', tag: 'Elite', clv: 2180000, freq: '0.03' },
  { id: 'C006', name: 'Meera Iyer', initials: 'MI', phone: '+91 88****9923', email: 'm****@gmail.com', group: 'Standard', type: 'Individual', gender: 'Female', city: 'Chennai', store: 'PMRG T-Nagar', joined: '2023-07-18', lastPurchase: '2025-03-15', totalSpend: 89000, transactions: 15, returns: 4, status: 'Active', tag: 'New', clv: 89000, freq: '0.35' },
  { id: 'C007', name: 'Deepak Joshi', initials: 'DJ', phone: '+91 96****7761', email: 'd****@yahoo.com', group: 'Premium', type: 'Family', gender: 'Male', city: 'Pune', store: 'PMRG FC Road', joined: '2021-04-22', lastPurchase: '2025-05-18', totalSpend: 560000, transactions: 88, returns: 22, status: 'Active', tag: 'VIP', clv: 560000, freq: '0.09' },
  { id: 'C008', name: 'Anjali Verma', initials: 'AV', phone: '+91 75****4420', email: 'a****@hotmail.com', group: 'Standard', type: 'Individual', gender: 'Female', city: 'Lucknow', store: 'PMRG Hazratganj', joined: '2022-11-01', lastPurchase: '2025-02-28', totalSpend: 210000, transactions: 36, returns: 9, status: 'Inactive', tag: 'Regular', clv: 210000, freq: '0.18' },
];

// ─── ORDERS ──────────────────────────────────────────────────
export const orders = [
  { id: 'ORD-2025-8841', customer: 'Rahul Mehta', customerId: 'C001', product: 'Nike Air Max 270', sku: 'NK-AM270-42', qty: 2, amount: 8340, store: 'PMRG Andheri', date: '2025-06-12', status: 'Delivered', payment: 'UPI', category: 'Footwear' },
  { id: 'ORD-2025-8840', customer: 'Vikram Singh', customerId: 'C005', product: 'Adidas Ultraboost 22', sku: 'ADI-UB22-43', qty: 1, amount: 12999, store: 'PMRG Pink City', date: '2025-06-11', status: 'Delivered', payment: 'Card', category: 'Footwear' },
  { id: 'ORD-2025-8839', customer: 'Priya Sharma', customerId: 'C002', product: 'Puma RS-X3', sku: 'PUM-RSX3-37', qty: 1, amount: 6499, store: 'PMRG Connaught', date: '2025-06-10', status: 'Processing', payment: 'COD', category: 'Footwear' },
  { id: 'ORD-2025-8838', customer: 'Arun Nair', customerId: 'C003', product: 'Reebok Classic Leather', sku: 'RBK-CLS-44', qty: 3, amount: 11997, store: 'PMRG Koramangala', date: '2025-06-09', status: 'Shipped', payment: 'UPI', category: 'Footwear' },
  { id: 'ORD-2025-8837', customer: 'Sneha Patel', customerId: 'C004', product: 'New Balance 574', sku: 'NB-574-38', qty: 1, amount: 7999, store: 'PMRG SG Highway', date: '2025-06-08', status: 'Cancelled', payment: 'Card', category: 'Footwear' },
  { id: 'ORD-2025-8836', customer: 'Deepak Joshi', customerId: 'C007', product: 'Skechers Go Walk 6', sku: 'SKE-GW6-42', qty: 2, amount: 5998, store: 'PMRG FC Road', date: '2025-06-07', status: 'Delivered', payment: 'UPI', category: 'Footwear' },
  { id: 'ORD-2025-8835', customer: 'Meera Iyer', customerId: 'C006', product: 'Woodland Sneakers', sku: 'WL-SNK-36', qty: 1, amount: 3499, store: 'PMRG T-Nagar', date: '2025-06-06', status: 'Returned', payment: 'COD', category: 'Footwear' },
  { id: 'ORD-2025-8834', customer: 'Anjali Verma', customerId: 'C008', product: 'Bata Power X', sku: 'BAT-PWX-39', qty: 1, amount: 1999, store: 'PMRG Hazratganj', date: '2025-06-05', status: 'Delivered', payment: 'Card', category: 'Footwear' },
  { id: 'ORD-2025-8833', customer: 'Rahul Mehta', customerId: 'C001', product: 'Sparx Running Shoes', sku: 'SPX-RUN-42', qty: 4, amount: 5996, store: 'PMRG Andheri', date: '2025-06-04', status: 'Delivered', payment: 'UPI', category: 'Footwear' },
  { id: 'ORD-2025-8832', customer: 'Vikram Singh', customerId: 'C005', product: 'Campus Force', sku: 'CAM-FRC-44', qty: 2, amount: 3998, store: 'PMRG Pink City', date: '2025-06-03', status: 'Shipped', payment: 'UPI', category: 'Footwear' },
  { id: 'ORD-2025-8831', customer: 'Priya Sharma', customerId: 'C002', product: 'Liberty Gliders', sku: 'LIB-GLD-37', qty: 1, amount: 2499, store: 'PMRG Connaught', date: '2025-06-02', status: 'Processing', payment: 'COD', category: 'Footwear' },
  { id: 'ORD-2025-8830', customer: 'Arun Nair', customerId: 'C003', product: 'FILA Tennis Classic', sku: 'FLA-TNC-42', qty: 1, amount: 4599, store: 'PMRG Koramangala', date: '2025-06-01', status: 'Delivered', payment: 'Card', category: 'Footwear' },
];

// ─── PRODUCTS ─────────────────────────────────────────────────
export const products = [
  { id: 'P001', name: 'Nike Air Max 270', brand: 'Nike', sku: 'NK-AM270', category: 'Running', price: 4170, mrp: 5999, stock: 48, sold: 312, rating: 4.6, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=80&fit=crop', status: 'Active' },
  { id: 'P002', name: 'Adidas Ultraboost 22', brand: 'Adidas', sku: 'ADI-UB22', category: 'Running', price: 12999, mrp: 15999, stock: 22, sold: 187, rating: 4.8, image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=80&h=80&fit=crop', status: 'Active' },
  { id: 'P003', name: 'Puma Deviate NITRO 2', brand: 'Puma', sku: 'PUM-DN2', category: 'Running', price: 400, mrp: 10999, stock: 61, sold: 245, rating: 4.4, image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=80&h=80&fit=crop', status: 'Active' },
  { id: 'P004', name: 'Reebok Classic Leather', brand: 'Reebok', sku: 'RBK-CLS', category: 'Casual', price: 3999, mrp: 5499, stock: 5, sold: 98, rating: 4.3, image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=80&h=80&fit=crop', status: 'Low Stock' },
  { id: 'P005', name: 'New Balance 574', brand: 'New Balance', sku: 'NB-574', category: 'Lifestyle', price: 7999, mrp: 9499, stock: 0, sold: 76, rating: 4.5, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=80&fit=crop&sat=-100', status: 'Out of Stock' },
  { id: 'P006', name: 'Skechers Go Walk 6', brand: 'Skechers', sku: 'SKE-GW6', category: 'Walking', price: 2999, mrp: 3999, stock: 134, sold: 421, rating: 4.2, image: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=80&h=80&fit=crop', status: 'Active' },
  { id: 'P007', name: 'Woodland Sneakers', brand: 'Woodland', sku: 'WL-SNK', category: 'Casual', price: 3499, mrp: 4299, stock: 87, sold: 183, rating: 4.1, image: 'https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=80&h=80&fit=crop', status: 'Active' },
  { id: 'P008', name: 'Bata Power X', brand: 'Bata', sku: 'BAT-PWX', category: 'Sports', price: 1999, mrp: 2499, stock: 210, sold: 634, rating: 3.9, image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=80&h=80&fit=crop', status: 'Active' },
  { id: 'P009', name: 'Campus Force', brand: 'Campus', sku: 'CAM-FRC', category: 'Sports', price: 1999, mrp: 2799, stock: 145, sold: 398, rating: 4.0, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=80&fit=crop&hue=180', status: 'Active' },
  { id: 'P010', name: 'FILA Tennis Classic', brand: 'FILA', sku: 'FLA-TNC', category: 'Casual', price: 4599, mrp: 5999, stock: 33, sold: 112, rating: 4.3, image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=80&h=80&fit=crop&hue=90', status: 'Active' },
];

// ─── NOTIFICATIONS ────────────────────────────────────────────
export const notifications = [
  { id: 'N001', type: 'order', title: 'New Order Received', message: 'ORD-2025-8841 placed by Rahul Mehta for ₹8,340', time: '2 min ago', read: false, priority: 'high' },
  { id: 'N002', type: 'return', title: 'Return Request', message: 'Meera Iyer requested a return for Woodland Sneakers (ORD-2025-8835)', time: '15 min ago', read: false, priority: 'high' },
  { id: 'N003', type: 'payment', title: 'Payment Received', message: 'UPI payment of ₹12,999 confirmed for Vikram Singh', time: '1 hr ago', read: false, priority: 'medium' },
  { id: 'N004', type: 'stock', title: 'Low Stock Alert', message: 'Reebok Classic Leather (RBK-CLS) has only 5 units remaining', time: '3 hrs ago', read: true, priority: 'medium' },
  { id: 'N005', type: 'customer', title: 'VIP Customer Visit', message: 'Vikram Singh (Elite) is in PMRG Pink City store right now', time: '5 hrs ago', read: true, priority: 'low' },
  { id: 'N006', type: 'report', title: 'Monthly Report Ready', message: 'June 2025 sales report has been generated and is ready for review', time: '1 day ago', read: true, priority: 'low' },
  { id: 'N007', type: 'order', title: 'Order Cancelled', message: 'Sneha Patel cancelled ORD-2025-8837 worth ₹7,999', time: '1 day ago', read: true, priority: 'medium' },
  { id: 'N008', type: 'payment', title: 'COD Order Pending', message: '3 COD orders awaiting collection confirmation', time: '2 days ago', read: true, priority: 'low' },
];

// ─── REPORT / ANALYTICS DATA ──────────────────────────────────
export const monthlySales = [
  { month: 'Jan', revenue: 2800000, orders: 412, returns: 52, target: 3000000 },
  { month: 'Feb', revenue: 2200000, orders: 318, returns: 38, target: 2500000 },
  { month: 'Mar', revenue: 3500000, orders: 521, returns: 64, target: 3200000 },
  { month: 'Apr', revenue: 4100000, orders: 610, returns: 78, target: 4000000 },
  { month: 'May', revenue: 3800000, orders: 567, returns: 72, target: 4000000 },
  { month: 'Jun', revenue: 3200000, orders: 488, returns: 58, target: 3500000 },
  { month: 'Jul', revenue: 1800000, orders: 276, returns: 32, target: 2000000 },
  { month: 'Aug', revenue: 2400000, orders: 356, returns: 44, target: 2500000 },
  { month: 'Sep', revenue: 3100000, orders: 468, returns: 56, target: 3000000 },
  { month: 'Oct', revenue: 4200000, orders: 634, returns: 81, target: 4000000 },
  { month: 'Nov', revenue: 4900000, orders: 745, returns: 92, target: 4500000 },
  { month: 'Dec', revenue: 4500000, orders: 682, returns: 86, target: 4500000 },
];

export const categoryBreakdown = [
  { name: 'Running', value: 42, color: '#00B4A0' },
  { name: 'Casual', value: 28, color: '#6366F1' },
  { name: 'Sports', value: 18, color: '#F0884A' },
  { name: 'Walking', value: 8, color: '#F5A623' },
  { name: 'Lifestyle', value: 4, color: '#E05C5C' },
];

export const storePerformance = [
  { store: 'PMRG Andheri', revenue: 4200000, orders: 621, customers: 189, target: 4500000 },
  { store: 'PMRG Pink City', revenue: 3800000, orders: 543, customers: 167, target: 4000000 },
  { store: 'PMRG Koramangala', revenue: 3500000, orders: 498, customers: 155, target: 3800000 },
  { store: 'PMRG FC Road', revenue: 2900000, orders: 412, customers: 134, target: 3000000 },
  { store: 'PMRG Connaught', revenue: 2600000, orders: 378, customers: 121, target: 2800000 },
  { store: 'PMRG SG Highway', revenue: 2200000, orders: 316, customers: 102, target: 2500000 },
  { store: 'PMRG T-Nagar', revenue: 1900000, orders: 278, customers: 88, target: 2000000 },
  { store: 'PMRG Hazratganj', revenue: 1600000, orders: 231, customers: 74, target: 1800000 },
];

export const weeklyTraffic = [
  { day: 'Mon', visits: 320, conversions: 88 },
  { day: 'Tue', visits: 415, conversions: 112 },
  { day: 'Wed', visits: 380, conversions: 98 },
  { day: 'Thu', visits: 510, conversions: 145 },
  { day: 'Fri', visits: 680, conversions: 198 },
  { day: 'Sat', visits: 820, conversions: 256 },
  { day: 'Sun', visits: 740, conversions: 221 },
];

export const topProducts = [
  { name: 'Bata Power X', sales: 634, revenue: 1266366 },
  { name: 'Skechers Go Walk 6', sales: 421, revenue: 1262979 },
  { name: 'Campus Force', sales: 398, revenue: 795602 },
  { name: 'Nike Air Max 270', sales: 312, revenue: 1301040 },
  { name: 'Puma Deviate NITRO 2', sales: 245, revenue: 98000 },
];

// ─── DASHBOARD KPIs ────────────────────────────────────────────
export const dashboardKPIs = {
  totalRevenue: { value: '₹3,82,00,000', change: '+12.4%', trend: 'up', label: 'Total Revenue (FY25)' },
  totalCustomers: { value: '2,847', change: '+8.2%', trend: 'up', label: 'Total Customers' },
  totalOrders: { value: '4,924', change: '+15.7%', trend: 'up', label: 'Total Orders' },
  avgOrderValue: { value: '₹7,759', change: '-2.1%', trend: 'down', label: 'Avg. Order Value' },
};

export const recentActivity = [
  { id: 1, type: 'order', text: 'New order #ORD-2025-8841 from Rahul Mehta', time: '2 min ago', color: '#00B4A0' },
  { id: 2, type: 'return', text: 'Return approved for Meera Iyer — ₹3,499', time: '18 min ago', color: '#E05C5C' },
  { id: 3, type: 'customer', text: 'New customer Ravi Kumar registered', time: '45 min ago', color: '#6366F1' },
  { id: 4, type: 'payment', text: 'Payment received ₹12,999 — Vikram Singh', time: '1 hr ago', color: '#F5A623' },
  { id: 5, type: 'stock', text: 'Reebok Classic Leather stock critical (5 left)', time: '3 hr ago', color: '#F0884A' },
  { id: 6, type: 'order', text: 'Bulk order placed — Arun Nair ₹11,997', time: '5 hr ago', color: '#00B4A0' },
];

// ─── SETTINGS ─────────────────────────────────────────────────
export const settingsData = {
  company: { name: 'PMRG Solution', gstin: '27AADCP1234F1Z5', pan: 'AADCP1234F', address: 'E2-103, Sr No-296,Revell Orchid, Porwal Pune City, Pune-411047', phone: '+91-7722017100', email: 'admin@pmrgsolution.com', website: 'https://www.pmrgsolution.com', currency: 'INR', timezone: 'Asia/Kolkata', language: 'en-IN' },
  stores: [
    { id: 'S001', name: 'PMRG Andheri', city: 'Mumbai', manager: 'Aditya Kulkarni', phone: '+91 22 2674 0000', status: 'Open' },
    { id: 'S002', name: 'PMRG Pink City', city: 'Jaipur', manager: 'Preethi Rao', phone: '+91 141 455 0000', status: 'Open' },
    { id: 'S003', name: 'PMRG Koramangala', city: 'Bengaluru', manager: 'Suresh Babu', phone: '+91 80 4567 0000', status: 'Open' },
    { id: 'S004', name: 'PMRG FC Road', city: 'Pune', manager: 'Neha Desai', phone: '+91 20 2567 0000', status: 'Open' },
    { id: 'S005', name: 'PMRG Connaught', city: 'Delhi', manager: 'Harpreet Singh', phone: '+91 11 2345 0000', status: 'Closed' },
  ],
  users: [
    { id: 'U001', name: 'Aditya Kulkarni', role: 'Store Manager', email: 'aditya@pmrg.com', store: 'PMRG Andheri', status: 'Active' },
    { id: 'U002', name: 'Preethi Rao', role: 'Store Manager', email: 'preethi@pmrg.com', store: 'PMRG Pink City', status: 'Active' },
    { id: 'U003', name: 'Rahul Admin', role: 'CRM Admin', email: 'admin@pmrg.com', store: 'HQ', status: 'Active' },
    { id: 'U004', name: 'Suresh Babu', role: 'Store Manager', email: 'suresh@pmrg.com', store: 'PMRG Koramangala', status: 'Active' },
  ],
};

// ─── CUSTOMER PROFILE (selected customer) ─────────────────────
export const customerData = {
  name: 'Rahul Mehta',
  id: 'PMRG-C-00481',
  initials: 'RM',
  tag: 'VIP',
  phone: '+91 9*******54',
  email: 'r****ehta@gmail.com',
  registeredSince: 'Sep 6, 2021',
  registeredDays: '1391 Days',
  purchasesFrom: ['PMRG Andheri Store', 'City Square Mall – Thane', 'PMRG Bandra Store'],
  lastPurchase: 'Jun 12, 2025',
  totalReturnsValue: '₹13,20,182',
  totalReturnsQty: '142',
  otherInfo: {
    customerGroup: 'Premium',
    gender: 'Male',
    customerType: 'Family',
    dob: '15-Mar',
    maritalStatus: 'Married',
    weddingAnniversary: '20-Nov',
    salesPerson: 'Aditya Kulkarni',
  },
};

export const statsData = [
  { id: 'freq', label: 'Purchase Frequency', value: '0.05', unit: 'Days', chip: 'Active Buyer', icon: 'ti-refresh' },
  { id: 'clv', label: 'CLV (Customer Lifetime Value)', value: '₹12,40,500.00', sub: 'Lifetime spend', chip: '+8.4% YoY', icon: 'ti-coin-rupee' },
  { id: 'txn', label: 'Total Transactions', value: '284', sub: 'All time', chip: 'Bills + Returns', icon: 'ti-receipt' },
  { id: 'atv', label: 'ATV / AUT', value: '₹4,368.66', sub: '/ ₹22.10 per unit', chip: 'Avg Ticket', icon: 'ti-trending-up' },
];

export const transactionSummaryData = [
  { month: "Jul '24", Billed: 180000, Returned: 22000, Cancelled: 12000 },
  { month: "Aug '24", Billed: 240000, Returned: 35000, Cancelled: 18000 },
  { month: "Sep '24", Billed: 310000, Returned: 42000, Cancelled: 25000 },
  { month: "Oct '24", Billed: 420000, Returned: 55000, Cancelled: 30000 },
  { month: "Nov '24", Billed: 490000, Returned: 68000, Cancelled: 38000 },
  { month: "Dec '24", Billed: 450000, Returned: 60000, Cancelled: 32000 },
  { month: "Jan '25", Billed: 280000, Returned: 30000, Cancelled: 20000 },
  { month: "Feb '25", Billed: 190000, Returned: 18000, Cancelled: 10000 },
  { month: "Mar '25", Billed: 350000, Returned: 45000, Cancelled: 22000 },
  { month: "Apr '25", Billed: 410000, Returned: 52000, Cancelled: 28000 },
  { month: "May '25", Billed: 380000, Returned: 48000, Cancelled: 26000 },
  { month: "Jun '25", Billed: 320000, Returned: 38000, Cancelled: 20000 },
];

export const feedbackData = [
  { name: 'Happy', value: 25, pct: '58.14%', color: '#00B4A0' },
  { name: 'Neutral', value: 14, pct: '32.56%', color: '#94A3B8' },
  { name: 'Sad', value: 4, pct: '9.30%', color: '#E05C5C' },
];

export const voucherData = [
  { id: 'disc', label: 'Discount Voucher', count: '15', amount: '₹52,000.00', icon: 'ti-tag' },
  { id: 'coup', label: 'Coupons', count: '0', amount: '₹0.00', icon: 'ti-ticket' },
  { id: 'cred', label: 'Credit Note', count: '3', amount: '₹14,500.00', icon: 'ti-file-invoice' },
  { id: 'gift', label: 'Gift Voucher', count: '1', amount: '₹500.00', icon: 'ti-gift' },
];

export const transactionsData = [
  { id: 't1', type: 'Bill', trn: 'TRN - PMRG05243470', amount: '₹4,170.00', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=60&h=60&fit=crop', productName: 'Nike Air Max 270 Men\'s Running Shoes', sku: 'NK-AM270-BLK-42', qty: '1 Qty', price: '₹4,170.00', discountBadge: 'Manual Discount', discountType: 'blue', store: 'PMRG Andheri Store', date: 'Jun 12, 2025' },
  { id: 't2', type: 'Bill', trn: 'TRN - PMRG05243469', amount: '₹138.00', image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=60&h=60&fit=crop', productName: 'Adidas Galaxy 6 Men\'s Running Shoes Blue', sku: 'ADI-GAL6-BLU-43', qty: '1 Qty', price: '₹137.50', discountBadge: 'Adidas Galaxy 6 Discount', discountType: 'green', store: 'PMRG Andheri Store', date: 'Jun 12, 2025' },
  { id: 't3', type: 'Bill', trn: 'TRN - PMRG05243468', amount: '₹400.00', image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=60&h=60&fit=crop', productName: 'Puma Deviate NITRO 2 Men\'s Running Shoes Green', sku: 'PUM-DN2-GRN-41', qty: '1 Qty', price: '₹400.00', discountBadge: 'Flat 25% off on Puma Shoes', discountType: 'green', store: 'City Square Mall – Thane', date: 'May 21, 2025' },
  { id: 't4', type: 'Bill', trn: 'TRN - PMRG05243466', amount: '₹87,500.00', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=60&h=60&fit=crop', productName: '4DFWD x STRUNG Running Shoes Limited Edition', sku: 'ADI-4DFW-RUNS', qty: '100 Qty', price: '₹4,30,000.00', discountBadge: 'Manual Discount', discountType: 'blue', store: 'PMRG Bandra Store', date: 'May 21, 2025' },
];

export const navItems = [
  { icon: 'ti-home', label: 'Dashboard', path: '/' },
  { icon: 'ti-users', label: 'Contacts', path: '/contacts' },
  { icon: 'ti-shopping-cart', label: 'Orders', path: '/orders' },
  { icon: 'ti-box', label: 'Products', path: '/products' },
  { icon: 'ti-chart-bar', label: 'Reports', path: '/reports' },
  { icon: 'ti-chart-line', label: 'Analytics', path: '/analytics' },
  { icon: 'ti-settings', label: 'Settings', path: '/settings' },
  { icon: 'ti-bell', label: 'Notifications', path: '/notifications', badge: '4' },
];
