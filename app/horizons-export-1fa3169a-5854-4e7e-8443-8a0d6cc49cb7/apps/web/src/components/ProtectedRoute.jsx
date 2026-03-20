import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, userType, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center text-white">Carregando...</div>;
  }

  if (!isAuthenticated) {
    if (location.pathname.startsWith('/admin')) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    if (location.pathname.includes('/modelo')) {
      return <Navigate to="/login-modelo" state={{ from: location }} replace />;
    }
    return <Navigate to="/login-cliente" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userType)) {
    if (userType === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (userType === 'modelo') return <Navigate to="/dashboard/modelo" replace />;
    return <Navigate to="/dashboard/cliente" replace />;
  }

  return children;
};

export default ProtectedRoute;