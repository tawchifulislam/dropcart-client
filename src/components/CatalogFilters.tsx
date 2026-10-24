import Link from 'next/link';

interface Props {
  categories: string[];
  activeCategory?: string;
  search?: string;
}

export function CatalogFilters({ categories, activeCategory, search }: Props) {
  const hrefFor = (category?: string) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    const query = params.toString();
    return query ? `/?${query}` : '/';
  };

  const chip = (active: boolean) =>
    `inline-flex h-10 items-center rounded-control border-[1.5px] border-line px-3.5 text-sm font-bold ${
      active ? 'bg-ink text-canvas' : 'bg-surface'
    }`;

  return (
    <div className="space-y-3">
      <form action="/" role="search" className="flex gap-2">
        <input
          name="search"
          defaultValue={search}
          placeholder="Search products"
          aria-label="Search products"
          className="field"
        />
        {activeCategory && (
          <input type="hidden" name="category" value={activeCategory} />
        )}
        <button type="submit" className="btn">
          Search
        </button>
      </form>
      <nav aria-label="Categories" className="flex flex-wrap gap-2">
        <Link href={hrefFor()} className={chip(!activeCategory)}>
          All
        </Link>
        {categories.map(category => (
          <Link
            key={category}
            href={hrefFor(category)}
            className={chip(activeCategory === category)}
          >
            {category}
          </Link>
        ))}
      </nav>
    </div>
  );
}
