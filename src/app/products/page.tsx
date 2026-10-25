import type { Metadata } from 'next';
import { CatalogFilters } from '@/components/CatalogFilters';
import { Container } from '@/components/Container';
import { EmptyState } from '@/components/EmptyState';
import { PageHeader } from '@/components/PageHeader';
import { Pagination } from '@/components/Pagination';
import { ProductTile } from '@/components/ProductTile';
import { Reveal } from '@/components/Reveal';
import { api } from '@/lib/api';
import type { CatalogProduct, Paginated } from '@/lib/types';

const PAGE_SIZE = 12;

export const metadata: Metadata = {
  title: 'Catalog',
  description:
    'Browse every DropCart product. Products go on sale in scheduled drops.',
};

interface Props {
  searchParams: Promise<{ search?: string; category?: string; page?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const { search, category, page: pageParam } = await searchParams;
  const page = Math.max(1, Number.parseInt(pageParam ?? '1', 10) || 1);

  const params = new URLSearchParams({
    page: String(page),
    limit: String(PAGE_SIZE),
  });
  if (search) params.set('search', search);
  if (category) params.set('category', category);

  const [categories, catalog] = await Promise.all([
    api<{ items: string[] }>('/products/categories'),
    api<Paginated<CatalogProduct>>(`/products?${params}`),
  ]);

  const totalPages = Math.max(1, Math.ceil(catalog.total / catalog.limit));

  const hrefFor = (target: number) => {
    const query = new URLSearchParams();
    if (search) query.set('search', search);
    if (category) query.set('category', category);
    if (target > 1) query.set('page', String(target));
    const value = query.toString();
    return value ? `/products?${value}` : '/products';
  };

  return (
    <main>
      <PageHeader
        title="Catalog"
        description="Every product, any time. Checkout opens only while a product's drop is live."
      />
      <Container className="pt-8 pb-20">
        <CatalogFilters
          categories={categories.items}
          activeCategory={category}
          search={search}
        />
        {catalog.items.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {catalog.items.map((product, index) => (
              <Reveal key={product.id} delay={(index % 4) * 0.06}>
                <ProductTile product={product} />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No products match"
            body="Try a different search or clear the filters."
            href="/products"
            cta="Clear filters"
          />
        )}
        <Pagination
          page={page}
          totalPages={totalPages}
          prevHref={page > 1 ? hrefFor(page - 1) : null}
          nextHref={page < totalPages ? hrefFor(page + 1) : null}
        />
      </Container>
    </main>
  );
}
