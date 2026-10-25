const CELLS = 12;

export function PunchRow() {
  return (
    <div
      aria-hidden="true"
      className="mt-6 grid max-w-md auto-cols-fr grid-flow-col gap-1"
    >
      {Array.from({ length: CELLS }, (_, index) => (
        <span
          key={index}
          className="animate-punch-cell border-brand bg-brand h-3.5 rounded-[3px] border-[1.5px] border-dashed"
          style={{ animationDelay: `${index * 0.18}s` }}
        />
      ))}
    </div>
  );
}
