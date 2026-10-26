'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { HttpError, request } from '@/lib/browser-api';
import { formatPrice } from '@/lib/format';
import type { OrderView } from '@/lib/types';
import { useAuth } from './AuthProvider';
import { Container } from './Container';
import { Skeleton } from './Skeleton';

const POLL_MS = 1500;
const MAX_ATTEMPTS = 20;

const MESSAGES: Record<
  Exclude<OrderView['status'], 'pending' | 'paid'>,
  { title: string; body: string }
> = {
  cancelled: {
    title: 'This payment was cancelled',
    body: 'The reservation ended before the payment went through. You were not charged.',
  },
  refunded: {
    title: 'Your payment was refunded',
    body: 'Your payment arrived after the hold ended and the unit was no longer available, so we returned your money.',
  },
  refund_failed: {
    title: 'Something went wrong with your payment',
    body: 'We could not complete the refund automatically. Please contact support with your order number.',
  },
};

export function CheckoutComplete({ orderId }: { orderId: string }) {
  const router = useRouter();
  const { user, status } = useAuth();
  const [order, setOrder] = useState<OrderView | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'ready' && !user) {
      router.replace(
        `/login?next=${encodeURIComponent(`/checkout/complete?order=${orderId}`)}`,
      );
    }
  }, [status, user, router, orderId]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    let attempts = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const poll = async () => {
      try {
        const next = await request<OrderView>(`/orders/${orderId}/sync`, {
          method: 'POST',
        });
        if (cancelled) return;
        setOrder(next);
        if (next.status !== 'pending') return;
      } catch (caught) {
        if (!cancelled) {
          setError(
            caught instanceof HttpError
              ? caught.message
              : 'Network error. Please try again.',
          );
        }
        return;
      }
      attempts += 1;
      if (attempts >= MAX_ATTEMPTS) {
        if (!cancelled) setTimedOut(true);
        return;
      }
      timer = setTimeout(poll, POLL_MS);
    };

    void poll();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [user, orderId]);

  let content;
  if (error) {
    content = (
      <p role="alert" className="rounded-control bg-live-wash p-3 font-bold">
        {error}
      </p>
    );
  } else if (!order) {
    content = <Skeleton className="h-40 w-full" />;
  } else if (order.status === 'paid') {
    content = (
      <div className="ticket p-6">
        <span className="badge badge-ok">Paid</span>
        <h2 className="display mt-3 text-2xl">Payment received</h2>
        <p className="text-ink-soft mt-2">
          {order.product
            ? `${order.product.name} is yours.`
            : 'Your order is confirmed.'}{' '}
          You paid {formatPrice(order.amount)}.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/account" className="btn btn-primary">
            View my account
          </Link>
          <Link href="/drops" className="btn">
            Keep shopping
          </Link>
        </div>
      </div>
    );
  } else if (order.status === 'pending') {
    content = (
      <div className="ticket p-6" role="status">
        <h2 className="display text-2xl">
          {timedOut ? 'Still processing' : 'Confirming your payment'}
        </h2>
        <p className="text-ink-soft mt-2">
          {timedOut
            ? 'Your payment is taking longer than usual. It will appear on your account page as soon as it is confirmed.'
            : 'This usually takes a few seconds. Please do not close this page.'}
        </p>
        {timedOut && (
          <Link href="/account" className="btn mt-4">
            Go to my account
          </Link>
        )}
      </div>
    );
  } else {
    const message = MESSAGES[order.status];
    content = (
      <div className="ticket p-6">
        <h2 className="display text-2xl">{message.title}</h2>
        <p className="text-ink-soft mt-2">{message.body}</p>
        <Link href="/drops" className="btn mt-4">
          Back to drops
        </Link>
      </div>
    );
  }

  return (
    <main>
      <Container className="py-8 md:py-12">
        <h1 className="display text-2xl md:text-3xl">Checkout</h1>
        <div className="mt-6 max-w-xl">{content}</div>
      </Container>
    </main>
  );
}
