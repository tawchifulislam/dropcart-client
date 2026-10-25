import Link from 'next/link';
import type { Drop } from '@/lib/types';
import { Countdown } from './Countdown';
import { DropBadge } from './DropBadge';
import { StockCells } from './StockCells';

export function ProductDropPanel({ drop }: { drop: Drop | null }) {
  if (!drop) {
    return (
      <div className="ticket border-dashed p-4">
        <p className="font-bold">No drop scheduled</p>
        <p className="text-ink-soft mt-1 text-sm">
          This product is not on sale right now. New drops are announced on the
          Drops page.
        </p>
        <Link href="/drops" className="btn mt-3">
          See upcoming drops
        </Link>
      </div>
    );
  }

  const countdown =
    drop.status === 'upcoming'
      ? { target: drop.startsAt, label: 'Starts in' }
      : { target: drop.endsAt, label: 'Ends in' };

  return (
    <div className="ticket">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <DropBadge drop={drop} />
          <span className="text-ink-soft text-sm">
            {drop.stockTotal} units in this drop
          </span>
        </div>
        <div className="mt-3 mb-2 flex items-center justify-between">
          <b>{drop.stockRemaining} left</b>
          <span className="text-ink-soft text-sm">of {drop.stockTotal}</span>
        </div>
        <StockCells remaining={drop.stockRemaining} total={drop.stockTotal} />
      </div>
      <div className="ticket-perf" />
      <div className="p-4">
        <Countdown target={countdown.target} label={countdown.label} />
        <Link
          href={`/drops/${drop.id}`}
          className="btn btn-reserve mt-4 w-full"
        >
          {drop.status === 'live' ? 'Go to the drop' : 'View the drop'}
        </Link>
      </div>
    </div>
  );
}
