import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import HomePage from './pages/HomePage.jsx';
import ModelsPage from './pages/ModelsPage.jsx';
import ModelDetailPage from './pages/ModelDetailPage.jsx';
import ClientDashboardPage from './pages/ClientDashboardPage.jsx';
import CreditPackagesPage from './pages/CreditPackagesPage.jsx';
import ModelSignupPage from './pages/ModelSignupPage.jsx';
import ModelLoginPage from './pages/ModelLoginPage.jsx';
import ModelConfirmationPage from './pages/ModelConfirmationPage.jsx';
import ModelDashboardPage from './pages/ModelDashboardPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import AdminLoginPage from './pages/AdminLoginPage.jsx';
import ClientSignupPage from './pages/ClientSignupPage.jsx';
import ClientLoginPage from './pages/ClientLoginPage.jsx';
import StripeConfigPage from './pages/StripeConfigPage.jsx';

function App() {
    return (
        <AuthProvider>
            <Router>
                <ScrollToTop />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/modelos" element={<ModelsPage />} />
                    <Route path="/modelo/:id" element={<ModelDetailPage />} />
                    
                    {/* Auth Routes */}
                    <Route path="/cadastro-cliente" element={<ClientSignupPage />} />
                    <Route path="/login-cliente" element={<ClientLoginPage />} />
                    <Route path="/cadastro-modelo" element={<ModelSignupPage />} />
                    <Route path="/login-modelo" element={<ModelLoginPage />} />
                    <Route path="/modelo-confirmacao" element={<ModelConfirmationPage />} />
                    <Route path="/admin/login" element={<AdminLoginPage />} />
                    
                    {/* Protected Routes */}
                    <Route path="/recarregar-creditos" element={
                        <ProtectedRoute allowedRoles={['cliente']}>
                            <CreditPackagesPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/dashboard/cliente/*" element={
                        <ProtectedRoute allowedRoles={['cliente']}>
                            <ClientDashboardPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/dashboard/client/*" element={
                        <ProtectedRoute allowedRoles={['cliente']}>
                            <ClientDashboardPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/dashboard/modelo/*" element={
                        <ProtectedRoute allowedRoles={['modelo']}>
                            <ModelDashboardPage />
                        </ProtectedRoute>
                    } />
                    
                    {/* Admin Routes */}
                    <Route path="/admin/*" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminDashboardPage />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/stripe-config" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <StripeConfigPage />
                        </ProtectedRoute>
                    } />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;