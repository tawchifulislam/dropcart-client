import type { Metadata } from 'next';
import { AdminDrops } from '@/components/AdminDrops';

export const metadata: Metadata = { title: 'Drops' };

export default function AdminDropsPage() {
  return <AdminDrops />;
}
