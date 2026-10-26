import { CategoryTiles } from '@/components/CategoryTiles';
import { Container } from '@/components/Container';
import { CtaBand } from '@/components/CtaBand';
import { DropCard } from '@/components/DropCard';
import { Hero } from '@/components/Hero';
import { HowItWorks } from '@/components/HowItWorks';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { Ticker } from '@/components/Ticker';
import { UpcomingDropRow } from '@/components/UpcomingDropRow';
import { api } from '@/lib/api';
import type { DropWithProduct } from '@/lib/types';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'DropCart | Limited drops, every unit counted' },
};

export default async function HomePage() {
  const [live, upcoming, categories] = await Promise.all([
    api<{ items: DropWithProduct[] }>('/drops/live'),
    api<{ items: DropWithProduct[] }>('/drops/upcoming'),
    api<{ items: string[] }>('/products/categories'),
  ]);

  const liveSorted = [...live.items].sort(
    (a, b) => Number(a.soldOut) - Number(b.soldOut),
  );
  const [featuredLive, ...otherLive] = liveSorted;
  const featured = featuredLive ?? upcoming.items[0];
  const upcomingList = featuredLive ? upcoming.items : upcoming.items.slice(1);

  return (
    <main>
      <Hero
        drop={featured}
        liveCount={live.items.length}
        upcomingCount={upcoming.items.length}
      />
      <Ticker drops={[...live.items, ...upcoming.items]} />
      <Container className="pb-20">
        {otherLive.length > 0 && (
          <section aria-labelledby="live-heading" className="pt-16">
            <SectionHeading
              id="live-heading"
              title="Also live now"
              href="/drops"
            />
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {otherLive.slice(0, 3).map((drop, index) => (
                <Reveal key={drop.id} delay={index * 0.08}>
                  <DropCard drop={drop} />
                </Reveal>
              ))}
            </div>
          </section>
        )}

        <HowItWorks />
        <CategoryTiles categories={categories.items} />

        {upcomingList.length > 0 && (
          <section aria-labelledby="upcoming-heading" className="pt-16">
            <SectionHeading
              id="upcoming-heading"
              title="Dropping soon"
              href="/drops"
            />
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {upcomingList.slice(0, 3).map((drop, index) => (
                <Reveal key={drop.id} delay={index * 0.08}>
                  <UpcomingDropRow drop={drop} />
                </Reveal>
              ))}
            </div>
          </section>
        )}

        <CtaBand />
      </Container>
    </main>
  );
}
