import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { Countdown } from '@/components/Countdown';
import { DropBadge } from '@/components/DropBadge';
import { ProductImage } from '@/components/ProductImage';
import { StockCells } from '@/components/StockCells';
import { ApiError, api } from '@/lib/api';
import { formatPrice } from '@/lib/format';
import type { DropWithProduct } from '@/lib/types';
import { Container } from '@/components/Container';

interface Props {
  params: Promise<{ id: string }>;
}

const loadDrop = cache(async (id: string) => {
  try {
    return await api<DropWithProduct>(`/drops/${id}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const drop = await loadDrop(id);
  return { title: `${drop.product.name} | DropCart` };
}

export default async function DropPage({ params }: Props) {
  const { id } = await params;
  const drop = await loadDrop(id);
  const { product } = drop;

  const countdown =
    drop.status === 'upcoming'
      ? { target: drop.startsAt, label: 'Starts in' }
      : drop.status === 'live'
        ? { target: drop.endsAt, label: 'Ends in' }
        : null;

  return (
    <Container as="main" className="py-8 md:py-12">
      <Link href="/" className="text-brand text-sm font-bold">
        Back to drops
      </Link>
      <article className="ticket mt-4 grid gap-6 p-4 md:grid-cols-2 md:p-5">
        <ProductImage className="h-72 md:h-full md:min-h-96" />
        <div>
          <div className="flex items-center gap-2">
            <DropBadge drop={drop} />
            <span className="badge">{product.category}</span>
          </div>
          <h1 className="display mt-2 text-2xl md:text-3xl">{product.name}</h1>
          <p className="mt-2 flex items-baseline gap-3">
            <span className="display text-3xl">
              {formatPrice(drop.dropPrice)}
            </span>
            <s className="text-ink-soft">{formatPrice(product.basePrice)}</s>
          </p>
          <p className="text-ink-soft mt-3 max-w-prose">
            {product.description}
          </p>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <b>{drop.stockRemaining} left</b>
              <span className="text-ink-soft text-sm">
                of {drop.stockTotal}
              </span>
            </div>
            <StockCells
              remaining={drop.stockRemaining}
              total={drop.stockTotal}
            />
          </div>

          <div className="mt-5">
            {countdown ? (
              <Countdown target={countdown.target} label={countdown.label} />
            ) : (
              <p className="text-ink-soft">This drop has ended.</p>
            )}
          </div>
        </div>
      </article>
    </Container>
  );
}
