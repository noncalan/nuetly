export const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"] as const;

const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;

/** 125 → "2:05" */
export function formatClock(totalSeconds: number): string {
  const seconds = Math.max(0, Math.round(totalSeconds));
  const minutes = Math.floor(seconds / SECONDS_PER_MINUTE);
  const rest = seconds % SECONDS_PER_MINUTE;
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

/** 6720 → "1 ч 52 мин" */
export function formatDuration(totalSeconds: number): string {
  const totalMinutes = Math.round(totalSeconds / SECONDS_PER_MINUTE);
  const hours = Math.floor(totalMinutes / MINUTES_PER_HOUR);
  const minutes = totalMinutes % MINUTES_PER_HOUR;
  if (hours === 0) return `${minutes} мин`;
  if (minutes === 0) return `${hours} ч`;
  return `${hours} ч ${minutes} мин`;
}

export function percent(part: number, whole: number): number {
  return whole === 0 ? 0 : Math.round((part / whole) * 100);
}

/** pluralRu(5, ["день", "дня", "дней"]) → "дней" */
export function pluralRu(n: number, forms: readonly [string, string, string]): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
  return forms[2];
}

export function formatSigned(n: number): string {
  return n > 0 ? `+${n}` : n < 0 ? `−${Math.abs(n)}` : "0";
}
