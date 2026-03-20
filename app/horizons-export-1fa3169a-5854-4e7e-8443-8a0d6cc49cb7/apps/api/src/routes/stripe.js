import 'dotenv/config';
import express from 'express';
import Stripe from 'stripe';
import { stripeConfigured } from '../main.js';
import logger from '../utils/logger.js';

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// GET /stripe/status - Check Stripe configuration status
router.get('/status', async (req, res) => {
  logger.info('Checking Stripe configuration status');
  res.json({
    configured: stripeConfigured,
    message: stripeConfigured ? 'Stripe configurado' : 'Stripe não configurado',
  });
});

// POST /stripe/create-checkout - Create Stripe checkout session
router.post('/create-checkout', async (req, res) => {
  logger.info('POST /stripe/create-checkout - Iniciando criação de sessão de checkout');

  // Check if Stripe is configured
  if (!stripeConfigured) {
    logger.warn('Stripe não configurado - retornando 503');
    return res.status(503).json({
      error: 'Stripe não configurado. Verifique STRIPE_SECRET_KEY no .env',
    });
  }

  const { packageId, packageName, credits, priceInCents, customerEmail, successUrl, cancelUrl } = req.body;

  logger.info(`Parâmetros recebidos: packageId=${packageId}, packageName=${packageName}, credits=${credits}, priceInCents=${priceInCents}, customerEmail=${customerEmail}`);

  if (!packageId || !packageName || !credits || !priceInCents || !customerEmail || !successUrl || !cancelUrl) {
    logger.warn('Campos obrigatórios faltando');
    return res.status(400).json({
      error: 'Missing required fields: packageId, packageName, credits, priceInCents, customerEmail, successUrl, cancelUrl',
    });
  }

  logger.info(`Criando sessão de checkout para pacote: ${packageId}, cliente: ${customerEmail}`);
  logger.info(`Success URL: ${successUrl}`);
  logger.info(`Cancel URL: ${cancelUrl}`);

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'brl',
          unit_amount: priceInCents,
          product_data: {
            name: packageName,
          },
        },
        quantity: 1,
      },
    ],
    customer_email: customerEmail,
    success_url: successUrl,
    cancel_url: cancelUrl,
    locale: 'pt-BR',
    metadata: {
      packageId,
      credits,
    },
  });

  logger.info(`Sessão de checkout criada com sucesso: ${session.id}`);

  res.json({ url: session.url });
});

// GET /stripe/session/:sessionId - Retrieve Stripe checkout session details
router.get('/session/:sessionId', async (req, res) => {
  logger.info('GET /stripe/session/:sessionId - Recuperando detalhes da sessão');

  // Check if Stripe is configured
  if (!stripeConfigured) {
    logger.warn('Stripe não configurado - retornando 503');
    return res.status(503).json({
      error: 'Stripe não configurado. Verifique STRIPE_SECRET_KEY no .env',
    });
  }

  const { sessionId } = req.params;

  logger.info(`sessionId recebido: ${sessionId}`);

  if (!sessionId) {
    logger.warn('sessionId não fornecido');
    return res.status(400).json({
      error: 'sessionId parameter is required',
    });
  }

  logger.info(`Recuperando sessão Stripe: ${sessionId}`);

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  logger.info(`Sessão recuperada com sucesso: ${sessionId}, status: ${session.payment_status}`);

  res.json({
    id: session.id,
    status: session.payment_status,
    amountTotal: session.amount_total,
    customerEmail: session.customer_details?.email,
  });
});

export default router;