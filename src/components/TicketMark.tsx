export function TicketMark({
  className = 'text-brand',
}: {
  className?: string;
}) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M3 7h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4z"
        fill="currentColor"
      />
    </svg>
  );
}
