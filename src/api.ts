import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { createCheckoutStripeSession } from './checkout';
export const app = express();

app.use(express.json());

app.use(cors({ origin: true }));

app.post(
  '/checkout',
  runAsync(async (req: Request, res: Response) => {
    res.json(await createCheckoutStripeSession(req.body.line_items));
  })
);

function runAsync(callback: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    callback(req, res, next).catch(next);
  };
}
