'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const UNITS = ['hrs', 'min', 'sec'];

const pad = (value: number) => String(value).padStart(2, '0');

function Digit({ value }: { value: string }) {
  return (
    <span className="relative inline-block h-[1em] w-[1ch] overflow-hidden align-top">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
          className="absolute inset-0 text-center"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function Countdown({
  target,
  label,
}: {
  target: string;
  label: string;
}) {
  const router = useRouter();
  const [seconds, setSeconds] = useState<number | null>(null);

  useEffect(() => {
    const targetTime = new Date(target).getTime();
    const tick = () => {
      const left = Math.max(0, Math.round((targetTime - Date.now()) / 1000));
      setSeconds(left);
      if (left === 0) {
        clearInterval(timer);
        router.refresh();
      }
    };
    const timer = setInterval(tick, 1000);
    tick();
    return () => clearInterval(timer);
  }, [target, router]);

  const parts =
    seconds === null
      ? ['--', '--', '--']
      : [
          pad(Math.floor(seconds / 3600)),
          pad(Math.floor((seconds % 3600) / 60)),
          pad(seconds % 60),
        ];
  const spoken =
    seconds === null
      ? label
      : `${label} ${parts[0]} hours ${parts[1]} minutes ${parts[2]} seconds`;

  return (
    <div role="timer" aria-label={spoken}>
      <p className="text-ink-soft text-sm">{label}</p>
      <div aria-hidden="true" className="flex items-start gap-0.5">
        {parts.map((value, index) => (
          <div key={UNITS[index]} className="flex items-start gap-0.5">
            {index > 0 && <span className="numerals pt-0.5 text-4xl">:</span>}
            <div className="min-w-16 text-center">
              <span className="numerals flex justify-center text-5xl">
                {[...value].map((char, position) => (
                  <Digit key={position} value={char} />
                ))}
              </span>
              <span className="text-ink-soft text-xs">{UNITS[index]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
