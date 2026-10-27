'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { HttpError, request } from '@/lib/browser-api';
import { formatPrice } from '@/lib/format';
import type { CartItem } from '@/lib/types';
import { useAuth } from './AuthProvider';
import { Container } from './Container';
import { DropBadge } from './DropBadge';
import { EmptyState } from './EmptyState';
import { ProductImage } from './ProductImage';
import { Skeleton } from './Skeleton';
import { useToast } from './ToastProvider';

function availability(item: CartItem) {
  const { drop } = item.product;
  if (!drop) return 'No drop is scheduled for this product yet.';
  if (drop.soldOut) return 'This drop is sold out.';
  if (drop.status === 'upcoming') return 'Reserve opens when the drop starts.';
  return null;
}

export function CartView() {
  const router = useRouter();
  const { user, status } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<CartItem[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (status === 'ready' && !user) router.replace('/login?next=%2Fcart');
  }, [status, user, router]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    request<{ items: CartItem[] }>('/cart')
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

  const remove = async (item: CartItem) => {
    try {
      await request(`/cart/items/${item.product.id}`, { method: 'DELETE' });
      setItems(
        (current) =>
          current?.filter((entry) => entry.product.id !== item.product.id) ??
          null,
      );
      toast({
        tone: 'info',
        title: 'Removed from cart',
        description: item.product.name,
      });
    } catch (caught) {
      toast({
        tone: 'error',
        title: 'Could not remove the item',
        description: caught instanceof HttpError ? caught.message : undefined,
      });
    }
  };

  return (
    <main>
      <Container className="py-8 md:py-12">
        <h1 className="display text-2xl md:text-3xl">Your cart</h1>
        <p className="text-ink-soft mt-2 max-w-prose">
          Items in your cart are not reserved. Reserve a unit while the
          product&apos;s drop is live.
        </p>

        {failed && (
          <p
            role="alert"
            className="rounded-control bg-live-wash mt-6 p-3 font-bold"
          >
            We could not load your cart. Please refresh the page.
          </p>
        )}

        {!failed && (!user || items === null) && (
          <div className="mt-6 space-y-3" aria-busy="true">
            {Array.from({ length: 2 }, (_, index) => (
              <Skeleton key={index} className="h-24 w-full" />
            ))}
          </div>
        )}

        {items && items.length === 0 && (
          <EmptyState
            title="Your cart is empty"
            body="Add products from the catalog, or ask the Copilot to find something for you."
            href="/copilot"
            cta="Ask the Copilot"
          />
        )}

        {items && items.length > 0 && (
          <ul className="mt-6 space-y-3">
            {items.map((item) => {
              const { product } = item;
              const note = availability(item);
              const price = product.drop
                ? product.drop.dropPrice
                : product.basePrice;
              return (
                <li
                  key={product.id}
                  className="ticket flex flex-wrap items-center gap-4 p-3 sm:flex-nowrap"
                >
                  <ProductImage
                    src={product.images[0]}
                    alt={product.name}
                    sizes="80px"
                    className="h-20 w-20 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/products/${product.slug}`}
                      className="block truncate font-bold hover:underline"
                    >
                      {product.name}
                    </Link>
                    <p className="text-ink-soft text-sm">
                      {item.quantity} {item.quantity === 1 ? 'unit' : 'units'},{' '}
                      {formatPrice(price)} each
                    </p>
                    <DropBadge drop={product.drop} />
                  </div>
                  <div className="flex w-full items-center gap-2 sm:w-auto">
                    {note ? (
                      <span className="text-ink-soft flex-1 text-sm sm:max-w-48">
                        {note}
                      </span>
                    ) : (
                      product.drop && (
                        <Link
                          href={`/drops/${product.drop.id}`}
                          className="btn btn-reserve min-h-11 flex-1 px-4 text-base sm:flex-none"
                        >
                          Reserve now
                        </Link>
                      )
                    )}
                    <button
                      type="button"
                      onClick={() => void remove(item)}
                      className="btn btn-quiet min-h-11 px-3 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Container>
    </main>
  );
}
