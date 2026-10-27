'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { request } from '@/lib/browser-api';
import { formatDateTime, formatPrice } from '@/lib/format';
import type {
  AdminDropStats,
  AdminOrder,
  AdminOverview,
  DropWithProduct,
} from '@/lib/types';
import { Countdown } from './Countdown';
import { DropBadge } from './DropBadge';
import { Skeleton } from './Skeleton';
import { StockCells } from './StockCells';

const POLL_MS = 4000;
const compact = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

interface ChartPoint {
  id: string;
  label: string;
  name: string;
  revenue: number;
  unitsSold: number;
  live: boolean;
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="ticket p-4">
      <dt className="text-ink-soft text-sm">{label}</dt>
      <dd className="display text-2xl md:text-3xl">{value}</dd>
    </div>
  );
}

const ORDER_STATUS: Record<
  AdminOrder['status'],
  { label: string; className: string }
> = {
  paid: { label: 'Paid', className: 'badge badge-ok' },
  pending: { label: 'Awaiting payment', className: 'badge badge-upcoming' },
  cancelled: { label: 'Cancelled', className: 'badge' },
  refunded: { label: 'Refunded', className: 'badge' },
  refund_failed: { label: 'Refund failed', className: 'badge badge-live' },
};

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: ChartPoint }[];
}) {
  const point = payload?.[0]?.payload;
  if (!active || !point) return null;
  return (
    <div className="ticket shadow-sheet p-3 text-sm">
      <p className="font-bold">{point.name}</p>
      <p>{formatPrice(point.revenue)}</p>
      <p className="text-ink-soft">{point.unitsSold} units sold</p>
    </div>
  );
}

