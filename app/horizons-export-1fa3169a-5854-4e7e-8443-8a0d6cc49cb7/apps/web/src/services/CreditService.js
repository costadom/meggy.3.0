import pb from '@/lib/pocketbaseClient.js';

export const CreditService = {
  async getPackages() {
    return await pb.collection('pacotes_creditos').getFullList({
      filter: 'ativo = true',
      sort: 'ordem',
      $autoCancel: false
    });
  },

  async getClientCredits(userId) {
    return await pb.collection('creditos').getFullList({
      filter: `usuario_id = "${userId}"`,
      sort: '-created',
      $autoCancel: false
    });
  },

  async updateClientBalance(userId, newBalance) {
    return await pb.collection('clientes').update(userId, {
      saldo_creditos: newBalance
    }, { $autoCancel: false });
  },

  async getClientBalance(clienteId) {
    const client = await pb.collection('clientes').getOne(clienteId, { $autoCancel: false });
    return client.saldo_creditos || 0;
  },

  async deductCredits(clienteId, amount, description, agendamentoId = null) {
    const client = await pb.collection('clientes').getOne(clienteId, { $autoCancel: false });
    
    if (client.saldo_creditos < amount) {
      throw new Error('Saldo de créditos insuficiente.');
    }

    const newBalance = client.saldo_creditos - amount;

    // Update client balance
    await pb.collection('clientes').update(clienteId, {
      saldo_creditos: newBalance
    }, { $autoCancel: false });

    // Create credit history record
    await pb.collection('creditos').create({
      usuario_id: clienteId,
      tipo: 'Consumo',
      quantidade: amount,
      descricao: description || 'Consumo de créditos',
      status: 'Concluido'
    }, { $autoCancel: false });

    return newBalance;
  },

  async refundCredits(clienteId, amount, description, agendamentoId = null) {
    const client = await pb.collection('clientes').getOne(clienteId, { $autoCancel: false });
    const newBalance = client.saldo_creditos + amount;

    // Update client balance
    await pb.collection('clientes').update(clienteId, {
      saldo_creditos: newBalance
    }, { $autoCancel: false });

    // Create credit history record
    await pb.collection('creditos').create({
      usuario_id: clienteId,
      tipo: 'Reembolso',
      quantidade: amount,
      descricao: description || 'Reembolso de créditos',
      status: 'Concluido'
    }, { $autoCancel: false });

    return newBalance;
  },

  async getCreditHistory(clienteId, filter = '') {
    let queryFilter = `usuario_id = "${clienteId}"`;
    if (filter) {
      queryFilter += ` && ${filter}`;
    }
    
    return await pb.collection('creditos').getFullList({
      filter: queryFilter,
      sort: '-created',
      $autoCancel: false
    });
  }
};