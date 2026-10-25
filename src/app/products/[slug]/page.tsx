import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Container } from '@/components/Container';
import { DropBadge } from '@/components/DropBadge';
import { ProductDropPanel } from '@/components/ProductDropPanel';
import { ProductGallery } from '@/components/ProductGallery';
import { ProductTile } from '@/components/ProductTile';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { ApiError, api } from '@/lib/api';
import { formatPrice, humanize } from '@/lib/format';
import { SITE_URL } from '@/lib/site';
import type { CatalogProduct, Drop, Paginated } from '@/lib/types';

interface Props {
  params: Promise<{ slug: string }>;
}

const loadProduct = cache(async (slug: string) => {
  try {
    return await api<CatalogProduct>(`/products/${encodeURIComponent(slug)}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
});

function availabilityOf(drop: Drop | null) {
  if (!drop) return 'https://schema.org/OutOfStock';
  if (drop.soldOut) return 'https://schema.org/SoldOut';
  return drop.status === 'live'
    ? 'https://schema.org/InStock'
    : 'https://schema.org/PreOrder';
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await loadProduct(slug);
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images.slice(0, 1),
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await loadProduct(slug);
  const { drop } = product;
  const live = drop?.status === 'live';
  const price = live && drop ? drop.dropPrice : product.basePrice;
  const categoryHref = `/products?category=${encodeURIComponent(product.category)}`;
  const specs = Object.entries(product.specs ?? {});

  const related = await api<Paginated<CatalogProduct>>(
    `/products?category=${encodeURIComponent(product.category)}&limit=5`,
  );
  const others = related.items
    .filter((item) => item.id !== product.id)
    .slice(0, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    category: product.category,
    image: product.images.map((src) => new URL(src, SITE_URL).toString()),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'BDT',
      price,
      availability: availabilityOf(drop),
      url: new URL(`/products/${product.slug}`, SITE_URL).toString(),
    },
  };

  return (
    <main>
      <Container className="py-8 md:py-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
          }}
        />
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Catalog', href: '/products' },
            { label: product.category, href: categoryHref },
            { label: product.name },
          ]}
        />

        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <ProductGallery images={product.images} name={product.name} />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <DropBadge drop={drop} />
              <span className="badge">{product.category}</span>
            </div>
            <h1 className="display mt-3 text-2xl md:text-4xl">
              {product.name}
            </h1>
            <p className="mt-3 flex items-baseline gap-3">
              <span className="display text-3xl">{formatPrice(price)}</span>
              {live && (
                <s className="text-ink-soft">
                  {formatPrice(product.basePrice)}
                </s>
              )}
            </p>
            <p className="text-ink-soft mt-4 max-w-prose">
              {product.description}
            </p>

            {product.variants.length > 0 && (
              <div className="mt-6">
                <h2 className="text-sm font-bold">Options</h2>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <li
                      key={variant.label}
                      className="rounded-control border-line inline-flex h-10 min-w-10 items-center justify-center border-[1.5px] px-3 text-sm font-bold"
                    >
                      {variant.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {specs.length > 0 && (
              <dl className="divide-line border-line mt-6 divide-y-[1.5px] divide-dashed border-y-[1.5px] border-dashed text-sm">
                {specs.map(([key, value]) => (
                  <div key={key} className="flex justify-between gap-4 py-2">
                    <dt className="text-ink-soft">{humanize(key)}</dt>
                    <dd className="font-bold">{value}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="mt-8">
              <ProductDropPanel drop={drop} />
            </div>
          </div>
        </div>

        {others.length > 0 && (
          <section aria-labelledby="related-heading" className="pt-16">
            <SectionHeading
              id="related-heading"
              title={`More in ${product.category}`}
              href={categoryHref}
              linkLabel="See all"
            />
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {others.map((item, index) => (
                <Reveal key={item.id} delay={index * 0.06}>
                  <ProductTile product={item} />
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </Container>
    </main>
  );
}
