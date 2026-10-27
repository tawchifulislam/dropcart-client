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

export interface ReservationHistoryItem {
  id: string;
  dropId: string;
  quantity: number;
  status: ReservationView['status'];
  expiresAt: string;
  createdAt: string;
  dropPrice: number;
  product: { id: string; name: string; slug: string; image?: string };
  expiresInMs: number;
  holdMs: number;
  orderId: string | null;
}
export interface CheckoutSession {
  provider: 'stripe' | 'mock';
  url: string;
  orderId: string;
  amount: number;
}

export interface OrderView {
  id: string;
  status: 'pending' | 'paid' | 'cancelled' | 'refunded' | 'refund_failed';
  amount: number;
  quantity: number;
  dropId: string;
  reservationId: string;
  paidAt: string | null;
  product: { name: string; slug: string; image?: string } | null;
}

export interface ProductCard {
  id: string;
  name: string;
  slug: string;
  image?: string;
  category: string;
  price: number;
  basePrice: number;
  status: 'live' | 'upcoming' | 'no_drop' | 'sold_out';
  stockRemaining?: number;
  dropId?: string;
}

export interface CopilotAction {
  type: 'added_to_cart';
  productId: string;
  name: string;
  quantity: number;
}

export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  trace: string[];
  products: ProductCard[];
  actions: CopilotAction[];
  createdAt: string;
}

export interface CartItem {
  quantity: number;
  product: CatalogProduct;
}
export interface AdminDropSummary extends Drop {
  productName: string;
  revenue: number;
  paidOrders: number;
  unitsSold: number;
}

export interface AdminOverview {
  totals: {
    revenue: number;
    paidOrders: number;
    heldUnits: number;
    liveDrops: number;
  };
  drops: AdminDropSummary[];
}

export interface AdminOrder {
  id: string;
  status: OrderView['status'];
  amount: number;
  quantity: number;
  createdAt: string;
  customer: string;
}

export interface AdminDropStats {
  drop: Drop;
  product: Product | null;
  revenue: number;
  paidOrders: number;
  unitsSold: number;
  heldUnits: number;
  pendingOrders: number;
  recentOrders: AdminOrder[];
}
