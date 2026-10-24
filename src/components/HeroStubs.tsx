import Link from 'next/link';
import { formatPrice } from '@/lib/format';
import type { DropWithProduct } from '@/lib/types';
import { ProductImage } from './ProductImage';

export function HeroStubs({ drops }: { drops: DropWithProduct[] }) {
  if (drops.length === 0) return null;

  return (
    <ul className="mt-10 grid max-w-md grid-cols-3 gap-3 sm:gap-4">
      {drops.slice(0, 3).map((drop) => (
        <li key={drop.id}>
          <Link
            href={`/drops/${drop.id}`}
            className="ticket ease-snap block p-2 transition-transform duration-200 hover:-translate-y-1"
          >
            <ProductImage
              src={drop.product.images[0]}
              alt={drop.product.name}
              sizes="144px"
              className="h-24 sm:h-36"
            />
            <p className="mt-2 truncate text-xs font-bold sm:text-sm">
              {drop.product.name}
            </p>
            <p className="display text-base">{formatPrice(drop.dropPrice)}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
