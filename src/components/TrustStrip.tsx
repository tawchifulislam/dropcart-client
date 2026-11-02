import { Container } from './Container';

const ITEMS = [
  {
    label: 'No overselling',
    path: 'M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z',
  },
  {
    label: '5 minute hold',
    path: 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
  },
  { label: 'Secure checkout', path: 'M5 11h14v9H5zM8 11V8a4 4 0 0 1 8 0v3' },
  { label: 'AI copilot', path: 'M4 5h16v11H9l-5 4z' },
];

export function TrustStrip() {
  return (
    <section
      aria-label="Highlights"
      className="border-line bg-surface border-b-[1.5px]"
    >
      <Container>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-3 py-4 lg:grid-cols-4">
          {ITEMS.map((item) => (
            <li
              key={item.label}
              className="flex items-center gap-2.5 text-sm font-bold lg:justify-center"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="text-brand shrink-0"
              >
                <path d={item.path} />
              </svg>
              {item.label}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
