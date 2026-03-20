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

const ClientSignupPage = () => {
  const [formData, setFormData] = useState({
    nome_completo: '',
    email: '',
    telefone: '',
    cidade: '',
    estado: '',
    password: '',
    passwordConfirm: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signupClient } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.passwordConfirm) {
      return setError('As senhas não coincidem.');
    }
    if (formData.password.length < 8) {
      return setError('A senha deve ter pelo menos 8 caracteres.');
    }

    setLoading(true);
    try {
      await signupClient(formData);
      navigate('/login-cliente', { state: { message: 'Cadastro realizado com sucesso! Faça login.' } });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Erro ao criar conta. O email pode já estar em uso.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col">
      <Helmet>
        <title>Cadastro de Cliente | Meggy</title>
      </Helmet>
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <Card className="w-full max-w-md bg-[#1F1F1F] border-white/10">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-white">Criar Conta</CardTitle>
            <CardDescription className="text-gray-400">
              Cadastre-se para agendar sessões com nossas modelos.
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
                <Label htmlFor="nome_completo" className="text-gray-300">Nome Completo</Label>
                <Input id="nome_completo" name="nome_completo" required value={formData.nome_completo} onChange={handleChange} className="bg-black/20 border-white/10 text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className="bg-black/20 border-white/10 text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefone" className="text-gray-300">Telefone</Label>
                  <Input id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} className="bg-black/20 border-white/10 text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado" className="text-gray-300">Estado (UF)</Label>
                  <Input id="estado" name="estado" maxLength={2} value={formData.estado} onChange={handleChange} className="bg-black/20 border-white/10 text-white uppercase" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cidade" className="text-gray-300">Cidade</Label>
                <Input id="cidade" name="cidade" value={formData.cidade} onChange={handleChange} className="bg-black/20 border-white/10 text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Senha</Label>
                <Input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} className="bg-black/20 border-white/10 text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passwordConfirm" className="text-gray-300">Confirmar Senha</Label>
                <Input id="passwordConfirm" name="passwordConfirm" type="password" required value={formData.passwordConfirm} onChange={handleChange} className="bg-black/20 border-white/10 text-white" />
              </div>
              <Button type="submit" className="w-full bg-[#D946EF] hover:bg-[#c026d3] text-white mt-6" disabled={loading}>
                {loading ? 'Criando conta...' : 'Cadastrar'}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-gray-400">
              Já tem uma conta? <Link to="/login-cliente" className="text-[#D946EF] hover:underline">Faça login</Link>
            </div>
            <div className="mt-4 text-center text-sm text-gray-400">
              Quer ser modelo? <Link to="/cadastro-modelo" className="text-[#D946EF] hover:underline">Cadastre-se aqui</Link>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ClientSignupPage;