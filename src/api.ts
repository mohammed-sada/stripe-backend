import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';

import { verifyToken } from './middlewares/verifyToken';
import { runAsync } from './utils/runAsync';
import { validateUser } from './utils/validateUser';

import { createCheckoutStripeSession } from './stripe/checkout';
import { createPaymentIntent } from './stripe/payment';
import { createSetupIntent, listPaymentmethods } from './stripe/customers';
import { stripeWebhookHandler } from './stripe/webHooks';
import {
  cancelSubscription,
  createSubscription,
  listSubscriptions,
} from './stripe/blilling';

export const app = express();

app.use(
  express.json({
    verify: (req, res, buffer) => (req['rawBody'] = buffer), // buffer body is needed for stripe webhook handling
  })
);

app.use(morgan('combined'));
app.use(cors({ origin: true }));
app.use(verifyToken);

app.post('/webhook', runAsync(stripeWebhookHandler));

app.post(
  '/checkout',
  runAsync(async (req: Request, res: Response) => {
    res.json(await createCheckoutStripeSession(req.body.line_items));
  })
);

app.post(
  '/payment',
  runAsync(async (req: Request, res: Response) => {
    res.json(await createPaymentIntent(req.body.amount));
  })
);

app.post('/wallet', async (req: Request, res: Response) => {
  // create a new payment-method for a specific customer for future use
  const user = validateUser(req);
  res.json(await createSetupIntent(user.uid));
});

app.get(
  '/wallet',
  runAsync(async (req: Request, res: Response) => {
    const user = validateUser(req);
    const paymentMethods = await listPaymentmethods(user.uid);
    res.json(paymentMethods.data); // array of payment methods
  })
);

app.get(
  '/subscriptions',
  runAsync(async (req: Request, res: Response) => {
    const user = validateUser(req);
    const subscriptions = await listSubscriptions(user.uid);
    res.json(subscriptions.data);
  })
);

app.post(
  '/subscriptions',
  runAsync(async (req: Request, res: Response) => {
    const user = validateUser(req);
    const { payment_method, plan } = req.body;
    const subscription = await createSubscription(
      user.uid,
      payment_method,
      plan
    );
    res.json(subscription);
  })
);

app.patch(
  '/subscriptions/:id',
  runAsync(async (req: Request, res: Response) => {
    const user = validateUser(req);
    const subscription = await cancelSubscription(user.uid, req.params.id);
    res.json(subscription);
  })
);
