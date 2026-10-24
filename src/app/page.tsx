import { CatalogFilters } from '@/components/CatalogFilters';
import { Container } from '@/components/Container';
import { DropCard } from '@/components/DropCard';
import { Hero } from '@/components/Hero';
import { HowItWorks } from '@/components/HowItWorks';
import { ProductTile } from '@/components/ProductTile';
import { UpcomingDropRow } from '@/components/UpcomingDropRow';
import { api } from '@/lib/api';
import type { CatalogProduct, DropWithProduct, Paginated } from '@/lib/types';

interface Props {
  searchParams: Promise<{ search?: string; category?: string }>;
}

export default async function HomePage({ searchParams }: Props) {
  const { search, category } = await searchParams;
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (category) params.set('category', category);

  const [live, upcoming, categories, catalog] = await Promise.all([
    api<{ items: DropWithProduct[] }>('/drops/live'),
    api<{ items: DropWithProduct[] }>('/drops/upcoming'),
    api<{ items: string[] }>('/products/categories'),
    api<Paginated<CatalogProduct>>(`/products?${params}`),
  ]);

  const [featuredLive, ...otherLive] = live.items;
  const featured = featuredLive ?? upcoming.items[0];
  const upcomingList = featuredLive ? upcoming.items : upcoming.items.slice(1);

  return (
    <main>
      <Hero
        drop={featured}
        liveCount={live.items.length}
        upcomingCount={upcoming.items.length}
      />
      <Container className="pb-16">
        {otherLive.length > 0 && (
          <section aria-labelledby="live-heading" className="pt-10 md:pt-12">
            <h2 id="live-heading" className="display text-2xl">
              Also live now
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {otherLive.map((drop) => (
                <DropCard key={drop.id} drop={drop} />
              ))}
            </div>
          </section>
        )}

        {upcomingList.length > 0 && (
          <section
            aria-labelledby="upcoming-heading"
            className="pt-10 md:pt-12"
          >
            <h2 id="upcoming-heading" className="display text-2xl">
              Dropping soon
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {upcomingList.map((drop) => (
                <UpcomingDropRow key={drop.id} drop={drop} />
              ))}
            </div>
          </section>
        )}

        <HowItWorks />

        <section
          id="catalog"
          aria-labelledby="catalog-heading"
          className="pt-12"
        >
          <h2 id="catalog-heading" className="display mb-4 text-2xl">
            All products
          </h2>
          <CatalogFilters
            categories={categories.items}
            activeCategory={category}
            search={search}
          />
          {catalog.items.length > 0 ? (
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {catalog.items.map((product) => (
                <ProductTile key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-ink-soft mt-5">No products match your search.</p>
          )}
        </section>
      </Container>
    </main>
  );
}
