import { createApp } from './app';

const PORT = Number(process.env.PORT) || 3001;
const APP_VERSION = process.env.APP_VERSION || 'v1.0.0-local';

const app = createApp();

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