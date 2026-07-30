const express = require('express');

const {
  calculatePaymentTotal,
  createPayment
} = require('./payments');

const app = express();

const PORT = process.env.PORT || 3001;
const APP_VERSION = process.env.APP_VERSION || 'v1.0.0-local';

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'kk-payments',
    version: APP_VERSION,
    port: Number(PORT)
  });
});

app.post('/payments', (req, res) => {
  try {
    const payment = createPayment(req.body);

    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
});

app.post('/payments/total', (req, res) => {
  try {
    const items = req.body.items || [];
    const total = calculatePaymentTotal(items);

    res.status(200).json({
      total,
      currency: 'KES'
    });
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
});

const server = app.listen(PORT, () => {
  console.log(
    `kk-payments ${APP_VERSION} listening on port ${PORT}`
  );
});

function shutdown(signal) {
  console.log(`${signal} received. Shutting down gracefully...`);

  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));