'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { HttpError, request } from '@/lib/browser-api';
import { formatClock, formatPrice } from '@/lib/format';
import type { CheckoutSession, ReservationHistoryItem } from '@/lib/types';
import { useAuth } from './AuthProvider';
import { Container } from './Container';
import { MockPayment } from './MockPayment';
import { ProductImage } from './ProductImage';
import { Skeleton } from './Skeleton';
import { StripePayment } from './StripePayment';

export function CheckoutView({ reservationId }: { reservationId: string }) {
  const router = useRouter();
  const { user, status } = useAuth();
  const [item, setItem] = useState<ReservationHistoryItem | null>(null);
  const [session, setSession] = useState<CheckoutSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deadline, setDeadline] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(0);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (status === 'ready' && !user) {
      router.replace(
        `/login?next=${encodeURIComponent(`/checkout/${reservationId}`)}`,
      );
    }
  }, [status, user, router, reservationId]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    (async () => {
      try {
        const { reservation } = await request<{
          reservation: ReservationHistoryItem;
        }>(`/reservations/${reservationId}`);
        if (cancelled) return;
        setItem(reservation);
        if (reservation.status !== 'active' || reservation.expiresInMs <= 0)
          return;

        setDeadline(Date.now() + reservation.expiresInMs);
        setRemaining(reservation.expiresInMs);
        const checkout = await request<CheckoutSession>(
          `/checkout/${reservationId}`,
          {
            method: 'POST',
          },
        );
        if (!cancelled) setSession(checkout);
      } catch (caught) {
        if (!cancelled) {
          setError(
            caught instanceof HttpError
              ? caught.message
              : 'Network error. Please try again.',
          );
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, reservationId]);

  useEffect(() => {
    if (deadline === null) return;
    const timer = setInterval(() => {
      const left = deadline - Date.now();
      if (left <= 0) {
        clearInterval(timer);
        setRemaining(0);
        setExpired(true);
      } else {
        setRemaining(left);
      }
    }, 250);
    return () => clearInterval(timer);
  }, [deadline]);

  if (!user || (!item && !error)) {
    return (
      <main>
        <Container className="space-y-4 py-12">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-72 w-full" />
        </Container>
      </main>
    );
  }

  const active = item?.status === 'active' && item.expiresInMs > 0 && !expired;
  const total = item ? item.dropPrice * item.quantity : 0;
  const amountLabel = formatPrice(total);

  return (
    <main>
      <Container className="py-8 md:py-12">
        <h1 className="display text-2xl md:text-3xl">Checkout</h1>

        {error && (
          <p
            role="alert"
            className="rounded-control bg-live-wash mt-6 p-3 font-bold"
          >
            {error}
          </p>
        )}

        {item && !active && (
          <div className="ticket mt-6 p-6">
            <p className="display text-xl">
              This reservation is no longer active
            </p>
            <p className="text-ink-soft mt-1">
              The five minute hold has ended, or the unit has already been paid
              for or released.
            </p>
            <Link
              href={`/drops/${item.dropId}`}
              className="btn btn-primary mt-4"
            >
              Back to the drop
            </Link>
          </div>
        )}

        {item && active && (
          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
            <section aria-labelledby="payment-heading">
              <h2 id="payment-heading" className="display mb-4 text-xl">
                Payment
              </h2>
              {!session && <Skeleton className="h-56 w-full" />}
              {session?.provider === 'stripe' && (
                <StripePayment
                  clientSecret={session.clientSecret}
                  orderId={session.orderId}
                  amountLabel={amountLabel}
                />
              )}
              {session?.provider === 'mock' && (
                <MockPayment
                  orderId={session.orderId}
                  amountLabel={amountLabel}
                />
              )}
            </section>

            <aside aria-labelledby="summary-heading">
              <div className="ticket">
                <div className="p-4">
                  <h2 id="summary-heading" className="display text-xl">
                    Order summary
                  </h2>
                  <div className="mt-4 flex items-center gap-4">
                    <ProductImage
                      src={item.product.image}
                      alt={item.product.name}
                      sizes="64px"
                      className="h-16 w-16 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="truncate font-bold">{item.product.name}</p>
                      <p className="text-ink-soft text-sm">
                        {item.quantity} {item.quantity === 1 ? 'unit' : 'units'}
                        , {formatPrice(item.dropPrice)} each
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-ink-soft">Total</span>
                    <span className="display text-2xl">{amountLabel}</span>
                  </div>
                </div>
                <div className="ticket-perf" />
                <div className="p-4">
                  <p className="text-ink-soft text-sm">Your unit is held for</p>
                  <p className="numerals my-1 text-5xl" role="timer">
                    {formatClock(remaining)}
                  </p>
                  <div className="hold" aria-hidden="true">
                    <i
                      style={{
                        width: `${Math.min(100, (remaining / item.holdMs) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </Container>
    </main>
  );
}
