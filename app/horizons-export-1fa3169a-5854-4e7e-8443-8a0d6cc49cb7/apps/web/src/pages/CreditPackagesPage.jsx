import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, Zap, AlertTriangle } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { CreditService } from '@/services/CreditService.js';
import apiServerClient from '@/lib/apiServerClient.js';
import StripeCancelPage from './StripeCancelPage.jsx';

const CreditPackagesPage = () => {
  const [searchParams] = useSearchParams();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const [isStripeConfigured, setIsStripeConfigured] = useState(true);

  useEffect(() => {
    const checkStripeStatus = async () => {
      try {
        const res = await apiServerClient.fetch('/stripe/status');
        if (res.ok) {
          const data = await res.json();
          setIsStripeConfigured(data.configured);
        } else {
          setIsStripeConfigured(false);
        }
      } catch (error) {
        console.error("Error checking Stripe status:", error);
        setIsStripeConfigured(false);
      }
    };

    const fetchPackages = async () => {
      try {
        const data = await CreditService.getPackages();
        setPackages(data);
      } catch (error) {
        console.error("Error fetching packages:", error);
        toast({ title: "Erro", description: "Não foi possível carregar os pacotes.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    checkStripeStatus();
    fetchPackages();
  }, [toast]);

  if (searchParams.get('payment') === 'canceled' || searchParams.get('payment') === 'cancelled') {
    return (
      <div className="min-h-screen flex flex-col bg-[#0F0F0F] text-white">
        <Helmet><title>Pagamento Cancelado | Meggy</title></Helmet>
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <StripeCancelPage />
        </main>
        <Footer />
      </div>
    );
  }

  const handleBuy = async (pkg) => {
    if (!isStripeConfigured) return;
    
    setLoadingId(pkg.id);
    try {
      const response = await apiServerClient.fetch('/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: pkg.id,
          packageName: pkg.nome,
          credits: pkg.quantidade_creditos,
          priceInCents: Math.round(pkg.preco_final * 100),
          customerEmail: currentUser.email,
          successUrl: 'https://1fa3169a-5854-4e7e-8443-8a0d6cc49cb7.app-preview.com/dashboard/cliente?session_id={CHECKOUT_SESSION_ID}&payment=success',
          cancelUrl: 'https://1fa3169a-5854-4e7e-8443-8a0d6cc49cb7.app-preview.com/recarregar-creditos?payment=canceled'
        })
      });
      
      if (response.status === 503) {
        setIsStripeConfigured(false);
        toast({ 
          title: "Erro", 
          description: "Serviço temporariamente indisponível. Tente novamente mais tarde.", 
          variant: "destructive" 
        });
        return;
      }
      
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || err.message || 'Erro ao iniciar pagamento');
      }
      
      const data = await response.json();
      // Open Stripe Checkout in a new tab to bypass iframe restrictions
      window.open(data.url, '_blank');
    } catch (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0F0F] text-white">
      <Helmet>
        <title>Recarregar Créditos | Meggy</title>
      </Helmet>
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4">Escolha seu <span className="text-[#D946EF]">Pacote de Créditos</span></h1>
          <p className="text-gray-400 text-lg">
            Compre créditos para agendar sessões exclusivas com suas modelos favoritas. Pagamento rápido e seguro.
          </p>
        </div>

        {!isStripeConfigured && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 p-4 rounded-xl mb-8 text-center flex items-center justify-center gap-3 max-w-6xl mx-auto">
            <AlertTriangle className="w-6 h-6 flex-shrink-0" />
            <span className="font-medium">⚠️ Sistema de pagamento temporariamente indisponível. Tente novamente mais tarde.</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-[#D946EF]" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {packages.map((pkg) => (
              <Card key={pkg.id} className="bg-[#1F1F1F] border-white/10 relative overflow-hidden flex flex-col hover:border-[#D946EF]/50 transition-colors duration-300">
                {pkg.desconto_percentual > 0 && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-500 text-white border-none">
                      -{pkg.desconto_percentual}%
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl text-white">{pkg.nome}</CardTitle>
                  <div className="flex justify-center items-center gap-2 mt-4">
                    <Zap className="w-6 h-6 text-[#D946EF]" />
                    <span className="text-4xl font-bold text-white">{pkg.quantidade_creditos}</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">Créditos</p>
                </CardHeader>
                <CardContent className="text-center flex-1 flex flex-col justify-center py-6">
                  {pkg.desconto_percentual > 0 && (
                    <p className="text-gray-500 line-through text-sm mb-1">
                      R$ {pkg.preco_reais.toFixed(2).replace('.', ',')}
                    </p>
                  )}
                  <p className="text-3xl font-bold text-green-400">
                    R$ {pkg.preco_final.toFixed(2).replace('.', ',')}
                  </p>
                </CardContent>
                <CardFooter className="flex-col gap-3">
                  <Button 
                    onClick={() => handleBuy(pkg)} 
                    disabled={loadingId === pkg.id || !isStripeConfigured}
                    className={`w-full bg-[#D946EF] hover:bg-[#c026d3] text-white text-lg py-6 ${!isStripeConfigured ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {loadingId === pkg.id ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                    Comprar Agora
                  </Button>
                  {!isStripeConfigured && (
                    <p className="text-yellow-500/80 text-xs text-center font-medium">
                      ⚠️ Pagamento indisponível - Sistema em manutenção
                    </p>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CreditPackagesPage;