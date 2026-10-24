import Link from 'next/link';
import { formatPrice } from '@/lib/format';
import type { DropWithProduct } from '@/lib/types';
import { Countdown } from './Countdown';
import { DropBadge } from './DropBadge';
import { ProductImage } from './ProductImage';
import { StockCells } from './StockCells';

export function LiveDropCard({ drop }: { drop: DropWithProduct }) {
  return (
    <article className="ticket">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <DropBadge drop={drop} />
          <span className="text-sm text-ink-soft">{drop.product.category}</span>
        </div>
        <ProductImage className="mt-3 h-48" />
        <h3 className="display mt-3 text-xl">{drop.product.name}</h3>
        <p className="mt-1 flex items-baseline gap-3">
          <span className="display text-2xl">
            {formatPrice(drop.dropPrice)}
          </span>
          <s className="text-ink-soft">{formatPrice(drop.product.basePrice)}</s>
        </p>
      </div>
      <div className="ticket-perf" />
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <b>{drop.stockRemaining} left</b>
          <span className="text-sm text-ink-soft">of {drop.stockTotal}</span>
        </div>
        <StockCells remaining={drop.stockRemaining} total={drop.stockTotal} />
        <div className="mt-4">
          <Countdown target={drop.endsAt} label="Ends in" />
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
