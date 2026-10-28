'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { request } from '@/lib/browser-api';
import { formatDate, formatDateTime, formatPrice } from '@/lib/format';
import type { ReservationHistoryItem, ReservationView } from '@/lib/types';
import { useAuth } from './AuthProvider';
import { Container } from './Container';
import { EmptyState } from './EmptyState';
import { ProductImage } from './ProductImage';
import { ReservationStatusBadge } from './ReservationStatusBadge';
import { RoleBadge } from './RoleBadge';
import { Skeleton } from './Skeleton';

const STRIPE: Record<ReservationView['status'], string> = {
  active: 'border-l-upcoming',
  completed: 'border-l-ok',
  expired: 'border-l-sold',
  released: 'border-l-sold',
};

function StatStrip({ items }: { items: { label: string; value: number }[] }) {
  return (
    <dl className="ticket bg-line grid grid-cols-2 gap-px overflow-hidden md:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="bg-surface px-4 py-3">
          <dt className="text-ink-soft text-sm">{item.label}</dt>
          <dd className="display text-2xl">{item.value}</dd>
        </div>
      ))}
    </dl>
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
        <Container className="grid gap-6 py-10 lg:grid-cols-[320px_1fr]">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </Container>
      </main>
    );
  }

  const count = (...statuses: ReservationView['status'][]) =>
    items?.filter((item) => statuses.includes(item.status)).length ?? 0;
  const isManager = user.role === 'admin' || user.role === 'superadmin';

  return (
    <main>
      <Container className="grid items-start gap-8 py-8 md:py-12 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-4">
          <section aria-label="Profile" className="ticket">
            <div className="flex items-center gap-4 p-5">
              <span
                aria-hidden="true"
                className="display border-line bg-brand text-on-brand grid size-16 shrink-0 place-items-center rounded-full border-[1.5px] text-3xl"
              >
                {user.name.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0">
                <h1 className="display truncate text-2xl">{user.name}</h1>
                <p className="text-ink-soft truncate text-sm">{user.email}</p>
              </div>
            </div>
            <div className="ticket-perf" />
            <dl className="space-y-3 p-5 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-ink-soft">Role</dt>
                <dd>
                  <RoleBadge role={user.role} />
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-ink-soft">Member since</dt>
                <dd className="font-bold">{formatDate(user.joinedAt)}</dd>
              </div>
            </dl>
            <div className="border-line border-t-[1.5px] border-dashed p-3">
              <button
                type="button"
                onClick={() => void signOut()}
                className="btn btn-quiet w-full"
              >
                Sign out
              </button>
            </div>
          </section>

          {isManager && (
            <section
              aria-labelledby="tools-heading"
              className="ticket bg-brand-wash p-5"
            >
              <h2 id="tools-heading" className="display text-lg">
                {user.role === 'superadmin'
                  ? 'Store management'
                  : 'Seller tools'}
              </h2>
              <p className="text-ink-soft mt-1 text-sm">
                {user.role === 'superadmin'
                  ? 'Products, drops, revenue and roles for the whole store.'
                  : 'Manage your own products and drops and follow their revenue.'}
              </p>
              <div className="mt-4 grid gap-2">
                <Link
                  href="/admin"
                  className="btn btn-primary min-h-11 text-sm"
                >
                  Open dashboard
                </Link>
                <Link href="/admin/products" className="btn min-h-11 text-sm">
                  Manage products
                </Link>
              </div>
            </section>
          )}
        </aside>

        <div className="min-w-0 space-y-8">
          <StatStrip
            items={[
              { label: 'Reservations', value: items?.length ?? 0 },
              { label: 'Held now', value: count('active') },
              { label: 'Paid', value: count('completed') },
              { label: 'Missed', value: count('expired', 'released') },
            ]}
          />

          <section aria-labelledby="history-heading">
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
                    className={`ticket flex items-center gap-4 border-l-[6px] p-3 ${STRIPE[item.status]}`}
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
                          Held until {formatDateTime(item.expiresAt)}.{' '}
                          <Link
                            href={`/checkout/${item.id}`}
                            className="text-brand font-bold hover:underline"
                          >
                            Pay now
                          </Link>
                        </p>
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
        </div>
      </Container>
    </main>
  );
}
