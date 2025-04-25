import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { CustomThemeProvider } from './contexts/ThemeContext';

// Components
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

// Pages - Public
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Pages - Customer
import Dashboard from './pages/customer/Dashboard';
import TransactionsPage from './pages/customer/TransactionsPage';
import BeneficiariesPage from './pages/customer/BeneficiariesPage';
import AddBeneficiaryPage from './pages/customer/AddBeneficiaryPage';
import EditBeneficiaryPage from './pages/customer/EditBeneficiaryPage';
import TransferPage from './pages/customer/TransferPage';
import ProfilePage from './pages/customer/ProfilePage';

// Pages - Admin
import AdminDashboard from './pages/admin/Dashboard';
import CustomersPage from './pages/admin/CustomersPage';
import CustomerDetailsPage from './pages/admin/CustomerDetailsPage';
import AdminTransactionsPage from './pages/admin/TransactionsPage';
import AccountOpeningPage from './pages/admin/AccountOpeningPage';
import AdminProfilePage from './pages/admin/ProfilePage';

function App() {
  return (
    <CustomThemeProvider>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Customer routes */}
              <Route element={<PrivateRoute requiredRole="customer" />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/transactions" element={<TransactionsPage />} />
                <Route path="/beneficiaries" element={<BeneficiariesPage />} />
                <Route path="/beneficiaries/add" element={<AddBeneficiaryPage />} />
                <Route path="/beneficiaries/edit/:id" element={<EditBeneficiaryPage />} />
                <Route path="/transfer" element={<TransferPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>

              {/* Admin routes */}
              <Route element={<PrivateRoute requiredRole="admin" />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/customers" element={<CustomersPage />} />
                <Route path="/admin/customers/:id" element={<CustomerDetailsPage />} />
                <Route path="/admin/transactions" element={<AdminTransactionsPage />} />
                <Route path="/admin/account-opening" element={<AccountOpeningPage />} />
                <Route path="/admin/profile" element={<AdminProfilePage />} />
              </Route>

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </CustomThemeProvider>
  );
}

export default App; 