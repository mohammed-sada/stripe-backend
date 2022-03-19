import Stripe from 'stripe';
import { stripe } from '..';
import { getOrCreateCustomer } from './getOrCreateCustomer';
import { arrayRemove, arrayUnion, firestore } from '../firebase';

/*
1- Attaches a payment-method to a stripe customer
2- Subscribes the customer to a stripe plan
3- Sync the changres with Firestore
*/

export async function createSubscription(
  userId: string,
  payment_method: string,
  plan: string
) {
  const customer = await getOrCreateCustomer(userId);

  // attach the payment method to stripe customer, but you can seperate this action into a seperate endpoint
  await stripe.paymentMethods.attach(payment_method, { customer: customer.id });
  // update the customer default payment method to be current payment method, you can also seperate this action into a seperate endpoint
  await stripe.customers.update(customer.id, {
    invoice_settings: { default_payment_method: payment_method },
  });

  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ plan }],
    expand: ['latest_invoice.payment_intent'],
  });

  const latest_invoice = subscription.latest_invoice as Stripe.Invoice;
  const payment_intent = latest_invoice.payment_intent as Stripe.PaymentIntent;

  if (payment_intent.status === 'succeeded') {
    const userRef = firestore.collection('users').doc(userId);

    console.log(subscription.items.data[0].plan.id);
    await userRef.set(
      {
        stripeCustomerId: customer.id,
        activePlans: arrayUnion(plan),
      },
      { merge: true }
    );
  }

  return subscription;
}

/*
1- Cancel Subscription 
2- Sync the changres with Firestore
*/

export async function cancelSubscription(
  userId: string,
  subscriptionId: string
) {
  const customer = await getOrCreateCustomer(userId);

  if (customer.metadata.firebaseUID !== userId) {
    throw new Error(
      'You do not have the permission to cancel this subscription'
    );
  }
  const subscription = await stripe.subscriptions.del(subscriptionId); // cancel the subscription immediately

  // const subscription = await stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true }); // this approach have to be handled via a webhook

  if (subscription.status === 'canceled') {
    const userRef = firestore.collection('users').doc(userId);
    await userRef.update({
      activePlans: arrayRemove(subscription.items.data[0].plan.id),
    });
  }
  return subscription;
}

export async function listSubscriptions(userId: string) {
  const customer = await getOrCreateCustomer(userId);

  const subscriptions = await stripe.subscriptions.list({
    customer: customer.id,
  });
  return subscriptions;
}
