'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { HttpError, request } from '@/lib/browser-api';
import { formatPrice } from '@/lib/format';
import type { Drop, ReservationView, User } from '@/lib/types';
import { useAuth } from './AuthProvider';
import { Countdown } from './Countdown';
import { StockCells } from './StockCells';

const POLL_MS = 4000;
const TICK_MS = 250;

interface Hold {
  id: string;
  deadline: number;
  holdMs: number;
}

type Notice = 'lost' | 'expired' | null;

const toHold = (reservation: ReservationView): Hold => ({
  id: reservation.id,
  deadline: Date.now() + reservation.expiresInMs,
  holdMs: reservation.holdMs,
});

const clock = (ms: number) => {
  const total = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
};

function Message({
  tone,
  title,
  children,
}: {
  tone: 'live' | 'upcoming';
  title: string;
  children: ReactNode;
}) {
  return (
    <div
      role="status"
      className={`rounded-control p-3 ${tone === 'live' ? 'bg-live-wash' : 'bg-upcoming-wash'}`}
    >
      <p className="font-bold">{title}</p>
      <p className="text-sm">{children}</p>
    </div>
  );
}

interface Props {
  initial: Drop;
  price: number;
}

interface ViewProps extends Props {
  user: User | null;
  authReady: boolean;
}

