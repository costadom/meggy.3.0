import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';

const StripeSuccessPage = () => {
  const navigate = useNavigate();
  const { currentUser, refreshUser } = useAuth();
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchBalance = async () => {
      if (currentUser) {
        try {
          // Wait a moment to ensure webhook has processed the payment
          await new Promise(resolve => setTimeout(resolve, 1500));
          await refreshUser();
          const client = await pb.collection('clientes').getOne(currentUser.id, { $autoCancel: false });
          if (isMounted) setBalance(client.saldo_creditos);
        } catch (error) {
          console.error("Error fetching updated balance:", error);
        }
      }
    };
    
    fetchBalance();

    const timer = setTimeout(() => {
      if (isMounted) navigate('/dashboard/cliente', { replace: true });
    }, 5000);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [currentUser, navigate, refreshUser]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-white p-4 animate-in fade-in zoom-in duration-500">
      <CheckCircle className="w-24 h-24 text-green-500 mb-6" />
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Créditos adicionados com sucesso!</h1>
      
      <div className="bg-[#1F1F1F] border border-white/10 rounded-2xl p-8 text-center mb-8 min-w-[300px]">
        <p className="text-gray-400 mb-2">Seu novo saldo é de</p>
        {balance !== null ? (
          <p className="text-5xl font-bold text-[#D946EF]">{balance} <span className="text-2xl text-gray-400">CR</span></p>
        ) : (
          <div className="flex justify-center py-2"><Loader2 className="w-8 h-8 animate-spin text-[#D946EF]" /></div>
        )}
      </div>

      <Button 
        onClick={() => navigate('/dashboard/cliente', { replace: true })} 
        className="bg-white text-black hover:bg-gray-200 px-8 py-6 text-lg rounded-xl"
      >
        Voltar para Dashboard
      </Button>
      <p className="text-gray-500 text-sm mt-6">Redirecionando automaticamente em alguns segundos...</p>
    </div>
  );
};

export default StripeSuccessPage;