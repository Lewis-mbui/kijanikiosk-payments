import express, {
  type Request,
  type Response
} from 'express';

import {
  calculatePaymentTotal,
  createPayment,
  type CreatePaymentInput,
  type PaymentItem
} from './payments';

export function createApp() {
  const app = express();

  app.use(express.json());

  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      service: 'kk-payments',
      version: process.env.APP_VERSION || 'v1.0.0-local',
      port: Number(process.env.PORT) || 3001
    });
  });

  app.post('/payments', (req: Request, res: Response) => {
    try {
      const input = req.body as CreatePaymentInput;
      const payment = createPayment(input);

      res.status(201).json(payment);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unknown error';

      res.status(400).json({
        error: message
      });
    }
  });

  app.post('/payments/total', (req: Request, res: Response) => {
    try {
      const body = req.body as { items?: PaymentItem[] };
      const total = calculatePaymentTotal(body.items ?? []);

      res.status(200).json({
        total,
        currency: 'KES'
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unknown error';

      res.status(400).json({
        error: message
      });
    }
  });

  return app;
}