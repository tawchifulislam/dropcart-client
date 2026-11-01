'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Reveal } from './Reveal';
import { SectionHeading } from './SectionHeading';

const STEPS = [
  {
    title: 'A drop goes live',
    body: 'Each product opens on a schedule with a fixed number of units.',
    path: 'M3 7h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4z',
  },
  {
    title: 'Reserve for five minutes',
    body: 'Your unit is held in your name while you check out.',
    path: 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
  },
  {
    title: 'Pay before time runs out',
    body: 'Unpaid reservations release the unit back to the drop.',
    path: 'M3 7h18v10H3zM3 11h18',
  },
];

export function HowItWorks() {
  const reduceMotion = useReducedMotion();

  return (
    <section aria-labelledby="how-heading" className="pt-20">
      <SectionHeading
        id="how-heading"
        title="How a drop works"
        href="/how-it-works"
        linkLabel="Full guide"
      />
      <ol className="relative mt-10 grid gap-10 md:grid-cols-3 md:gap-6">
        <motion.span
          aria-hidden="true"
          className="border-brand absolute inset-x-[16.67%] top-7 hidden origin-left border-t-[3px] border-dashed md:block"
          initial={reduceMotion ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}
        />
        {STEPS.map((step, index) => (
          <li key={step.title}>
            <Reveal delay={index * 0.12} className="h-full">
              <div className="flex items-start gap-4 md:flex-col md:items-center md:text-center">
                <span className="border-line bg-brand text-on-brand shadow-pop relative z-10 grid size-14 shrink-0 place-items-center rounded-full border-[1.5px]">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d={step.path} />
                  </svg>
                </span>
                <div>
                  <p className="numerals text-ink-soft text-sm">
                    Step {index + 1}
                  </p>
                  <h3 className="display text-xl">{step.title}</h3>
                  <p className="text-ink-soft mt-1 max-w-xs">{step.body}</p>
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
