import { formatStart } from '@/lib/format';
import type { DropWithProduct } from '@/lib/types';
import { TicketMark } from './TicketMark';

function describe(drop: DropWithProduct) {
  return drop.status === 'live'
    ? `Live now, ${drop.stockRemaining} left`
    : `Starts ${formatStart(drop.startsAt)}`;
}

export function Ticker({ drops }: { drops: DropWithProduct[] }) {
  if (drops.length === 0) return null;

  const half = [...drops, ...drops];
  const track = [...half, ...half];

  return (
    <div
      aria-hidden="true"
      className="group border-line bg-ink text-canvas overflow-hidden border-b-[1.5px] py-3"
    >
      <div className="animate-marquee flex w-max group-hover:[animation-play-state:paused]">
        {track.map((drop, index) => (
          <span
            key={index}
            className="flex items-center gap-3 pr-10 whitespace-nowrap"
          >
            <TicketMark className="text-live" />
            <span className="display text-lg">{drop.product.name}</span>
            <span className="text-sm opacity-80">{describe(drop)}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
