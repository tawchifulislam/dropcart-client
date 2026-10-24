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
