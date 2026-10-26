'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface Stop {
  title: string;
  short: string;
  detail: string;
}

const STATIONS: (Stop & { x: number })[] = [
  {
    x: 90,
    title: 'Drop scheduled',
    short: 'Fixed units',
    detail:
      'Every drop has a start time, an end time, a drop price and a fixed number of units. You can browse the catalog any time and see exactly when each drop opens.',
  },
  {
    x: 290,
    title: 'Drop goes live',
    short: 'Reserve opens',
    detail:
      'When the start time arrives the drop goes live and Reserve opens. Checkout is only possible while a drop is live and stock remains.',
  },
  {
    x: 490,
    title: 'You reserve',
    short: 'One atomic update',
    detail:
      'Taking a unit from the stock is one atomic operation, so when two people press at the same instant, exactly one of them gets the last unit.',
  },
  {
    x: 690,
    title: 'Five minute hold',
    short: 'Held in your name',
    detail:
      'Your unit is held in your name for five minutes while you pay securely with Stripe.',
  },
];

const OUTCOMES: (Stop & { y: number; tone: 'ok' | 'live' })[] = [
  {
    y: 90,
    tone: 'ok',
    title: 'Paid',
    short: 'Order confirmed',
    detail: 'Pay in time and the order is yours.',
  },
  {
    y: 250,
    tone: 'live',
    title: 'Released',
    short: 'Back in the drop',
    detail:
      'Miss the window, or release the unit yourself, and it goes straight back into the drop for the next person.',
  },
];

const MAIN = 'M90 170 H690';
const PAID = 'M690 170 C770 170 790 90 880 90';
const RELEASED = 'M690 170 C770 170 790 250 880 250';
const RETURN = 'M880 272 C880 372 290 372 290 208';
const RIDE = 'M90 170 H690 C770 170 790 90 880 90';
const TICKET = 'M-14 -9h28v6a3 3 0 0 0 0 6v6h-28v-6a3 3 0 0 0 0-6z';
const VIEW = { once: true, margin: '-60px' } as const;
const POP_ORIGIN = {
  transformBox: 'fill-box',
  transformOrigin: 'center',
} as const;

