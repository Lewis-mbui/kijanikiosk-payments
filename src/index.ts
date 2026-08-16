import { createApp } from "./app";
import { log } from "./logger";

const PORT = Number(process.env.PORT) || 3001;

const APP_VERSION = process.env.APP_VERSION || "v1.0.0-local";

const app = createApp();

const server = app.listen(PORT, () => {
  log("info", "service.started", {
    version: APP_VERSION,
    port: PORT,
  });
});

function shutdown(signal: NodeJS.Signals): void {
  log("info", "service.shutdown_requested", {
    signal,
  });

  server.close(() => {
    log("info", "service.stopped");
    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));

process.on("SIGINT", () => shutdown("SIGINT"));
