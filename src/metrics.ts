import {
  collectDefaultMetrics,
  Counter,
  Registry,
} from "prom-client";

export const register = new Registry();

collectDefaultMetrics({
  register,
  prefix: "kk_payments_",
});

export const httpRequestsTotal = new Counter({
  name: "kk_payments_http_requests_total",
  help: "Total number of HTTP requests handled by kk-payments",
  labelNames: ["method", "route", "status_code"] as const,
  registers: [register],
});