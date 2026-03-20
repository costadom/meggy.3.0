import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const BookingDetailsModal = ({ isOpen, onClose, booking }) => {
  if (!booking) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#1F1F1F] border-white/10 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Detalhes do Agendamento</DialogTitle>
          <DialogDescription className="text-gray-400">
            ID: {booking.id}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg border border-white/5">
            <span className="text-gray-400">Status</span>
            <Badge className={
              booking.status === 'Concluido' ? 'bg-blue-500/20 text-blue-400' :
              booking.status === 'Confirmado' ? 'bg-green-500/20 text-green-400' :
              booking.status === 'Cancelado' ? 'bg-red-500/20 text-red-400' :
              'bg-yellow-500/20 text-yellow-500'
            }>{booking.status}</Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Cliente:</span>
              <span className="font-medium">{booking.expand?.cliente_id?.nome_completo || 'N/A'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Modelo:</span>
              <span className="font-medium">{booking.expand?.modelo_id?.nome_artistico || 'N/A'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Data:</span>
              <span className="font-medium">{new Date(booking.data_agendamento).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Horário:</span>
              <span className="font-medium">{booking.hora_inicio} - {booking.hora_fim}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Duração:</span>
              <span className="font-medium">{booking.duracao_minutos} min</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Créditos Gastos:</span>
              <span className="font-bold text-[#D946EF]">{booking.creditos_gastos} CR</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Criado em:</span>
              <span className="font-medium">{new Date(booking.created).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="bg-[#D946EF] hover:bg-[#c026d3] text-white w-full">
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDetailsModal;