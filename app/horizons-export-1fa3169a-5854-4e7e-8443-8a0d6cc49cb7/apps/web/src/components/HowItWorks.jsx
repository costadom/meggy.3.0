import React from 'react';
import { UserPlus, CreditCard, Users, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const HowItWorks = () => {
  const steps = [
    {
      num: 1,
      icon: UserPlus,
      title: 'Crie sua conta',
      desc: 'Cadastro rápido e fácil. Preencha seus dados e acesse a plataforma em segundos.'
    },
    {
      num: 2,
      icon: CreditCard,
      title: 'Compre créditos',
      desc: 'Escolha um pacote de créditos e recarregue sua carteira. Simples e seguro.'
    },
    {
      num: 3,
      icon: Users,
      title: 'Escolha a modelo',
      desc: 'Navegue pelo catálogo, veja perfis, fotos, jogos e escolha quem você quer.'
    },
    {
      num: 4,
      icon: Calendar,
      title: 'Agende sua sessão',
      desc: 'Selecione um horário disponível, confirme e aproveite sua sessão exclusiva.'
    }
  ];

  return (
    <section id="como-funciona" className="py-20 bg-[#0F0F0F] relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
            Direto, simples e sem complicação
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Entenda como funciona a plataforma em 4 passos simples
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <Card 
              key={i} 
              className="bg-[#1F1F1F] border-border/20 hover:border-[#D946EF]/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(217,70,239,0.15)] hover:-translate-y-2 group rounded-xl overflow-hidden"
            >
              <CardHeader className="relative pb-4 pt-8 px-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 rounded-xl bg-[#D946EF] flex items-center justify-center text-white font-bold text-2xl shadow-[0_0_20px_rgba(217,70,239,0.5)] group-hover:scale-110 transition-transform duration-300">
                    {step.num}
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#D946EF]/10 transition-colors duration-300">
                    <step.icon className="w-6 h-6 text-gray-500 group-hover:text-[#D946EF] transition-colors duration-300" />
                  </div>
                </div>
                <CardTitle className="text-xl text-white font-bold">{step.title}</CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-8">
                <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                  {step.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;