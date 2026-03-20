import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  LogOut,
  Menu,
  X,
  ShieldAlert,
  Globe,
  Ban,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext.jsx';

import AdminDashboard from '@/components/admin/AdminDashboard.jsx';
import AdminModelosAnalise from '@/components/admin/AdminModelosAnalise.jsx';
import AdminModeloDetalhes from '@/components/admin/AdminModeloDetalhes.jsx';
import AdminClients from '@/components/admin/AdminClients.jsx';
import AdminBookings from '@/components/admin/AdminBookings.jsx';

const AdminDashboardPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout, isAuthenticated, userType, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate('/admin/login');
      } else if (userType !== 'admin') {
        navigate('/dashboard/cliente');
      }
    }
  }, [loading, isAuthenticated, userType, navigate]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    {
      path: '/admin/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard Geral',
    },
    {
      path: '/admin/modelos-analise',
      icon: ShieldAlert,
      label: 'Análise de Modelos',
    },
    {
      path: '/admin/modelos-aprovadas',
      icon: Users,
      label: 'Modelos Aprovadas',
    },
    {
      path: '/admin/modelos-publicadas',
      icon: Globe,
      label: 'Modelos Publicadas',
    },
    {
      path: '/admin/modelos-recusadas',
      icon: Ban,
      label: 'Modelos Recusadas',
    },
    {
      path: '/admin/clientes',
      icon: Users,
      label: 'Clientes',
    },
    {
      path: '/admin/agendamentos',
      icon: Calendar,
      label: 'Agendamentos',
    },
  ];

  const isActiveRoute = (path) => location.pathname === path;

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Carregando painel administrativo...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Painel Admin | Meggy</title>
      </Helmet>

      <div className="min-h-screen bg-black text-white flex">
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={toggleSidebar}
          />
        )}

        <aside
          className={`
            fixed lg:static top-0 left-0 z-50 h-screen w-64 bg-[#111111] border-r border-white/10
            transform transition-transform duration-300
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <div className="p-6 border-b border-white/10">
            <h1 className="text-2xl font-bold text-white leading-none">MEGGY.</h1>
            <p className="text-xs text-[#D946EF] mt-1 tracking-wide">ADMIN PANEL</p>
          </div>

          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActiveRoute(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${active
                      ? 'bg-[#D946EF] text-white'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/5"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <header className="h-20 border-b border-white/10 bg-black/80 backdrop-blur flex items-center justify-between px-4 lg:px-8">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="lg:hidden text-white hover:bg-white/5"
              >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              <h2 className="text-xl font-semibold">Painel Administrativo</h2>
            </div>
          </header>

          <main className="p-4 lg:p-8">
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/dashboard" element={<AdminDashboard />} />

              <Route
                path="/modelos-analise"
                element={<AdminModelosAnalise defaultStatus="Em análise" />}
              />
              <Route
                path="/modelos-aprovadas"
                element={<AdminModelosAnalise defaultStatus="Aprovada" />}
              />
              <Route
                path="/modelos-publicadas"
                element={<AdminModelosAnalise defaultStatus="Publicada" />}
              />
              <Route
                path="/modelos-recusadas"
                element={<AdminModelosAnalise defaultStatus="Recusada" />}
              />

              <Route
                path="/modelos-detalhes/:id"
                element={<AdminModeloDetalhes />}
              />

              <Route path="/clientes" element={<AdminClients />} />
              <Route path="/agendamentos" element={<AdminBookings />} />
            </Routes>
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminDashboardPage;