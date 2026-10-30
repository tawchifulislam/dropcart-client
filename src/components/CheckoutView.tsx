'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { HttpError, request } from '@/lib/browser-api';
import { formatClock, formatPrice } from '@/lib/format';
import type { CheckoutSession, ReservationHistoryItem } from '@/lib/types';
import { useAuth } from './AuthProvider';
import { Container } from './Container';
import { ProductImage } from './ProductImage';
import { Skeleton } from './Skeleton';

export function CheckoutView({ reservationId }: { reservationId: string }) {
  const router = useRouter();
  const { user, status } = useAuth();
  const [item, setItem] = useState<ReservationHistoryItem | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
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

    request<{ reservation: ReservationHistoryItem }>(
      `/reservations/${reservationId}`,
    )
      .then(({ reservation }) => {
        if (cancelled) return;
        setItem(reservation);
        if (reservation.status === 'active' && reservation.expiresInMs > 0) {
          setDeadline(Date.now() + reservation.expiresInMs);
          setRemaining(reservation.expiresInMs);
        }
      })
      .catch((caught) => {
        if (!cancelled) {
          setLoadError(
            caught instanceof HttpError
              ? caught.message
              : 'Network error. Please try again.',
          );
        }
      });

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

  const continueToPayment = async () => {
    setBusy(true);
    setSubmitError(null);
    try {
      const session = await request<CheckoutSession>(
        `/checkout/${reservationId}`,
        {
          method: 'POST',
        },
      );
      window.location.assign(session.url);
    } catch (caught) {
      setSubmitError(
        caught instanceof HttpError
          ? caught.message
          : 'Network error. Please try again.',
      );
      setBusy(false);
    }
  };

  if (!user || (!item && !loadError)) {
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
  const amountLabel = item ? formatPrice(item.dropPrice * item.quantity) : '';

  return (
    <main>
      <Container className="py-8 md:py-12">
        <h1 className="display text-2xl md:text-3xl">Checkout</h1>

        {loadError && (
          <p
            role="alert"
            className="rounded-control bg-live-wash mt-6 p-3 font-bold"
          >
            {loadError}
          </p>
        )}

        {item && !active && (
          <div className="ticket mt-6 p-6">
            <p className="display text-xl">
              This reservation is no longer active
            </p>
            <p className="text-ink-soft mt-1">
              The hold has ended, or the unit has already been paid for or
              released.
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
              <div className="ticket p-5">
                <p className="font-bold">Secure payment page</p>
                <p className="text-ink-soft mt-1">
                  You will be taken to a secure payment page to enter your card
                  details. Your unit stays held for the time shown while you
                  pay.
                </p>
                <ul className="text-ink-soft mt-4 space-y-2 text-sm">
                  <li>
                    Card details are entered on the payment provider&apos;s
                    page, never on DropCart.
                  </li>
                  <li>
                    When the timer runs out, the unit goes back on sale and the
                    payment page closes.
                  </li>
                </ul>
                {process.env.NEXT_PUBLIC_DEMO_MODE === 'true' && (
                  <p className="rounded-control bg-upcoming-wash mt-4 p-3 text-sm">
                    <b>Demo store.</b> Payments run in test mode. Use card 4242
                    4242 4242 4242, any future date and any CVC. No real money
                    is charged.
                  </p>
                )}
                {submitError && (
                  <p
                    role="alert"
                    className="rounded-control bg-live-wash mt-4 p-3 text-sm font-bold"
                  >
                    {submitError}
                  </p>
                )}
                <button
                  type="button"
                  onClick={continueToPayment}
                  disabled={busy}
                  className="btn btn-reserve mt-5 w-full"
                >
                  {busy ? 'Redirecting...' : `Pay ${amountLabel}`}
                </button>
              </div>
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
