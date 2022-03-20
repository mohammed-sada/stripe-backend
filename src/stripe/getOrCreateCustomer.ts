import { firestore } from '../firebase';
import Stripe from 'stripe';
import { stripe } from '..';

export async function getOrCreateCustomer(
  userId: string,
  params?: Stripe.CustomerCreateParams
): Promise<Stripe.Customer> {
  const userSnapshot = await firestore.collection('users').doc(userId).get();
  const { stripeCustomerId, email, displayName } = userSnapshot.data();
  console.log(email);
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email,
      name: displayName,
      metadata: {
        firebaseUID: userId,
      },
      ...params,
    });
    await userSnapshot.ref.update({ stripeCustomerId: customer.id });
    return customer;
  } else {
    const customer = await stripe.customers.retrieve(stripeCustomerId);
    return customer as Stripe.Customer;
  }
}
