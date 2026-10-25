const MAX_CELLS = 24;

interface Props {
  remaining: number;
  total: number;
  punchedAt?: number;
}

export function StockCells({ remaining, total, punchedAt }: Props) {
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
      {Array.from({ length: cellCount }, (_, index) => {
        if (index < filled) return <span key={index} className="cell" />;
        const punched = punchedAt !== undefined && index === filled;
        return (
          <span
            key={index}
            className={`cell gone${punched ? 'just-gone' : ''}`}
          />
        );
      })}
    </div>
  );
}
