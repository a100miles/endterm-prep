import { createContext, useContext, useState, type ReactNode } from "react";
import { questions } from "../content/questions";
import type { Answer, Config } from "./engine";
export interface Attempt {
  id: string;
  qid: string;
  correct: boolean;
  at: number;
  self: boolean;
}
export interface Session {
  id: string;
  exam: boolean;
  at: number;
  duration: number;
  total: number;
  correct: number;
  self: number;
}
export interface Draft {
  id: string;
  config: Config;
  ids: string[];
  answers: Record<string, Answer>;
  graded: Record<string, boolean>;
  index: number;
  started: number;
  deadline?: number;
  finished?: boolean;
  finishedAt?: number;
}
export interface Progress {
  version: 1;
  attempts: Attempt[];
  sessions: Session[];
  known: Record<string, boolean>;
  bookmarks: string[];
  read: string[];
  lastTopic?: string;
  dark: boolean;
  draft?: Draft;
}
export const STORAGE_KEY = "endterm-prep-v1";
export const fresh = (): Progress => ({
  version: 1,
  attempts: [],
  sessions: [],
  known: {},
  bookmarks: [],
  read: [],
  dark: false,
});
const validIds = new Set(questions.map((q) => q.id));
export function parseProgress(raw: string | null): Progress {
  if (!raw) return fresh();
  try {
    const p = JSON.parse(raw);
    if (
      p?.version !== 1 ||
      !Array.isArray(p.attempts) ||
      !Array.isArray(p.sessions) ||
      !Array.isArray(p.bookmarks) ||
      !Array.isArray(p.read) ||
      !p.known ||
      typeof p.known !== "object"
    )
      return fresh();
    const out: Progress = {
      ...fresh(),
      ...p,
      attempts: p.attempts.filter(
        (a: Attempt) =>
          a &&
          validIds.has(a.qid) &&
          typeof a.correct === "boolean" &&
          typeof a.at === "number",
      ),
      sessions: p.sessions.filter(
        (s: Session) =>
          s &&
          typeof s.id === "string" &&
          Number.isFinite(s.total) &&
          Number.isFinite(s.correct) &&
          Number.isFinite(s.duration),
      ),
      bookmarks: p.bookmarks.filter((id: string) => validIds.has(id)),
      read: p.read.filter((id: unknown) => typeof id === "string"),
      known: Object.fromEntries(
        Object.entries(p.known).filter(
          ([id, v]) => validIds.has(id) && typeof v === "boolean",
        ),
      ),
      dark: !!p.dark,
    };
    const d = p.draft;
    if (
      d &&
      (!Array.isArray(d.ids) ||
        !d.ids.length ||
        d.ids.some((id: string) => !validIds.has(id)) ||
        !Number.isInteger(d.index) ||
        d.index < 0 ||
        d.index >= d.ids.length ||
        !d.answers ||
        !d.graded ||
        !d.config ||
        !Number.isFinite(d.started) ||
        Object.values(d.answers).some((a) => !Array.isArray(a)))
    )
      delete out.draft;
    return out;
  } catch {
    return fresh();
  }
}
type Ctx = {
  progress: Progress;
  update: (fn: (p: Progress) => Progress) => void;
  storageError: boolean;
};
const Context = createContext<Ctx | null>(null);
export function StudyProvider({ children }: { children: ReactNode }) {
  const [storageError, setError] = useState(false);
  const [progress, set] = useState<Progress>(() => {
    try {
      return parseProgress(localStorage.getItem(STORAGE_KEY));
    } catch {
      return fresh();
    }
  });
  const update = (fn: (p: Progress) => Progress) =>
    set((p) => {
      const next = fn(p);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        setError(false);
      } catch {
        setError(true);
      }
      return next;
    });
  return (
    <Context.Provider value={{ progress, update, storageError }}>
      {children}
    </Context.Provider>
  );
}
export function useStudy() {
  return useContext(Context)!;
}
export function latestAttempts(p: Progress) {
  return Object.fromEntries(p.attempts.map((a) => [a.qid, a]));
}
export function stats(p: Progress, module = 0) {
  const ids = new Set(
    questions.filter((q) => !module || q.module === module).map((q) => q.id),
  );
  const attempts = p.attempts.filter((a) => ids.has(a.qid));
  const unique = new Set(attempts.map((a) => a.qid)).size;
  return {
    attempts: attempts.length,
    unique,
    total: ids.size,
    correct: attempts.filter((a) => a.correct).length,
    accuracy: attempts.length
      ? Math.round(
          (attempts.filter((a) => a.correct).length / attempts.length) * 100,
        )
      : null,
    completion: ids.size ? Math.round((unique / ids.size) * 100) : 0,
  };
}
