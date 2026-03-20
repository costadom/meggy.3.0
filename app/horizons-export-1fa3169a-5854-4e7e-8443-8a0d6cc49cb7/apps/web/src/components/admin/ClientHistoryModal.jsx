import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';

const ClientHistoryModal = ({ isOpen, onClose, clientId, clientName }) => {
  const [activeTab, setActiveTab] = useState('agendamentos');
  const [agendamentos, setAgendamentos] = useState([]);
  const [creditos, setCreditos] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [tipoFilter, setTipoFilter] = useState('Todos');

  useEffect(() => {
    if (isOpen && clientId) {
      fetchData();
    }
  }, [isOpen, clientId, activeTab, statusFilter, tipoFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'agendamentos') {
        let filter = `cliente_id = "${clientId}"`;
        if (statusFilter !== 'Todos') filter += ` && status = "${statusFilter}"`;
        
        const res = await pb.collection('agendamentos').getFullList({
          filter,
          sort: '-data_agendamento',
          expand: 'modelo_id',
          $autoCancel: false
        });
        setAgendamentos(res);
      } else {
        let filter = `usuario_id = "${clientId}"`;
        if (tipoFilter !== 'Todos') filter += ` && tipo = "${tipoFilter}"`;
        
        const res = await pb.collection('creditos').getFullList({
          filter,
          sort: '-created',
          $autoCancel: false
        });
        setCreditos(res);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#1F1F1F] border-white/10 text-white max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Histórico do Cliente</DialogTitle>
          <DialogDescription className="text-gray-400">
            {clientName}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden mt-4">
          <TabsList className="bg-black/40 border border-white/10 w-full justify-start">
            <TabsTrigger value="agendamentos" className="data-[state=active]:bg-[#D946EF] data-[state=active]:text-white">Agendamentos</TabsTrigger>
            <TabsTrigger value="creditos" className="data-[state=active]:bg-[#D946EF] data-[state=active]:text-white">Créditos</TabsTrigger>
          </TabsList>

          <TabsContent value="agendamentos" className="flex-1 overflow-y-auto mt-4">
            <div className="flex justify-end mb-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] bg-black/20 border-white/10 text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-[#1F1F1F] border-white/10 text-white">
                  <SelectItem value="Todos">Todos</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Confirmado">Confirmado</SelectItem>
                  <SelectItem value="Concluido">Concluído</SelectItem>
                  <SelectItem value="Cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-[#D946EF]" /></div>
            ) : (
              <div className="border border-white/10 rounded-md">
                <Table>
                  <TableHeader className="bg-black/20">
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="text-gray-400">Modelo</TableHead>
                      <TableHead className="text-gray-400">Data</TableHead>
                      <TableHead className="text-gray-400">Hora</TableHead>
                      <TableHead className="text-gray-400">Duração</TableHead>
                      <TableHead className="text-gray-400">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {agendamentos.length === 0 ? (
                      <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500">Nenhum agendamento encontrado.</TableCell></TableRow>
                    ) : (
                      agendamentos.map(a => (
                        <TableRow key={a.id} className="border-white/10 hover:bg-white/5">
                          <TableCell>{a.expand?.modelo_id?.nome_artistico || 'N/A'}</TableCell>
                          <TableCell>{new Date(a.data_agendamento).toLocaleDateString()}</TableCell>
                          <TableCell>{a.hora_inicio}</TableCell>
                          <TableCell>{a.duracao_minutos} min</TableCell>
                          <TableCell>
                            <Badge className={
                              a.status === 'Concluido' ? 'bg-blue-500/20 text-blue-400' :
                              a.status === 'Confirmado' ? 'bg-green-500/20 text-green-400' :
                              a.status === 'Cancelado' ? 'bg-red-500/20 text-red-400' :
                              'bg-yellow-500/20 text-yellow-500'
                            }>{a.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="creditos" className="flex-1 overflow-y-auto mt-4">
            <div className="flex justify-end mb-4">
              <Select value={tipoFilter} onValueChange={setTipoFilter}>
                <SelectTrigger className="w-[180px] bg-black/20 border-white/10 text-white">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent className="bg-[#1F1F1F] border-white/10 text-white">
                  <SelectItem value="Todos">Todos</SelectItem>
                  <SelectItem value="Recarga">Recarga</SelectItem>
                  <SelectItem value="Consumo">Consumo</SelectItem>
                  <SelectItem value="Reembolso">Reembolso</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-[#D946EF]" /></div>
            ) : (
              <div className="border border-white/10 rounded-md">
                <Table>
                  <TableHeader className="bg-black/20">
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="text-gray-400">Data</TableHead>
                      <TableHead className="text-gray-400">Tipo</TableHead>
                      <TableHead className="text-gray-400">Descrição</TableHead>
                      <TableHead className="text-right text-gray-400">Quantidade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {creditos.length === 0 ? (
                      <TableRow><TableCell colSpan={4} className="text-center py-8 text-gray-500">Nenhuma transação encontrada.</TableCell></TableRow>
                    ) : (
                      creditos.map(c => (
                        <TableRow key={c.id} className="border-white/10 hover:bg-white/5">
                          <TableCell>{new Date(c.created).toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge className={
                              c.tipo === 'Recarga' ? 'bg-green-500/20 text-green-400' :
                              c.tipo === 'Reembolso' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-orange-500/20 text-orange-400'
                            }>{c.tipo}</Badge>
                          </TableCell>
                          <TableCell className="text-gray-400">{c.descricao}</TableCell>
                          <TableCell className={`text-right font-bold ${c.tipo === 'Consumo' ? 'text-orange-400' : 'text-green-400'}`}>
                            {c.tipo === 'Consumo' ? '-' : '+'}{c.quantidade} CR
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ClientHistoryModal;