import express, { type Response } from "express";

import {
  calculatePaymentTotal,
  createPayment,
  type CreatePaymentInput,
  type PaymentItem,
} from "./payments";

import { correlationMiddleware, type CorrelatedRequest } from "./correlation";

import { log } from "./logger";

export function createApp() {
  const app = express();

  app.use(correlationMiddleware);
  app.use(express.json());

  app.get("/health", (req: CorrelatedRequest, res: Response) => {
    res.status(200).json({
      status: "ok",
      service: "kk-payments",
      version: process.env.APP_VERSION || "v1.0.0-local",
      port: Number(process.env.PORT) || 3001,
      correlationId: req.correlationId,
    });
  });

  app.post("/payments", (req: CorrelatedRequest, res: Response) => {
    try {
      const input = req.body as CreatePaymentInput;

      const payment = createPayment(input);

      log("info", "payment.created", {
        correlationId: req.correlationId,
        paymentId: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
      });

      res.status(201).json({
        ...payment,
        correlationId: req.correlationId,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";

      log("warn", "payment.rejected", {
        correlationId: req.correlationId,
        reason: message,
      });

      res.status(400).json({
        error: message,
        correlationId: req.correlationId,
      });
    }
  });

  app.post("/payments/total", (req: CorrelatedRequest, res: Response) => {
    try {
      const body = req.body as { items?: PaymentItem[] };

      const total = calculatePaymentTotal(body.items ?? []);

      log("info", "payment.total_calculated", {
        correlationId: req.correlationId,
        itemCount: body.items?.length ?? 0,
        total,
        currency: "KES",
      });

      res.status(200).json({
        total,
        currency: "KES",
        correlationId: req.correlationId,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";

      log("warn", "payment.total_failed", {
        correlationId: req.correlationId,
        reason: message,
      });

      res.status(400).json({
        error: message,
        correlationId: req.correlationId,
      });
    }
  });

  return app;
}
