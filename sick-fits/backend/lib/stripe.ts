import Stripe from 'stripe';

const stripeConfig = new Stripe(process.env.STRIPE_SECRET || '', {
  apiVersion: '2024-04-10',
});

export default stripeConfig;
