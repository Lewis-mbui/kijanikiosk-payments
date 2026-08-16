import request from "supertest";

import { createApp } from "../src/app";

describe("kk-payments HTTP API", () => {
  const app = createApp();

  test("health endpoint returns a correlation ID", async () => {
    const response = await request(app).get("/health").expect(200);

    expect(response.headers["x-correlation-id"]).toBeDefined();

    expect(response.body.correlationId).toBe(
      response.headers["x-correlation-id"],
    );
  });

  test("preserves an incoming correlation ID", async () => {
    const correlationId = "capstone-test-123";

    const response = await request(app)
      .post("/payments")
      .set("x-correlation-id", correlationId)
      .send({
        amount: 500,
        currency: "KES",
      })
      .expect(201);

    expect(response.headers["x-correlation-id"]).toBe(correlationId);

    expect(response.body.correlationId).toBe(correlationId);
  });

  test("returns the same correlation ID on payment validation failure", async () => {
    const correlationId = "capstone-error-123";

    const response = await request(app)
      .post("/payments")
      .set("x-correlation-id", correlationId)
      .send({
        amount: 0,
      })
      .expect(400);

    expect(response.body.correlationId).toBe(correlationId);
  });
});
