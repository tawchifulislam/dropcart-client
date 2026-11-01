import Link from 'next/link';
import { PunchRow } from './PunchRow';
import { Reveal } from './Reveal';
import { SectionHeading } from './SectionHeading';

export function FeatureGrid() {
  return (
    <section aria-labelledby="why-heading" className="pt-20">
      <SectionHeading id="why-heading" title="Built for the rush" />
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Reveal className="md:col-span-2">
          <article className="ticket h-full p-6">
            <h3 className="display text-2xl">Every unit counted</h3>
            <p className="text-ink-soft mt-2 max-w-prose">
              A drop has a fixed number of units. Each purchase punches one out,
              live, for everyone watching.
            </p>
            <PunchRow />
          </article>
        </Reveal>

        <Reveal delay={0.08}>
          <article className="ticket h-full p-6">
            <h3 className="display text-2xl">One fair race</h3>
            <p className="text-ink-soft mt-2">
              When two people press Reserve at the same instant, exactly one
              gets the last unit. Stock is taken in a single atomic database
              operation.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="badge badge-live">1 unit left</span>
              <span className="badge">2 buyers</span>
              <span className="badge badge-ok">1 winner</span>
            </div>
          </article>
        </Reveal>

        <Reveal delay={0.04}>
          <article className="ticket h-full p-6">
            <h3 className="display text-2xl">Five minute hold</h3>
            <p className="text-ink-soft mt-2">
              Reserve a unit and it is yours while you pay. Miss the window and
              it goes back to the drop.
            </p>
            <p className="numerals mt-5 text-5xl">5:00</p>
            <div className="hold mt-3" aria-hidden="true">
              <i className="animate-hold-drain" style={{ width: '100%' }} />
            </div>
          </article>
        </Reveal>

        <Reveal delay={0.12} className="md:col-span-2">
          <article className="ticket flex h-full flex-col gap-5 p-6 sm:flex-row sm:items-center">
            <div className="sm:w-1/2">
              <h3 className="display text-2xl">Shop with the Copilot</h3>
              <p className="text-ink-soft mt-2">
                Describe what you want and your budget. The Copilot searches the
                real catalog and fills your cart. It never invents a product.
              </p>
              <Link href="/copilot" className="btn btn-primary mt-5">
                Try the Copilot
              </Link>
            </div>
            <div className="space-y-2 text-sm sm:w-1/2" aria-hidden="true">
              <p className="bg-ink text-canvas ml-auto w-fit max-w-[90%] rounded-[14px_14px_4px_14px] px-3 py-2">
                A gift under ৳2,000 for a rainy day
              </p>
              <p className="rounded-control bg-sunk text-ink-soft w-fit px-3 py-1.5">
                Searched the store: gift, 2 found
              </p>
              <p className="ticket w-fit max-w-[90%] rounded-[14px_14px_14px_4px] px-3 py-2">
                Two matches. The shell jacket is live right now.
              </p>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