function RevenueChart({ points }: { points: ChartPoint[] }) {
  if (points.length === 0) {
    return <p className="text-ink-soft p-6 text-center">No drops yet.</p>;
  }

  return (
    <div role="img" aria-label="Revenue per drop, bar chart">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={points}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            vertical={false}
            stroke="var(--line)"
            strokeOpacity={0.3}
            strokeDasharray="4 4"
          />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={{ stroke: 'var(--line)' }}
            tick={{ fill: 'var(--ink-soft)', fontSize: 12 }}
          />
          <YAxis
            width={52}
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'var(--ink-soft)', fontSize: 12 }}
            tickFormatter={(value: number) => compact.format(value)}
          />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{ fill: 'var(--sunk)' }}
          />
          <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
            {points.map((point) => (
              <Cell
                key={point.id}
                fill={point.live ? 'var(--upcoming)' : 'var(--brand)'}
                stroke="var(--brand)"
                strokeWidth={1.5}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function LiveDropPanel({
  stats,
  punchedAt,
}: {
  stats: AdminDropStats;
  punchedAt?: number;
}) {
  const { drop } = stats;
  const countdown =
    drop.status === 'upcoming'
      ? { target: drop.startsAt, label: 'Starts in' }
      : drop.status === 'live'
        ? { target: drop.endsAt, label: 'Ends in' }
        : null;

  const figures = [
    { label: 'Revenue', value: formatPrice(stats.revenue) },
    { label: 'Units sold', value: String(stats.unitsSold) },
    { label: 'Held now', value: String(stats.heldUnits) },
    { label: 'Awaiting payment', value: String(stats.pendingOrders) },
  ];

  return (
    <section aria-labelledby="live-heading" className="ticket">
      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 id="live-heading" className="display truncate text-xl">
            {stats.product?.name ?? 'Drop'}
          </h2>
          <DropBadge drop={drop} />
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="numerals text-7xl">{drop.stockRemaining}</span>
          <span className="display text-ink-soft text-2xl">
            / {drop.stockTotal}
          </span>
        </div>
        <p className="text-ink-soft mb-3 text-sm">units left</p>
        <StockCells
          remaining={drop.stockRemaining}
          total={drop.stockTotal}
          punchedAt={punchedAt}
        />
        {countdown && (
          <div className="mt-4">
            <Countdown target={countdown.target} label={countdown.label} />
          </div>
        )}
      </div>
      <div className="ticket-perf" />
      <dl className="grid grid-cols-2 gap-4 p-4 text-sm">
        {figures.map((figure) => (
          <div key={figure.label}>
            <dt className="text-ink-soft">{figure.label}</dt>
            <dd className="display text-xl">{figure.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function OrdersTable({ orders }: { orders: AdminOrder[] }) {
  if (orders.length === 0) {
    return (
      <p className="text-ink-soft p-6 text-center">
        No orders for this drop yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-136 text-left text-sm">
        <thead>
          <tr className="border-line text-ink-soft border-b-[1.5px]">
            <th className="px-4 py-2 font-normal">Order</th>
            <th className="px-4 py-2 font-normal">Customer</th>
            <th className="px-4 py-2 font-normal">Qty</th>
            <th className="px-4 py-2 font-normal">Amount</th>
            <th className="px-4 py-2 font-normal">Status</th>
            <th className="px-4 py-2 font-normal">Time</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const status = ORDER_STATUS[order.status];
            return (
              <tr
                key={order.id}
                className="border-line border-b border-dashed last:border-0"
              >
                <td className="px-4 py-3 font-bold">
                  #{order.id.slice(-8).toUpperCase()}
                </td>
                <td className="px-4 py-3">{order.customer}</td>
                <td className="px-4 py-3">{order.quantity}</td>
                <td className="px-4 py-3">{formatPrice(order.amount)}</td>
                <td className="px-4 py-3">
                  <span className={status.className}>{status.label}</span>
                </td>
                <td className="text-ink-soft px-4 py-3">
                  {formatDateTime(order.createdAt)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function AdminDashboard() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [drops, setDrops] = useState<DropWithProduct[]>([]);
  const [chosenId, setChosenId] = useState<string | null>(null);
  const [stats, setStats] = useState<AdminDropStats | null>(null);
  const [punchedAt, setPunchedAt] = useState<number | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const lastRemaining = useRef<{ id: string; value: number } | null>(null);

  const activeId =
    chosenId ??
    drops.find((drop) => drop.status === 'live')?.id ??
    drops[0]?.id ??
    null;

  const loadOverview = useCallback(async () => {
    try {
      setOverview(await request<AdminOverview>('/admin/overview'));
    } catch {
      setError('We could not refresh the dashboard.');
    }
  }, []);

  const loadDrops = useCallback(async () => {
    try {
      const { items } = await request<{ items: DropWithProduct[] }>(
        '/admin/drops',
      );
      setDrops(items);
    } catch {
      setError('We could not load the drops.');
    }
  }, []);

  const loadStats = useCallback(async (id: string) => {
    try {
      const next = await request<AdminDropStats>(`/admin/drops/${id}/stats`);
      const previous = lastRemaining.current;
      if (
        previous &&
        previous.id === id &&
        next.drop.stockRemaining < previous.value
      ) {
        setPunchedAt(next.drop.stockRemaining);
      }
      lastRemaining.current = { id, value: next.drop.stockRemaining };
      setStats(next);
      setError(null);
    } catch {
      setError('We could not refresh the dashboard.');
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadOverview();
    void loadDrops();
  }, [loadOverview, loadDrops]);

  useEffect(() => {
    if (!activeId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadStats(activeId);
    const timer = setInterval(() => {
      if (document.hidden) return;
      void loadStats(activeId);
      void loadOverview();
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [activeId, loadStats, loadOverview]);

  const points: ChartPoint[] = (overview?.drops ?? []).map((drop) => ({
    id: drop.id,
    label: drop.productName.split(' ').slice(0, 2).join(' '),
    name: drop.productName,
    revenue: drop.revenue,
    unitsSold: drop.unitsSold,
    live: drop.status === 'live',
  }));

  const currentStats = stats && stats.drop.id === activeId ? stats : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="display text-2xl md:text-3xl">Dashboard</h1>
        {drops.length > 0 && (
          <div>
            <label htmlFor="drop-select" className="sr-only">
              Select a drop
            </label>
            <select
              id="drop-select"
              className="field w-auto max-w-full"
              value={activeId ?? ''}
              onChange={(event) => {
                setChosenId(event.target.value);
                setPunchedAt(undefined);
              }}
            >
              {drops.map((drop) => (
                <option key={drop.id} value={drop.id}>
                  {drop.product.name} ({drop.status},{' '}
                  {formatDateTime(drop.startsAt)})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-control bg-live-wash p-3 text-sm font-bold"
        >
          {error}
        </p>
      )}

      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi
          label="Total revenue"
          value={overview ? formatPrice(overview.totals.revenue) : '...'}
        />
        <Kpi
          label="Paid orders"
          value={overview ? String(overview.totals.paidOrders) : '...'}
        />
        <Kpi
          label="Units held now"
          value={overview ? String(overview.totals.heldUnits) : '...'}
        />
        <Kpi
          label="Live drops"
          value={overview ? String(overview.totals.liveDrops) : '...'}
        />
      </dl>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        {currentStats ? (
          <LiveDropPanel stats={currentStats} punchedAt={punchedAt} />
        ) : (
          <Skeleton className="h-96 w-full" />
        )}

        <section aria-labelledby="chart-heading" className="ticket">
          <div className="p-4">
            <h2 id="chart-heading" className="display text-xl">
              Revenue per drop
            </h2>
            <p className="text-ink-soft text-sm">
              The most recent drops. The live drop is highlighted.
            </p>
          </div>
          <div className="px-2 pb-4">
            {overview ? (
              <RevenueChart points={points} />
            ) : (
              <Skeleton className="mx-2 h-72" />
            )}
          </div>
        </section>
      </div>

      <section aria-labelledby="orders-heading" className="ticket">
        <h2 id="orders-heading" className="display p-4 text-xl">
          Recent orders for this drop
        </h2>
        {currentStats ? (
          <OrdersTable orders={currentStats.recentOrders} />
        ) : (
          <Skeleton className="m-4 h-32" />
        )}
      </section>
    </div>
  );
}
