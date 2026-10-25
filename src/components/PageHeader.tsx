import { Container } from './Container';

export function PageHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="border-line border-b-[1.5px]">
      <Container className="py-10 md:py-14">
        <h1 className="display animate-rise text-3xl md:text-4xl">{title}</h1>
        <p className="animate-rise text-ink-soft mt-3 max-w-prose text-lg [animation-delay:100ms]">
          {description}
        </p>
      </Container>
    </section>
  );
}
