"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Desativado temporariamente para não quebrar a Vercel com código velho
// import { useAuth } from '@/contexts/AuthContext'; 
// import pb from '@/lib/pocketbaseClient.js';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Mock de autenticação temporário para o visual funcionar
  const isAuthenticated = false;
  const currentUser = null;
  const userType = null;
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    // logout();
    router.push('/');
  };

  const getDashboardLink = () => {
    if (userType === 'admin') return '/dashboard/admin';
    if (userType === 'modelo') return '/dashboard/modelo';
    return '/dashboard/cliente';
  };

  const displayName = currentUser?.nome_artistico || currentUser?.nome_completo || 'Usuário';
  const displayInitials = displayName.substring(0, 2).toUpperCase();
  const avatarUrl = ''; // Limpo do PocketBase

  // Função auxiliar para marcar o link ativo
  const isActive = (path) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0F0F0F]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0F0F0F]/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex flex-col">
            <span className="text-2xl font-bold text-[#D946EF] tracking-tighter">MEGGY</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest -mt-1">My Exclusive Gamer Girl</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-[#D946EF]' : 'text-gray-300 hover:text-[#D946EF]'}`}>Início</Link>
          <Link href="/modelos" className={`text-sm font-medium transition-colors ${isActive('/modelos') ? 'text-[#D946EF]' : 'text-gray-300 hover:text-[#D946EF]'}`}>Modelos</Link>
          <a href="/#como-funciona" className="text-sm font-medium text-gray-300 hover:text-[#D946EF] transition-colors">Como funciona</a>
          <a href="/#faq" className="text-sm font-medium text-gray-300 hover:text-[#D946EF] transition-colors">FAQ</a>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              {userType === 'cliente' && (
                <div className="flex flex-col items-end mr-2">
                  <span className="text-xs text-gray-400">Saldo</span>
                  <span className="text-sm font-bold text-[#D946EF]">{currentUser?.saldo_creditos || 0} CR</span>
                </div>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-white/10 hover:border-[#D946EF]/50">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={avatarUrl} alt={displayName} />
                      <AvatarFallback>{displayInitials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-[#1F1F1F] border-white/10 text-white" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{displayName}</p>
                      <p className="text-xs leading-none text-gray-400">{currentUser?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem asChild className="hover:bg-white/5 cursor-pointer focus:bg-white/5 focus:text-white">
                    <Link href={getDashboardLink()} className="flex items-center">
                      <LayoutDashboard className="mr-2 h-4 w-4 text-[#D946EF]" />
                      <span>Meu Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={handleLogout} className="hover:bg-red-500/10 text-red-400 cursor-pointer focus:bg-red-500/10 focus:text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <>
              <Button variant="ghost" className="text-white hover:text-[#D946EF] hover:bg-white/5" asChild>
                <Link href="/login-cliente">Entrar</Link>
              </Button>
              <Button variant="outline" className="border-[#D946EF] text-[#D946EF] hover:bg-[#D946EF]/10" asChild>
                <Link href="/cadastro-cliente">Criar conta</Link>
              </Button>
              <Button className="bg-[#D946EF] text-white hover:bg-[#c026d3] shadow-[0_0_15px_rgba(217,70,239,0.5)]" asChild>
                <Link href="/cadastro-modelo">Quero ser modelo</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden p-2 text-white" onClick={toggleMenu}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-[#0F0F0F] border-b border-white/10 p-4 flex flex-col gap-4 shadow-xl">
          <Link href="/" className="text-lg font-medium p-2 text-white hover:bg-white/5 rounded-md" onClick={toggleMenu}>Início</Link>
          <Link href="/modelos" className="text-lg font-medium p-2 text-white hover:bg-white/5 rounded-md" onClick={toggleMenu}>Modelos</Link>
          <a href="/#como-funciona" className="text-lg font-medium p-2 text-white hover:bg-white/5 rounded-md" onClick={toggleMenu}>Como funciona</a>
          <a href="/#faq" className="text-lg font-medium p-2 text-white hover:bg-white/5 rounded-md" onClick={toggleMenu}>FAQ</a>
          <div className="h-px bg-white/10 my-2"></div>
          
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-3 p-2 mb-2">
                <Avatar className="h-10 w-10 border border-[#D946EF]">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback>{displayInitials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-white font-medium">{displayName}</p>
                  {userType === 'cliente' && <p className="text-sm text-[#D946EF] font-bold">{currentUser?.saldo_creditos || 0} Créditos</p>}
                </div>
              </div>
              <Button variant="outline" className="w-full justify-start border-white/10 text-white hover:bg-white/5" asChild onClick={toggleMenu}>
                <Link href={getDashboardLink()}><LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard</Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start text-red-400 hover:bg-red-500/10 hover:text-red-400" onClick={() => { handleLogout(); toggleMenu(); }}>
                <LogOut className="mr-2 h-4 w-4" /> Sair
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" className="w-full justify-start text-white" asChild onClick={toggleMenu}>
                <Link href="/login-cliente">Entrar</Link>
              </Button>
              <Button variant="outline" className="w-full justify-start border-[#D946EF] text-[#D946EF]" asChild onClick={toggleMenu}>
                <Link href="/cadastro-cliente">Criar conta</Link>
              </Button>
              <Button className="w-full justify-start bg-[#D946EF] text-white" asChild onClick={toggleMenu}>
                <Link href="/cadastro-modelo">Quero ser modelo</Link>
              </Button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;