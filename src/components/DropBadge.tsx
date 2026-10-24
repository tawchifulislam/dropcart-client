import { formatStart } from '@/lib/format';
import type { Drop } from '@/lib/types';

export function DropBadge({ drop }: { drop: Drop | null }) {
  if (!drop) return <span className="badge">No drop</span>;
  if (drop.soldOut) return <span className="badge badge-sold">Sold out</span>;
  if (drop.status === 'live')
    return <span className="badge badge-live">Live</span>;
  return (
    <span className="badge badge-upcoming">
      Starts {formatStart(drop.startsAt)}
    </span>
  );
}
