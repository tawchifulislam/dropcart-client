'use client';

import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useRouter } from 'next/navigation';
import { type FormEvent, useState } from 'react';

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

interface FormProps {
  orderId: string;
  amountLabel: string;
}

function PaymentForm({ orderId, amountLabel }: FormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;
    setBusy(true);
    setError(null);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/complete?order=${orderId}`,
      },
      redirect: 'if_required',
    });

    if (result.error) {
      setError(result.error.message ?? 'Payment failed. Please try again.');
      setBusy(false);
      return;
    }
    router.push(`/checkout/complete?order=${orderId}`);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <PaymentElement />
      {error && (
        <p
          role="alert"
          className="rounded-control bg-live-wash p-3 text-sm font-bold"
        >
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={!stripe || busy}
        className="btn btn-reserve w-full"
      >
        {busy ? 'Processing...' : `Pay ${amountLabel}`}
      </button>
    </form>
  );
}

interface Props extends FormProps {
  clientSecret: string;
}

export function StripePayment({ clientSecret, orderId, amountLabel }: Props) {
  const [dark] = useState(
    () => document.documentElement.dataset.theme === 'dark',
  );

  if (!stripePromise) {
    return (
      <p
        role="alert"
        className="rounded-control bg-live-wash p-3 text-sm font-bold"
      >
        Stripe is not configured. Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.
      </p>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: dark ? 'night' : 'stripe',
          variables: {
            colorPrimary: dark ? '#8089FF' : '#2B35F0',
            colorBackground: dark ? '#161A3D' : '#FFFFFF',
            colorText: dark ? '#ECEEFF' : '#15173F',
            borderRadius: '10px',
          },
        },
      }}
    >
      <PaymentForm orderId={orderId} amountLabel={amountLabel} />
    </Elements>
  );
}
