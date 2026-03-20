import pb from '@/lib/pocketbaseClient.js';
import { CreditService } from './CreditService.js';
import { AgendaService } from './AgendaService.js';

export const AgendamentoService = {
  async createAgendamento(clienteId, modeloId, data, horaInicio, duracaoMinutos, creditosGastos) {
    try {
      // 1. Deduct credits
      await CreditService.deductCredits(
        clienteId, 
        creditosGastos, 
        `Reserva com modelo`
      );

      // Calculate end time (simple logic for 60 mins)
      const [hours, mins] = horaInicio.split(':').map(Number);
      const endHours = hours + Math.floor(duracaoMinutos / 60);
      const horaFim = `${endHours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;

      // 2. Create Agendamento
      const agendamento = await pb.collection('agendamentos').create({
        cliente_id: clienteId,
        modelo_id: modeloId,
        data_agendamento: AgendaService.formatDateForPB(data),
        hora_inicio: horaInicio,
        hora_fim: horaFim,
        duracao_minutos: duracaoMinutos,
        creditos_gastos: creditosGastos,
        status: 'Pendente'
      }, { $autoCancel: false });

      // 3. Mark slot as occupied
      await AgendaService.markSlotAsOccupied(modeloId, data, horaInicio, horaFim);

      return agendamento;
    } catch (error) {
      console.error("Error creating agendamento:", error);
      throw new Error(error.message || "Erro ao criar agendamento.");
    }
  },

  async cancelAgendamento(agendamentoId, clienteId) {
    try {
      const agendamento = await pb.collection('agendamentos').getOne(agendamentoId, { $autoCancel: false });
      
      if (agendamento.status === 'Cancelado' || agendamento.status === 'Concluido') {
        throw new Error('Este agendamento não pode ser cancelado.');
      }

      // Check 24h rule if confirmed
      if (agendamento.status === 'Confirmado') {
        const agendamentoDate = new Date(agendamento.data_agendamento);
        const [hours, mins] = agendamento.hora_inicio.split(':');
        agendamentoDate.setHours(parseInt(hours), parseInt(mins), 0, 0);
        
        const diffHours = (agendamentoDate.getTime() - new Date().getTime()) / (1000 * 60 * 60);
        
        if (diffHours < 24) {
          throw new Error('Cancelamentos devem ser feitos com pelo menos 24 horas de antecedência.');
        }
      }

      // 1. Update status
      await pb.collection('agendamentos').update(agendamentoId, {
        status: 'Cancelado'
      }, { $autoCancel: false });

      // 2. Refund credits
      await CreditService.refundCredits(
        agendamento.cliente_id, 
        agendamento.creditos_gastos, 
        `Reembolso de cancelamento`
      );

      // 3. Free the slot
      await AgendaService.markSlotAsFree(
        agendamento.modelo_id, 
        new Date(agendamento.data_agendamento), 
        agendamento.hora_inicio, 
        agendamento.hora_fim
      );

      return true;
    } catch (error) {
      console.error("Error canceling agendamento:", error);
      throw new Error(error.message || "Erro ao cancelar agendamento.");
    }
  },

  async confirmAgendamento(agendamentoId) {
    try {
      return await pb.collection('agendamentos').update(agendamentoId, {
        status: 'Confirmado',
        data_confirmacao: new Date().toISOString()
      }, { $autoCancel: false });
    } catch (error) {
      console.error("Error confirming agendamento:", error);
      throw new Error(error.message || "Erro ao confirmar agendamento.");
    }
  },

  async refuseAgendamento(agendamentoId) {
    try {
      const agendamento = await pb.collection('agendamentos').getOne(agendamentoId, { $autoCancel: false });
      
      // 1. Update status
      await pb.collection('agendamentos').update(agendamentoId, {
        status: 'Cancelado'
      }, { $autoCancel: false });

      // 2. Refund credits to client
      await CreditService.refundCredits(
        agendamento.cliente_id, 
        agendamento.creditos_gastos, 
        `Reembolso: Reserva recusada pela modelo`
      );

      // 3. Free the slot
      await AgendaService.markSlotAsFree(
        agendamento.modelo_id, 
        new Date(agendamento.data_agendamento), 
        agendamento.hora_inicio, 
        agendamento.hora_fim
      );

      return true;
    } catch (error) {
      console.error("Error refusing agendamento:", error);
      throw new Error(error.message || "Erro ao recusar agendamento.");
    }
  },

  async markAsCompleted(agendamentoId, modeloId) {
    try {
      const agendamento = await pb.collection('agendamentos').getOne(agendamentoId, { $autoCancel: false });
      
      if (agendamento.status !== 'Confirmado') {
        throw new Error('Apenas agendamentos confirmados podem ser concluídos.');
      }

      // 1. Update status
      await pb.collection('agendamentos').update(agendamentoId, {
        status: 'Concluido'
      }, { $autoCancel: false });

      // 2. Add earnings to model
      const model = await pb.collection('modelos').getOne(modeloId, { $autoCancel: false });
      const newEarnings = (model.ganhos_totais || 0) + agendamento.creditos_gastos;
      
      await pb.collection('modelos').update(modeloId, {
        ganhos_totais: newEarnings
      }, { $autoCancel: false });

      return true;
    } catch (error) {
      console.error("Error marking agendamento as completed:", error);
      throw new Error(error.message || "Erro ao concluir agendamento.");
    }
  }
};