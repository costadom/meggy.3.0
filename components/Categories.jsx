import React from 'react';
import { Gamepad2, MessageCircle, Play, Zap, Wand2 } from 'lucide-react';

const Categories = () => {
  const categories = [
    {
      title: 'Gameplay com vídeo',
      icon: Gamepad2,
      description: 'Jogue junto com a modelo enquanto ela reage e interage com você.'
    },
    {
      title: 'Conversa online',
      icon: MessageCircle,
      description: 'Bom papo, companhia descontraída e diversão durante a sessão.'
    },
    {
      title: 'Assistir junto',
      icon: Play,
      description: 'Assista séries, filmes ou streams enquanto conversa com a modelo.'
    },
    {
      title: 'Reações ao vivo',
      icon: Zap,
      description: 'A modelo reage em tempo real aos seus momentos e conquistas.'
    },
    {
      title: 'Sessões personalizadas',
      icon: Wand2,
      description: 'Crie uma experiência única e sob medida para suas preferências.'
    }
  ];

  return (
    <section className="py-20 bg-[#1A1A1A] relative border-t border-white/5">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
            Escolha o tipo de sessão que você quer
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Cada modelo oferece diferentes tipos de atendimento. Encontre o que combina com você.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category, index) => (
            <div 
              key={index}
              className="bg-[#2D2D2D] rounded-xl px-6 py-8 cursor-pointer shadow-md hover:shadow-lg hover:bg-[#383838] hover:scale-105 transition-all duration-300 group flex flex-col items-center text-center border border-white/5 hover:border-[#D946EF]/30"
            >
              <category.icon 
                className="w-16 h-16 text-[#D946EF] group-hover:text-[#A21CAF] transition-colors duration-300 mb-6" 
                strokeWidth={1.5}
              />
              <h3 className="text-white font-bold text-lg mb-3">
                {category.title}
              </h3>
              <p className="text-[#D1D5DB] text-sm leading-relaxed line-clamp-3">
                {category.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;