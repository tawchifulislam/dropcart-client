export function ProductImage({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`rounded-lg border-[1.5px] border-line bg-[repeating-linear-gradient(135deg,var(--brand-wash)_0_12px,var(--surface)_12px_24px)] ${className}`}
    />
  );
}
