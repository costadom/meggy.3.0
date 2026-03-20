import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, History, PlusCircle, Ban, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import pb from '@/lib/pocketbaseClient.js';
import ClientHistoryModal from './ClientHistoryModal.jsx';
import AddCreditsModal from './AddCreditsModal.jsx';

const AdminClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  // Modals
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [creditsModalOpen, setCreditsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const conditions = [];
      
      if (statusFilter === 'Ativo') conditions.push("ativo = true");
      if (statusFilter === 'Inativo') conditions.push("ativo = false");
      
      if (searchTerm) {
        conditions.push(`(nome_completo ~ "${searchTerm}" || email ~ "${searchTerm}")`);
      }

      const options = {
        sort: '-created',
        $autoCancel: false
      };

      if (conditions.length > 0) {
        options.filter = conditions.join(" && ");
      }

      const res = await pb.collection('clientes').getList(page, 10, options);
      
      setClients(res.items);
      setTotalPages(res.totalPages);
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast({ title: "Erro", description: "Não foi possível carregar os clientes.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [page, searchTerm, statusFilter]);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await pb.collection('clientes').update(id, {
        ativo: !currentStatus
      }, { $autoCancel: false });
      toast({ title: "Sucesso", description: `Cliente ${!currentStatus ? 'ativado' : 'desativado'} com sucesso.` });
      fetchClients();
    } catch (error) {
      toast({ title: "Erro", description: "Erro ao alterar status do cliente.", variant: "destructive" });
    }
  };

  const openHistory = (client) => {
    setSelectedClient(client);
    setHistoryModalOpen(true);
  };

  const openAddCredits = (client) => {
    setSelectedClient(client);
    setCreditsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-white">Clientes</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[130px] bg-[#1F1F1F] border-white/10 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#1F1F1F] border-white/10 text-white">
              <SelectItem value="Todos">Todos</SelectItem>
              <SelectItem value="Ativo">Ativos</SelectItem>
              <SelectItem value="Inativo">Inativos</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Buscar nome ou email..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="pl-9 bg-[#1F1F1F] border-white/10 text-white"
            />
          </div>
        </div>
      </div>

      <div className="bg-[#1F1F1F] border border-white/10 rounded-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-black/20">
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-gray-400">Nome</TableHead>
              <TableHead className="text-gray-400">Email</TableHead>
              <TableHead className="text-gray-400">Telefone</TableHead>
              <TableHead className="text-gray-400">Saldo</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
              <TableHead className="text-right text-gray-400">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8"><Loader2 className="w-6 h-6 animate-spin mx-auto text-[#D946EF]" /></TableCell></TableRow>
            ) : clients.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">Nenhum cliente encontrado.</TableCell></TableRow>
            ) : (
              clients.map(client => (
                <TableRow key={client.id} className="border-white/10 hover:bg-white/5">
                  <TableCell className="text-white font-medium">{client.nome_completo}</TableCell>
                  <TableCell className="text-gray-400">{client.email}</TableCell>
                  <TableCell className="text-gray-400">{client.telefone || '-'}</TableCell>
                  <TableCell className="text-[#D946EF] font-bold">{client.saldo_creditos || 0} CR</TableCell>
                  <TableCell>
                    <Badge className={client.ativo ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}>
                      {client.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button onClick={() => openHistory(client)} size="sm" variant="outline" className="border-white/20 text-gray-300 hover:bg-white/10">
                      <History className="w-4 h-4 mr-1" /> Histórico
                    </Button>
                    <Button onClick={() => openAddCredits(client)} size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                      <PlusCircle className="w-4 h-4 mr-1" /> Créditos
                    </Button>
                    <Button onClick={() => handleToggleStatus(client.id, client.ativo)} size="sm" variant="outline" className={client.ativo ? "border-red-500/50 text-red-400 hover:bg-red-500/10" : "border-green-500/50 text-green-400 hover:bg-green-500/10"}>
                      <Ban className="w-4 h-4 mr-1" /> {client.ativo ? 'Desativar' : 'Ativar'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 p-4 border-t border-white/10 bg-black/20">
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="border-white/10 text-white">Anterior</Button>
            <span className="text-sm text-gray-400">Página {page} de {totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="border-white/10 text-white">Próxima</Button>
          </div>
        )}
      </div>

      <ClientHistoryModal 
        isOpen={historyModalOpen} 
        onClose={() => setHistoryModalOpen(false)} 
        clientId={selectedClient?.id} 
        clientName={selectedClient?.nome_completo} 
      />
      <AddCreditsModal 
        isOpen={creditsModalOpen} 
        onClose={() => setCreditsModalOpen(false)} 
        client={selectedClient} 
        onSuccess={fetchClients} 
      />
    </div>
  );
};

export default AdminClients;