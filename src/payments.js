function calculatePaymentTotal(items) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

function createPayment({ amount, currency = 'KES' }) {
  if (!amount || amount <= 0) {
    throw new Error('Payment amount must be greater than zero');
  }

  return {
    id: `pay_${Date.now()}`,
    amount,
    currency,
    status: 'pending'
  };
}

module.exports = {
  calculatePaymentTotal,
  createPayment
};
