import Link from 'next/link';
import { formatPrice } from '@/lib/format';
import type { CatalogProduct } from '@/lib/types';
import { DropBadge } from './DropBadge';
import { ProductImage } from './ProductImage';

export function ProductTile({ product }: { product: CatalogProduct }) {
  const price =
    product.drop?.status === 'live'
      ? product.drop.dropPrice
      : product.basePrice;
  const content = (
    <>
      <ProductImage
        src={product.images[0]}
        alt={product.name}
        sizes="(min-width: 1024px) 280px, (min-width: 640px) 33vw, 50vw"
        className="h-32"
      />
      <p className="mt-2 text-sm font-bold">{product.name}</p>
      <p className="display mb-2 text-lg">{formatPrice(price)}</p>
      <DropBadge drop={product.drop} />
    </>
  );

  return product.drop ? (
    <Link
      href={`/drops/${product.drop.id}`}
      className="group ticket ease-snap block p-3 transition-transform duration-200 hover:-translate-y-1"
    >
      {content}
    </Link>
  ) : (
    <div className="group ticket ease-snap block p-3 transition-transform duration-200 hover:-translate-y-1">
      {content}
    </div>
  );
}
