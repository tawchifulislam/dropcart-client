interface Item {
  question: string;
  answer: string;
}

export function Faq({ items }: { items: Item[] }) {
  return (
    <div className="divide-line border-line divide-y-[1.5px] border-y-[1.5px]">
      {items.map((item) => (
        <details key={item.question} className="group py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold [&::-webkit-details-marker]:hidden">
            {item.question}
            <span
              aria-hidden="true"
              className="rounded-chip border-line grid size-8 shrink-0 place-items-center border-[1.5px] transition-transform duration-200 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="text-ink-soft mt-3 max-w-prose">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
