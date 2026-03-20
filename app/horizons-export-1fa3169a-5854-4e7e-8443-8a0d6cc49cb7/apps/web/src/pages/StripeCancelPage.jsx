import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const StripeCancelPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-white p-4 animate-in fade-in zoom-in duration-500">
      <AlertTriangle className="w-24 h-24 text-yellow-500 mb-6" />
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Pagamento cancelado</h1>
      <p className="text-gray-400 text-lg mb-8 text-center max-w-md">
        O processo de pagamento foi interrompido. Nenhuma cobrança foi realizada. Tente novamente quando estiver pronto.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={() => navigate('/recarregar-creditos', { replace: true })} 
          className="bg-[#D946EF] hover:bg-[#c026d3] text-white px-8 py-6 text-lg rounded-xl"
        >
          Tentar Novamente
        </Button>
        <Button 
          onClick={() => navigate('/dashboard/cliente', { replace: true })} 
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl"
        >
          Voltar ao Painel
        </Button>
      </div>
    </div>
  );
};

export default StripeCancelPage;