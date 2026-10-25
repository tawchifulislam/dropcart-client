import type { MetadataRoute } from 'next';
import { api } from '@/lib/api';
import { SITE_URL } from '@/lib/site';
import type { CatalogProduct, DropWithProduct, Paginated } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, live, upcoming] = await Promise.all([
    api<Paginated<CatalogProduct>>('/products?limit=48'),
    api<{ items: DropWithProduct[] }>('/drops/live'),
    api<{ items: DropWithProduct[] }>('/drops/upcoming'),
  ]);

  const pages = ['', '/drops', '/products', '/how-it-works'].map((path) => ({
    url: `${SITE_URL}${path}`,
  }));
  const productPages = products.items.map((product) => ({
    url: `${SITE_URL}/products/${product.slug}`,
  }));
  const dropPages = [...live.items, ...upcoming.items].map((drop) => ({
    url: `${SITE_URL}/drops/${drop.id}`,
  }));

  return [...pages, ...productPages, ...dropPages];
}
