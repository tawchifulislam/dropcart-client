import { Container } from './Container';

export function SiteFooter() {
  return (
    <footer className="border-line bg-surface border-t-[1.5px]">
      <Container className="text-ink-soft flex flex-col gap-2 py-8 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="display text-ink text-base">DropCart</span>
          <span className="ml-3">Limited drops. Every unit counted.</span>
        </p>
        <p>&copy; {new Date().getFullYear()} DropCart</p>
      </Container>
    </footer>
  );
}
