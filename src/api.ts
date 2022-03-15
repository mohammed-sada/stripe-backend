import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { createCheckoutStripeSession } from './stripe/checkout';
import { createPaymentIntent } from './stripe/payment';
import { stripeWebhookHandler } from './stripe/webHooks';

export const app = express();

app.use(
  express.json({
    verify: (req, res, buffer) => (req['rawBody'] = buffer), // buffer body is needed for stripe webhook handling
  })
);

app.use(cors({ origin: true }));

app.post(
  '/checkout',
  runAsync(async ({ body }: Request, res: Response) => {
    res.json(await createCheckoutStripeSession(body.line_items));
  })
);
app.post(
  '/payment',
  runAsync(async ({ body }: Request, res: Response) => {
    res.json(await createPaymentIntent(body.amount));
  })
);
app.post('/webhook', runAsync(stripeWebhookHandler));

function runAsync(callback: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    callback(req, res, next).catch(next);
  };
}
