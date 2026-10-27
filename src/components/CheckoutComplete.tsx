'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { HttpError, request } from '@/lib/browser-api';
import { formatDateTime, formatPrice } from '@/lib/format';
import type { OrderView } from '@/lib/types';
import { useAuth } from './AuthProvider';
import { ProductImage } from './ProductImage';
import { Skeleton } from './Skeleton';

const POLL_MS = 1500;
const MAX_ATTEMPTS = 20;
const CELLS = 10;

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

function PaidStamp() {
  const reduceMotion = useReducedMotion();
  return (
    <motion.span
      initial={reduceMotion ? false : { scale: 1.8, opacity: 0, rotate: -14 }}
      animate={{ scale: 1, opacity: 1, rotate: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 18 }}
      className="display rounded-chip border-ok text-ok inline-block border-[3px] border-double px-4 py-1 text-2xl"
    >
      PAID
    </motion.span>
  );
}

function PaidReceipt({ order }: { order: OrderView }) {
  const orderNumber = `#${order.id.slice(-8).toUpperCase()}`;
  const details = [
    { label: 'Order number', value: orderNumber },
    {
      label: 'Paid on',
      value: order.paidAt ? formatDateTime(order.paidAt) : 'Just now',
    },
    {
      label: 'Quantity',
      value: `${order.quantity} ${order.quantity === 1 ? 'unit' : 'units'}`,
    },
    { label: 'Amount paid', value: formatPrice(order.amount) },
  ];

  return (
    <article className="ticket">
      <div className="p-6 text-center">
        <PaidStamp />
        <h1 className="display mt-4 text-3xl">Payment received</h1>
        <p className="text-ink-soft mt-1">Thank you. Your unit is confirmed.</p>
      </div>
      <div className="ticket-perf" />
      <div className="p-6">
        <div className="flex items-center gap-4">
          <ProductImage
            src={order.product?.image}
            alt={order.product?.name ?? 'Product'}
            sizes="80px"
            className="h-20 w-20 shrink-0"
          />
          <div className="min-w-0">
            {order.product ? (
              <Link
                href={`/products/${order.product.slug}`}
                className="block truncate text-lg font-bold hover:underline"
              >
                {order.product.name}
              </Link>
            ) : (
              <p className="text-lg font-bold">Your order</p>
            )}
            <p className="text-ink-soft text-sm">Limited drop</p>
          </div>
        </div>
        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
          {details.map((detail) => (
            <div key={detail.label}>
              <dt className="text-ink-soft">{detail.label}</dt>
              <dd className="font-bold">{detail.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="ticket-perf" />
      <div className="p-6">
        <div aria-hidden="true" className="cells">
          {Array.from({ length: CELLS }, (_, index) => (
            <span
              key={index}
              className={index < CELLS - 1 ? 'cell' : 'cell gone just-gone'}
            />
          ))}
        </div>
        <p className="text-ink-soft mt-2 text-center text-sm">
          One unit punched out of the drop, and it is yours.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link href="/account" className="btn btn-primary">
            View my account
          </Link>
          <Link href="/drops" className="btn">
            See more drops
          </Link>
        </div>
      </div>
    </article>
  );
}

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
    content = <Skeleton className="h-80 w-full" />;
  } else if (order.status === 'paid') {
    content = <PaidReceipt order={order} />;
  } else if (order.status === 'pending') {
    content = (
      <div className="ticket p-8 text-center" role="status">
        <div aria-hidden="true" className="cells mx-auto mb-6 max-w-xs">
          {Array.from({ length: CELLS }, (_, index) => (
            <span
              key={index}
              className="cell animate-pulse"
              style={{ animationDelay: `${index * 0.12}s` }}
            />
          ))}
        </div>
        <h1 className="display text-2xl">
          {timedOut ? 'Still processing' : 'Confirming your payment'}
        </h1>
        <p className="text-ink-soft mt-2">
          {timedOut
            ? 'Your payment is taking longer than usual. It will appear on your account page as soon as it is confirmed.'
            : 'This usually takes a few seconds. Please do not close this page.'}
        </p>
        {timedOut && (
          <Link href="/account" className="btn mt-5">
            Go to my account
          </Link>
        )}
      </div>
    );
  } else {
    const message = MESSAGES[order.status];
    content = (
      <div className="ticket p-8 text-center">
        <h1 className="display text-2xl">{message.title}</h1>
        <p className="text-ink-soft mt-2">{message.body}</p>
        <Link href="/drops" className="btn mt-5">
          Back to drops
        </Link>
      </div>
    );
  }

  return <div className="mx-auto max-w-xl">{content}</div>;
}
