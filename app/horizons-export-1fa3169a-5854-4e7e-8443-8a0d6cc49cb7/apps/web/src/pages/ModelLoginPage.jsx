import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ModelLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginModel, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const authData = await loginModel(email, password);
      
      if (authData.record.status_aprovacao === 'Pendente' || authData.record.status_aprovacao === 'Recusada') {
        logout(); // Don't keep them logged in if not approved
        navigate('/modelo-confirmacao', { state: { status: authData.record.status_aprovacao } });
      } else {
        navigate('/dashboard/modelo');
      }
    } catch (err) {
      console.error(err);
      setError('Email ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col">
      <Helmet>
        <title>Login Modelo | Meggy</title>
      </Helmet>
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-[#1F1F1F] border-white/10">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-white">Painel da Modelo</CardTitle>
            <CardDescription className="text-gray-400">
              Faça login para gerenciar sua agenda e ganhos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4 bg-red-500/10 border-red-500/50 text-red-400">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="bg-black/20 border-white/10 text-white" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-300">Senha</Label>
                </div>
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="bg-black/20 border-white/10 text-white" />
              </div>
              <Button type="submit" className="w-full bg-[#D946EF] hover:bg-[#c026d3] text-white mt-6" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-gray-400">
              Ainda não é modelo? <Link to="/cadastro-modelo" className="text-[#D946EF] hover:underline">Cadastre-se</Link>
            </div>
            <div className="mt-4 text-center text-sm text-gray-400">
              É um cliente? <Link to="/login-cliente" className="text-[#D946EF] hover:underline">Login para Clientes</Link>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ModelLoginPage;