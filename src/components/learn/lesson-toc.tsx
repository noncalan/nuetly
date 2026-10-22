export type TocItem = { id: string; title: string };

type Props = { items: readonly TocItem[] };

/** Desktop-only (lg+) sticky table of contents; on smaller screens the lesson reads top to bottom. */
export function LessonToc({ items }: Props) {
  return (
    <nav aria-label="Содержание урока" className="sticky top-10 hidden lg:block">
      <p className="text-caption text-ink-3">Содержание</p>
      <ol className="mt-3 space-y-0.5 border-l border-line">
        {items.map((item, index) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="-ml-px flex gap-2.5 border-l border-transparent py-1.5 pl-3 text-meta text-ink-2 transition-colors hover:border-control-border hover:text-ink"
            >
              <span aria-hidden className="w-3 shrink-0 font-mono tabular-nums text-ink-3">
                {index + 1}
              </span>
              {item.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
