import { Router } from 'express';
import healthCheck from './health-check.js';
import stripeRouter from './stripe.js';
import webhooksRouter from './webhooks.js';
import configRouter from './config.js';

const router = Router();

export default () => {
  router.get('/health', healthCheck);
  router.use('/stripe', stripeRouter);
  router.use('/webhooks', webhooksRouter);
  router.use('/config', configRouter);

  return router;
};