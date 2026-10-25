import Link from 'next/link';

interface Props {
  title: string;
  body: string;
  href?: string;
  cta?: string;
}

export function EmptyState({ title, body, href, cta }: Props) {
  return (
    <div className="ticket mt-5 border-dashed p-8 text-center">
      <p className="display text-xl">{title}</p>
      <p className="text-ink-soft mt-1">{body}</p>
      {href && cta && (
        <Link href={href} className="btn mt-4">
          {cta}
        </Link>
      )}
    </div>
  );
}
