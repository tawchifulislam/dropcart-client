import Link from 'next/link';
import { formatPrice } from '@/lib/format';
import type { DropWithProduct } from '@/lib/types';
import { Countdown } from './Countdown';
import { DropBadge } from './DropBadge';
import { ProductImage } from './ProductImage';
import { StockCells } from './StockCells';

const CARD_SIZES = '(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw';
const FEATURED_SIZES = '(min-width: 1024px) 560px, 100vw';

interface Props {
  drop: DropWithProduct;
  featured?: boolean;
}

export function DropCard({ drop, featured = false }: Props) {
  const { product } = drop;
  const countdown =
    drop.status === 'upcoming'
      ? { target: drop.startsAt, label: 'Starts in' }
      : { target: drop.endsAt, label: 'Ends in' };

  return (
    <article className="group ticket ease-snap transition-transform duration-200 hover:-translate-y-1">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <DropBadge drop={drop} />
          <span className="text-ink-soft text-sm">{product.category}</span>
        </div>
        <ProductImage
          src={product.images[0]}
          alt={product.name}
          sizes={featured ? FEATURED_SIZES : CARD_SIZES}
          priority={featured}
          className={`mt-3 ${featured ? 'h-56 sm:h-72' : 'h-48'}`}
        />
        <h3 className="display mt-3 text-xl">{product.name}</h3>
        <p className="mt-1 flex items-baseline gap-3">
          <span className="display text-2xl">
            {formatPrice(drop.dropPrice)}
          </span>
          <s className="text-ink-soft">{formatPrice(product.basePrice)}</s>
        </p>
      </div>
      <div className="ticket-perf" />
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <b>{drop.stockRemaining} left</b>
          <span className="text-ink-soft text-sm">of {drop.stockTotal}</span>
        </div>
        <StockCells remaining={drop.stockRemaining} total={drop.stockTotal} />
        <div className="mt-4">
          <Countdown target={countdown.target} label={countdown.label} />
        </div>
        <Link
          href={`/drops/${drop.id}`}
          className="btn btn-primary mt-4 w-full"
        >
          View drop
        </Link>
      </div>
    </article>
  );
}
