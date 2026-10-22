import { cn } from "@/lib/cn";
import { TOPIC_ACCURACY, WEAK_SHARE, topicsOf } from "@/lib/demo/practice";
import { SECTIONS, type SectionId } from "@/lib/demo/topics";

/** Radio value for "every topic of the section". */
export const ALL_TOPICS = "all";

const NOTE_ID = "practice-topic-note";

type Props = {
  section: SectionId;
  value: string;
  onChange: (topicId: string) => void;
};

/** Single-choice topic list on native radios, with the demo accuracy per topic. */
export function TopicPicker({ section, value, onChange }: Props) {
  const rows = [
    { id: ALL_TOPICS, name: "Все темы раздела", share: null as number | null },
    ...topicsOf(section).map((topic) => ({ id: topic.id, name: topic.name, share: TOPIC_ACCURACY[topic.id]?.share ?? null })),
  ];

  return (
    <fieldset aria-describedby={NOTE_ID}>
      <legend className="text-meta font-medium text-ink-2">Тема</legend>
      <p id={NOTE_ID} className="mt-0.5 text-caption font-normal text-ink-3">
        Точность — по последнему пробному экзамену
      </p>
      <div className="mt-2 divide-y divide-line overflow-hidden rounded-xl border border-line">
        {rows.map((row) => {
          const isActive = row.id === value;
          const isWeak = row.share !== null && row.share < WEAK_SHARE;
          return (
            <label
              key={`${section}-${row.id}`}
              className={cn(
                "flex min-h-11 cursor-pointer items-center gap-3 px-4 py-2.5 text-body select-none",
                "transition-colors",
                "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-[-2px] has-[:focus-visible]:outline-accent",
                isActive ? "bg-accent-soft" : "hover:bg-subtle active:bg-muted",
              )}
            >
              <input
                type="radio"
                name="practice-topic"
                value={row.id}
                checked={isActive}
                onChange={() => onChange(row.id)}
                className="sr-only"
              />
              <span
                aria-hidden
                className={cn(
                  "grid size-4 shrink-0 place-items-center rounded-full border",
                  isActive ? "border-accent bg-accent" : "border-control-border bg-surface",
                )}
              >
                {isActive && <span className="size-1.5 rounded-full bg-accent-ink" />}
              </span>
              <span className={cn("min-w-0 flex-1 truncate", isActive ? "font-medium text-ink" : "text-ink")}>
                {row.name}
              </span>
              {row.share === null ? (
                <span className="shrink-0 text-caption font-normal text-ink-3">{SECTIONS[section].short}</span>
              ) : (
                <span className={cn("shrink-0 font-mono text-meta tabular-nums", isWeak ? "text-danger" : "text-ink-2")}>
                  {row.share}%<span className="sr-only">{isWeak ? ", слабая тема" : ""}</span>
                </span>
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
