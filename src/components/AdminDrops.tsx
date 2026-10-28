'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { HttpError, request } from '@/lib/browser-api';
import { formatDateTime, formatPrice } from '@/lib/format';
import type { DropWithProduct } from '@/lib/types';
import { DropBadge } from './DropBadge';
import { EmptyState } from './EmptyState';
import { ProductImage } from './ProductImage';
import { Skeleton } from './Skeleton';
import { useToast } from './ToastProvider';

export function AdminDrops() {
  const { toast } = useToast();
  const [items, setItems] = useState<DropWithProduct[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    request<{ items: DropWithProduct[] }>('/admin/drops')
      .then((result) => {
        if (!cancelled) setItems(result.items);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const remove = async (drop: DropWithProduct) => {
    if (!window.confirm(`Delete the upcoming drop for ${drop.product.name}?`))
      return;
    try {
      await request(`/admin/drops/${drop.id}`, { method: 'DELETE' });
      setItems(
        (current) => current?.filter((item) => item.id !== drop.id) ?? null,
      );
      toast({
        tone: 'info',
        title: 'Drop deleted',
        description: drop.product.name,
      });
    } catch (caught) {
      toast({
        tone: 'error',
        title: 'Could not delete the drop',
        description: caught instanceof HttpError ? caught.message : undefined,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="display text-2xl md:text-3xl">Drops</h1>
        <Link href="/admin/drops/new" className="btn btn-primary">
          Schedule a drop
        </Link>
      </div>

      {failed && (
        <p role="alert" className="rounded-control bg-live-wash p-3 font-bold">
          We could not load your drops. Please refresh the page.
        </p>
      )}

      {!failed && items === null && (
        <div className="space-y-3" aria-busy="true">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-28 w-full" />
          ))}
        </div>
      )}

      {items && items.length === 0 && (
        <EmptyState
          title="No drops yet"
          body="Schedule a drop to put one of your products on sale."
          href="/admin/drops/new"
          cta="Schedule a drop"
        />
      )}

      {items && items.length > 0 && (
        <ul className="space-y-3">
          {items.map((drop) => (
            <li
              key={drop.id}
              className="ticket flex flex-wrap items-center gap-4 p-3"
            >
              <ProductImage
                src={drop.product.images[0]}
                alt={drop.product.name}
                sizes="64px"
                className="h-16 w-16 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">{drop.product.name}</p>
                <p className="text-ink-soft text-sm">
                  {formatDateTime(drop.startsAt)} to{' '}
                  {formatDateTime(drop.endsAt)}
                </p>
                <p className="text-ink-soft text-sm">
                  {formatPrice(drop.dropPrice)}, {drop.stockRemaining} of{' '}
                  {drop.stockTotal} left
                </p>
              </div>
              <DropBadge drop={drop} />
              <div className="flex gap-2">
                <Link
                  href={`/drops/${drop.id}`}
                  className="btn min-h-10 px-3 text-sm"
                >
                  View
                </Link>
                {drop.status === 'upcoming' && (
                  <>
                    <Link
                      href={`/admin/drops/${drop.id}/edit`}
                      className="btn min-h-10 px-3 text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => void remove(drop)}
                      className="btn btn-quiet min-h-10 px-3 text-sm"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
