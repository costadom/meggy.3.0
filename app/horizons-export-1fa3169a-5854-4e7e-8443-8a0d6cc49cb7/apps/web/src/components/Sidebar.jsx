import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  History, 
  Wallet, 
  User, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/cliente' },
    { icon: Users, label: 'Modelos', path: '/modelos' },
    { icon: Calendar, label: 'Meus agendamentos', path: '/dashboard/cliente/agendamentos' },
    { icon: History, label: 'Histórico', path: '/dashboard/cliente/historico' },
    { icon: Wallet, label: 'Créditos', path: '/dashboard/cliente/creditos' },
    { icon: User, label: 'Perfil', path: '/dashboard/cliente/perfil' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-[#1F1F1F] border-r border-white/10 
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <NavLink to="/" className="flex flex-col">
            <span className="text-2xl font-bold text-[#D946EF] tracking-tighter">MEGGY</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest -mt-1">Client Panel</span>
          </NavLink>
          <Button variant="ghost" size="icon" className="lg:hidden text-gray-400 hover:text-white" onClick={toggleSidebar}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              end={item.path === '/dashboard/cliente'}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-[#D946EF]/10 text-[#D946EF] font-medium' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }
              `}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="p-4 border-t border-white/10">
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 w-full text-left">
            <LogOut className="h-5 w-5" />
            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;