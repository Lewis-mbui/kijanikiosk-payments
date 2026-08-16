import crypto from "node:crypto";
import type { NextFunction, Request, Response } from "express";

export interface CorrelatedRequest extends Request {
  correlationId?: string;
}

export function correlationMiddleware(
  req: CorrelatedRequest,
  res: Response,
  next: NextFunction,
): void {
  const incomingCorrelationId = req.header("x-correlation-id")?.trim();

  const correlationId = incomingCorrelationId || crypto.randomUUID();

  req.correlationId = correlationId;

  res.setHeader("x-correlation-id", correlationId);

  next();
}
