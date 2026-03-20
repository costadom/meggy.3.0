import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const ModelConfirmationPage = () => {
  const location = useLocation();
  const status = location.state?.status || 'Pendente';

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col">
      <Helmet>
        <title>Status do Cadastro | Meggy</title>
      </Helmet>
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="bg-[#1F1F1F] border-white/10 max-w-md w-full text-center p-8">
          
          {status === 'Pendente' && (
            <>
              <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-10 h-10 text-yellow-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Cadastro em Análise</h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Recebemos seus dados com sucesso! Nossa equipe fará a análise do seu perfil em até 24-48 horas úteis. Você receberá um email com o resultado.
              </p>
            </>
          )}

          {status === 'Recusada' && (
            <>
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Cadastro Não Aprovado</h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Infelizmente seu perfil não atendeu aos nossos critérios no momento. Agradecemos o interesse.
              </p>
            </>
          )}

          <Button className="w-full bg-[#D946EF] hover:bg-[#c026d3] text-white" asChild>
            <Link to="/">Voltar para a Home</Link>
          </Button>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ModelConfirmationPage;