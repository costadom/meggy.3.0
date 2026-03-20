import express from 'express';
import { stripeConfigured } from '../main.js';

const router = express.Router();

// GET /config/stripe-status - Check Stripe configuration status
// Returns whether Stripe is configured based on STRIPE_SECRET_KEY in process.env
router.get('/stripe-status', async (req, res) => {
  res.json({
    stripeConfigured,
  });
});

export default router;