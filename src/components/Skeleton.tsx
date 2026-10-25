export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`bg-sunk animate-pulse rounded-lg ${className}`}
    />
  );
}
