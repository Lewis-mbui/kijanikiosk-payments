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

const app = express();

const PORT = Number(process.env.PORT) || 3001;
const APP_VERSION = process.env.APP_VERSION || 'v1.0.0-local';

app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'kk-payments',
    version: APP_VERSION,
    port: PORT
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

const server = app.listen(PORT, () => {
  console.log(
    `kk-payments ${APP_VERSION} listening on port ${PORT}`
  );
});

function shutdown(signal: NodeJS.Signals): void {
  console.log(`${signal} received. Shutting down gracefully...`);

  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));