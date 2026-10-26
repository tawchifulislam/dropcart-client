import type { ReservationView } from '@/lib/types';

const STATUS: Record<
  ReservationView['status'],
  { label: string; className: string }
> = {
  active: { label: 'Held', className: 'badge badge-upcoming' },
  completed: { label: 'Paid', className: 'badge badge-ok' },
  expired: { label: 'Expired', className: 'badge' },
  released: { label: 'Released', className: 'badge' },
};

export function ReservationStatusBadge({
  status,
}: {
  status: ReservationView['status'];
}) {
  const { label, className } = STATUS[status];
  return <span className={className}>{label}</span>;
}
