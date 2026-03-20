import React from 'react';
import Link from 'next/link';
import { Instagram, Twitter, Youtube, Music } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0A0A0A] pt-16 pb-8 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          
          {/* Column 1: Logo & Description */}
          <div className="lg:col-span-1 flex flex-col space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-3xl font-bold text-white tracking-tight">
                Meggy<span className="text-[#D946EF]">.</span>
              </span>
            </Link>
            <p className="text-white font-medium text-sm">
              Conexões reais, sem intermediários
            </p>
            <p className="text-[#D1D5DB] text-sm leading-relaxed">
              A plataforma que conecta você com modelos incríveis para sessões personalizadas.
            </p>
          </div>

          {/* Column 2: Plataforma */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-white font-bold text-lg mb-2">Plataforma</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-[#D1D5DB] hover:text-[#D946EF] transition-colors text-sm">Home</Link></li>
              <li><Link href="/modelos" className="text-[#D1D5DB] hover:text-[#D946EF] transition-colors text-sm">Modelos</Link></li>
              <li><Link href="/categorias" className="text-[#D1D5DB] hover:text-[#D946EF] transition-colors text-sm">Categorias</Link></li>
              <li><Link href="/como-funciona" className="text-[#D1D5DB] hover:text-[#D946EF] transition-colors text-sm">Como funciona</Link></li>
              <li><Link href="/cadastro-modelo" className="text-[#D1D5DB] hover:text-[#D946EF] transition-colors text-sm">Seja modelo</Link></li>
            </ul>
          </div>

          {/* Column 3: Suporte */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-white font-bold text-lg mb-2">Suporte</h4>
            <ul className="space-y-3">
              <li><Link href="/faq" className="text-[#D1D5DB] hover:text-[#D946EF] transition-colors text-sm">FAQ</Link></li>
              <li><Link href="/contato" className="text-[#D1D5DB] hover:text-[#D946EF] transition-colors text-sm">Contato</Link></li>
              <li><Link href="/privacidade" className="text-[#D1D5DB] hover:text-[#D946EF] transition-colors text-sm">Políticas de privacidade</Link></li>
              <li><Link href="/termos" className="text-[#D1D5DB] hover:text-[#D946EF] transition-colors text-sm">Termos de serviço</Link></li>
              <li><Link href="/seguranca" className="text-[#D1D5DB] hover:text-[#D946EF] transition-colors text-sm">Segurança</Link></li>
            </ul>
          </div>

          {/* Column 4: Contato */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-white font-bold text-lg mb-2">Contato</h4>
            <ul className="space-y-3">
              <li className="text-[#D1D5DB] text-sm">
                <a href="mailto:contato@meggy.com.br" className="hover:text-[#D946EF] transition-colors">
                  contato@meggy.com.br
                </a>
              </li>
              <li className="text-[#D1D5DB] text-sm">
                <a href="https://wa.me/5511999999999" target="_blank" rel="noreferrer" className="hover:text-[#D946EF] transition-colors">
                  WhatsApp: (11) 9999-9999
                </a>
              </li>
              <li className="text-[#D1D5DB] text-sm mt-2">
                Segunda a sexta, 9h às 18h
              </li>
            </ul>
          </div>

          {/* Column 5: Social Media */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-white font-bold text-lg mb-2">Redes Sociais</h4>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-[#1F1F1F] flex items-center justify-center hover:bg-[#D946EF]/20 transition-colors group">
                <Instagram className="w-5 h-5 text-[#D946EF] group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#1F1F1F] flex items-center justify-center hover:bg-[#D946EF]/20 transition-colors group">
                <Twitter className="w-5 h-5 text-[#D946EF] group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#1F1F1F] flex items-center justify-center hover:bg-[#D946EF]/20 transition-colors group">
                <Music className="w-5 h-5 text-[#D946EF] group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#1F1F1F] flex items-center justify-center hover:bg-[#D946EF]/20 transition-colors group">
                <Youtube className="w-5 h-5 text-[#D946EF] group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#D1D5DB] text-sm text-center md:text-left">
            © 2024 Meggy. Todos os direitos reservados. | Desenvolvido com ❤️
          </p>
          <Link 
            href="/admin/login" 
            className="text-white/10 hover:text-white/40 transition-colors text-xs"
            title="Acesso Administrativo"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;