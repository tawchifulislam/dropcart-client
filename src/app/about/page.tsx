import type { Metadata } from 'next';
import Link from 'next/link';
import { ArchitectureDiagram } from '@/components/ArchitectureDiagram';
import { Container } from '@/components/Container';
import { GuestButton } from '@/components/GuestButton';
import { PageHeader } from '@/components/PageHeader';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';

export const metadata: Metadata = {
  title: 'About this project',
  description:
    'DropCart is a portfolio project: a limited-drop store with oversell-proof reservations, Stripe checkout, an AI shopping copilot and an admin dashboard.',
};

const REPO = process.env.NEXT_PUBLIC_REPO_URL;
const API_REPO = process.env.NEXT_PUBLIC_API_REPO_URL;
const LOAD_TEST = null as { buyers: number; stock: number } | null;

const TRY_STEPS = [
  {
    title: 'Continue as a guest',
    body: 'No sign-up needed. A temporary account is created for you and deleted after a day.',
  },
  {
    title: 'Reserve a live drop',
    body: 'Open a live drop and press Reserve. One unit is taken from the stock in a single atomic update and held for five minutes.',
    href: '/drops',
    cta: 'See live drops',
  },
  {
    title: 'Pay with a test card',
    body: 'Use 4242 4242 4242 4242, any future date and any CVC. No real money is charged.',
  },
  {
    title: 'Ask the Copilot',
    body: 'Try a gift under 2000 taka, then ask for something that does not exist and watch it say so.',
    href: '/copilot',
    cta: 'Open the Copilot',
  },
  {
    title: 'Open your receipt',
    body: 'Your account page lists every reservation, and paid ones link to a receipt.',
    href: '/account',
    cta: 'My account',
  },
];

const DECISIONS = [
  {
    title: 'Oversell-proof reservations',
    body: 'Taking stock is one atomic MongoDB update that checks the drop is live and enough units remain. No locks, no transactions, and a unit can never be sold twice.',
    where: 'src/services/reservation.service.ts',
  },
  {
    title: 'Idempotent payment fulfillment',
    body: 'Webhooks can repeat or arrive late. Fulfillment runs exactly once, and a payment that lands after the hold ended either re-takes the stock or is refunded automatically.',
    where: 'src/services/payment.service.ts',
  },
  {
    title: 'Payments behind an interface',
    body: 'Stripe Checkout and a mock provider share one code path, so the demo works anywhere and a local gateway can be added without touching business logic.',
    where: 'src/payments/',
  },
  {
    title: 'A grounded AI copilot',
    body: 'Gemini function calling against the real catalog. Product cards come from database rows, tool arguments are validated, and each user is rate limited.',
    where: 'src/copilot/',
  },
  {
    title: 'Roles with ownership',
    body: 'Shopper, admin and superadmin. Admins only see their own products, drops and revenue, roles are read from the database on every request, and foreign ids return 404.',
    where: 'src/middleware/auth.ts',
  },
];

const STACK = [
  'Next.js 16',
  'React 19',
  'TypeScript',
  'Tailwind CSS 4',
  'Framer Motion',
  'Recharts',
  'Express 5',
  'MongoDB',
  'Stripe',
  'Gemini API',
  'Vercel',
  'Render',
];

export default function AboutPage() {
  return (
    <main>
      <PageHeader
        title="About this project"
        description="DropCart is a portfolio project. It looks like a store, but the interesting part is what happens when many people try to buy the last unit at the same time."
      />
      <Container className="pb-20">
        <section aria-labelledby="try-heading" className="pt-12">
          <SectionHeading id="try-heading" title="Try it in 60 seconds" />
          <ol className="mt-6 space-y-4">
            {TRY_STEPS.map((step, index) => (
              <li
                key={step.title}
                className="ticket flex flex-wrap items-center gap-4 p-4"
              >
                <span
                  aria-hidden="true"
                  className="numerals border-line bg-brand text-on-brand grid size-10 shrink-0 place-items-center rounded-full border-[1.5px] text-lg"
                >
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold">{step.title}</h3>
                  <p className="text-ink-soft text-sm">{step.body}</p>
                </div>
                {index === 0 && (
                  <GuestButton className="btn btn-primary min-h-11 text-sm" />
                )}
                {step.href && (
                  <Link href={step.href} className="btn min-h-11 text-sm">
                    {step.cta}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="architecture-heading" className="pt-16">
          <SectionHeading id="architecture-heading" title="Architecture" />
          <p className="text-ink-soft mt-2 max-w-prose">
            The browser only talks to the web app. API calls are rewritten to
            the Express API, so the session cookie is first-party and needs no
            CORS.
          </p>
          <div className="mt-5">
            <ArchitectureDiagram />
          </div>
        </section>

        <section aria-labelledby="decisions-heading" className="pt-16">
          <SectionHeading
            id="decisions-heading"
            title="Engineering decisions"
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {DECISIONS.map((decision, index) => (
              <Reveal key={decision.title} delay={(index % 2) * 0.08}>
                <article className="ticket h-full p-5">
                  <h3 className="display text-xl">{decision.title}</h3>
                  <p className="text-ink-soft mt-2">{decision.body}</p>
                  <p className="mt-3 text-sm">
                    <span className="text-ink-soft">Where to look: </span>
                    <code className="font-bold">{decision.where}</code>
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section aria-labelledby="verified-heading" className="pt-16">
          <SectionHeading id="verified-heading" title="How it is verified" />
          <ul className="text-ink-soft mt-5 max-w-prose list-disc space-y-2 pl-5">
            <li>
              A load test fires many simultaneous reservation requests at a drop
              and checks that exactly as many succeed as there are units.
            </li>
            <li>
              A payment test covers normal fulfillment, repeated webhooks, a
              late payment that is honored, and a late payment that is refunded.
            </li>
            <li>
              A copilot test checks that unknown products produce no cards.
            </li>
          </ul>
          {LOAD_TEST && (
            <p className="rounded-control bg-ok-wash text-ok mt-4 max-w-prose p-3 font-bold">
              Last load test: {LOAD_TEST.buyers} simultaneous buyers,{' '}
              {LOAD_TEST.stock} units, exactly {LOAD_TEST.stock} succeeded.
            </p>
          )}
        </section>

        <section aria-labelledby="stack-heading" className="pt-16">
          <SectionHeading id="stack-heading" title="Stack and notes" />
          <ul className="mt-5 flex flex-wrap gap-2">
            {STACK.map((item) => (
              <li key={item} className="badge">
                {item}
              </li>
            ))}
          </ul>
          <p className="text-ink-soft mt-4 max-w-prose text-sm">
            Prices are in Bangladeshi taka (৳) and times are shown in Dhaka time
            (GMT+6). Payments run in test mode.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {REPO && (
              <a
                href={REPO}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Web app source
              </a>
            )}
            {API_REPO && (
              <a
                href={API_REPO}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
              >
                API source
              </a>
            )}
          </div>
        </section>
      </Container>
    </main>
  );
}
