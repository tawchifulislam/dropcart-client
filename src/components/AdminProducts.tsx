'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { request } from '@/lib/browser-api';
import { formatPrice } from '@/lib/format';
import type { ManagedProduct } from '@/lib/types';
import { useAuth } from './AuthProvider';
import { DropBadge } from './DropBadge';
import { EmptyState } from './EmptyState';
import { ProductImage } from './ProductImage';
import { Skeleton } from './Skeleton';

export function AdminProducts() {
  const { user } = useAuth();
  const [items, setItems] = useState<ManagedProduct[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    request<{ items: ManagedProduct[] }>('/admin/products')
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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="display text-2xl md:text-3xl">Products</h1>
        <Link href="/admin/products/new" className="btn btn-primary">
          New product
        </Link>
      </div>

      {failed && (
        <p role="alert" className="rounded-control bg-live-wash p-3 font-bold">
          We could not load your products. Please refresh the page.
        </p>
      )}

      {!failed && items === null && (
        <div className="space-y-3" aria-busy="true">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-24 w-full" />
          ))}
        </div>
      )}

      {items && items.length === 0 && (
        <EmptyState
          title="No products yet"
          body="Create your first product, then schedule a drop for it."
          href="/admin/products/new"
          cta="Create a product"
        />
      )}

      {items && items.length > 0 && (
        <ul className="space-y-3">
          {items.map((product) => (
            <li
              key={product.id}
              className="ticket flex flex-wrap items-center gap-4 p-3"
            >
              <ProductImage
                src={product.images[0]}
                alt={product.name}
                sizes="64px"
                className="h-16 w-16 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">{product.name}</p>
                <p className="text-ink-soft text-sm">
                  {product.category}, {formatPrice(product.basePrice)}
                  {user?.role === 'superadmin' &&
                    `, owner: ${product.owner?.name ?? 'the platform'}`}
                </p>
              </div>
              <DropBadge drop={product.drop} />
              <div className="flex gap-2">
                <Link
                  href={`/admin/drops/new?product=${product.id}`}
                  className="btn min-h-10 px-3 text-sm"
                >
                  Schedule drop
                </Link>
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="btn min-h-10 px-3 text-sm"
                >
                  Edit
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
