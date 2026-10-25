import type { Metadata } from 'next';
import { Container } from '@/components/Container';
import { DropCard } from '@/components/DropCard';
import { EmptyState } from '@/components/EmptyState';
import { PageHeader } from '@/components/PageHeader';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { api } from '@/lib/api';
import type { DropWithProduct } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Drops | DropCart',
  description:
    'Live drops and upcoming drops. Every drop has a fixed number of units.',
};

export default async function DropsPage() {
  const [live, upcoming] = await Promise.all([
    api<{ items: DropWithProduct[] }>('/drops/live'),
    api<{ items: DropWithProduct[] }>('/drops/upcoming'),
  ]);

  return (
    <main>
      <PageHeader
        title="Drops"
        description="Live now and dropping soon. Every drop has a fixed number of units, and when they are gone, they are gone."
      />
      <Container className="pb-20">
        <section aria-labelledby="live-heading" className="pt-10">
          <SectionHeading id="live-heading" title="Live now" />
          {live.items.length > 0 ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {live.items.map((drop, index) => (
                <Reveal key={drop.id} delay={(index % 3) * 0.08}>
                  <DropCard drop={drop} />
                </Reveal>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Nothing is live right now"
              body="Check the upcoming drops below and come back when one starts."
            />
          )}
        </section>

        <section aria-labelledby="upcoming-heading" className="pt-12">
          <SectionHeading id="upcoming-heading" title="Dropping soon" />
          {upcoming.items.length > 0 ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.items.map((drop, index) => (
                <Reveal key={drop.id} delay={(index % 3) * 0.08}>
                  <DropCard drop={drop} />
                </Reveal>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No drops are scheduled"
              body="New drops are announced here. Browse the catalog in the meantime."
              href="/products"
              cta="Browse catalog"
            />
          )}
        </section>
      </Container>
    </main>
  );
}
