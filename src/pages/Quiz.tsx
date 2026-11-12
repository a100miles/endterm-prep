import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Clock,
  Flag,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { questions, topicById } from "../content/questions";
import { modules } from "../content/theory";
import type { Question } from "../content/types";
import {
  grade,
  selectQuestions,
  remainingSeconds,
  timeLabel,
  type Config,
  type Answer,
} from "../lib/engine";
import {
  useStudy,
  latestAttempts,
  type Draft,
  type Attempt,
} from "../lib/store";
import { Button } from "../components/ui/button";
import { Confirm } from "../components/ui/confirm";
import { Heading, Meter } from "./Study";
const byId = Object.fromEntries(questions.map((q) => [q.id, q]));
export default function Quiz({ exam }: { exam: boolean }) {
  const { progress, update } = useStudy();
  const [params] = useSearchParams();
  const [config, setConfig] = useState<Config>({
    module: exam ? 0 : Number(params.get("module") || 0),
    difficulty: "Mixed",
    type: "all",
    count: exam ? 40 : 10,
    timed: exam,
    minutes: exam ? 40 : 15,
    shuffle: true,
    exam,
  });
  const [confirm, setConfirm] = useState<"submit" | "leave" | "replace" | null>(
    null,
  );
  const [reveal, setReveal] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [customIds, setCustomIds] = useState<string[] | null>(null);
  const draft =
    progress.draft?.config.exam === exam ? progress.draft : undefined;
  const active = draft && !draft.finished;
  const latest = latestAttempts(progress);
  const review = params.get("review");
  const bank = customIds
    ? customIds.map((id) => byId[id])
    : review === "wrong"
      ? questions.filter((q) => latest[q.id] && !latest[q.id].correct)
      : review === "saved"
        ? questions.filter((q) => progress.bookmarks.includes(q.id))
        : questions;
  useEffect(() => {
    setConfig((c) => ({
      ...c,
      exam,
      type: exam ? "all" : c.type,
      module: exam ? 0 : Number(params.get("module") || 0),
      count: exam ? 40 : 10,
      timed: exam,
    }));
    setCustomIds(null);
    setReveal(false);
  }, [exam, params]);
  const available = bank.filter(
    (q) =>
      (!config.module || q.module === config.module) &&
      (config.difficulty === "Mixed" || q.difficulty === config.difficulty) &&
      (config.type === "all" || q.type === config.type) &&
      (!exam || q.type !== "short"),
  );
  const selectedCount =
    config.count === 0
      ? available.length
      : Math.min(config.count, available.length);
  function setDraft(fn: (d: Draft) => Draft) {
    update((p) => (p.draft ? { ...p, draft: fn(p.draft) } : p));
  }
  function start() {
    const selected = selectQuestions(bank, {
      ...config,
      exam,
      module: exam ? 0 : config.module,
    });
    if (!selected.length) return;
    const started = Date.now();
    update((p) => ({
      ...p,
      draft: {
        id: crypto.randomUUID(),
        config: { ...config, exam },
        ids: selected.map((q) => q.id),
        answers: {},
        graded: {},
        index: 0,
        started,
        deadline: config.timed ? started + config.minutes * 60000 : undefined,
      },
    }));
    setReveal(false);
    setNow(started);
  }
  function finish(d: Draft) {
    const end = Date.now();
    update((p) => {
      if (!p.draft || p.draft.id !== d.id || p.draft.finished) return p;
      const current = p.draft;
      const results = current.ids.map((id) => ({
        id: `${current.id}:${id}`,
        qid: id,
        correct:
          current.graded[id] ??
          grade(byId[id], current.answers[id] || []) ??
          false,
        at: end,
        self: byId[id].type === "short",
      }));
      const existing = new Set(p.attempts.map((a) => a.id));
      const additions = results.filter((a) => !existing.has(a.id));
      const graded = Object.fromEntries(results.map((a) => [a.qid, a.correct]));
      return {
        ...p,
        draft: { ...current, finished: true, finishedAt: end, graded },
        attempts: [...p.attempts, ...additions],
        sessions: p.sessions.some((s) => s.id === current.id)
          ? p.sessions
          : [
              ...p.sessions,
              {
                id: current.id,
                exam: current.config.exam,
                at: end,
                duration: Math.max(
                  0,
                  Math.round(
                    (Math.min(end, current.deadline ?? end) - current.started) /
                      1000,
                  ),
                ),
                total: results.length,
                correct: results.filter((r) => r.correct).length,
                self: results.filter((r) => r.self).length,
              },
            ],
      };
    });
  }
  useEffect(() => {
    if (!active || !draft.deadline) return;
    const timer = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(timer);
  }, [active, draft?.deadline]);
  const remaining = remainingSeconds(draft?.deadline, now);
  useEffect(() => {
    if (active && remaining === 0 && draft) finish(draft);
  }, [active, remaining, draft]);
  const current = draft ? byId[draft.ids[draft.index]] : undefined;
  const answer = current && draft ? draft.answers[current.id] || [] : [];
  const submitted = current && draft ? current.id in draft.graded : false;
  function submit(self?: boolean) {
    if (!draft || !current || submitted) return;
    const correct = grade(current, answer) ?? self;
    if (correct === undefined || correct === null) return;
    const attempt: Attempt = {
      id: `${draft.id}:${current.id}`,
      qid: current.id,
      correct,
      at: Date.now(),
      self: current.type === "short",
    };
    update((p) => ({
      ...p,
      draft: p.draft
        ? { ...p.draft, graded: { ...p.draft.graded, [current.id]: correct } }
        : undefined,
      attempts: p.attempts.some((a) => a.id === attempt.id)
        ? p.attempts
        : [...p.attempts, attempt],
    }));
    setReveal(false);
  }
  function choose(value: string) {
    if (!draft || !current || (!exam && submitted)) return;
    const next =
      current.type === "multiple"
        ? answer.includes(value)
          ? answer.filter((x) => x !== value)
          : [...answer, value]
        : [value];
    setDraft((d) => ({ ...d, answers: { ...d.answers, [current.id]: next } }));
  }
  function move(index: number) {
    setDraft((d) => ({
      ...d,
      index: Math.max(0, Math.min(d.ids.length - 1, index)),
    }));
    setReveal(false);
  }
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        !active ||
        !current ||
        (e.target as HTMLElement).closest("input,textarea,select,button,a")
      )
        return;
      if (/^[1-6]$/.test(e.key) && current.options?.[Number(e.key) - 1])
        choose(current.options[Number(e.key) - 1]);
      if (e.key === "ArrowRight" && (exam || submitted)) move(draft!.index + 1);
      if (e.key === "ArrowLeft") move(draft!.index - 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });
  const confirmElement = (
    <Confirm
      open={confirm !== null}
      onOpenChange={(v) => {
        if (!v) setConfirm(null);
      }}
      title={
        confirm === "submit"
          ? "Submit your exam?"
          : confirm === "replace"
            ? "Replace your saved session?"
            : "End this session?"
      }
      description={
        confirm === "submit"
          ? `${draft?.ids.filter((id) => !draft.answers[id]?.length).length || 0} questions have no answer. You cannot change answers after submission.`
          : confirm === "replace"
            ? "Starting this session replaces the saved session. Previously submitted answers remain in your progress."
            : "The session will be scored now. Unanswered questions count as incorrect; unassessed short answers count as not demonstrated."
      }
      label={confirm === "replace" ? "Start new session" : "Submit session"}
      onConfirm={() => {
        if (confirm === "replace") start();
        else if (draft) finish(draft);
      }}
    />
  );
  if (draft?.finished) {
    const correct = draft.ids.filter((id) => draft.graded[id]).length;
    const wrong = draft.ids.filter((id) => !draft.graded[id]);
    const session = progress.sessions.find((s) => s.id === draft.id);
    return (
      <>
        <Heading
          title={exam ? "Your exam, reviewed." : "Session complete."}
          description="Use the results to choose what to revise next."
        />
        <section className="result-summary">
          <CheckCircle2 size={36} />
          <div>
            <strong>
              {correct}
              <small> / {draft.ids.length}</small>
            </strong>
            <p>
              {Math.round((correct / draft.ids.length) * 100)}% accuracy ·{" "}
              {wrong.length} incorrect · {timeLabel(session?.duration || 0)}{" "}
              elapsed
            </p>
          </div>
        </section>
        <div className="actions">
          <Button
            disabled={!wrong.length}
            onClick={() => {
              setCustomIds(wrong);
              setConfig((c) => ({
                ...c,
                module: 0,
                type: "all",
                difficulty: "Mixed",
                count: 0,
              }));
              update((p) => ({ ...p, draft: undefined }));
            }}
          >
            <RotateCcw size={17} />
            Retry incorrect questions
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setCustomIds(null);
              update((p) => ({ ...p, draft: undefined }));
            }}
          >
            Configure another session
          </Button>
        </div>
        <h2>Performance by module</h2>
        <div className="result-modules">
          {modules.map((m) => {
            const ids = draft.ids.filter((id) => byId[id].module === m.id);
            if (!ids.length) return null;
            return (
              <div key={m.id}>
                <span>{m.short}</span>
                <strong>
                  {ids.filter((id) => draft.graded[id]).length}/{ids.length}
                </strong>
                <Meter
                  value={
                    (ids.filter((id) => draft.graded[id]).length / ids.length) *
                    100
                  }
                  label={`${m.short} accuracy`}
                />
              </div>
            );
          })}
        </div>
        {wrong.length > 0 && (
          <div className="source-note">
            <strong>Recommended revision</strong>
            <p>
              {[...new Set(wrong.map((id) => byId[id].topic))].map((id) => (
                <Link
                  className="revision-link"
                  key={id}
                  to={`/learn/${id[0]}?topic=${id}`}
                >
                  {topicById[id].title}
                  <ArrowUpRightSmall />
                </Link>
              ))}
            </p>
          </div>
        )}
        <h2>Detailed answer review</h2>
        {draft.ids.map((id, i) => (
          <details className="answer-review" key={id}>
            <summary>
              {draft.graded[id] ? (
                <CheckCircle2 className="success" size={19} />
              ) : (
                <XCircle className="error" size={19} />
              )}
              <span>
                {i + 1}. {byId[id].prompt}
              </span>
            </summary>
            <p>
              <strong>Your answer:</strong>{" "}
              {draft.answers[id]?.join(" · ") || "No answer"}
            </p>
            <p>
              <strong>
                {byId[id].type === "short"
                  ? "Reference answer"
                  : "Correct answer"}
                :
              </strong>{" "}
              {byId[id].answer.join(" · ")}
            </p>
            <p>{byId[id].explanation}</p>
            {byId[id].correction && (
              <p className="source-note">
                {byId[id].correction}
                <br />
                Original source answer: {byId[id].originalAnswer}
              </p>
            )}
            <p className="source-label">{byId[id].reference}</p>
            <Link to={`/learn/${byId[id].module}?topic=${byId[id].topic}`}>
              Read the topic
            </Link>
          </details>
        ))}
      </>
    );
  }
  if (active && draft && current)
    return (
      <>
        <div className="session-heading">
          <div>
            <h1>{exam ? "Mock endterm" : "Practice session"}</h1>
            <p>
              Question {draft.index + 1} of {draft.ids.length}
            </p>
          </div>
          <div className="actions">
            {remaining !== undefined && (
              <span
                className={`timer ${remaining < 60 ? "error" : ""}`}
                role="timer"
                aria-label="Time remaining"
              >
                <Clock size={18} />
                {timeLabel(remaining)}
              </span>
            )}
            <Button
              variant="ghost"
              onClick={() => setConfirm(exam ? "submit" : "leave")}
            >
              <Flag size={16} />
              {exam ? "Submit exam" : "End session"}
            </Button>
          </div>
        </div>
        <Meter
          value={((draft.index + 1) / draft.ids.length) * 100}
          label="Session position"
        />
        <div className="quiz-layout">
          <section className="quiz-question">
            <div className="question-meta">
              <span>
                Module {current.module} · {current.difficulty}
              </span>
              <Button
                variant="ghost"
                size="icon"
                aria-label={
                  progress.bookmarks.includes(current.id)
                    ? "Remove bookmark"
                    : "Bookmark question"
                }
                aria-pressed={progress.bookmarks.includes(current.id)}
                onClick={() =>
                  update((p) => ({
                    ...p,
                    bookmarks: p.bookmarks.includes(current.id)
                      ? p.bookmarks.filter((id) => id !== current.id)
                      : [...p.bookmarks, current.id],
                  }))
                }
              >
                <Bookmark
                  size={19}
                  fill={
                    progress.bookmarks.includes(current.id)
                      ? "currentColor"
                      : "none"
                  }
                />
              </Button>
            </div>
            <span className="badge">{current.source}</span>
            <h2>{current.prompt}</h2>
            <p className="muted">
              {current.type === "multiple"
                ? `Select ${current.answer.length} answers.`
                : current.type === "short"
                  ? "Write your answer, then compare it with the reference and assess yourself."
                  : current.type === "blank"
                    ? "Enter the requested term or value. Matching ignores case and extra whitespace."
                    : "Choose one answer."}
            </p>
            {current.options && current.type !== "short" ? (
              <fieldset className="choices" disabled={!exam && submitted}>
                <legend className="sr-only">Answer choices</legend>
                {current.options.map((option, i) => (
                  <label
                    className={`choice ${answer.includes(option) ? "selected" : ""} ${!exam && submitted && current.answer.includes(option) ? "correct" : ""} ${!exam && submitted && answer.includes(option) && !current.answer.includes(option) ? "incorrect" : ""}`}
                    key={option}
                  >
                    <input
                      type={current.type === "multiple" ? "checkbox" : "radio"}
                      name={current.id}
                      checked={answer.includes(option)}
                      onChange={() => choose(option)}
                    />
                    <span className="option-index">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span>{option}</span>
                    {!exam && submitted && current.answer.includes(option) && (
                      <CheckCircle2 size={18} />
                    )}
                  </label>
                ))}
              </fieldset>
            ) : (
              <label className="text-answer">
                Your answer
                {current.type === "short" ? (
                  <textarea
                    rows={5}
                    disabled={submitted}
                    value={answer[0] || ""}
                    onChange={(e) => choose(e.target.value)}
                  />
                ) : (
                  <input
                    autoComplete="off"
                    disabled={submitted}
                    value={answer[0] || ""}
                    onChange={(e) => choose(e.target.value)}
                  />
                )}
              </label>
            )}
            {!exam && current.type === "short" && !submitted && reveal && (
              <div className="feedback">
                <h3>Reference answer</h3>
                <p>{current.answer.join(" · ")}</p>
                <p>{current.explanation}</p>
                {current.correction && (
                  <p className="source-note">{current.correction}</p>
                )}
                <div className="actions">
                  <Button variant="outline" onClick={() => submit(false)}>
                    Needs more work
                  </Button>
                  <Button onClick={() => submit(true)}>
                    My answer covers this
                  </Button>
                </div>
                <small>Self-assessed; no automated free-text grading.</small>
              </div>
            )}
            {!exam && submitted && (
              <div
                className={`feedback ${draft.graded[current.id] ? "positive" : "negative"}`}
                role="status"
              >
                <h3>
                  {draft.graded[current.id]
                    ? "Correct. Nicely done."
                    : "A useful one to revisit."}
                </h3>
                <p>
                  <strong>
                    {current.type === "short" ? "Reference" : "Correct answer"}:
                  </strong>{" "}
                  {current.answer.join(" · ")}
                </p>
                <p>{current.explanation}</p>
                {current.originalAnswer && (
                  <details>
                    <summary>Original flashcard answer</summary>
                    <p>{current.originalAnswer}</p>
                  </details>
                )}
                {current.correction && (
                  <p className="source-note">{current.correction}</p>
                )}
                <p className="source-label">{current.reference}</p>
                <Link to={`/learn/${current.module}?topic=${current.topic}`}>
                  Read the explanation in Learn
                </Link>
              </div>
            )}
            <div className="quiz-controls">
              <Button
                variant="outline"
                onClick={() => move(draft.index - 1)}
                disabled={draft.index === 0}
              >
                <ArrowLeft size={17} />
                Previous
              </Button>
              {!exam && !submitted ? (
                <Button
                  disabled={
                    !answer.length ||
                    !answer[0]?.trim() ||
                    (current.type === "multiple" &&
                      answer.length !== current.answer.length)
                  }
                  onClick={() =>
                    current.type === "short" ? setReveal(true) : submit()
                  }
                >
                  {current.type === "short"
                    ? "Compare answer"
                    : "Submit answer"}
                  <CheckCircle2 size={17} />
                </Button>
              ) : draft.index === draft.ids.length - 1 ? (
                <Button
                  onClick={() => (exam ? setConfirm("submit") : finish(draft))}
                >
                  {exam ? "Submit exam" : "Finish session"}
                  <CheckCircle2 size={17} />
                </Button>
              ) : (
                <Button onClick={() => move(draft.index + 1)}>
                  Next question
                  <ArrowRight size={17} />
                </Button>
              )}
            </div>
            <p className="keyboard-help">
              Your answers are saved automatically.{" "}
              {exam
                ? "No feedback until submission."
                : "Number keys select choices when an input is not focused."}
            </p>
          </section>
          <aside className="question-navigator">
            <h3>Question navigator</h3>
            <div>
              {draft.ids.map((id, i) => (
                <button
                  key={id}
                  aria-label={`Go to question ${i + 1}${draft.answers[id]?.length ? ", answered" : ""}`}
                  aria-current={i === draft.index ? "step" : undefined}
                  className={`${i === draft.index ? "current" : ""} ${draft.answers[id]?.length ? "answered" : ""}`}
                  onClick={() => move(i)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <p>
              Filled = answered
              <br />
              Outline = current
            </p>
            <p>
              {draft.ids.filter((id) => draft.answers[id]?.length).length} of{" "}
              {draft.ids.length} answered
            </p>
            {exam && <p>You can change answers until final submission.</p>}
          </aside>
        </div>
        {confirmElement}
      </>
    );
  return (
    <>
      <Heading
        title={
          exam ? "A rehearsal for the real thing." : "Practice with purpose."
        }
        description={
          exam
            ? "A timed, balanced exam across all six modules. Review your answers after submission."
            : "Choose a focus, answer at your own pace, and learn from the explanation."
        }
      />
      {customIds && (
        <div className="notice">
          Retrying {customIds.length} questions from your last result.{" "}
          {exam ? "A retry may not include every module." : ""}
        </div>
      )}
      {review && (
        <div className="notice">
          Review collection:{" "}
          {review === "wrong"
            ? "latest incorrect answers"
            : "bookmarked questions"}
          . {bank.length} available before filters.
        </div>
      )}
      <div className="configuration">
        <div className="form-grid">
          {!exam && (
            <label>
              Module
              <select
                value={config.module}
                onChange={(e) =>
                  setConfig((c) => ({ ...c, module: Number(e.target.value) }))
                }
              >
                <option value={0}>All modules</option>
                {modules.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.id}. {m.short}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label>
            Difficulty
            <select
              value={config.difficulty}
              onChange={(e) =>
                setConfig((c) => ({
                  ...c,
                  difficulty: e.target.value as Config["difficulty"],
                }))
              }
            >
              {["Mixed", "Easy", "Medium", "Hard"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label>
            Question count
            <select
              value={config.count}
              onChange={(e) =>
                setConfig((c) => ({ ...c, count: Number(e.target.value) }))
              }
            >
              {[10, 20, 30, 40, 50, 100, 0].map((n) => (
                <option value={n} key={n}>
                  {n || "All available"}
                </option>
              ))}
            </select>
          </label>
          {!exam && (
            <label>
              Question type
              <select
                value={config.type}
                onChange={(e) =>
                  setConfig((c) => ({
                    ...c,
                    type: e.target.value as Config["type"],
                  }))
                }
              >
                <option value="all">All types</option>
                <option value="single">Single choice</option>
                <option value="multiple">Multiple answers</option>
                <option value="boolean">True / False</option>
                <option value="blank">Fill in the blank</option>
                <option value="short">Short answer · self-assessed</option>
              </select>
            </label>
          )}
          <label>
            Timing
            <select
              value={config.timed ? "timed" : "untimed"}
              onChange={(e) =>
                setConfig((c) => ({ ...c, timed: e.target.value === "timed" }))
              }
            >
              <option value="timed">Timed</option>
              <option value="untimed">Untimed</option>
            </select>
          </label>
          {config.timed && (
            <label>
              Time limit (minutes)
              <input
                type="number"
                min={1}
                max={180}
                value={config.minutes}
                onChange={(e) =>
                  setConfig((c) => ({
                    ...c,
                    minutes: Math.min(
                      180,
                      Math.max(1, Number(e.target.value) || 1),
                    ),
                  }))
                }
              />
            </label>
          )}
        </div>
        {!exam && (
          <label className="check-label">
            <input
              type="checkbox"
              checked={config.shuffle}
              onChange={(e) =>
                setConfig((c) => ({ ...c, shuffle: e.target.checked }))
              }
            />
            Shuffle question order
          </label>
        )}
        <div className="config-footer">
          <p>
            <strong>{selectedCount} questions</strong> match your selection.
            {config.count > available.length && (
              <>
                {" "}
                Requested {config.count}; using all {available.length} matching
                questions.
              </>
            )}
            <br />
            <span>
              {exam
                ? "Questions are randomized and distributed as evenly as available content allows. Short answers are excluded from exam scoring."
                : "Feedback appears only after you submit. Short answers use explicit self-assessment."}
            </span>
          </p>
          <Button
            disabled={!selectedCount}
            onClick={() =>
              progress.draft && !progress.draft.finished
                ? setConfirm("replace")
                : start()
            }
          >
            Start {exam ? "exam" : "practice"}
            <ArrowRight size={18} />
          </Button>
        </div>
        {!selectedCount && (
          <p role="status" className="error">
            No matching questions. Change the filters or build your review
            collection through practice.
          </p>
        )}
      </div>
      <section className="session-guide">
        <h2>{exam ? "Know what to expect" : "Make your session count"}</h2>
        <ol>
          {(exam
            ? [
                "Choose your answers and move freely between questions.",
                "The timer continues across refreshes and while the tab is in the background.",
                "Confirm submission, or let the timer submit automatically.",
                "Review your score, module breakdown and recommended topics.",
              ]
            : [
                "Answer before looking at the explanation.",
                "Use bookmarks for questions you want to revisit.",
                "For short answers, compare against the reference before rating yourself.",
                "Return to Review to retry mistakes and difficult cards.",
              ]
          ).map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ol>
      </section>
      {confirmElement}
    </>
  );
}
function ArrowUpRightSmall() {
  return <ArrowRight size={13} />;
}
