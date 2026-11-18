import type { Difficulty, Kind, Question } from "../content/types";
export interface Config {
  module: number;
  course?: "foundations" | "developing" | "all";
  difficulty: Difficulty | "Mixed";
  type: Kind | "all";
  count: number;
  timed: boolean;
  minutes: number;
  shuffle: boolean;
  exam: boolean;
}
export type Answer = string[];
export function shuffle<T>(
  items: T[],
  random: () => number = Math.random,
): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function normalize(s: string) {
  return s.trim().toLocaleLowerCase("en").replace(/\s+/g, " ");
}
export function grade(q: Question, answer: Answer): boolean | null {
  if (q.type === "short") return null;
  if (q.type === "blank")
    return (
      answer.length === 1 &&
      q.answer.some((a) => normalize(a) === normalize(answer[0]))
    );
  return (
    answer.length === q.answer.length &&
    new Set(answer).size === answer.length &&
    q.answer.every((a) => answer.includes(a))
  );
}
export function matchesCourse(module: number, course?: Config["course"]) {
  return (
    !course ||
    course === "all" ||
    (course === "foundations" ? module >= 101 : module < 101)
  );
}
export function eligibleQuestions(bank: Question[], c: Config) {
  return bank.filter(
    (q) =>
      matchesCourse(q.module, c.course) &&
      (!c.module || q.module === c.module) &&
      (c.difficulty === "Mixed" || q.difficulty === c.difficulty) &&
      (c.type === "all" || q.type === c.type) &&
      (!c.exam || q.type !== "short"),
  );
}
export function selectQuestions(bank: Question[], c: Config): Question[] {
  const pool = eligibleQuestions(bank, c);
  const count = c.count === 0 ? pool.length : Math.min(c.count, pool.length);
  if (!c.exam) return (c.shuffle ? shuffle(pool) : pool).slice(0, count);
  const groups = shuffle([...new Set(pool.map((q) => q.module))]).map((m) =>
    shuffle(pool.filter((q) => q.module === m)),
  );
  const selected: Question[] = [];
  while (selected.length < count) {
    for (const group of groups) {
      if (group.length && selected.length < count) selected.push(group.pop()!);
    }
  }
  return shuffle(selected);
}
export function remainingSeconds(
  deadline: number | undefined,
  now = Date.now(),
) {
  return deadline === undefined
    ? undefined
    : Math.max(0, Math.ceil((deadline - now) / 1000));
}
export function timeLabel(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}
