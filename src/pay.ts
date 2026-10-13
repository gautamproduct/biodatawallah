import { CONFIG } from './config';

declare global {
  interface Window { Razorpay?: new (opts: Record<string, unknown>) => { open(): void; on(ev: string, cb: (r: unknown) => void): void } }
}

export const isDemoMode = () => !CONFIG.razorpayKeyId;

function loadCheckout(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Could not load Razorpay'));
    document.head.appendChild(s);
  });
}

export interface PaymentResult { paymentId: string }

/**
 * Opens Razorpay Checkout (UPI, cards, wallets).
 * TODO before scaling: create the order and verify the signature on a small server (e.g. a Cloudflare Worker).
 * A static site can only trust the browser's success callback.
 */
export async function pay(opts: { name: string; description: string; phone?: string }): Promise<PaymentResult> {
  await loadCheckout();
  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay!({
      key: CONFIG.razorpayKeyId,
      amount: CONFIG.price * 100,
      currency: 'INR',
      name: CONFIG.siteName,
      description: opts.description,
      prefill: { name: opts.name, contact: opts.phone ?? '' },
      theme: { color: '#7a1f2b' },
      config: { display: { preferences: { show_default_blocks: true } } },
      handler: (r: { razorpay_payment_id: string }) => resolve({ paymentId: r.razorpay_payment_id }),
      modal: { ondismiss: () => reject(new Error('dismissed')) },
    });
    rzp.on('payment.failed', () => reject(new Error('failed')));
    rzp.open();
  });
}
