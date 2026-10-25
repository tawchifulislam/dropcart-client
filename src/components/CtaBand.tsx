import Link from 'next/link';
import { Reveal } from './Reveal';

export function CtaBand() {
  return (
    <section aria-labelledby="cta-heading" className="pt-16">
      <Reveal>
        <div className="ticket bg-ink text-canvas flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-10">
          <div>
            <h2 id="cta-heading" className="display text-2xl md:text-3xl">
              The next drop will not wait.
            </h2>
            <p className="mt-2 max-w-prose opacity-80">
              Create an account now so you can reserve the moment a drop goes
              live.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/register" className="btn btn-reserve">
              Create account
            </Link>
            <Link href="/drops" className="btn">
              See upcoming drops
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
