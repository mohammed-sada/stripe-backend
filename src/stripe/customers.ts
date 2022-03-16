import { stripe } from '..';
import { getOrCreateCustomer } from './getOrCreateCustomer';

export async function createSetupIntent(userId: string) {
  const customer = await getOrCreateCustomer(userId);
  return stripe.setupIntents.create({
    customer: customer.id,
  });
}

export async function listPaymentmethods(uesrId: string) {
  const customer = await getOrCreateCustomer(uesrId);
  return stripe.paymentMethods.list({
    customer: customer.id,
    type: 'card',
  });
}
