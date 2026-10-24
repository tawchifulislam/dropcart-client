'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const pad = (value: number) => String(value).padStart(2, '0');

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
  const units = ['hrs', 'min', 'sec'];

  return (
    <div>
      <p className="text-sm text-ink-soft">{label}</p>
      <div className="flex items-start gap-0.5" role="timer">
        {parts.map((value, index) => (
          <div key={units[index]} className="flex items-start gap-0.5">
            {index > 0 && <span className="numerals pt-0.5 text-4xl">:</span>}
            <div className="min-w-16 text-center">
              <span className="numerals block text-5xl">{value}</span>
              <span className="text-xs text-ink-soft">{units[index]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
