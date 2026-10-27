'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { request } from '@/lib/browser-api';
import { formatDateTime, formatPrice } from '@/lib/format';
import type { ReservationHistoryItem, ReservationView } from '@/lib/types';
import { useAuth } from './AuthProvider';
import { Container } from './Container';
import { EmptyState } from './EmptyState';
import { ProductImage } from './ProductImage';
import { ReservationStatusBadge } from './ReservationStatusBadge';
import { Skeleton } from './Skeleton';

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="ticket p-4">
      <dt className="text-ink-soft text-sm">{label}</dt>
      <dd className="display text-3xl">{value}</dd>
    </div>
  );
}

export function AccountView() {
  const router = useRouter();
  const { user, status, logout } = useAuth();
  const [items, setItems] = useState<ReservationHistoryItem[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (status === 'ready' && !user) router.replace('/login?next=%2Faccount');
  }, [status, user, router]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    request<{ items: ReservationHistoryItem[] }>('/reservations/mine')
      .then((result) => {
        if (!cancelled) setItems(result.items);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const signOut = async () => {
    await logout();
    router.replace('/');
  };

  if (!user) {
    return (
      <main>
        <Container className="space-y-4 py-12">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-32 w-full" />
        </Container>
      </main>
    );
  }

  const count = (...statuses: ReservationView['status'][]) =>
    items?.filter((item) => statuses.includes(item.status)).length ?? 0;

  return (
    <main>
      <section className="border-line border-b-[1.5px]">
        <Container className="flex flex-wrap items-center justify-between gap-4 py-10 md:py-14">
          <div className="flex items-center gap-4">
            <span
              aria-hidden="true"
              className="display border-line bg-brand text-on-brand grid size-16 place-items-center rounded-full border-[1.5px] text-3xl"
            >
              {user.name.charAt(0).toUpperCase()}
            </span>
            <div>
              <h1 className="display text-2xl md:text-3xl">{user.name}</h1>
              <p className="text-ink-soft">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="badge">
              {user.role === 'admin' ? 'Admin' : 'Shopper'}
            </span>
            {user.role === 'admin' && (
              <Link href="/admin" className="btn btn-primary">
                Admin dashboard
              </Link>
            )}
            <button
              type="button"
              onClick={() => void signOut()}
              className="btn"
            >
              Sign out
            </button>
          </div>
        </Container>
      </section>

      <Container className="pt-8 pb-20">
        <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Reservations" value={items?.length ?? 0} />
          <Stat label="Held now" value={count('active')} />
          <Stat label="Paid" value={count('completed')} />
          <Stat label="Missed" value={count('expired', 'released')} />
        </dl>

        <section aria-labelledby="history-heading" className="pt-12">
          <h2 id="history-heading" className="display text-2xl">
            Reservation history
          </h2>

          {failed && (
            <p
              role="alert"
              className="rounded-control bg-live-wash mt-4 p-3 text-sm font-bold"
            >
              We could not load your activity. Please refresh the page.
            </p>
          )}

          {!failed && items === null && (
            <div className="mt-4 space-y-3" aria-busy="true">
              {Array.from({ length: 3 }, (_, index) => (
                <Skeleton key={index} className="h-24 w-full" />
              ))}
            </div>
          )}

          {items && items.length === 0 && (
            <EmptyState
              title="No reservations yet"
              body="When you reserve a unit in a live drop, it shows up here."
              href="/drops"
              cta="See live drops"
            />
          )}

          {items && items.length > 0 && (
            <ul className="mt-4 space-y-3">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="ticket flex items-center gap-4 p-3"
                >
                  <ProductImage
                    src={item.product.image}
                    alt={item.product.name}
                    sizes="64px"
                    className="h-16 w-16 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/drops/${item.dropId}`}
                      className="block truncate font-bold hover:underline"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-ink-soft text-sm">
                      {formatDateTime(item.createdAt)}, {item.quantity}{' '}
                      {item.quantity === 1 ? 'unit' : 'units'},{' '}
                      {formatPrice(item.dropPrice * item.quantity)}
                    </p>
                    {item.status === 'active' && (
                      <p className="text-ink-soft text-sm">
                        Held until {formatDateTime(item.expiresAt)}
                      </p>
                    )}
                    {item.status === 'active' && (
                      <Link
                        href={`/checkout/${item.id}`}
                        className="text-brand text-sm font-bold hover:underline"
                      >
                        Pay now
                      </Link>
                    )}
                    {item.status === 'completed' && item.orderId && (
                      <p className="text-ink-soft text-sm">
                        Order #{item.orderId.slice(-8).toUpperCase()},{' '}
                        <Link
                          href={`/checkout/complete?order=${item.orderId}`}
                          className="text-brand font-bold hover:underline"
                        >
                          View receipt
                        </Link>
                      </p>
                    )}
                  </div>
                  <ReservationStatusBadge status={item.status} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </Container>
    </main>
  );
}
