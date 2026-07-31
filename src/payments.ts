export interface PaymentItem {
  price: number;
  quantity: number;
}

export interface CreatePaymentInput {
  amount: number;
  currency?: string;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: 'pending';
}

export function calculatePaymentTotal(items: PaymentItem[]): number {
  return items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
}

export function createPayment({
  amount,
  currency = 'KES'
}: CreatePaymentInput): Payment {
  if (!amount || amount <= 0) {
    throw new Error('Payment amount must be greater than 0');
  }

  return {
    id: `pay_${Date.now()}`,
    amount,
    currency,
    status: 'pending'
  };
}