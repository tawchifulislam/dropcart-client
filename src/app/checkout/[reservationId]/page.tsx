import type { Metadata } from 'next';
import { CheckoutView } from '@/components/CheckoutView';

export const metadata: Metadata = {
  title: 'Checkout',
  robots: { index: false },
};

interface Props {
  params: Promise<{ reservationId: string }>;
}

export default async function CheckoutPage({ params }: Props) {
  const { reservationId } = await params;
  return <CheckoutView reservationId={reservationId} />;
}
