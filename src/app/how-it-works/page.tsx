import type { Metadata } from 'next';
import { Container } from '@/components/Container';
import { CtaBand } from '@/components/CtaBand';
import { Faq } from '@/components/Faq';
import { PageHeader } from '@/components/PageHeader';
import { RouteMap } from '@/components/RouteMap';
import { SectionHeading } from '@/components/SectionHeading';

export const metadata: Metadata = {
  title: 'How it works',
  description:
    'How limited drops, five-minute reservations and checkout work on DropCart.',
};

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
        <section aria-labelledby="route-heading" className="pt-12">
          <SectionHeading id="route-heading" title="The route of a unit" />
          <p className="text-ink-soft mt-2 max-w-prose">
            Follow one unit from the moment a drop is scheduled to the moment it
            is yours, or back on sale for the next person.
          </p>
          <div className="mt-8">
            <RouteMap />
          </div>
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
