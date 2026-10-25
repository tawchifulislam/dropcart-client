import { Reveal } from './Reveal';
import { SectionHeading } from './SectionHeading';

const steps = [
  {
    title: 'A drop goes live',
    body: 'Each product opens on a schedule with a fixed number of units.',
  },
  {
    title: 'Reserve for five minutes',
    body: 'Your unit is held in your name while you check out.',
  },
  {
    title: 'Pay before time runs out',
    body: 'Unpaid reservations release the unit back to the drop.',
  },
];

export function HowItWorks() {
  return (
    <section aria-labelledby="how-heading" className="pt-16">
      <SectionHeading
        id="how-heading"
        title="How a drop works"
        href="/how-it-works"
        linkLabel="Full guide"
      />
      <ol className="mt-5 grid gap-3 md:grid-cols-3">
        {steps.map((step, index) => (
          <li key={step.title}>
            <Reveal delay={index * 0.08} className="h-full">
              <div className="ticket flex h-full gap-4 p-4">
                <span
                  aria-hidden="true"
                  className="numerals text-brand text-3xl"
                >
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-bold">{step.title}</h3>
                  <p className="text-ink-soft mt-1 text-sm">{step.body}</p>
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
