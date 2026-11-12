import { describe, it, expect } from "vitest";
import { questions, topicById } from "../content/questions";
import { modules } from "../content/theory";
import { originalCards } from "../content/flashcards";
import {
  grade,
  selectQuestions,
  remainingSeconds,
  shuffle,
  type Config,
} from "./engine";
import { parseProgress, fresh, stats } from "./store";
const config: Config = {
  module: 0,
  difficulty: "Mixed",
  type: "all",
  count: 40,
  timed: true,
  minutes: 40,
  shuffle: true,
  exam: true,
};
describe("source-backed content", () => {
  it("covers six decks and all 50 original cards", () => {
    expect(modules).toHaveLength(6);
    expect(modules.reduce((a, m) => a + m.slides, 0)).toBe(441);
    expect(originalCards).toHaveLength(50);
    for (const m of [2, 3, 4, 5, 6])
      expect(originalCards.filter((q) => q.module === m)).toHaveLength(10);
  });
  it("has unique ids, prompts, valid keys and references", () => {
    expect(new Set(questions.map((q) => q.id)).size).toBe(questions.length);
    expect(new Set(questions.map((q) => q.prompt)).size).toBe(questions.length);
    for (const q of questions) {
      expect(topicById[q.topic], q.id).toBeTruthy();
      expect(q.answer.length, q.id).toBeGreaterThan(0);
      expect(q.explanation.length, q.id).toBeGreaterThan(20);
      expect(q.reference, q.id).toBeTruthy();
      if (q.options) {
        expect(new Set(q.options).size, q.id).toBe(q.options.length);
        for (const a of q.answer) expect(q.options, q.id).toContain(a);
      }
    }
  });
  it("represents all five formats and every theory topic", () => {
    expect(new Set(questions.map((q) => q.type)).size).toBe(5);
    for (const topic of Object.keys(topicById))
      expect(
        questions.some((q) => q.topic === topic),
        topic,
      ).toBe(true);
  });
  it("preserves incorrect source keys while correcting scored answers", () => {
    const url = questions.find((q) => q.id === "f3-8")!;
    expect(url.originalAnswer).toContain("bucket endpoint");
    expect(url.answer).toEqual(["A presigned URL"]);
    expect(questions.find((q) => q.id === "f5-5")!.originalAnswer).toBe(
      "?? either 2 or 5",
    );
    expect(questions.find((q) => q.id === "f2-8")!.type).toBe("short");
  });
});
describe("selection and grading", () => {
  it("balances a 40-question mock and excludes self-assessment", () => {
    for (let repeat = 0; repeat < 10; repeat++) {
      const selected = selectQuestions(questions, config);
      expect(selected).toHaveLength(40);
      expect(new Set(selected.map((q) => q.id)).size).toBe(40);
      expect(selected.every((q) => q.type !== "short")).toBe(true);
      const counts = modules.map(
        (m) => selected.filter((q) => q.module === m.id).length,
      );
      expect(Math.max(...counts) - Math.min(...counts)).toBeLessThanOrEqual(1);
    }
  });
  it("obeys practice filters and caps counts", () => {
    const selected = selectQuestions(questions, {
      ...config,
      exam: false,
      module: 5,
      type: "blank",
      difficulty: "Hard",
      count: 100,
    });
    expect(selected.length).toBeGreaterThan(0);
    expect(
      selected.every(
        (q) => q.module === 5 && q.type === "blank" && q.difficulty === "Hard",
      ),
    ).toBe(true);
    expect(selectQuestions([], config)).toEqual([]);
  });
  it("checks exact sets without partial credit", () => {
    const q = questions.find((q) => q.type === "multiple")!;
    expect(grade(q, [...q.answer].reverse())).toBe(true);
    expect(grade(q, [q.answer[0]])).toBe(false);
    expect(grade(q, [...q.answer, q.answer[0]])).toBe(false);
    expect(grade(q, [])).toBe(false);
  });
  it("normalizes blanks without pretending to grade essays", () => {
    const q = questions.find((q) => q.type === "blank")!;
    expect(grade(q, [`  ${q.answer[0].toUpperCase()}  `])).toBe(true);
    expect(grade(q, ["wrong"])).toBe(false);
    expect(
      grade(
        questions.find((q) => q.type === "short")!,
        ["anything"],
      ),
    ).toBeNull();
  });
  it("keeps source arrays immutable when shuffling", () => {
    const input = [1, 2, 3, 4];
    expect(new Set(shuffle(input)).size).toBe(4);
    expect(input).toEqual([1, 2, 3, 4]);
  });
  it("uses absolute deadlines even after backgrounding", () => {
    expect(remainingSeconds(10000, 7000)).toBe(3);
    expect(remainingSeconds(10000, 12000)).toBe(0);
    expect(remainingSeconds(undefined, 12000)).toBeUndefined();
  });
});
describe("persistence", () => {
  it("recovers malformed or incompatible saved data", () => {
    expect(parseProgress("{broken")).toEqual(fresh());
    expect(parseProgress('{"version":9}')).toEqual(fresh());
  });
  it("roundtrips saved progress and separates attempts from unique coverage", () => {
    const p = fresh();
    p.attempts = [
      { id: "a", qid: questions[0].id, correct: false, at: 1, self: false },
      { id: "b", qid: questions[0].id, correct: true, at: 2, self: false },
    ];
    const loaded = parseProgress(JSON.stringify(p));
    expect(loaded).toEqual(p);
    expect(stats(loaded).unique).toBe(1);
    expect(stats(loaded).attempts).toBe(2);
    expect(stats(loaded).accuracy).toBe(50);
  });
});
