const {
  calculatePaymentTotal,
  createPayment
} = require('../src/payments');

test('calculates payment total', () => {
  const total = calculatePaymentTotal([
    { price: 100, quantity: 2 },
    { price: 50, quantity: 1 }
  ]);

  expect(total).toBe(250);
});

test('creates a pending payment', () => {
  const payment = createPayment({ amount: 500 });

  expect(payment.amount).toBe(500);
  expect(payment.currency).toBe('KES');
  expect(payment.status).toBe('pending');
});

test('rejects invalid payment amount', () => {
  expect(() => createPayment({ amount: 0 })).toThrow();
});

test('intentional failure', () => {
  expect(true).toBe(false);
});