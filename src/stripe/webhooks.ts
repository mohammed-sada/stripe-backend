import Stripe from 'stripe';
import { stripe } from '..';
import { firestore, arrayUnion, arrayRemove } from '../firebase';

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
  'customer.subscription.deleted': async (data: Stripe.Subscription) => {
    const customer = (await stripe.customers.retrieve(
      data.customer as string
    )) as Stripe.Customer;
    const userId = customer.metadata.firebaseUID;
    const userRef = firestore.collection('users').doc(userId);

    await userRef.update({
      activePlans: arrayRemove(data.items.data[0].plan.id),
    });
  },
  'customer.subscription.created': async (data: Stripe.Subscription) => {
    const customer = (await stripe.customers.retrieve(
      data.customer as string
    )) as Stripe.Customer;
    const userId = customer.metadata.firebaseUID;
    const userRef = firestore.collection('users').doc(userId);

    await userRef.update({
      activePlans: arrayUnion(data.items.data[0].plan.id),
    });
  },
  'invoice.payment_succeeded': async (data: Stripe.Invoice) => {
    // Add your business logic here
  },
  'invoice.payment_failed': async (data: Stripe.Invoice) => {
    const customer = (await stripe.customers.retrieve(
      data.customer as string
    )) as Stripe.Customer;
    const userId = customer.metadata.firebaseUID;
    const userSnapshot = await firestore.collection('users').doc(userId).get();
    await userSnapshot.ref.update({ status: 'PAST_DUE' });
  },
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