export function RouteMap() {
  const reduce = useReducedMotion();

  const draw = (delay: number, duration: number) => ({
    initial: { pathLength: reduce ? 1 : 0 },
    whileInView: { pathLength: 1 },
    viewport: VIEW,
    transition: {
      duration: reduce ? 0 : duration,
      delay: reduce ? 0 : delay,
      ease: 'easeInOut' as const,
    },
  });

  const pop = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, scale: 0.6 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: VIEW,
    transition: { duration: 0.4, delay, ease: [0.2, 0.8, 0.2, 1] as const },
  });

  const fade = (delay: number) => ({
    initial: reduce ? false : { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: VIEW,
    transition: { duration: 0.4, delay },
  });

  return (
    <div>
      <svg
        viewBox="0 0 1100 390"
        role="img"
        aria-labelledby="route-title route-desc"
        className="hidden w-full lg:block"
      >
        <title id="route-title">The route of a unit</title>
        <desc id="route-desc">
          A unit moves from a scheduled drop to live, is reserved and held for
          five minutes, then is either paid or released back to the drop.
        </desc>

        <motion.path
          d={RETURN}
          fill="none"
          strokeWidth={4}
          strokeDasharray="10 10"
          strokeLinecap="round"
          className="stroke-sold"
          {...fade(2.2)}
        />
        <motion.path
          d="M290 192 L281 208 L299 208 z"
          className="fill-sold"
          {...fade(2.2)}
        />
        <motion.text
          x={585}
          y={326}
          textAnchor="middle"
          fontSize={15}
          className="fill-ink-soft"
          {...fade(2.2)}
        >
          Released units go back on sale
        </motion.text>

        <motion.path
          d={MAIN}
          fill="none"
          strokeWidth={10}
          strokeLinecap="round"
          className="stroke-brand"
          {...draw(0, 1.2)}
        />
        <motion.path
          d={PAID}
          fill="none"
          strokeWidth={10}
          strokeLinecap="round"
          className="stroke-ok"
          {...draw(1.1, 0.8)}
        />
        <motion.path
          d={RELEASED}
          fill="none"
          strokeWidth={10}
          strokeLinecap="round"
          className="stroke-live"
          {...draw(1.1, 0.8)}
        />

        {STATIONS.map((station, index) => (
          <g key={station.title}>
            <motion.g {...pop(0.25 * index)} style={POP_ORIGIN}>
              <circle
                cx={station.x}
                cy={170}
                r={20}
                strokeWidth={3}
                className="fill-brand stroke-ink"
              />
              <text
                x={station.x}
                y={177}
                textAnchor="middle"
                fontSize={20}
                className="numerals fill-on-brand"
              >
                {index + 1}
              </text>
            </motion.g>
            <motion.g {...fade(0.25 * index)}>
              <text
                x={station.x}
                y={128}
                textAnchor="middle"
                fontSize={22}
                className="display fill-ink"
              >
                {station.title}
              </text>
              <text
                x={station.x}
                y={214}
                textAnchor="middle"
                fontSize={15}
                className="fill-ink-soft"
              >
                {station.short}
              </text>
            </motion.g>
          </g>
        ))}

        {OUTCOMES.map((outcome, index) => (
          <g key={outcome.title}>
            <motion.g {...pop(1.7 + index * 0.15)} style={POP_ORIGIN}>
              <circle
                cx={880}
                cy={outcome.y}
                r={22}
                strokeWidth={3}
                className={`stroke-ink ${outcome.tone === 'ok' ? 'fill-ok' : 'fill-live'}`}
              />
              <path
                transform={`translate(880 ${outcome.y})`}
                d={
                  outcome.tone === 'ok'
                    ? 'M-9 1l6 6 12-13'
                    : 'M10 0H-8M-8 0l7-7M-8 0l7 7'
                }
                fill="none"
                strokeWidth={3.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="stroke-canvas"
              />
            </motion.g>
            <motion.g {...fade(1.7 + index * 0.15)}>
              <text
                x={918}
                y={outcome.y - 2}
                fontSize={22}
                className="display fill-ink"
              >
                {outcome.title}
              </text>
              <text
                x={918}
                y={outcome.y + 22}
                fontSize={15}
                className="fill-ink-soft"
              >
                {outcome.short}
              </text>
            </motion.g>
          </g>
        ))}

        {!reduce && (
          <g>
            <path
              d={TICKET}
              strokeWidth={2.5}
              className="fill-upcoming stroke-ink"
            />
            <animateMotion dur="9s" repeatCount="indefinite" path={RIDE} />
          </g>
        )}
      </svg>

      <dl className="mt-8 hidden grid-cols-3 gap-6 lg:grid">
        {[...STATIONS, ...OUTCOMES].map((stop) => (
          <div key={stop.title}>
            <dt className="display text-lg">{stop.title}</dt>
            <dd className="text-ink-soft mt-1 text-sm">{stop.detail}</dd>
          </div>
        ))}
      </dl>

      <div className="lg:hidden">
        <ol className="border-brand relative space-y-8 border-l-[3px] pl-8">
          {STATIONS.map((station, index) => (
            <li key={station.title} className="relative">
              <span
                aria-hidden="true"
                className="numerals border-ink bg-brand text-on-brand absolute top-0 left-[-3.22rem] grid size-9 place-items-center rounded-full border-[3px] text-lg"
              >
                {index + 1}
              </span>
              <h3 className="display text-xl">{station.title}</h3>
              <p className="text-ink-soft mt-1 max-w-prose">{station.detail}</p>
            </li>
          ))}
        </ol>
        <p className="mt-8 font-bold">Then one of two things happens</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {OUTCOMES.map((outcome) => (
            <div
              key={outcome.title}
              className={`ticket border-l-[6px] p-4 ${
                outcome.tone === 'ok' ? 'border-l-ok' : 'border-l-live'
              }`}
            >
              <h3 className="display text-xl">{outcome.title}</h3>
              <p className="text-ink-soft mt-1 text-sm">{outcome.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
