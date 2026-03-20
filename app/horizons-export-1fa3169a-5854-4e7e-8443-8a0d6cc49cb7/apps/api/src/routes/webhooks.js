import 'dotenv/config';
import express from 'express';
import Stripe from 'stripe';
import { stripeConfigured } from '../main.js';
import pb from '../utils/pocketbase.js';
import logger from '../utils/logger.js';

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /webhooks/stripe - Handle Stripe webhook events
// No authentication required (Stripe webhooks must be publicly accessible)
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  logger.info('POST /webhooks/stripe - Recebendo webhook do Stripe');

  // Check if Stripe is configured
  if (!stripeConfigured) {
    logger.warn('Stripe não configurado - retornando 503');
    return res.status(503).json({
      error: 'Stripe não configurado. Verifique STRIPE_SECRET_KEY no .env',
    });
  }

  let event;

  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  logger.info(`Stripe signature presente: ${sig ? '✅ SIM' : '❌ NÃO'}`);
  logger.info(`Webhook secret configurado: ${endpointSecret ? '✅ SIM' : '❌ NÃO'}`);

  if (sig && endpointSecret) {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    logger.info(`Evento construído com verificação de assinatura: ${event.type}`);
  } else {
    event = JSON.parse(req.body.toString());
    logger.info(`Evento construído sem verificação de assinatura: ${event.type}`);
  }

  logger.info(`Webhook recebido: ${event.type}`);

  // Handle checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const packageId = session.metadata.packageId;
    const clientId = session.metadata.clientId;
    const quantidade_creditos = parseInt(session.metadata.quantidade_creditos, 10);
    const sessionId = session.id;

    logger.info(`Processando conclusão de checkout: sessionId=${sessionId}, clientId=${clientId}`);

    // Fetch client
    const clientRecord = await pb.collection('clientes').getOne(clientId);
    logger.info(`Cliente recuperado: ${clientId}`);

    // Fetch package details
    const packageRecord = await pb.collection('pacotes_creditos').getOne(packageId);
    logger.info(`Pacote recuperado: ${packageId}`);

    // Update client credits
    const currentBalance = clientRecord.saldo_creditos || 0;
    await pb.collection('clientes').update(clientId, {
      saldo_creditos: currentBalance + quantidade_creditos,
    });

    logger.info(`Créditos atualizados para cliente ${clientId}: ${currentBalance} + ${quantidade_creditos} = ${currentBalance + quantidade_creditos}`);

    // Create transaction record
    await pb.collection('creditos').create({
      cliente_id: clientId,
      tipo: 'Recarga',
      quantidade: quantidade_creditos,
      valor_reais: packageRecord.preco_final,
      descricao: `Recarga via Stripe - ${packageRecord.nome}`,
      status: 'Concluído',
      stripe_session_id: sessionId,
    });

    logger.info(`Registro de transação criado: ${sessionId}`);
  }

  // Return 200 OK for all events
  res.status(200).json({ received: true });
});

export default router;