import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext.jsx';

const ModelDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, userType } = useAuth();

  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModel = async () => {
      try {
        const record = await pb.collection('modelos').getOne(id, {
          $autoCancel: false,
        });

        if (record.status_aprovacao !== 'Publicada') {
          toast({
            title: 'Indisponível',
            description: 'Este perfil não está disponível no momento.',
            variant: 'destructive',
          });
          navigate('/');
          return;
        }

        setModel(record);
      } catch (error) {
        console.error('Error fetching model:', error);
        toast({
          title: 'Erro',
          description: 'Modelo não encontrada.',
          variant: 'destructive',
        });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchModel();
    }
  }, [id, navigate, toast]);

  const handleBookSession = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Faça login',
        description: 'Você precisa entrar como cliente para agendar uma sessão.',
      });

      navigate('/login-cliente', {
        state: {
          redirectTo: `/modelo/${id}`,
          selectedModelId: id,
        },
      });
      return;
    }

    if (userType !== 'cliente') {
      toast({
        title: 'Acesso inválido',
        description: 'Somente clientes podem agendar sessões.',
        variant: 'destructive',
      });

      navigate('/dashboard/cliente');
      return;
    }

    navigate('/dashboard/cliente', {
      state: {
        selectedModelId: id,
        openBooking: true,
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#D946EF]" />
      </div>
    );
  }

  if (!model) return null;

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col">
      <Helmet>
        <title>{`${model.nome_artistico} | Meggy`}</title>
      </Helmet>

      <Header />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto bg-[#1F1F1F] rounded-2xl overflow-hidden border border-white/10 flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 h-96 md:h-auto bg-black/50 relative">
            {model.foto_perfil_arquivo ? (
              <img
                src={pb.files.getUrl(model, model.foto_perfil_arquivo)}
                alt={model.nome_artistico}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                Sem foto
              </div>
            )}
          </div>

          <div className="w-full md:w-1/2 p-8 flex flex-col">
            <h1 className="text-4xl font-bold mb-2">{model.nome_artistico}</h1>
            <p className="text-[#D946EF] font-medium mb-6 text-lg">
              {model.categorias?.join(', ') || 'Acompanhante'}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div>
                <span className="text-gray-400 block">Localização</span>
                <span className="font-medium">
                  {model.cidade || '—'} - {model.estado || '—'}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block">Idade</span>
                <span className="font-medium">
                  {model.data_nascimento
                    ? `${new Date().getFullYear() - new Date(model.data_nascimento).getFullYear()} anos`
                    : '—'}
                </span>
              </div>
            </div>

            <div className="prose prose-invert mb-8 flex-1">
              <h3 className="text-xl font-semibold mb-2 text-white">Sobre mim</h3>
              <p className="text-gray-300 leading-relaxed">
                {model.bio_completa || model.bio_curta || 'Nenhuma biografia disponível.'}
              </p>
            </div>

            <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/10">
              <div>
                <p className="text-sm text-gray-400">Valor por hora</p>
                <p className="text-3xl font-bold text-white">
                  {model.preco_hora} <span className="text-lg text-[#D946EF]">CR</span>
                </p>
              </div>

              <Button
                onClick={handleBookSession}
                className="bg-[#D946EF] hover:bg-[#c026d3] text-white px-8 py-6 text-lg font-bold shadow-[0_0_15px_rgba(217,70,239,0.3)]"
              >
                Agendar Sessão
              </Button>
            </div>
          </div>
        </div>

        {model.galeria_fotos && model.galeria_fotos.length > 0 && (
          <div className="max-w-5xl mx-auto mt-12">
            <h2 className="text-2xl font-bold mb-6">Galeria de Fotos</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {model.galeria_fotos.map((foto, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-xl overflow-hidden border border-white/10 bg-black/50"
                >
                  <img
                    src={pb.files.getUrl(model, foto)}
                    alt={`Galeria ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ModelDetailPage;