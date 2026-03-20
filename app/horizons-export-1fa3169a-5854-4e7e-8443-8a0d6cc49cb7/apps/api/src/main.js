import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import Stripe from 'stripe';

import routes from './routes/index.js';
import { errorMiddleware } from './middleware/index.js';
import logger from './utils/logger.js';

const app = express();

// Initialize Stripe configuration
let stripeConfigured = false;
let stripe = null;

console.log('🔍 Verificando STRIPE_SECRET_KEY...');
console.log('STRIPE_SECRET_KEY carregada:', process.env.STRIPE_SECRET_KEY ? '✅ SIM' : '❌ NÃO');

if (process.env.STRIPE_SECRET_KEY) {
  try {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    stripeConfigured = true;
    console.log('✅ Stripe inicializado com sucesso');
    console.log('Stripe Status:', stripeConfigured ? '✅ Configurado' : '❌ Não configurado');
    app.locals.stripe = stripe;
  } catch (error) {
    console.log('❌ Erro ao inicializar Stripe:', error.message);
    console.log('Stripe Status:', stripeConfigured ? '✅ Configurado' : '❌ Não configurado');
    stripeConfigured = false;
  }
} else {
  console.log('❌ STRIPE_SECRET_KEY não configurada no .env');
  console.log('Stripe Status:', stripeConfigured ? '✅ Configurado' : '❌ Não configurado');
  stripeConfigured = false;
}

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection at:', promise, 'reason:', reason);
});

process.on('SIGINT', async () => {
  logger.info('Interrupted');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received');
  await new Promise(resolve => setTimeout(resolve, 3000));
  logger.info('Exiting');
  process.exit();
});

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', routes());

app.use(errorMiddleware);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  logger.info(`🚀 API Server running on http://localhost:${port}`);
});

export { stripe, stripeConfigured };
export default app;