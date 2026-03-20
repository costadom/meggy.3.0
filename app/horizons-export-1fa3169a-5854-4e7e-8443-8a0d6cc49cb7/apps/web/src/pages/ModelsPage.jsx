import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ModelCard from '@/components/ModelCard.jsx';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';

const ModelsPage = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchModels = async () => {
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

      setModels(sortedRecords);
    } catch (err) {
      console.error('Error fetching models:', err);
      setModels([]);
      setError('Erro ao carregar a lista de modelos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col">
      <Helmet>
        <title>Modelos | Meggy</title>
      </Helmet>

      <Header />

      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Nossas Modelos</h1>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-64 w-full rounded-xl bg-white/5" />
                <Skeleton className="h-6 w-3/4 bg-white/5" />
                <Skeleton className="h-4 w-1/2 bg-white/5" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-red-400 bg-[#1F1F1F] rounded-xl border border-white/10">
            <AlertCircle className="w-12 h-12 mb-4" />
            <p className="mb-6 text-lg">{error}</p>
            <Button
              onClick={fetchModels}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar Novamente
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {models.map((model) => (
              <ModelCard key={model.id} model={model} />
            ))}

            {models.length === 0 && (
              <div className="col-span-full text-center text-gray-400 py-20 bg-[#1F1F1F] rounded-xl border border-white/10">
                <p className="text-xl mb-2">Nenhuma modelo disponível no momento.</p>
                <p className="text-sm">
                  Estamos preparando novos perfis incríveis para você. Volte em breve!
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ModelsPage;