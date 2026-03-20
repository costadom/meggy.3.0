import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, Check, X, Globe, EyeOff, Download, AlertCircle } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import { useToast } from '@/hooks/use-toast';

const AdminModeloDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchModel = async () => {
    setLoading(true);
    setError(null);
    try {
      const record = await pb.collection('modelos').getOne(id, { $autoCancel: false });
      setModel(record);
    } catch (err) {
      console.error("Error fetching model details:", err);
      setError("Não foi possível carregar os detalhes desta modelo.");
      toast({ title: "Erro", description: "Modelo não encontrada.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchModel();
    }
  }, [id]);

  const handleStatusUpdate = async (status, publicada = false) => {
    setActionLoading(status);
    try {
      let dataToUpdate = { status_aprovacao: status, publicada: publicada };
      
      if (status === 'Recusada') {
        const motivo = window.prompt("Por favor, informe o motivo da recusa:");
        if (motivo === null) {
          setActionLoading(null);
          return; // Usuário cancelou
        }
        dataToUpdate.motivo_recusa = motivo;
      }

      await pb.collection('modelos').update(id, dataToUpdate, { $autoCancel: false });
      toast({ title: "Sucesso", description: `Status atualizado para ${status}.` });
      fetchModel(); // Recarrega os dados atualizados
    } catch (err) {
      console.error("Error updating status:", err);
      toast({ title: "Erro", description: "Não foi possível atualizar o status.", variant: "destructive" });
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-[#D946EF] mb-4" />
        <p className="text-gray-400">Carregando detalhes...</p>
      </div>
    );
  }

  if (error || !model) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Ops! Algo deu errado.</h2>
        <p className="text-gray-400 mb-6">{error || "Modelo não encontrada."}</p>
        <Button onClick={() => navigate('/admin/modelos-analise')} variant="outline" className="border-white/20 text-white">
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para a lista
        </Button>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Em análise': return <Badge className="bg-yellow-500/20 text-yellow-500 text-lg py-1 px-3">Em análise</Badge>;
      case 'Aprovada': return <Badge className="bg-blue-500/20 text-blue-400 text-lg py-1 px-3">Aprovada</Badge>;
      case 'Publicada': return <Badge className="bg-green-500/20 text-green-400 text-lg py-1 px-3">Publicada</Badge>;
      case 'Recusada': return <Badge className="bg-red-500/20 text-red-400 text-lg py-1 px-3">Recusada</Badge>;
      default: return <Badge>{status || '—'}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-10">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/admin/modelos-analise')} className="text-gray-400 hover:text-white">
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
        </Button>
        {getStatusBadge(model.status_aprovacao)}
      </div>

      {model.status_aprovacao === 'Recusada' && model.motivo_recusa && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
          <strong>Motivo da Recusa:</strong> {model.motivo_recusa}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Esquerda: Perfil e Ações */}
        <div className="space-y-6">
          <Card className="bg-[#1F1F1F] border-white/10 overflow-hidden">
            <div className="h-64 bg-black/50 relative">
              {model.foto_perfil_arquivo ? (
                <img src={pb.files.getUrl(model, model.foto_perfil_arquivo)} alt="Perfil" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">Sem foto de perfil</div>
              )}
            </div>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-white mb-1">{model.nome_artistico || '—'}</h2>
              <p className="text-gray-400 mb-6">{model.email || '—'}</p>
              
              <div className="space-y-3">
                {model.status_aprovacao === 'Em análise' && (
                  <>
                    <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white" onClick={() => handleStatusUpdate('Aprovada', false)} disabled={actionLoading !== null}>
                      {actionLoading === 'Aprovada' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />} Aprovar Cadastro
                    </Button>
                    <Button variant="destructive" className="w-full" onClick={() => handleStatusUpdate('Recusada', false)} disabled={actionLoading !== null}>
                      {actionLoading === 'Recusada' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <X className="w-4 h-4 mr-2" />} Recusar Cadastro
                    </Button>
                  </>
                )}
                
                {model.status_aprovacao === 'Aprovada' && (
                  <>
                    <Button className="w-full bg-green-500 hover:bg-green-600 text-white" onClick={() => handleStatusUpdate('Publicada', true)} disabled={actionLoading !== null}>
                      {actionLoading === 'Publicada' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Globe className="w-4 h-4 mr-2" />} Publicar no Site
                    </Button>
                    <Button variant="destructive" className="w-full" onClick={() => handleStatusUpdate('Recusada', false)} disabled={actionLoading !== null}>
                      {actionLoading === 'Recusada' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <X className="w-4 h-4 mr-2" />} Recusar Cadastro
                    </Button>
                  </>
                )}

                {model.status_aprovacao === 'Publicada' && (
                  <Button variant="outline" className="w-full border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10" onClick={() => handleStatusUpdate('Aprovada', false)} disabled={actionLoading !== null}>
                    {actionLoading === 'Aprovada' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />} Despublicar (Ocultar)
                  </Button>
                )}

                {model.status_aprovacao === 'Recusada' && (
                  <Button variant="outline" className="w-full border-blue-500/50 text-blue-400 hover:bg-blue-500/10" onClick={() => handleStatusUpdate('Aprovada', false)} disabled={actionLoading !== null}>
                    {actionLoading === 'Aprovada' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />} Reavaliar e Aprovar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna Direita: Dados e Documentos */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-[#1F1F1F] border-white/10">
            <CardHeader>
              <CardTitle>Dados Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-400">Nome Completo</p>
                <p className="font-medium text-white">{model.nome_completo || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">CPF</p>
                <p className="font-medium text-white">{model.cpf || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Data de Nascimento</p>
                <p className="font-medium text-white">{model.data_nascimento ? new Date(model.data_nascimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '—'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Telefone / WhatsApp</p>
                <p className="font-medium text-white">{model.telefone || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Localização</p>
                <p className="font-medium text-white">{model.cidade || '—'} - {model.estado || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Valor por Hora</p>
                <p className="font-medium text-[#D946EF]">R$ {model.preco_hora || '0'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-400">Biografia</p>
                <p className="font-medium text-white mt-1 bg-black/20 p-4 rounded-lg">{model.bio_completa || model.bio_curta || 'Sem biografia'}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1F1F1F] border-white/10">
            <CardHeader>
              <CardTitle>Documentos de Verificação</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-white/10 rounded-lg p-4 bg-black/20">
                <p className="font-medium text-white mb-3">Documento RG / CNH</p>
                {model.documento_rg ? (
                  <div className="flex flex-col gap-3">
                    <div className="h-40 bg-black/50 rounded flex items-center justify-center overflow-hidden">
                      {model.documento_rg.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                        <img src={pb.files.getUrl(model, model.documento_rg)} alt="RG" className="max-h-full object-contain" />
                      ) : (
                        <span className="text-gray-400">Arquivo PDF</span>
                      )}
                    </div>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href={pb.files.getUrl(model, model.documento_rg)} target="_blank" rel="noreferrer">
                        <Download className="w-4 h-4 mr-2" /> Visualizar / Baixar
                      </a>
                    </Button>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Não enviado</p>
                )}
              </div>

              <div className="border border-white/10 rounded-lg p-4 bg-black/20">
                <p className="font-medium text-white mb-3">Selfie com Documento (CPF)</p>
                {model.documento_cpf ? (
                  <div className="flex flex-col gap-3">
                    <div className="h-40 bg-black/50 rounded flex items-center justify-center overflow-hidden">
                      {model.documento_cpf.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                        <img src={pb.files.getUrl(model, model.documento_cpf)} alt="CPF" className="max-h-full object-contain" />
                      ) : (
                        <span className="text-gray-400">Arquivo PDF</span>
                      )}
                    </div>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href={pb.files.getUrl(model, model.documento_cpf)} target="_blank" rel="noreferrer">
                        <Download className="w-4 h-4 mr-2" /> Visualizar / Baixar
                      </a>
                    </Button>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Não enviado</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1F1F1F] border-white/10">
            <CardHeader>
              <CardTitle>Galeria de Fotos</CardTitle>
            </CardHeader>
            <CardContent>
              {model.galeria_fotos && model.galeria_fotos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {model.galeria_fotos.map((foto, index) => (
                    <a key={index} href={pb.files.getUrl(model, foto)} target="_blank" rel="noreferrer" className="block aspect-square rounded-lg overflow-hidden border border-white/10 hover:border-[#D946EF] transition-colors">
                      <img src={pb.files.getUrl(model, foto)} alt={`Galeria ${index + 1}`} className="w-full h-full object-cover" />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Nenhuma foto na galeria.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminModeloDetalhes;