import React from 'react';
import Link from 'next/link';
import { Clock, TrendingUp, Sliders, Headphones, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BecomeModelSection = () => {
  const benefits = [
    {
      icon: Clock,
      title: 'Liberdade de horários',
      description: 'Trabalhe quando quiser, escolha seus próprios horários'
    },
    {
      icon: TrendingUp,
      title: 'Ganhos justos',
      description: 'Receba 100% dos seus ganhos, sem taxas abusivas'
    },
    {
      icon: Sliders,
      title: 'Controle total',
      description: 'Gerencie sua agenda, perfil e interações com clientes'
    },
    {
      icon: Headphones,
      title: 'Suporte dedicado',
      description: 'Equipe sempre pronta para ajudar e resolver dúvidas'
    },
    {
      icon: Shield,
      title: 'Comunidade segura',
      description: 'Plataforma verificada e segura para você trabalhar'
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden bg-[#2D2D2D] border-y border-white/5">
      {/* Subtle background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#D946EF]/5 to-[#A21CAF]/5 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Text Content & CTA */}
          <div className="flex flex-col space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                Seja uma <span className="text-[#D946EF]">Modelo Meggy</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-300 font-medium">
                Ganhe dinheiro com liberdade total de horários
              </p>
              <p className="text-gray-400 text-base leading-relaxed max-w-lg">
                Junte-se a centenas de modelos que já ganham na plataforma. Você controla sua agenda, seus horários e seus ganhos. Sem intermediários, sem complicações.
              </p>
            </div>

            <div>
              <Button 
                size="lg" 
                className="bg-[#D946EF] hover:bg-[#c026d3] text-white font-bold px-8 py-7 text-lg rounded-xl shadow-[0_4px_20px_rgba(217,70,239,0.4)] hover:shadow-[0_8px_30px_rgba(217,70,239,0.6)] hover:-translate-y-1 transition-all duration-300 group"
                asChild
              >
                <Link href="/cadastro-modelo" className="flex items-center gap-2">
                  Quero ser modelo
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>

            <div className="pt-6 border-t border-white/10">
              <h4 className="text-white font-semibold mb-4">Como funciona:</h4>
              <ol className="flex flex-col sm:flex-row sm:flex-wrap gap-y-3 gap-x-6 text-sm text-gray-400">
                <li className="flex items-center gap-2"><span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#D946EF]/20 text-[#D946EF] text-xs font-bold">1</span> Preencha o cadastro</li>
                <li className="flex items-center gap-2"><span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#D946EF]/20 text-[#D946EF] text-xs font-bold">2</span> Envie fotos e documentos</li>
                <li className="flex items-center gap-2"><span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#D946EF]/20 text-[#D946EF] text-xs font-bold">3</span> Análise rápida</li>
                <li className="flex items-center gap-2"><span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#D946EF]/20 text-[#D946EF] text-xs font-bold">4</span> Aprovação</li>
                <li className="flex items-center gap-2"><span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#D946EF]/20 text-[#D946EF] text-xs font-bold">5</span> Comece a ganhar</li>
              </ol>
            </div>
          </div>

          {/* Right Column: Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className={`bg-[#3D3D3D] p-6 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-white/5 group ${index === 4 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
              >
                <div className="w-14 h-14 rounded-lg bg-[#2D2D2D] flex items-center justify-center mb-5 group-hover:bg-[#D946EF]/10 transition-colors duration-300">
                  <benefit.icon className="w-8 h-8 text-[#D946EF]" strokeWidth={1.5} />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{benefit.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default BecomeModelSection;