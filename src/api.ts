import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';

import { verifyToken } from './middlewares/verifyToken';
import { runAsync } from './utils/runAsync';
import { validateUser } from './utils/validateUser';

import { createCheckoutStripeSession } from './stripe/checkout';
import { createPaymentIntent } from './stripe/payment';
import { stripeWebhookHandler } from './stripe/webHooks';
import { createSetupIntent, listPaymentmethods } from './stripe/customers';

export const app = express();

app.use(
  express.json({
    verify: (req, res, buffer) => (req['rawBody'] = buffer), // buffer body is needed for stripe webhook handling
  })
);

app.use(morgan('combined'));
app.use(cors({ origin: true }));
app.use(verifyToken);

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

app.post('/webhook', runAsync(stripeWebhookHandler));

app.post('/wallet', async (req: Request, res: Response) => {
  const user = validateUser(req);
  res.json(await createSetupIntent(user.uid));
});

app.get('/wallet', async (req: Request, res: Response) => {
  const user = validateUser(req);
  const paymentMethods = await listPaymentmethods(user.uid);
  res.json(paymentMethods.data); // array of payment methods
});
