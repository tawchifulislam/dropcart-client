import type { Metadata } from 'next';
import { Container } from '@/components/Container';
import { CtaBand } from '@/components/CtaBand';
import { Faq } from '@/components/Faq';
import { PageHeader } from '@/components/PageHeader';
import { RouteMap } from '@/components/RouteMap';
import { SectionHeading } from '@/components/SectionHeading';
import { FAQS } from '@/lib/faqs';

export const metadata: Metadata = {
  title: 'How it works',
  description:
    'How limited drops, five-minute reservations and checkout work on DropCart.',
};

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
            <Faq items={FAQS} />
          </div>
        </section>

        <CtaBand />
      </Container>
    </main>
  );
}
