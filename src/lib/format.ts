const amountFormat = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
});

const startFormat = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
  timeZone: 'Asia/Dhaka',
});

export const formatPrice = (amount: number) =>
  `৳${amountFormat.format(amount)}`;

export const formatStart = (iso: string) => startFormat.format(new Date(iso));
export const humanize = (key: string) =>
  key.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase());

const dateTimeFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
  timeZone: 'Asia/Dhaka',
});

export const formatDateTime = (iso: string) =>
  dateTimeFormat.format(new Date(iso));

export const formatClock = (ms: number) => {
  const total = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
};
const dateFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Asia/Dhaka',
});

export const formatDate = (iso: string) => dateFormat.format(new Date(iso));
