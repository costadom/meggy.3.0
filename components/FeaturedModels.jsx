import React, { useState, useEffect } from 'react';
import ModelCard from './ModelCard.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FeaturedModels = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeatured = async () => {
    setLoading(true);
    setError(null);

    try {
      const records = await pb.collection('modelos').getFullList({
        filter: 'status_aprovacao="Publicada"',
        $autoCancel: false,
      });

      const sortedRecords = Array.isArray(records)
        ? [...records].sort((a, b) => new Date(b.created || 0) - new Date(a.created || 0))
        : [];

      setModels(sortedRecords.slice(0, 6));
    } catch (err) {
      console.error('Error fetching featured models:', err);
      setModels([]);
      setError('Erro ao carregar modelos em destaque. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatured();
  }, []);

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

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-10 h-10 animate-spin text-[#D946EF]" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-red-400">
            <AlertCircle className="w-10 h-10 mb-4" />
            <p className="mb-4 text-lg">{error}</p>
            <Button
              onClick={fetchFeatured}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar Novamente
            </Button>
          </div>
        ) : (
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
        )}
      </div>
    </section>
  );
};

export default FeaturedModels;