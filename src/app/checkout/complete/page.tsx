import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CheckoutComplete } from '@/components/CheckoutComplete';
import { Container } from '@/components/Container';
import { DropCard } from '@/components/DropCard';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { api } from '@/lib/api';
import type { DropWithProduct } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Order status',
  robots: { index: false },
};

interface Props {
  searchParams: Promise<{ order?: string }>;
}

export default async function CheckoutCompletePage({ searchParams }: Props) {
  const { order } = await searchParams;
  if (!order) notFound();

  const live = await api<{ items: DropWithProduct[] }>('/drops/live').catch(
    () => ({
      items: [] as DropWithProduct[],
    }),
  );
  const more = live.items.filter((drop) => !drop.soldOut).slice(0, 3);

  return (
    <main>
      <Container className="py-10 md:py-14">
        <CheckoutComplete orderId={order} />
        {more.length > 0 && (
          <section aria-labelledby="more-heading" className="pt-16">
            <SectionHeading
              id="more-heading"
              title="More drops live now"
              href="/drops"
            />
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((drop, index) => (
                <Reveal key={drop.id} delay={index * 0.08}>
                  <DropCard drop={drop} />
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </Container>
    </main>
  );
}
