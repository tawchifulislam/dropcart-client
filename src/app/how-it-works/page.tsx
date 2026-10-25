import type { Metadata } from 'next';
import { Container } from '@/components/Container';
import { CtaBand } from '@/components/CtaBand';
import { Faq } from '@/components/Faq';
import { PageHeader } from '@/components/PageHeader';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';

export const metadata: Metadata = {
  title: 'How it works | DropCart',
  description:
    'How limited drops, five-minute reservations and checkout work on DropCart.',
};

const steps = [
  {
    title: 'A drop is scheduled',
    body: 'Every drop has a start time, an end time, a drop price and a fixed number of units. You can browse the catalog any time and see exactly when each drop opens.',
  },
  {
    title: 'Reserve your unit',
    body: 'While a drop is live, press Reserve. Taking a unit from the stock is one atomic operation, so when two people press at the same instant, exactly one of them gets the last unit.',
  },
  {
    title: 'Pay within five minutes',
    body: 'Your unit is held in your name for five minutes while you pay securely with Stripe.',
  },
  {
    title: 'Paid, or released',
    body: 'Pay in time and the order is yours. Miss the window and the unit goes straight back into the drop for the next person.',
  },
];

const faqs = [
  {
    question:
      'What happens if two people reserve the last unit at the same time?',
    answer:
      'Only one reservation succeeds. The stock is decremented in a single database operation that only works if enough units remain, so a unit can never be sold twice. The other person sees a clear sold out message.',
  },
  {
    question: 'How long is my reservation held?',
    answer:
      'Five minutes. A timer on the drop page shows exactly how much time is left.',
  },
  {
    question: 'What if I do not pay in time?',
    answer:
      'The reservation expires and the unit returns to the drop, so someone else can reserve it. You are never charged for an expired reservation.',
  },
  {
    question: 'Can I buy a product outside of a drop?',
    answer:
      "You can browse every product at any time, but checkout is only possible while the product's drop is live and stock remains.",
  },
  {
    question: 'Can I find out when a drop starts?',
    answer:
      'Every upcoming drop shows a countdown. Reminders by email are planned so you will not miss the start.',
  },
];

export default function HowItWorksPage() {
  return (
    <main>
      <PageHeader
        title="How it works"
        description="Limited drops are simple: a fixed number of units, a short window to reserve, and a fair race for every unit."
      />
      <Container className="pb-20">
        <section aria-labelledby="steps-heading" className="pt-12">
          <SectionHeading id="steps-heading" title="From drop to doorstep" />
          <ol className="border-line relative mt-8 space-y-8 border-l-[1.5px] border-dashed pl-8">
            {steps.map((step, index) => (
              <li key={step.title} className="relative">
                <span
                  aria-hidden="true"
                  className="numerals border-line bg-surface absolute top-0 left-[-3.2rem] grid size-9 place-items-center rounded-full border-[1.5px] text-lg"
                >
                  {index + 1}
                </span>
                <Reveal>
                  <h3 className="display text-xl">{step.title}</h3>
                  <p className="text-ink-soft mt-2 max-w-prose">{step.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="faq-heading" className="pt-16">
          <SectionHeading id="faq-heading" title="Questions" />
          <div className="mt-5">
            <Faq items={faqs} />
          </div>
        </section>

        <CtaBand />
      </Container>
    </main>
  );
}
