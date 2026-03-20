import React, { useState, useEffect } from 'react';
import { format, addDays, startOfToday, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AgendaService } from '@/services/AgendaService.js';
import { useToast } from '@/hooks/use-toast';

const ScheduleCalendar = ({ modeloId, onSlotClick, viewMode = 'client' }) => {
  const today = startOfToday();
  const [selectedDate, setSelectedDate] = useState(today);
  const [slotsData, setSlotsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Generate next 7 days
  const days = Array.from({ length: 7 }).map((_, i) => addDays(today, i));

  // Standard time slots
  const timeSlots = [
    '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', 
    '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
  ];

  const fetchSlots = async () => {
    if (!modeloId) return;
    setLoading(true);
    try {
      const data = await AgendaService.getAvailableSlots(modeloId, today, addDays(today, 7));
      setSlotsData(data);
    } catch (error) {
      console.error("Error fetching slots:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a agenda.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [modeloId]);

  const handleSlotClick = async (time) => {
    const [hours] = time.split(':');
    const endHours = parseInt(hours) + 1;
    const horaFim = `${endHours.toString().padStart(2, '0')}:00`;

    if (viewMode === 'model') {
      try {
        await AgendaService.toggleSlotAvailability(modeloId, selectedDate, time, horaFim);
        await fetchSlots();
        toast({
          title: "Sucesso",
          description: "Disponibilidade atualizada.",
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: error.message || "Erro ao atualizar horário.",
          variant: "destructive"
        });
      }
    } else {
      // Client mode
      const slotInfo = getSlotInfo(time);
      if (slotInfo.status === 'Livre') {
        if (onSlotClick) {
          onSlotClick(selectedDate, time, horaFim);
        }
      }
    }
  };

  const getSlotInfo = (time) => {
    const dateStr = AgendaService.formatDateForPB(selectedDate);
    const slot = slotsData.find(s => s.data === dateStr && s.hora_inicio === time);
    
    if (!slot) {
      return { status: 'Indefinido', disponivel: false };
    }
    return { status: slot.tipo, disponivel: slot.disponivel };
  };

  const getSlotStyle = (time) => {
    const info = getSlotInfo(time);
    
    if (viewMode === 'model') {
      if (info.status === 'Livre') return 'bg-green-500/20 border-green-500/50 text-green-400 hover:bg-green-500/30';
      if (info.status === 'Ocupado') return 'bg-[#D946EF]/20 border-[#D946EF]/50 text-[#D946EF] cursor-not-allowed';
      if (info.status === 'Bloqueado') return 'bg-gray-500/20 border-gray-500/50 text-gray-400 hover:bg-gray-500/30';
      return 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'; // Indefinido -> treated as blocked/inactive until toggled
    } else {
      // Client view
      if (info.status === 'Livre') return 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20 cursor-pointer';
      return 'bg-white/5 border-transparent text-gray-600 cursor-not-allowed opacity-50';
    }
  };

  return (
    <div className="bg-[#1F1F1F] rounded-xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#D946EF]" />
          {viewMode === 'model' ? 'Gerenciar Agenda' : 'Horários Disponíveis'}
        </h3>
        {loading && <Loader2 className="w-5 h-5 animate-spin text-[#D946EF]" />}
      </div>

      {/* Days Scroll */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-4 scrollbar-hide snap-x">
        {days.map((day, idx) => {
          const isSelected = isSameDay(day, selectedDate);
          return (
            <button
              key={idx}
              onClick={() => setSelectedDate(day)}
              className={`
                flex flex-col items-center justify-center min-w-[70px] p-3 rounded-xl border transition-all snap-start
                ${isSelected 
                  ? 'bg-[#D946EF]/20 border-[#D946EF] text-[#D946EF]' 
                  : 'bg-black/20 border-white/5 text-gray-400 hover:border-white/20 hover:text-white'
                }
              `}
            >
              <span className="text-xs font-medium uppercase mb-1">
                {format(day, 'EEE', { locale: ptBR })}
              </span>
              <span className={`text-xl font-bold ${isSelected ? 'text-white' : ''}`}>
                {format(day, 'dd')}
              </span>
            </button>
          );
        })}
      </div>

      {/* Time Slots */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {timeSlots.map((time, idx) => {
          const info = getSlotInfo(time);
          const isDisabled = viewMode === 'client' && info.status !== 'Livre';
          
          return (
            <button
              key={idx}
              disabled={isDisabled || (viewMode === 'model' && info.status === 'Ocupado')}
              onClick={() => handleSlotClick(time)}
              className={`py-2 px-1 rounded-lg text-sm font-medium transition-all border ${getSlotStyle(time)}`}
            >
              {time}
            </button>
          );
        })}
      </div>

      {viewMode === 'model' && (
        <div className="mt-6 flex gap-4 text-xs text-gray-400 justify-center">
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-500/50"></div> Livre</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#D946EF]/50"></div> Ocupado</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-gray-500/50"></div> Bloqueado</div>
        </div>
      )}
    </div>
  );
};

export default ScheduleCalendar;