import Stripe from 'stripe';
import { stripe } from '..';

/*
 1- Validate the stripe webhook secret
 2- Call the handler for the event type
*/

// event types:
const webhookHandlers = {
  'payment_intent.succeeded': async (data: Stripe.PaymentIntent) => {
    // fullfil the user purchase
  },
  'payment_intent.payment_failed': async (data: Stripe.PaymentIntent) => {},
};

export async function stripeWebhookHandler(req, res) {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(
    // validate that this webhook req is coming from stripe API
    req.rawBody,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  try {
    await webhookHandlers[event.type](event.data.object);
    //  Object containing the API resource relevant to the event => PaymentIntent Object in this case

    res.status(200).send({ received: true });
  } catch (err: any) {
    console.log(err);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
}

// Webhooks provide a way to listen to diffreent events that happen at the stripe API
