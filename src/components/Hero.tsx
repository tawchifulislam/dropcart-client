import Link from 'next/link';
import type { DropWithProduct } from '@/lib/types';
import { AnimatedHeading } from './AnimatedHeading';
import { Container } from './Container';
import { DropCard } from './DropCard';
import { PunchRow } from './PunchRow';
import { TiltStage } from './TiltStage';

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
      aria-labelledby="hero-heading"
      className="border-line relative isolate overflow-hidden border-b-[1.5px]"
    >
      <div
        aria-hidden="true"
        className="animate-drift absolute inset-0 -z-10 bg-[radial-gradient(var(--line)_1.2px,transparent_1.2px)] mask-[linear-gradient(to_bottom,black,transparent)] bg-size-[28px_28px] opacity-15"
      />
      <Container className="grid items-center gap-12 py-12 md:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-24">
        <div>
          <AnimatedHeading
            id="hero-heading"
            lines={[
              { text: 'Limited drops.' },
              { text: 'Every unit counted.', className: 'text-brand' },
            ]}
          />
          <p className="animate-rise text-ink-soft mt-5 max-w-prose text-lg [animation-delay:600ms]">
            Products go live on a schedule with a fixed number of units. Reserve
            yours for five minutes, pay, and it is yours. When the last unit is
            punched out, the drop is over.
          </p>
          <PunchRow />
          <div className="animate-rise mt-8 flex flex-wrap gap-3 [animation-delay:750ms]">
            {drop && (
              <Link href={`/drops/${drop.id}`} className="btn btn-reserve">
                {drop.status === 'live'
                  ? 'View the live drop'
                  : 'View the next drop'}
              </Link>
            )}
            <Link href="/products" className="btn">
              Browse catalog
            </Link>
          </div>
          <dl className="animate-rise mt-8 flex gap-8 [animation-delay:900ms]">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-ink-soft text-sm">{stat.label}</dt>
                <dd className="display text-3xl">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {drop && (
          <div className="animate-rise relative [animation-delay:300ms]">
            <TiltStage>
              <DropCard drop={drop} featured />
            </TiltStage>
            <div
              aria-hidden="true"
              className="ticket animate-float pointer-events-none absolute top-12 -left-8 hidden items-center gap-2 px-3 py-2 text-sm font-bold lg:flex"
            >
              <span className="badge badge-live">Live</span>
              {drop.stockRemaining} left
            </div>
            <div
              aria-hidden="true"
              className="ticket animate-float pointer-events-none absolute -right-4 bottom-28 hidden items-center gap-2 px-3 py-2 text-sm font-bold [animation-delay:1.2s] lg:flex"
            >
              <span className="badge badge-upcoming">5 min</span>
              hold while you pay
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
