import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import AIBuddy from './components/AIBuddy';
import DashboardPage from './pages/DashboardPage';
import ContactsPage from './pages/ContactsPage';
import OrdersPage from './pages/OrdersPage';
import ProductsPage from './pages/ProductsPage';
import ReportsPage from './pages/ReportsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import NotificationsPage from './pages/NotificationsPage';
import CustomerProfilePage from './pages/CustomerProfilePage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />
        <div className="main-content">
          <TopHeader />
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/contacts/:id" element={<CustomerProfilePage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
          <footer className="page-footer">
            © {new Date().getFullYear()} PMRG Solution Pvt Ltd. All Rights Reserved.
            &nbsp;·&nbsp; PMRG Customer 360 CRM
          </footer>
        </div>
        {/* Global AI Buddy — lives outside route tree so chat history persists on navigation */}
        <AIBuddy />
      </div>
    </BrowserRouter>
  );
}