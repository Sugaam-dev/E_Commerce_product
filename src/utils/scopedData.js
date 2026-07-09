import { useMemo } from 'react';
import {
  products as allProducts,
  orders as allOrders,
  customers as allCustomers,
  notifications as allNotifications,
} from '../data/mockData';

// ─── Plain filter functions (no hooks — safe for superadmin pages) ────────────

export function filterProductsByAdmin(adminId) {
  if (!adminId) return allProducts;
  return allProducts.filter(p => p.adminId === adminId);
}

export function filterOrdersByAdmin(adminId) {
  if (!adminId) return allOrders;
  return allOrders.filter(o => o.adminId === adminId);
}

export function filterCustomersByAdmin(adminId) {
  if (!adminId) return allCustomers;
  return allCustomers.filter(c => c.adminId === adminId);
}

export function filterNotificationsByAdmin(adminId) {
  if (!adminId) return allNotifications;
  return allNotifications.filter(n => n.adminId === adminId);
}

// ─── React hooks (memoized) ───────────────────────────────────

export function useScopedProducts(adminId) {
  return useMemo(() => filterProductsByAdmin(adminId), [adminId]);
}

export function useScopedOrders(adminId) {
  return useMemo(() => filterOrdersByAdmin(adminId), [adminId]);
}

export function useScopedCustomers(adminId) {
  return useMemo(() => filterCustomersByAdmin(adminId), [adminId]);
}

export function useScopedNotifications(adminId) {
  return useMemo(() => filterNotificationsByAdmin(adminId), [adminId]);
}

// ─── Derived stats helpers ─────────────────────────────────────

export function computeAdminStats(adminId) {
  const prods = filterProductsByAdmin(adminId);
  const ords = filterOrdersByAdmin(adminId);
  const custs = filterCustomersByAdmin(adminId);
  const revenue = ords
    .filter(o => o.status === 'Delivered')
    .reduce((s, o) => s + o.amount, 0);

  return {
    productCount: prods.length,
    orderCount: ords.length,
    customerCount: custs.length,
    revenue,
  };
}
