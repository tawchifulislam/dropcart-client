import Link from 'next/link';
import { formatPrice } from '@/lib/format';
import type { DropWithProduct } from '@/lib/types';
import { DropBadge } from './DropBadge';
import { ProductImage } from './ProductImage';

export function UpcomingDropRow({ drop }: { drop: DropWithProduct }) {
  return (
    <Link
      href={`/drops/${drop.id}`}
      className="ticket flex items-center gap-4 p-3"
    >
      <ProductImage className="h-16 w-16 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-bold">{drop.product.name}</p>
        <p className="text-ink-soft text-sm">
          {drop.stockTotal} units, {formatPrice(drop.dropPrice)}
        </p>
        <DropBadge drop={drop} />
      </div>
    </Link>
  );
}
