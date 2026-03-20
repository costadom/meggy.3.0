import pb from '@/lib/pocketbaseClient.js';
import { format, addDays } from 'date-fns';

export const AgendaService = {
  // Helper to format date for PB
  formatDateForPB(date) {
    return format(date, "yyyy-MM-dd 12:00:00.000'Z'");
  },

  async getAvailableSlots(modeloId, startDate, endDate) {
    const startStr = this.formatDateForPB(startDate);
    const endStr = this.formatDateForPB(endDate || addDays(startDate, 7));

    return await pb.collection('agenda_disponibilidade').getFullList({
      filter: `modelo_id = "${modeloId}" && data >= "${startStr}" && data <= "${endStr}"`,
      $autoCancel: false
    });
  },

  async markSlotAsOccupied(modeloId, date, horaInicio, horaFim) {
    const dateStr = this.formatDateForPB(date);
    
    // Find existing slot
    const slots = await pb.collection('agenda_disponibilidade').getFullList({
      filter: `modelo_id = "${modeloId}" && data = "${dateStr}" && hora_inicio = "${horaInicio}"`,
      $autoCancel: false
    });

    if (slots.length > 0) {
      return await pb.collection('agenda_disponibilidade').update(slots[0].id, {
        disponivel: false,
        tipo: 'Ocupado'
      }, { $autoCancel: false });
    } else {
      return await pb.collection('agenda_disponibilidade').create({
        modelo_id: modeloId,
        data: dateStr,
        hora_inicio: horaInicio,
        hora_fim: horaFim,
        disponivel: false,
        tipo: 'Ocupado'
      }, { $autoCancel: false });
    }
  },

  async markSlotAsFree(modeloId, date, horaInicio, horaFim) {
    const dateStr = this.formatDateForPB(date);
    
    const slots = await pb.collection('agenda_disponibilidade').getFullList({
      filter: `modelo_id = "${modeloId}" && data = "${dateStr}" && hora_inicio = "${horaInicio}"`,
      $autoCancel: false
    });

    if (slots.length > 0) {
      return await pb.collection('agenda_disponibilidade').update(slots[0].id, {
        disponivel: true,
        tipo: 'Livre'
      }, { $autoCancel: false });
    } else {
      return await pb.collection('agenda_disponibilidade').create({
        modelo_id: modeloId,
        data: dateStr,
        hora_inicio: horaInicio,
        hora_fim: horaFim,
        disponivel: true,
        tipo: 'Livre'
      }, { $autoCancel: false });
    }
  },

  async toggleSlotAvailability(modeloId, date, horaInicio, horaFim) {
    const dateStr = this.formatDateForPB(date);
    
    const slots = await pb.collection('agenda_disponibilidade').getFullList({
      filter: `modelo_id = "${modeloId}" && data = "${dateStr}" && hora_inicio = "${horaInicio}"`,
      $autoCancel: false
    });

    if (slots.length > 0) {
      const slot = slots[0];
      // If it's occupied by a booking, don't allow toggle
      if (slot.tipo === 'Ocupado') {
        throw new Error('Não é possível alterar um horário já reservado.');
      }
      
      const isNowAvailable = !slot.disponivel;
      return await pb.collection('agenda_disponibilidade').update(slot.id, {
        disponivel: isNowAvailable,
        tipo: isNowAvailable ? 'Livre' : 'Bloqueado'
      }, { $autoCancel: false });
    } else {
      // Create as available by default when toggled first time
      return await pb.collection('agenda_disponibilidade').create({
        modelo_id: modeloId,
        data: dateStr,
        hora_inicio: horaInicio,
        hora_fim: horaFim,
        disponivel: true,
        tipo: 'Livre'
      }, { $autoCancel: false });
    }
  }
};