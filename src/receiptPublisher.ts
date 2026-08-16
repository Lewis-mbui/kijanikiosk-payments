import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { log } from "./logger";

const receiptBucket = process.env.RECEIPT_BUCKET;

const s3Endpoint = process.env.S3_ENDPOINT;

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "af-south-1",

  ...(s3Endpoint
    ? {
        endpoint: s3Endpoint,
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID || "S3RVER",
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "S3RVER",
        },
      }
    : {}),
});

export interface ReceiptEvent {
  paymentId: string;
  amount: number;
  currency: string;
  correlationId: string;
  createdAt: string;
}

export async function publishReceiptEvent(event: ReceiptEvent): Promise<void> {
  if (!receiptBucket) {
    log("warn", "receipt.publish_skipped", {
      correlationId: event.correlationId,
      reason: "RECEIPT_BUCKET is not configured",
    });

    return;
  }

  const key = `receipt-${event.paymentId}.json`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: receiptBucket,
      Key: key,
      ContentType: "application/json",
      Body: JSON.stringify(event),
    }),
  );

  log("info", "receipt.published", {
    correlationId: event.correlationId,
    paymentId: event.paymentId,
    bucket: receiptBucket,
    key,
  });
}
