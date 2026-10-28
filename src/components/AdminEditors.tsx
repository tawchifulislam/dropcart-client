'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { request } from '@/lib/browser-api';
import type { DropWithProduct, ManagedProduct } from '@/lib/types';
import { DropForm } from './DropForm';
import { ProductForm } from './ProductForm';
import { Skeleton } from './Skeleton';

type State<T> =
  { status: 'loading' } | { status: 'missing' } | { status: 'ready'; item: T };

function useLoadedItem<T extends { id: string }>(
  path: string,
  id: string,
): State<T> {
  const [state, setState] = useState<State<T>>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    request<{ items: T[] }>(path)
      .then((result) => {
        if (cancelled) return;
        const item = result.items.find((entry) => entry.id === id);
        setState(item ? { status: 'ready', item } : { status: 'missing' });
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'missing' });
      });
    return () => {
      cancelled = true;
    };
  }, [path, id]);

  return state;
}

function Missing({ label, href }: { label: string; href: string }) {
  return (
    <div className="ticket p-8 text-center">
      <p className="display text-xl">{label} not found</p>
      <p className="text-ink-soft mt-1">
        It does not exist, or it is not one of yours.
      </p>
      <Link href={href} className="btn mt-4">
        Go back
      </Link>
    </div>
  );
}

export function ProductEditor({ id }: { id: string }) {
  const state = useLoadedItem<ManagedProduct>('/admin/products', id);
  if (state.status === 'loading') return <Skeleton className="h-96 w-full" />;
  if (state.status === 'missing')
    return <Missing label="Product" href="/admin/products" />;
  return <ProductForm product={state.item} />;
}

export function DropEditor({ id }: { id: string }) {
  const state = useLoadedItem<DropWithProduct>('/admin/drops', id);
  if (state.status === 'loading') return <Skeleton className="h-96 w-full" />;
  if (state.status === 'missing')
    return <Missing label="Drop" href="/admin/drops" />;
  return <DropForm drop={state.item} />;
}
