import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import AIBuddy from './components/AIBuddy';

// Admin pages
import DashboardPage from './pages/DashboardPage';
import ContactsPage from './pages/ContactsPage';
import OrdersPage from './pages/OrdersPage';
import ProductsPage from './pages/ProductsPage';
import ReportsPage from './pages/ReportsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import NotificationsPage from './pages/NotificationsPage';
import CustomerProfilePage from './pages/CustomerProfilePage';
import SettingsPage from './pages/SettingsPage';

// Super Admin pages
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';
import AdminManagementPage from './pages/superadmin/AdminManagementPage';
import AdminDetailPage from './pages/superadmin/AdminDetailPage';

// Auth
import LoginPage from './pages/LoginPage';

// ─── Route Guards ─────────────────────────────────────────────

function RequireAuth({ children }) {
  const { currentUser } = useAuth();
  const location = useLocation();
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function RequireAdmin({ children }) {
  const { currentUser, isAdmin } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/superadmin" replace />;
  return children;
}

function RequireSuperAdmin({ children }) {
  const { currentUser, isSuperAdmin } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (!isSuperAdmin) return <Navigate to="/" replace />;
  return children;
}

// ─── Layout shell for Admin ───────────────────────────────────

function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className={`app-layout ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
      )}
      <div className="main-content">
        <TopHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        {children}
        <footer className="page-footer">
          © {new Date().getFullYear()} PMRG Solution Pvt Ltd. All Rights Reserved.
          &nbsp;·&nbsp; PMRG Customer 360 CRM
        </footer>
      </div>
      <AIBuddy />
    </div>
  );
}

// ─── Layout shell for Super Admin ─────────────────────────────

function SuperAdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className={`app-layout ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
      )}
      <div className="main-content">
        <TopHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        {children}
        <footer className="page-footer">
          © {new Date().getFullYear()} PMRG Solution Pvt Ltd. · Super Admin Console
        </footer>
      </div>
    </div>
  );
}

// ─── Root redirect based on role ──────────────────────────────

function RootRedirect() {
  const { currentUser, isAdmin, isSuperAdmin } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (isSuperAdmin) return <Navigate to="/superadmin" replace />;
  if (isAdmin) return <Navigate to="/" replace />;
  return <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />

        {/* Admin routes */}
        <Route
          path="/"
          element={
            <RequireAdmin>
              <AdminLayout>
                <DashboardPage />
              </AdminLayout>
            </RequireAdmin>
          }
        />
        <Route
          path="/contacts"
          element={
            <RequireAdmin>
              <AdminLayout>
                <ContactsPage />
              </AdminLayout>
            </RequireAdmin>
          }
        />
        <Route
          path="/contacts/:id"
          element={
            <RequireAdmin>
              <AdminLayout>
                <CustomerProfilePage />
              </AdminLayout>
            </RequireAdmin>
          }
        />
        <Route
          path="/orders"
          element={
            <RequireAdmin>
              <AdminLayout>
                <OrdersPage />
              </AdminLayout>
            </RequireAdmin>
          }
        />
        <Route
          path="/products"
          element={
            <RequireAdmin>
              <AdminLayout>
                <ProductsPage />
              </AdminLayout>
            </RequireAdmin>
          }
        />
        <Route
          path="/reports"
          element={
            <RequireAdmin>
              <AdminLayout>
                <ReportsPage />
              </AdminLayout>
            </RequireAdmin>
          }
        />
        <Route
          path="/analytics"
          element={
            <RequireAdmin>
              <AdminLayout>
                <AnalyticsPage />
              </AdminLayout>
            </RequireAdmin>
          }
        />
        <Route
          path="/notifications"
          element={
            <RequireAdmin>
              <AdminLayout>
                <NotificationsPage />
              </AdminLayout>
            </RequireAdmin>
          }
        />
        <Route
          path="/settings"
          element={
            <RequireAuth>
              <AdminLayout>
                <SettingsPage />
              </AdminLayout>
            </RequireAuth>
          }
        />

        {/* Super Admin routes */}
        <Route
          path="/superadmin"
          element={
            <RequireSuperAdmin>
              <SuperAdminLayout>
                <SuperAdminDashboard />
              </SuperAdminLayout>
            </RequireSuperAdmin>
          }
        />
        <Route
          path="/superadmin/admins"
          element={
            <RequireSuperAdmin>
              <SuperAdminLayout>
                <AdminManagementPage />
              </SuperAdminLayout>
            </RequireSuperAdmin>
          }
        />
        <Route
          path="/superadmin/admins/:id"
          element={
            <RequireSuperAdmin>
              <SuperAdminLayout>
                <AdminDetailPage />
              </SuperAdminLayout>
            </RequireSuperAdmin>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}