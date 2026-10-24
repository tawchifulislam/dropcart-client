import Link from 'next/link';
import type { DropWithProduct } from '@/lib/types';
import { Container } from './Container';
import { DropCard } from './DropCard';

interface Props {
  drop?: DropWithProduct;
  liveCount: number;
  upcomingCount: number;
}

export function Hero({ drop, liveCount, upcomingCount }: Props) {
  const stats = [
    { label: 'Live now', value: liveCount },
    { label: 'Dropping soon', value: upcomingCount },
  ];

  return (
    <section
      id="drops"
      aria-labelledby="hero-heading"
      className="border-line border-b-[1.5px]"
    >
      <Container className="grid items-center gap-8 py-10 md:py-14 lg:grid-cols-2 lg:gap-14">
        <div>
          <h1
            id="hero-heading"
            className="display text-2xl sm:text-3xl lg:text-4xl"
          >
            Limited drops.
            <span className="text-brand block">Every unit counted.</span>
          </h1>
          <p className="text-ink-soft mt-4 max-w-prose text-lg">
            Products go live on a schedule with a fixed number of units. Reserve
            yours for five minutes, pay, and it is yours. When the last unit is
            punched out, the drop is over.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {drop && (
              <Link href={`/drops/${drop.id}`} className="btn btn-reserve">
                {drop.status === 'live'
                  ? 'View the live drop'
                  : 'View the next drop'}
              </Link>
            )}
            <Link href="/#catalog" className="btn">
              Browse catalog
            </Link>
          </div>
          <dl className="mt-8 flex gap-8">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-ink-soft text-sm">{stat.label}</dt>
                <dd className="display text-2xl">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        {drop && <DropCard drop={drop} featured />}
      </Container>
    </section>
  );
}
