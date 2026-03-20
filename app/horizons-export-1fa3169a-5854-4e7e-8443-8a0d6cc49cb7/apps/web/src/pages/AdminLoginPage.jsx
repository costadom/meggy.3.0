import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Loader2, ShieldCheck as ShieldLock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { refreshUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Erro", description: "Preencha todos os campos.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      await pb.collection('admin_users').authWithPassword(email, password, { $autoCancel: false });
      await refreshUser();
      toast({ title: "Acesso Permitido", description: "Bem-vindo ao painel administrativo." });
      navigate('/admin/dashboard');
    } catch (error) {
      console.error("Admin login error:", error);
      toast({ 
        title: "Acesso Negado", 
        description: "Credenciais inválidas ou sem permissão de administrador.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-4">
      <Helmet>
        <title>Admin Login | Meggy</title>
      </Helmet>
      
      <Card className="w-full max-w-md bg-[#1F1F1F] border-white/10 shadow-2xl">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
            <ShieldLock className="w-8 h-8 text-[#D946EF]" />
          </div>
          <CardTitle className="text-2xl font-bold text-white tracking-tight">Acesso Restrito</CardTitle>
          <CardDescription className="text-gray-400">
            Área exclusiva para administradores da plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">E-mail Administrativo</label>
              <Input 
                type="email" 
                placeholder="admin@meggy.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-black/50 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-[#D946EF]"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Senha</label>
              <Input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-black/50 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-[#D946EF]"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-[#D946EF] hover:bg-[#c026d3] text-white py-6 mt-4"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              Entrar no Painel
            </Button>
          </form>
          
          <div className="mt-8 text-center">
            <button 
              onClick={() => navigate('/')}
              className="text-sm text-gray-500 hover:text-white transition-colors"
            >
              &larr; Voltar para o site
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLoginPage;