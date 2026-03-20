import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Eye, Check, X, Globe, AlertCircle } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import { useToast } from '@/hooks/use-toast';

const statusMap = {
  'Todos': null,
  'Em análise': 'Em análise',
  'Aprovada': 'Aprovada',
  'Publicada': 'Publicada',
  'Recusada': 'Recusada',
};

const AdminModelosAnalise = ({ defaultStatus = 'Em análise' }) => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState(defaultStatus);
  const [actionLoading, setActionLoading] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchModels = async () => {
    setLoading(true);
    setError(null);

    try {
      const options = {
        $autoCancel: false,
      };

      const dbStatus = statusMap[statusFilter];

      if (dbStatus) {
        options.filter = `status_aprovacao="${dbStatus}"`;
      }

      const records = await pb.collection('modelos').getFullList(options);

      const sortedRecords = Array.isArray(records)
        ? [...records].sort((a, b) => new Date(b.created || 0) - new Date(a.created || 0))
        : [];

      setModels(sortedRecords);
    } catch (err) {
      console.error('Error fetching models:', err);
      setModels([]);
      setError('Não foi possível carregar a lista de modelos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, [statusFilter]);

  useEffect(() => {
    setStatusFilter(defaultStatus);
  }, [defaultStatus]);

  const handleStatusUpdate = async (id, nextStatus) => {
    setActionLoading(id);

    try {
      let dataToUpdate = { status_aprovacao: nextStatus };

      if (nextStatus === 'Recusada') {
        const motivo = window.prompt('Por favor, informe o motivo da recusa:');
        if (motivo === null) {
          setActionLoading(null);
          return;
        }
        dataToUpdate.motivo_recusa = motivo;
      }

      await pb.collection('modelos').update(id, dataToUpdate, { $autoCancel: false });

      toast({
        title: 'Sucesso',
        description: 'Status atualizado com sucesso.',
      });

      fetchModels();
    } catch (err) {
      console.error('Error updating status:', err);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o status.',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Em análise':
        return <Badge className="bg-yellow-500/20 text-yellow-500">Em análise</Badge>;
      case 'Aprovada':
        return <Badge className="bg-blue-500/20 text-blue-400">Aprovada</Badge>;
      case 'Publicada':
        return <Badge className="bg-green-500/20 text-green-400">Publicada</Badge>;
      case 'Recusada':
        return <Badge className="bg-red-500/20 text-red-400">Recusada</Badge>;
      default:
        return <Badge>{status || '—'}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Gerenciamento de Modelos</h2>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px] bg-[#1F1F1F] border-white/10 text-white">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent className="bg-[#1F1F1F] border-white/10 text-white">
            <SelectItem value="Todos">Todos os Status</SelectItem>
            <SelectItem value="Em análise">Em análise</SelectItem>
            <SelectItem value="Aprovada">Aprovadas</SelectItem>
            <SelectItem value="Publicada">Publicadas</SelectItem>
            <SelectItem value="Recusada">Recusadas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-[#1F1F1F] border-white/10">
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader className="border-white/10 bg-black/20">
              <TableRow className="hover:bg-transparent border-white/10">
                <TableHead className="text-gray-400 w-16">Foto</TableHead>
                <TableHead className="text-gray-400">Nome</TableHead>
                <TableHead className="text-gray-400">Email</TableHead>
                <TableHead className="text-gray-400">Telefone</TableHead>
                <TableHead className="text-gray-400">CPF</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-right text-gray-400">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    <Loader2 className="w-8 h-8 animate-spin text-[#D946EF] mx-auto" />
                    <p className="text-gray-400 mt-2">Carregando modelos...</p>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-red-400">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                    {error}
                  </TableCell>
                </TableRow>
              ) : models.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500 py-10">
                    Nenhuma modelo encontrada nesse status.
                  </TableCell>
                </TableRow>
              ) : (
                models.map((model) => (
                  <TableRow
                    key={model.id}
                    className="border-white/10 hover:bg-white/5 cursor-pointer"
                    onClick={() => navigate(`/admin/modelos-detalhes/${model.id}`)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div className="w-10 h-10 rounded-full bg-black/50 overflow-hidden border border-white/10">
                        {model.foto_perfil_arquivo ? (
                          <img
                            src={pb.files.getUrl(model, model.foto_perfil_arquivo)}
                            alt="Perfil"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                            Sem foto
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="font-medium text-white">{model.nome_artistico || '—'}</div>
                      <div className="text-xs text-gray-500">{model.nome_completo || '—'}</div>
                    </TableCell>

                    <TableCell className="text-gray-300">{model.email || '—'}</TableCell>
                    <TableCell className="text-gray-300">{model.telefone || '—'}</TableCell>
                    <TableCell className="text-gray-300">{model.cpf || '—'}</TableCell>
                    <TableCell>{getStatusBadge(model.status_aprovacao)}</TableCell>

                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-white/20 text-white hover:bg-white/10"
                          onClick={() => navigate(`/admin/modelos-detalhes/${model.id}`)}
                        >
                          <Eye className="w-4 h-4 mr-1" /> Detalhes
                        </Button>

                        {model.status_aprovacao === 'Em análise' && (
                          <>
                            <Button
                              size="sm"
                              className="bg-blue-500 hover:bg-blue-600 text-white"
                              onClick={() => handleStatusUpdate(model.id, 'Aprovada')}
                              disabled={actionLoading === model.id}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleStatusUpdate(model.id, 'Recusada')}
                              disabled={actionLoading === model.id}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}

                        {model.status_aprovacao === 'Aprovada' && (
                          <Button
                            size="sm"
                            className="bg-green-500 hover:bg-green-600 text-white"
                            onClick={() => handleStatusUpdate(model.id, 'Publicada')}
                            disabled={actionLoading === model.id}
                          >
                            <Globe className="w-4 h-4 mr-1" /> Publicar
                          </Button>
                        )}

                        {model.status_aprovacao === 'Publicada' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
                            onClick={() => handleStatusUpdate(model.id, 'Aprovada')}
                            disabled={actionLoading === model.id}
                          >
                            Despublicar
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminModelosAnalise;