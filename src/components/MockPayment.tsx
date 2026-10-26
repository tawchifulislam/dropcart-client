'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { HttpError, request } from '@/lib/browser-api';

interface Props {
  orderId: string;
  amountLabel: string;
}

const FIELDS = [
  { id: 'card', label: 'Card number', value: '4242 4242 4242 4242' },
  { id: 'expiry', label: 'Expiry', value: '12 / 34' },
  { id: 'cvc', label: 'CVC', value: '123' },
];

export function MockPayment({ orderId, amountLabel }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const pay = async () => {
    setBusy(true);
    setError(null);
    try {
      await request(`/orders/${orderId}/mock-confirm`, { method: 'POST' });
      router.push(`/checkout/complete?order=${orderId}`);
    } catch (caught) {
      setError(
        caught instanceof HttpError
          ? caught.message
          : 'Network error. Please try again.',
      );
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="rounded-control bg-upcoming-wash p-3 text-sm">
        <b>Test payment.</b> This demo uses a simulated card. No real money is
        charged.
      </p>
      <div className="grid grid-cols-2 gap-3">
        {FIELDS.map((field, index) => (
          <div key={field.id} className={index === 0 ? 'col-span-2' : ''}>
            <label htmlFor={field.id} className="mb-1 block text-sm font-bold">
              {field.label}
            </label>
            <input
              id={field.id}
              readOnly
              value={field.value}
              className="field"
            />
          </div>
        ))}
      </div>
      {error && (
        <p
          role="alert"
          className="rounded-control bg-live-wash p-3 text-sm font-bold"
        >
          {error}
        </p>
      )}
      <button
        type="button"
        onClick={pay}
        disabled={busy}
        className="btn btn-reserve w-full"
      >
        {busy ? 'Processing...' : `Pay ${amountLabel}`}
      </button>
    </div>
  );
}
