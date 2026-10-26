'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { HttpError, request } from '@/lib/browser-api';
import { formatPrice } from '@/lib/format';
import type { OrderView } from '@/lib/types';
import { useAuth } from './AuthProvider';
import { Container } from './Container';
import { MockPayment } from './MockPayment';
import { ProductImage } from './ProductImage';
import { Skeleton } from './Skeleton';

export function MockCheckout({ orderId }: { orderId: string }) {
  const router = useRouter();
  const { user, status } = useAuth();
  const [order, setOrder] = useState<OrderView | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'ready' && !user) {
      router.replace(
        `/login?next=${encodeURIComponent(`/checkout/mock/${orderId}`)}`,
      );
    }
  }, [status, user, router, orderId]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    request<OrderView>(`/orders/${orderId}`)
      .then((result) => {
        if (!cancelled) setOrder(result);
      })
      .catch((caught) => {
        if (!cancelled) {
          setError(
            caught instanceof HttpError
              ? caught.message
              : 'Network error. Please try again.',
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [user, orderId]);

  if (!user || (!order && !error)) {
    return (
      <main>
        <Container className="space-y-4 py-12">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-72 w-full" />
        </Container>
      </main>
    );
  }

  return (
    <main>
      <Container className="py-8 md:py-12">
        <h1 className="display text-2xl md:text-3xl">Test payment page</h1>

        {error && (
          <p
            role="alert"
            className="rounded-control bg-live-wash mt-6 p-3 font-bold"
          >
            {error}
          </p>
        )}

        {order && order.status !== 'pending' && (
          <div className="ticket mt-6 p-6">
            <p className="display text-xl">This order can no longer be paid</p>
            <p className="text-ink-soft mt-1">
              The reservation ended, or the order is already settled.
            </p>
            <Link href="/account" className="btn btn-primary mt-4">
              Go to my account
            </Link>
          </div>
        )}

        {order && order.status === 'pending' && (
          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
            <section aria-label="Test card payment">
              <MockPayment
                orderId={order.id}
                amountLabel={formatPrice(order.amount)}
              />
            </section>
            <aside aria-label="Order summary">
              <div className="ticket p-4">
                <div className="flex items-center gap-4">
                  <ProductImage
                    src={order.product?.image}
                    alt={order.product?.name ?? 'Product'}
                    sizes="64px"
                    className="h-16 w-16 shrink-0"
                  />
                  <p className="min-w-0 truncate font-bold">
                    {order.product?.name}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-ink-soft">Total</span>
                  <span className="display text-2xl">
                    {formatPrice(order.amount)}
                  </span>
                </div>
              </div>
            </aside>
          </div>
        )}
      </Container>
    </main>
  );
}
