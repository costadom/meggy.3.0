import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { validateCPF, formatCPF, formatPhone } from '@/lib/utils.js';
import { Loader2 } from 'lucide-react';

const ESTADOS_BR = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_DOC_SIZE = 10 * 1024 * 1024; // 10MB

const ModelSignupPage = () => {
  const [formData, setFormData] = useState({
    nome_artistico: '',
    nome_completo: '',
    email: '',
    telefone: '',
    cpf: '',
    data_nascimento: '',
    cidade: '',
    estado: '',
    bio_curta: '',
    bio_completa: '',
    preco_hora: '',
    password: '',
    passwordConfirm: ''
  });
  
  const [files, setFiles] = useState({
    foto_perfil_arquivo: null,
    documento_rg: null,
    documento_cpf: null,
    galeria_fotos: []
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signupModel } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    if (name === 'cpf') formattedValue = formatCPF(value);
    if (name === 'telefone') formattedValue = formatPhone(value);
    
    setFormData({ ...formData, [name]: formattedValue });
  };

  const handleStateChange = (value) => {
    setFormData({ ...formData, estado: value });
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (!selectedFiles.length) return;

    if (name === 'galeria_fotos') {
      const validFiles = Array.from(selectedFiles).filter(f => f.size <= MAX_FILE_SIZE);
      if (validFiles.length !== selectedFiles.length) {
        setError('Algumas fotos da galeria excedem o limite de 5MB e foram ignoradas.');
      }
      if (validFiles.length > 10) {
        setError('Máximo de 10 fotos na galeria.');
        return;
      }
      setFiles({ ...files, [name]: validFiles });
    } else {
      const file = selectedFiles[0];
      const maxSize = name.includes('documento') ? MAX_DOC_SIZE : MAX_FILE_SIZE;
      if (file.size > maxSize) {
        setError(`O arquivo ${file.name} excede o limite de tamanho permitido.`);
        return;
      }
      setFiles({ ...files, [name]: file });
    }
  };

  const validateForm = () => {
    if (!formData.nome_completo.trim()) return 'Nome completo é obrigatório.';
    if (!formData.nome_artistico.trim()) return 'Nome artístico é obrigatório.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Email inválido.';
    if (formData.telefone.replace(/\D/g, '').length < 10) return 'Telefone inválido. Use o formato (XX) 9XXXX-XXXX.';
    if (!validateCPF(formData.cpf)) return 'CPF inválido.';
    if (!formData.data_nascimento) return 'Data de nascimento é obrigatória.';
    if (!formData.cidade.trim()) return 'Cidade é obrigatória.';
    if (!formData.estado) return 'Estado é obrigatório.';
    if (formData.password !== formData.passwordConfirm) return 'As senhas não coincidem.';
    if (formData.password.length < 8) return 'A senha deve ter pelo menos 8 caracteres.';
    
    if (!files.foto_perfil_arquivo) return 'Foto de perfil é obrigatória.';
    if (!files.documento_rg) return 'Documento RG/CNH é obrigatório.';
    if (!files.documento_cpf) return 'Selfie com documento é obrigatória.';
    if (files.galeria_fotos.length === 0) return 'Envie pelo menos 1 foto para a galeria.';

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    try {
      const submitData = new FormData();
      
      // Append text fields
      Object.keys(formData).forEach(key => {
        if (key === 'cpf' || key === 'telefone') {
          submitData.append(key, formData[key].replace(/\D/g, ''));
        } else if (key === 'preco_hora') {
          const preco = Number(formData[key]) || 0;
          submitData.append(key, preco);
          submitData.append('custo_creditos', preco);
        } else {
          submitData.append(key, formData[key]);
        }
      });

      // Set initial status
      submitData.append('status_aprovacao', 'Em análise');
      submitData.append('publicada', false);

      // Append files
      if (files.foto_perfil_arquivo) submitData.append('foto_perfil_arquivo', files.foto_perfil_arquivo);
      if (files.documento_rg) submitData.append('documento_rg', files.documento_rg);
      if (files.documento_cpf) submitData.append('documento_cpf', files.documento_cpf);
      
      files.galeria_fotos.forEach(file => {
        submitData.append('galeria_fotos', file);
      });

      await signupModel(submitData);
      navigate('/modelo-confirmacao');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Erro ao criar conta. Verifique os dados e tente novamente.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col">
      <Helmet>
        <title>Cadastro de Modelo | Meggy</title>
      </Helmet>
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10 max-w-4xl">
        <Card className="bg-[#1F1F1F] border-white/10">
          <CardHeader className="space-y-1 text-center border-b border-white/10 pb-6">
            <CardTitle className="text-3xl font-bold text-white">Torne-se uma <span className="text-[#D946EF]">Modelo</span></CardTitle>
            <CardDescription className="text-gray-400 text-base">
              Preencha seus dados e envie seus documentos para análise.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {error && (
              <Alert variant="destructive" className="mb-6 bg-red-500/10 border-red-500/50 text-red-400">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Dados Pessoais */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-[#D946EF] border-b border-white/10 pb-2">Dados Pessoais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="nome_completo" className="text-gray-300">Nome Completo (Legal) *</Label>
                    <Input id="nome_completo" name="nome_completo" required value={formData.nome_completo} onChange={handleChange} className="bg-black/20 border-white/10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nome_artistico" className="text-gray-300">Nome Artístico *</Label>
                    <Input id="nome_artistico" name="nome_artistico" required value={formData.nome_artistico} onChange={handleChange} className="bg-black/20 border-white/10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cpf" className="text-gray-300">CPF *</Label>
                    <Input id="cpf" name="cpf" required value={formData.cpf} onChange={handleChange} maxLength={14} placeholder="000.000.000-00" className="bg-black/20 border-white/10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="data_nascimento" className="text-gray-300">Data de Nascimento *</Label>
                    <Input id="data_nascimento" name="data_nascimento" type="date" required value={formData.data_nascimento} onChange={handleChange} className="bg-black/20 border-white/10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300">Email *</Label>
                    <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className="bg-black/20 border-white/10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone" className="text-gray-300">Telefone / WhatsApp *</Label>
                    <Input id="telefone" name="telefone" required value={formData.telefone} onChange={handleChange} maxLength={15} placeholder="(00) 00000-0000" className="bg-black/20 border-white/10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cidade" className="text-gray-300">Cidade *</Label>
                    <Input id="cidade" name="cidade" required value={formData.cidade} onChange={handleChange} className="bg-black/20 border-white/10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estado" className="text-gray-300">Estado (UF) *</Label>
                    <Select value={formData.estado} onValueChange={handleStateChange} required>
                      <SelectTrigger className="bg-black/20 border-white/10 text-white">
                        <SelectValue placeholder="Selecione o Estado" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1F1F1F] border-white/10 text-white max-h-60">
                        {ESTADOS_BR.map(uf => (
                          <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Perfil e Valores */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-[#D946EF] border-b border-white/10 pb-2">Perfil e Valores</h3>
                <div className="space-y-2">
                  <Label htmlFor="preco_hora" className="text-gray-300">Valor por Hora (R$) (Opcional)</Label>
                  <Input id="preco_hora" name="preco_hora" type="number" min="1" value={formData.preco_hora} onChange={handleChange} className="bg-black/20 border-white/10 text-white w-full md:w-1/3" placeholder="Ex: 50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio_curta" className="text-gray-300">Descrição Curta (Resumo)</Label>
                  <Input id="bio_curta" name="bio_curta" maxLength={150} value={formData.bio_curta} onChange={handleChange} className="bg-black/20 border-white/10 text-white" placeholder="Ex: Especialista em Valorant e boas conversas" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio_completa" className="text-gray-300">Biografia Completa (Opcional)</Label>
                  <Textarea id="bio_completa" name="bio_completa" value={formData.bio_completa} onChange={handleChange} className="bg-black/20 border-white/10 text-white min-h-[120px]" placeholder="Conte mais sobre você..." />
                </div>
              </div>

              {/* Uploads */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-[#D946EF] border-b border-white/10 pb-2">Fotos e Documentos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="foto_perfil_arquivo" className="text-gray-300">Foto de Perfil (Rosto visível) *</Label>
                    <Input id="foto_perfil_arquivo" name="foto_perfil_arquivo" type="file" accept="image/jpeg, image/png" required onChange={handleFileChange} className="bg-black/20 border-white/10 text-white file:text-white file:bg-[#D946EF] file:border-0 file:rounded file:px-4 file:py-1 file:mr-4 cursor-pointer" />
                    <p className="text-xs text-gray-500">JPG ou PNG. Máx 5MB.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="galeria_fotos" className="text-gray-300">Galeria de Fotos (1 a 10 fotos) *</Label>
                    <Input id="galeria_fotos" name="galeria_fotos" type="file" accept="image/jpeg, image/png" multiple required onChange={handleFileChange} className="bg-black/20 border-white/10 text-white file:text-white file:bg-[#D946EF] file:border-0 file:rounded file:px-4 file:py-1 file:mr-4 cursor-pointer" />
                    <p className="text-xs text-gray-500">Selecione múltiplas fotos. Máx 5MB cada.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="documento_rg" className="text-gray-300">Documento de Identidade (RG/CNH) *</Label>
                    <Input id="documento_rg" name="documento_rg" type="file" accept="image/jpeg, image/png, application/pdf" required onChange={handleFileChange} className="bg-black/20 border-white/10 text-white file:text-white file:bg-gray-700 file:border-0 file:rounded file:px-4 file:py-1 file:mr-4 cursor-pointer" />
                    <p className="text-xs text-gray-500">Frente e verso legíveis. Máx 10MB.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="documento_cpf" className="text-gray-300">Selfie segurando o Documento *</Label>
                    <Input id="documento_cpf" name="documento_cpf" type="file" accept="image/jpeg, image/png, application/pdf" required onChange={handleFileChange} className="bg-black/20 border-white/10 text-white file:text-white file:bg-gray-700 file:border-0 file:rounded file:px-4 file:py-1 file:mr-4 cursor-pointer" />
                    <p className="text-xs text-gray-500">Rosto e documento devem estar nítidos. Máx 10MB.</p>
                  </div>
                </div>
              </div>

              {/* Senha */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-[#D946EF] border-b border-white/10 pb-2">Segurança</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-300">Senha *</Label>
                    <Input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} className="bg-black/20 border-white/10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passwordConfirm" className="text-gray-300">Confirmar Senha *</Label>
                    <Input id="passwordConfirm" name="passwordConfirm" type="password" required value={formData.passwordConfirm} onChange={handleChange} className="bg-black/20 border-white/10 text-white" />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full bg-[#D946EF] hover:bg-[#c026d3] text-white py-6 text-lg font-bold shadow-[0_0_15px_rgba(217,70,239,0.3)]" disabled={loading}>
                {loading ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Enviando Cadastro...</> : 'Enviar Cadastro para Análise'}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-gray-400">
              Já é modelo? <Link to="/login-modelo" className="text-[#D946EF] hover:underline">Faça login</Link>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ModelSignupPage;