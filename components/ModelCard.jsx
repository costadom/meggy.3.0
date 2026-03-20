import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const ModelCard = ({ model }) => {
  // Ajuste para pegar a imagem direto ou usar o placeholder (sem PocketBase)
  const imageUrl = model?.image || model?.foto_perfil_url || 'https://placehold.co/600x800/1f1f1f/ffffff?text=Sem+foto';

  const nomeArtistico = model?.name || model?.nome_artistico || 'Modelo';
  const bio = model?.description || model?.bio_completa || model?.bio_curta || 'Perfil em destaque na plataforma.';
  const precoHora = Number(model?.price || model?.preco_hora || 0);
  const creditos = Number(model?.credits || model?.creditos_por_hora || precoHora || 0);
  
  const categoria = Array.isArray(model?.badges) 
    ? model.badges[0] 
    : (Array.isArray(model?.categorias) ? model.categorias.join(', ') : model?.categorias || 'Destaque');
    
  const rating = model?.rating || null;
  const verificada = !!model?.verificada || !!model?.verified || true; // True temporário para ficar bonito
  const status = model?.status_aprovacao || null;

  return (
    <div className="bg-[#1F1F1F] rounded-xl overflow-hidden border border-white/5 hover:border-[#D946EF]/30 transition-all duration-300 shadow-lg hover:shadow-[0_8px_30px_rgba(217,70,239,0.15)] group flex flex-col h-full">
      <div className="relative h-[300px] overflow-hidden">
        <img
          src={imageUrl}
          alt={nomeArtistico}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F1F1F] via-transparent to-transparent opacity-90" />

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {status && (
            <Badge className="bg-[#D946EF] text-white hover:bg-[#D946EF] border-none shadow-md">
              {status}
            </Badge>
          )}

          <Badge
            variant="secondary"
            className="bg-black/50 backdrop-blur-md text-white border-white/10"
          >
            {categoria}
          </Badge>
        </div>

        {rating && (
          <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md rounded-full px-2 py-1 flex items-center gap-1 border border-white/10">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold text-white">{rating}</span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-white truncate">{nomeArtistico}</h3>
            {verificada && <CheckCircle2 className="w-4 h-4 text-[#D946EF]" />}
          </div>
        </div>

        <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-1">{bio}</p>

        <div className="flex items-end justify-between mb-5 pt-4 border-t border-white/10">
          <div>
            <p className="text-xs text-gray-500 mb-1">Valor por hora</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-[#D946EF]">R$ {precoHora}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-sm font-medium text-gray-300 bg-white/5 px-2 py-1 rounded-md">
              {creditos} créditos
            </span>
          </div>
        </div>

        <Button
          className="w-full bg-white/5 hover:bg-[#D946EF] text-white border border-white/10 hover:border-[#D946EF] transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(217,70,239,0.4)]"
          asChild
        >
          <Link href={`/modelo/${model.id}`}>Ver perfil</Link>
        </Button>
      </div>
    </div>
  );
};

export default ModelCard;