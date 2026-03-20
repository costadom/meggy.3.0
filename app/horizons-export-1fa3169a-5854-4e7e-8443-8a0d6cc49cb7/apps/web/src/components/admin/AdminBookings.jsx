import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, XCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import pb from '@/lib/pocketbaseClient.js';
import { AgendamentoService } from '@/services/AgendamentoService.js';
import BookingDetailsModal from './BookingDetailsModal.jsx';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [periodFilter, setPeriodFilter] = useState('Todos');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const conditions = [];
      
      if (statusFilter !== 'Todos') {
        conditions.push(`status = "${statusFilter}"`);
      }
      
      if (periodFilter === '7days') {
        const d = new Date(); d.setDate(d.getDate() - 7);
        const dateStr = d.toISOString().replace('T', ' ').substring(0, 19);
        conditions.push(`data_agendamento >= "${dateStr}"`);
      } else if (periodFilter === '30days') {
        const d = new Date(); d.setDate(d.getDate() - 30);
        const dateStr = d.toISOString().replace('T', ' ').substring(0, 19);
        conditions.push(`data_agendamento >= "${dateStr}"`);
      }

      const options = {
        sort: '-created',
        expand: 'cliente_id,modelo_id',
        $autoCancel: false
      };

      if (conditions.length > 0) {
        options.filter = conditions.join(" && ");
      }

      const res = await pb.collection('agendamentos').getList(page, 10, options);
      
      let items = res.items;
      if (searchTerm) {
        const lowerSearch = searchTerm.toLowerCase();
        items = items.filter(b => 
          b.expand?.cliente_id?.nome_completo?.toLowerCase().includes(lowerSearch) ||
          b.expand?.modelo_id?.nome_artistico?.toLowerCase().includes(lowerSearch)
        );
      }

      setBookings(items);
      setTotalPages(res.totalPages);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast({ title: "Erro", description: "Não foi possível carregar os agendamentos.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [page, statusFilter, periodFilter, searchTerm]);

  const handleCancel = async (booking) => {
    if (!window.confirm('Tem certeza que deseja cancelar este agendamento?')) return;
    setActionLoading(booking.id);
    try {
      if (booking.status === 'Pendente') {
        await AgendamentoService.refuseAgendamento(booking.id);
      } else if (booking.status === 'Confirmado') {
        await AgendamentoService.cancelAgendamento(booking.id, booking.cliente_id);
      }
      toast({ title: "Sucesso", description: "Agendamento cancelado." });
      fetchBookings();
    } catch (error) {
      toast({ title: "Erro", description: error.message || "Erro ao cancelar.", variant: "destructive" });
    } finally {
      setActionLoading(null);
    }
  };

  const handleComplete = async (booking) => {
    if (!window.confirm('Marcar como concluído e transferir créditos para a modelo?')) return;
    setActionLoading(booking.id);
    try {
      await AgendamentoService.markAsCompleted(booking.id, booking.modelo_id);
      toast({ title: "Sucesso", description: "Agendamento concluído." });
      fetchBookings();
    } catch (error) {
      toast({ title: "Erro", description: error.message || "Erro ao concluir.", variant: "destructive" });
    } finally {
      setActionLoading(null);
    }
  };

  const openDetails = (booking) => {
    setSelectedBooking(booking);
    setDetailsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-white">Agendamentos</h2>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Select value={periodFilter} onValueChange={(v) => { setPeriodFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[140px] bg-[#1F1F1F] border-white/10 text-white">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent className="bg-[#1F1F1F] border-white/10 text-white">
              <SelectItem value="Todos">Todos</SelectItem>
              <SelectItem value="7days">Últimos 7 dias</SelectItem>
              <SelectItem value="30days">Últimos 30 dias</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[140px] bg-[#1F1F1F] border-white/10 text-white">
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
          <div className="relative flex-1 sm:w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Buscar..." 
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
              <TableHead className="text-gray-400">Cliente</TableHead>
              <TableHead className="text-gray-400">Modelo</TableHead>
              <TableHead className="text-gray-400">Data</TableHead>
              <TableHead className="text-gray-400">Hora</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
              <TableHead className="text-right text-gray-400">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8"><Loader2 className="w-6 h-6 animate-spin mx-auto text-[#D946EF]" /></TableCell></TableRow>
            ) : bookings.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">Nenhum agendamento encontrado.</TableCell></TableRow>
            ) : (
              bookings.map(booking => (
                <TableRow key={booking.id} className="border-white/10 hover:bg-white/5">
                  <TableCell className="text-white">{booking.expand?.cliente_id?.nome_completo || 'N/A'}</TableCell>
                  <TableCell className="text-white">{booking.expand?.modelo_id?.nome_artistico || 'N/A'}</TableCell>
                  <TableCell className="text-gray-400">{new Date(booking.data_agendamento).toLocaleDateString()}</TableCell>
                  <TableCell className="text-gray-400">{booking.hora_inicio}</TableCell>
                  <TableCell>
                    <Badge className={
                      booking.status === 'Concluido' ? 'bg-blue-500/20 text-blue-400' :
                      booking.status === 'Confirmado' ? 'bg-green-500/20 text-green-400' :
                      booking.status === 'Cancelado' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-500'
                    }>{booking.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button onClick={() => openDetails(booking)} size="sm" variant="outline" className="border-white/20 text-gray-300 hover:bg-white/10">
                      <Eye className="w-4 h-4" />
                    </Button>
                    {(booking.status === 'Pendente' || booking.status === 'Confirmado') && (
                      <Button 
                        onClick={() => handleCancel(booking)} 
                        disabled={actionLoading === booking.id}
                        size="sm" 
                        variant="outline" 
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                      >
                        {actionLoading === booking.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                      </Button>
                    )}
                    {booking.status === 'Confirmado' && (
                      <Button 
                        onClick={() => handleComplete(booking)} 
                        disabled={actionLoading === booking.id}
                        size="sm" 
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        {actionLoading === booking.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      </Button>
                    )}
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

      <BookingDetailsModal isOpen={detailsModalOpen} onClose={() => setDetailsModalOpen(false)} booking={selectedBooking} />
    </div>
  );
};

export default AdminBookings;