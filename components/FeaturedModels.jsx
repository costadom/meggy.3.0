import React from 'react';
import ModelCard from './ModelCard';

const FeaturedModels = ({ models = [] }) => {
  return (
    <section className="py-24 bg-[#1A1A1A] relative border-t border-white/5">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Escolha o perfil ideal para sua sessão
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            As melhores companhias verificadas, prontas para elevar sua experiência e garantir momentos inesquecíveis.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {models.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}

          {models.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-8">
              Nenhuma modelo em destaque no momento.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedModels;