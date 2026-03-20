import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Check, X, Eye } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const AdminModelsAnalysis = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const { toast } = useToast();

  const fetchModels = async () => {
    try {
      // Using double quotes for the string value in the filter is the recommended PocketBase syntax
      const records = await pb.collection('modelos').getFullList({
        filter: 'status_aprovacao="Pendente"',
        sort: '-created',
        $autoCancel: false
      });
      setModels(records);
    } catch (error) {
      console.error("Error fetching models:", error);
      toast({ title: "Erro", description: "Não foi possível carregar as modelos.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    setActionLoading(id);
    try {
      await pb.collection('modelos').update(id, { status_aprovacao: status }, { $autoCancel: false });
      toast({ title: "Sucesso", description: `Modelo ${status.toLowerCase()} com sucesso.` });
      fetchModels();
    } catch (error) {
      console.error("Error updating status:", error);
      toast({ title: "Erro", description: "Não foi possível atualizar o status.", variant: "destructive" });
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-[#D946EF]" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in">
      <h2 className="text-2xl font-bold">Modelos em Análise</h2>
      <Card className="bg-[#1F1F1F] border-white/10">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="border-white/10 bg-black/20">
              <TableRow className="hover:bg-transparent border-white/10">
                <TableHead className="text-gray-400">Nome Artístico</TableHead>
                <TableHead className="text-gray-400">Email</TableHead>
                <TableHead className="text-gray-400">Data Cadastro</TableHead>
                <TableHead className="text-right text-gray-400">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {models.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500 py-8">Nenhuma modelo em análise.</TableCell>
                </TableRow>
              ) : (
                models.map(model => (
                  <TableRow key={model.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="font-medium text-white">{model.nome_artistico}</TableCell>
                    <TableCell className="text-gray-300">{model.email}</TableCell>
                    <TableCell className="text-gray-300">{new Date(model.created).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                              <Eye className="w-4 h-4 mr-1" /> Detalhes
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-[#1F1F1F] border-white/10 text-white max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Detalhes da Modelo</DialogTitle>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-4 py-4">
                              <div>
                                <p className="text-sm text-gray-400">Nome Completo</p>
                                <p className="font-medium">{model.nome_completo}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-400">Nome Artístico</p>
                                <p className="font-medium">{model.nome_artistico}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-400">Email</p>
                                <p className="font-medium">{model.email}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-400">Telefone</p>
                                <p className="font-medium">{model.telefone || '-'}</p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-sm text-gray-400">Bio</p>
                                <p className="font-medium">{model.bio_curta || '-'}</p>
                              </div>
                              {model.foto_perfil && (
                                <div className="col-span-2 mt-4">
                                  <p className="text-sm text-gray-400 mb-2">Foto de Perfil</p>
                                  <img src={pb.files.getUrl(model, model.foto_perfil)} alt="Perfil" className="w-32 h-32 object-cover rounded-lg border border-white/10" />
                                </div>
                              )}
                            </div>
                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/10">
                              <Button 
                                variant="destructive" 
                                onClick={() => handleStatusUpdate(model.id, 'Recusada')}
                                disabled={actionLoading === model.id}
                              >
                                {actionLoading === model.id ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <X className="w-4 h-4 mr-2" />}
                                Recusar
                              </Button>
                              <Button 
                                className="bg-green-500 hover:bg-green-600 text-white"
                                onClick={() => handleStatusUpdate(model.id, 'Aprovada')}
                                disabled={actionLoading === model.id}
                              >
                                {actionLoading === model.id ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                                Aprovar
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button 
                          size="sm" 
                          className="bg-green-500 hover:bg-green-600 text-white"
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

export default AdminModelsAnalysis;