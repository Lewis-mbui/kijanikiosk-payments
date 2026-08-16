export interface LogFields {
  [key: string]: unknown;
}

export function log(
  level: 'info' | 'warn' | 'error',
  event: string,
  fields: LogFields = {}
): void {
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      service: 'kk-payments',
      event,
      ...fields
    })
  );
}