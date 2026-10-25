export type DropStatus = 'upcoming' | 'live' | 'ended';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  images: string[];
  variants: { label: string; sku?: string }[];
  specs: Record<string, string>;
  basePrice: number;
}

export interface Drop {
  id: string;
  productId: string;
  startsAt: string;
  endsAt: string;
  dropPrice: number;
  stockTotal: number;
  stockRemaining: number;
  status: DropStatus;
  soldOut: boolean;
}

export interface DropWithProduct extends Drop {
  product: Product;
}

export interface CatalogProduct extends Product {
  drop: Drop | null;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'shopper' | 'admin';
}

export interface ReservationView {
  id: string;
  dropId: string;
  quantity: number;
  status: 'active' | 'completed' | 'expired' | 'released';
  expiresAt: string;
  expiresInMs: number;
  holdMs: number;
}
