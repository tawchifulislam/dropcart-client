import Link from 'next/link';
import { Reveal } from './Reveal';
import { SectionHeading } from './SectionHeading';

export function CategoryTiles({ categories }: { categories: string[] }) {
  if (categories.length === 0) return null;

  return (
    <section aria-labelledby="categories-heading" className="pt-16">
      <SectionHeading
        id="categories-heading"
        title="Shop by category"
        href="/products"
        linkLabel="All products"
      />
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {categories.map((category, index) => (
          <Reveal key={category} delay={index * 0.06}>
            <Link
              href={`/products?category=${encodeURIComponent(category)}`}
              className="group ticket hover:bg-brand hover:text-on-brand flex h-32 flex-col justify-between p-4 transition-colors duration-200"
            >
              <span className="display text-2xl">{category}</span>
              <span
                aria-hidden="true"
                className="text-sm font-bold transition-transform duration-200 group-hover:translate-x-1"
              >
                Shop now
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
