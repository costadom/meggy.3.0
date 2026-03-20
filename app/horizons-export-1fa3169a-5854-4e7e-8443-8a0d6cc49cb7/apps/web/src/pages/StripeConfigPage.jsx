import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Loader2, Key, ShieldCheck } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import apiServerClient from '@/lib/apiServerClient.js';

const StripeConfigPage = () => {
  const [secretKey, setSecretKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!secretKey.trim()) {
      toast({
        title: "Erro de validação",
        description: "A chave secreta não pode estar vazia.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setSuccessMessage('');

    try {
      const response = await apiServerClient.fetch('/config/stripe-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secretKey: secretKey.trim() })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao configurar Stripe');
      }

      toast({
        title: "Sucesso",
        description: "Configuração atualizada com sucesso.",
      });
      
      setSuccessMessage('Configuração atualizada com sucesso. Recarregando...');
      setSecretKey('');
      
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error("Error configuring Stripe:", error);
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao atualizar a chave.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0F0F] text-white">
      <Helmet>
        <title>Configuração do Stripe | Admin Meggy</title>
      </Helmet>
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
        <Card className="w-full max-w-md bg-[#1F1F1F] border-white/10">
          <CardHeader className="space-y-1 text-center pb-6">
            <div className="w-12 h-12 bg-[#D946EF]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-6 h-6 text-[#D946EF]" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">Configuração de Pagamento</CardTitle>
            <CardDescription className="text-gray-400">
              Insira a chave secreta do Stripe para habilitar pagamentos na plataforma.
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {successMessage && (
                <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-3 rounded-lg text-sm text-center mb-4">
                  {successMessage}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="secretKey" className="text-gray-300">Stripe Secret Key</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-4 w-4 text-gray-500" />
                  </div>
                  <Input
                    id="secretKey"
                    type="password"
                    placeholder="sk_test_... ou sk_live_..."
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    className="pl-10 bg-black/50 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-[#D946EF]"
                    disabled={loading || !!successMessage}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  A chave deve começar com <code className="bg-black/50 px-1 py-0.5 rounded">sk_test_</code> ou <code className="bg-black/50 px-1 py-0.5 rounded">sk_live_</code>.
                </p>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-[#D946EF] hover:bg-[#c026d3] text-white"
                disabled={loading || !!successMessage || !secretKey.trim()}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Configuração'
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default StripeConfigPage;