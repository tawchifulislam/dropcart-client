const MAX_CELLS = 24;

export function StockCells({
  remaining,
  total,
}: {
  remaining: number;
  total: number;
}) {
  const cellCount = Math.min(total, MAX_CELLS);
  const filled =
    remaining === 0
      ? 0
      : Math.max(1, Math.round((remaining / total) * cellCount));
  const isLow = remaining > 0 && remaining <= 3;

  return (
    <div
      className={`cells ${isLow ? 'is-low' : ''}`}
      role="img"
      aria-label={`${remaining} of ${total} left`}
    >
      {Array.from({ length: cellCount }, (_, index) => (
        <span key={index} className={index < filled ? 'cell' : 'cell gone'} />
      ))}
    </div>
  );
}