function DropActionsView({ initial, price, user, authReady }: ViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [drop, setDrop] = useState<Drop>(initial);
  const [hold, setHold] = useState<Hold | null>(null);
  const [remaining, setRemaining] = useState(0);
  const [notice, setNotice] = useState<Notice>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [punchedAt, setPunchedAt] = useState<number | undefined>(undefined);
  const lastRemaining = useRef(initial.stockRemaining);

  const applyDrop = useCallback((next: Drop) => {
    if (next.stockRemaining < lastRemaining.current)
      setPunchedAt(next.stockRemaining);
    lastRemaining.current = next.stockRemaining;
    setDrop(next);
  }, []);

  const refreshDrop = useCallback(async () => {
    try {
      applyDrop(await request<Drop>(`/drops/${initial.id}`));
    } catch {
      return;
    }
  }, [applyDrop, initial.id]);

  const startHold = useCallback((reservation: ReservationView) => {
    setHold(toHold(reservation));
    setRemaining(reservation.expiresInMs);
  }, []);

  const loadHold = useCallback(async () => {
    try {
      const { reservation } = await request<{
        reservation: ReservationView | null;
      }>(`/drops/${initial.id}/reservation`);
      if (reservation) startHold(reservation);
    } catch {
      return;
    }
  }, [initial.id, startHold]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refreshDrop();
  }, [refreshDrop]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (user) void loadHold();
  }, [user, loadHold]);

  useEffect(() => {
    if (drop.status === 'ended') return;
    const timer = setInterval(() => {
      if (!document.hidden) void refreshDrop();
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [drop.status, refreshDrop]);

  useEffect(() => {
    if (!hold) return;
    const timer = setInterval(() => {
      const left = hold.deadline - Date.now();
      if (left <= 0) {
        clearInterval(timer);
        setHold(null);
        setNotice('expired');
        void refreshDrop();
      } else {
        setRemaining(left);
      }
    }, TICK_MS);
    return () => clearInterval(timer);
  }, [hold, refreshDrop]);

  const reserve = async () => {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const result = await request<{
        reservation: ReservationView;
        drop: Drop;
      }>(`/drops/${initial.id}/reserve`, {
        method: 'POST',
        body: JSON.stringify({ quantity: 1 }),
      });
      applyDrop(result.drop);
      startHold(result.reservation);
    } catch (caught) {
      if (!(caught instanceof HttpError)) {
        setError('Network error. Please try again.');
      } else if (caught.status === 401) {
        router.push(`/login?next=${encodeURIComponent(pathname)}`);
      } else if (caught.code === 'SOLD_OUT') {
        setNotice('lost');
        await refreshDrop();
      } else if (caught.code === 'ALREADY_RESERVED') {
        await loadHold();
      } else {
        setError(caught.message);
        await refreshDrop();
      }
    } finally {
      setBusy(false);
    }
  };

  const release = async () => {
    if (!hold) return;
    setBusy(true);
    setError(null);
    try {
      await request(`/reservations/${hold.id}`, { method: 'DELETE' });
      setHold(null);
      await refreshDrop();
    } catch (caught) {
      setError(
        caught instanceof HttpError
          ? caught.message
          : 'Network error. Please try again.',
      );
    } finally {
      setBusy(false);
    }
  };

  const countdown =
    drop.status === 'upcoming'
      ? { target: drop.startsAt, label: 'Starts in' }
      : drop.status === 'live'
        ? { target: drop.endsAt, label: 'Ends in' }
        : null;
  const soldOut = drop.stockRemaining === 0;
  const loginHref = `/login?next=${encodeURIComponent(pathname)}`;

  let action: ReactNode = null;
  if (hold) {
    action = (
      <div className="ticket p-4">
        <p className="text-ink-soft text-sm">One unit is held for you</p>
        <p
          className="numerals my-2 text-5xl"
          role="timer"
          aria-label={`${clock(remaining)} left`}
        >
          {clock(remaining)}
        </p>
        <div className="hold" aria-hidden="true">
          <i
            style={{
              width: `${Math.min(100, (remaining / hold.holdMs) * 100)}%`,
            }}
          />
        </div>
        <p className="text-ink-soft mt-3 text-sm">
          When time runs out, the unit goes back on sale.
        </p>
        <button
          type="button"
          onClick={release}
          disabled={busy}
          className="btn btn-quiet mt-4 w-full"
        >
          Release this unit
        </button>
      </div>
    );
  } else if (drop.status === 'upcoming') {
    action = (
      <button type="button" disabled className="btn is-sold w-full">
        Reserve opens when the drop starts
      </button>
    );
  } else if (drop.status === 'live' && soldOut) {
    action = (
      <button type="button" disabled className="btn is-sold w-full">
        Sold out
      </button>
    );
  } else if (drop.status === 'live' && !authReady) {
    action = (
      <button type="button" disabled className="btn btn-reserve w-full">
        Reserve
      </button>
    );
  } else if (drop.status === 'live' && !user) {
    action = (
      <Link href={loginHref} className="btn btn-reserve w-full">
        Sign in to reserve
      </Link>
    );
  } else if (drop.status === 'live') {
    action = (
      <button
        type="button"
        onClick={reserve}
        disabled={busy}
        className="btn btn-reserve w-full"
      >
        {busy ? 'Reserving...' : `Reserve for ${formatPrice(price)}`}
      </button>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <b>{drop.stockRemaining} left</b>
          <span className="text-ink-soft text-sm">of {drop.stockTotal}</span>
        </div>
        <StockCells
          remaining={drop.stockRemaining}
          total={drop.stockTotal}
          punchedAt={punchedAt}
        />
      </div>

      {countdown ? (
        <Countdown target={countdown.target} label={countdown.label} />
      ) : (
        <p className="text-ink-soft">This drop has ended.</p>
      )}

      <div aria-live="polite" className="space-y-3">
        {notice === 'lost' && (
          <Message tone="live" title="You missed it">
            Someone reserved the last unit a moment before you. Nothing was
            charged.
          </Message>
        )}
        {notice === 'expired' && (
          <Message tone="upcoming" title="Reservation expired">
            Your unit went back on sale.
          </Message>
        )}
        {error && (
          <p
            role="alert"
            className="rounded-control bg-live-wash p-3 text-sm font-bold"
          >
            {error}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}

export function DropActions(props: Props) {
  const { user, status } = useAuth();
  return (
    <DropActionsView
      key={user?.id ?? 'guest'}
      {...props}
      user={user}
      authReady={status === 'ready'}
    />
  );
}
