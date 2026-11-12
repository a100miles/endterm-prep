import { useEffect, useState } from "react";
import {
  Link,
  useParams,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  BookOpen,
  Timer,
  RotateCcw,
  Search,
  Bookmark,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { modules } from "../content/theory";
import { questions, lectureQuestions, topicById } from "../content/questions";
import { originalCards, quizletUrls } from "../content/flashcards";
import { useStudy, stats, latestAttempts, fresh } from "../lib/store";
import { Button } from "../components/ui/button";
import { Confirm } from "../components/ui/confirm";
export function Meter({ value, label }: { value: number; label: string }) {
  return (
    <div
      className="meter"
      role="progressbar"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span style={{ width: `${value}%` }} />
    </div>
  );
}
export function Heading({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children}
    </div>
  );
}
export function Dashboard() {
  const { progress } = useStudy();
  const s = stats(progress);
  const next = progress.lastTopic ? Number(progress.lastTopic[0]) : 1;
  const weak = modules
    .map((m) => ({ ...m, s: stats(progress, m.id) }))
    .filter((m) => m.s.attempts > 0 && m.s.accuracy! < 75)
    .sort((a, b) => a.s.accuracy! - b.s.accuracy!);
  return (
    <>
      <Heading title="Endterm Prep." description="Six modules. One goal.">
        <Button asChild variant="outline">
          <Link to="/exam">
            <Timer size={17} /> Take a mock exam
          </Link>
        </Button>
      </Heading>
      <section className="continue-panel">
        <div>
          <h2>
            {progress.draft && !progress.draft.finished
              ? "Pick up where you left off."
              : s.attempts
                ? "A little more confident, every session."
                : "Your next chapter starts here."}
          </h2>
          <p>
            {progress.draft && !progress.draft.finished
              ? `Your ${progress.draft.config.exam ? "exam" : "practice session"} is saved. Continue with question ${progress.draft.index + 1} of ${progress.draft.ids.length}.`
              : "Learn the concepts, test your recall, and make the tricky parts stick."}
          </p>
          <Button asChild>
            <Link
              to={
                progress.draft && !progress.draft.finished
                  ? progress.draft.config.exam
                    ? "/exam"
                    : "/practice"
                  : `/learn/${next}`
              }
            >
              {s.attempts || progress.lastTopic
                ? "Continue studying"
                : "Start with Module 1"}
              <ArrowRight size={18} />
            </Link>
          </Button>
        </div>
        <div className="preparation">
          <span>Preparation progress</span>
          <strong>
            {s.completion}
            <small>%</small>
          </strong>
          <Meter value={s.completion} label="Questions attempted" />
          <p>
            {s.unique} of {s.total} questions attempted
          </p>
        </div>
      </section>
      <section className="stat-strip" aria-label="Study summary">
        <div>
          <strong>{questions.length}</strong>
          <span>Unique questions</span>
        </div>
        <div>
          <strong>{s.unique}</strong>
          <span>Questions completed</span>
        </div>
        <div>
          <strong>{s.accuracy === null ? "—" : `${s.accuracy}%`}</strong>
          <span>Answer accuracy</span>
        </div>
        <div>
          <strong>{progress.sessions.filter((s) => s.exam).length}</strong>
          <span>Mock exams completed</span>
        </div>
      </section>
      <div className="section-heading">
        <h2>Your modules</h2>
        <Link to="/learn">
          Quick revision <ArrowRight size={16} />
        </Link>
      </div>
      <div className="module-grid">
        {modules.map((m) => {
          const ms = stats(progress, m.id);
          return (
            <article className={`module-card module-${m.id}`} key={m.id}>
              <div className="module-card-top">
                <span className="module-number">
                  Module {String(m.id).padStart(2, "0")}
                </span>
                <BookOpen size={19} />
              </div>
              <h3>{m.short}</h3>
              <p>{m.description}</p>
              <div className="module-meta">
                <span>
                  {m.topics.length} topics · {ms.total} questions
                </span>
                <span>{ms.completion}%</span>
              </div>
              <Meter value={ms.completion} label={`Module ${m.id} progress`} />
              <Link className="module-link" to={`/learn/${m.id}`}>
                Study module <ArrowUpRight size={18} />
              </Link>
            </article>
          );
        })}
      </div>
      <section className="review-banner">
        <div>
          <h2>
            {weak.length
              ? "Give these another look."
              : "Let practice guide your review."}
          </h2>
          <p>
            {weak.length
              ? weak
                  .slice(0, 2)
                  .map((m) => `${m.short}: ${m.s.accuracy}% accuracy`)
                  .join(" · ")
              : "After you answer questions, your weak topics will appear here."}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to={weak.length ? "/review" : "/practice"}>
            {weak.length ? "Review weak areas" : "Start practicing"}
            <ArrowRight size={17} />
          </Link>
        </Button>
      </section>
    </>
  );
}
function CapacityCalculator() {
  const [size, setSize] = useState(11);
  const [rate, setRate] = useState(20);
  const [mode, setMode] = useState("eventual");
  const answer =
    (rate * Math.ceil(size / (mode === "write" ? 1 : 4))) /
    (mode === "eventual" ? 2 : 1);
  return (
    <section className="calculator">
      <h3>Try a capacity calculation</h3>
      <div className="form-grid">
        <label>
          Item size (KB)
          <input
            type="number"
            min="0.01"
            step="0.1"
            value={size}
            onChange={(e) => setSize(Math.max(0.01, Number(e.target.value)))}
          />
        </label>
        <label>
          Operations per second
          <input
            type="number"
            min="1"
            value={rate}
            onChange={(e) => setRate(Math.max(1, Number(e.target.value)))}
          />
        </label>
        <label>
          Operation
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="eventual">Eventual read</option>
            <option value="strong">Strong read</option>
            <option value="write">Write</option>
          </select>
        </label>
      </div>
      <output>
        {answer} {mode === "write" ? "WCUs" : "RCUs"}
      </output>
      <p>
        Nontransactional operations: round each item to{" "}
        {mode === "write" ? "1" : "4"} KB blocks, multiply by operations/second
        {mode === "eventual" ? ", then divide by 2" : ""}.
      </p>
    </section>
  );
}
export function Learn() {
  const { moduleId } = useParams();
  const [params] = useSearchParams();
  const { progress, update } = useStudy();
  const m = modules.find((m) => m.id === Number(moduleId));
  const navigate = useNavigate();
  useEffect(() => {
    if (params.get("topic"))
      document
        .getElementById(params.get("topic")!)
        ?.scrollIntoView({ block: "start" });
  }, [moduleId, params]);
  if (!m)
    return (
      <>
        <Heading
          title="Learn & revise"
          description="Start with an explanation. Finish by recalling it in your own words."
        />
        <div className="module-tabs">
          {modules.map((m) => (
            <Link key={m.id} to={`/learn/${m.id}`}>
              Module {m.id}: {m.short}
              <ArrowRight size={16} />
            </Link>
          ))}
        </div>
        <h2>Quick revision</h2>
        <p className="muted">
          High-value distinctions from all six modules. Expand a module for its
          key facts.
        </p>
        {modules.map((m) => (
          <details className="revision" key={m.id}>
            <summary>
              {m.id}. {m.short}
              <span>{m.topics.length} topics</span>
            </summary>
            {m.topics.map((t) => (
              <div key={t.id}>
                <Link to={`/learn/${m.id}?topic=${t.id}`}>
                  <strong>{t.title}</strong>
                </Link>
                <ul>
                  {t.takeaways.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            ))}
          </details>
        ))}
      </>
    );
  return (
    <>
      <Link className="back-link" to="/learn">
        ← All modules & quick revision
      </Link>
      <Heading title={`${m.id}. ${m.title}`} description={m.description}>
        <Button asChild variant="outline">
          <Link to={`/practice?module=${m.id}`}>
            Practice this module <ArrowRight size={17} />
          </Link>
        </Button>
      </Heading>
      <div className="learn-layout">
        <nav className="topic-nav" aria-label="Topics">
          {m.topics.map((t) => (
            <a
              key={t.id}
              href={`#/learn/${m.id}?topic=${t.id}`}
              onClick={() => update((p) => ({ ...p, lastTopic: t.id }))}
            >
              {progress.read.includes(t.id) ? (
                <CheckCircle2 size={16} />
              ) : (
                <span className="topic-dot" />
              )}
              {t.title}
            </a>
          ))}
          <label>
            Switch module
            <select
              value={m.id}
              onChange={(e) => navigate(`/learn/${e.target.value}`)}
            >
              {modules.map((x) => (
                <option value={x.id} key={x.id}>
                  {x.id}. {x.short}
                </option>
              ))}
            </select>
          </label>
        </nav>
        <article className="lesson">
          {m.topics.map((t) => (
            <section className="topic" id={t.id} key={t.id}>
              <div className="topic-heading">
                <h2>{t.title}</h2>
                <span className="source-label">Slides {t.slides}</span>
              </div>
              <p className="definition">{t.definition}</p>
              <p>{t.explanation}</p>
              {t.table && (
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        {t.table[0].map((x) => (
                          <th key={x}>{x}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {t.table.slice(1).map((row, i) => (
                        <tr key={i}>
                          {row.map((x, j) => (
                            <td key={j}>{x}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="example">
                <strong>Put it into practice</strong>
                <p>{t.example}</p>
              </div>
              {t.code && (
                <pre>
                  <code>{t.code}</code>
                </pre>
              )}
              <details className="misconception">
                <summary>Common misconception</summary>
                <p>{t.misconception}</p>
              </details>
              {t.note && (
                <div className="source-note">
                  <strong>Source clarification</strong>
                  <p>{t.note}</p>
                  {t.reference && (
                    <a href={t.reference} target="_blank" rel="noreferrer">
                      Verify in AWS documentation <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              )}
              <h3>Key takeaways</h3>
              <ul>
                {t.takeaways.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <div className="terms">
                {t.terms.map((x) => (
                  <span key={x}>{x}</span>
                ))}
              </div>
              <div className="recall">
                <strong>Check your understanding</strong>
                <p>{t.exam}</p>
              </div>
              {t.id === "5-capacity" && <CapacityCalculator />}
              <Button
                variant={progress.read.includes(t.id) ? "ghost" : "outline"}
                onClick={() =>
                  update((p) => ({
                    ...p,
                    lastTopic: t.id,
                    read: p.read.includes(t.id)
                      ? p.read.filter((id) => id !== t.id)
                      : [...p.read, t.id],
                  }))
                }
              >
                <Check size={17} />
                {progress.read.includes(t.id)
                  ? "Read · mark unread"
                  : "Mark topic as read"}
              </Button>
            </section>
          ))}
          <Button asChild>
            <Link to={`/practice?module=${m.id}`}>
              Test what you learned <ArrowRight size={17} />
            </Link>
          </Button>
        </article>
      </div>
    </>
  );
}
export function Review() {
  const { progress, update } = useStudy();
  const latest = latestAttempts(progress);
  const wrong = questions.filter((q) => latest[q.id] && !latest[q.id].correct);
  const saved = questions.filter((q) => progress.bookmarks.includes(q.id));
  const [filter, setFilter] = useState("wrong");
  const items = filter === "wrong" ? wrong : saved;
  const unknown = Object.entries(progress.known).filter(
    ([, v]) => v === false,
  ).length;
  const weak = Object.values(topicById)
    .map((t) => {
      const a = progress.attempts.filter(
        (a) => questions.find((q) => q.id === a.qid)?.topic === t.id,
      );
      return {
        t,
        total: a.length,
        accuracy: a.length
          ? Math.round((a.filter((x) => x.correct).length / a.length) * 100)
          : 0,
      };
    })
    .filter((x) => x.total && x.accuracy < 75)
    .sort((a, b) => a.accuracy - b.accuracy);
  return (
    <>
      <Heading
        title="Make the tricky parts stick."
        description="Review suggestions come from your answers, bookmarks and flashcard ratings."
      />
      <div className="review-actions">
        <Button asChild disabled={!wrong.length}>
          <Link to="/practice?review=wrong">
            Retry {wrong.length} incorrect questions <RotateCcw size={17} />
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/flashcards?unknown=1">
            Review {unknown} difficult cards
          </Link>
        </Button>
      </div>
      {weak.length > 0 && (
        <section>
          <h2>Topics worth revisiting</h2>
          <div className="weak-topics">
            {weak.map(({ t, accuracy, total }) => (
              <Link key={t.id} to={`/learn/${t.id[0]}?topic=${t.id}`}>
                <span>
                  {t.title}
                  <small>
                    Module {t.id[0]} · {total} answers
                  </small>
                </span>
                <strong>{accuracy}%</strong>
                <ArrowUpRight size={16} />
              </Link>
            ))}
          </div>
        </section>
      )}
      <div className="segmented" aria-label="Review filter">
        <button
          aria-pressed={filter === "wrong"}
          onClick={() => setFilter("wrong")}
        >
          Incorrect ({wrong.length})
        </button>
        <button
          aria-pressed={filter === "saved"}
          onClick={() => setFilter("saved")}
        >
          Bookmarked ({saved.length})
        </button>
      </div>
      {!items.length ? (
        <div className="empty">
          <Bookmark size={32} />
          <h2>
            {filter === "wrong"
              ? "No unresolved mistakes."
              : "No bookmarks yet."}
          </h2>
          <p>
            {filter === "wrong"
              ? "Start a practice session to find out what needs more attention."
              : "Bookmark a question while practicing to keep it here."}
          </p>
          <Button asChild>
            <Link to="/practice">Go to practice</Link>
          </Button>
        </div>
      ) : (
        <>
          <Button asChild variant="outline">
            <Link to={`/practice?review=${filter}`}>
              Practice this collection
            </Link>
          </Button>
          <div className="question-list">
            {items.map((q) => (
              <article key={q.id}>
                <span className="source-label">
                  Module {q.module} · {topicById[q.topic]?.title}
                </span>
                <h3>{q.prompt}</h3>
                <div className="actions">
                  <Link to={`/learn/${q.module}?topic=${q.topic}`}>
                    Revise topic
                  </Link>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      update((p) => ({
                        ...p,
                        bookmarks: p.bookmarks.includes(q.id)
                          ? p.bookmarks.filter((id) => id !== q.id)
                          : [...p.bookmarks, q.id],
                      }))
                    }
                  >
                    <Bookmark size={15} />
                    {progress.bookmarks.includes(q.id)
                      ? "Remove bookmark"
                      : "Bookmark"}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </>
  );
}
export function Statistics() {
  const { progress, update } = useStudy();
  const [reset, setReset] = useState(false);
  const s = stats(progress);
  return (
    <>
      <Heading
        title="Your progress"
        description="Every answer adds evidence. Reading progress and question coverage are tracked separately."
      />
      <section className="stat-strip">
        <div>
          <strong>{s.attempts}</strong>
          <span>Total answers</span>
        </div>
        <div>
          <strong>{s.accuracy === null ? "—" : `${s.accuracy}%`}</strong>
          <span>Answer accuracy</span>
        </div>
        <div>
          <strong>
            {progress.read.length}/{modules.flatMap((m) => m.topics).length}
          </strong>
          <span>Topics marked read</span>
        </div>
        <div>
          <strong>{progress.sessions.filter((s) => s.exam).length}</strong>
          <span>Mock exams</span>
        </div>
      </section>
      <h2>By module</h2>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Module</th>
              <th>Question coverage</th>
              <th>Accuracy</th>
              <th>Read</th>
            </tr>
          </thead>
          <tbody>
            {modules.map((m) => {
              const a = stats(progress, m.id);
              return (
                <tr key={m.id}>
                  <td>
                    <Link to={`/learn/${m.id}`}>
                      {m.id}. {m.short}
                    </Link>
                  </td>
                  <td>
                    {a.unique}/{a.total}
                    <Meter value={a.completion} label={`${m.short} coverage`} />
                  </td>
                  <td>
                    {a.accuracy === null ? "No answers" : `${a.accuracy}%`}
                  </td>
                  <td>
                    {
                      m.topics.filter((t) => progress.read.includes(t.id))
                        .length
                    }
                    /{m.topics.length}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="muted">
        Accuracy includes all submitted attempts, including self-assessed short
        answers. Question coverage counts unique questions attempted, not
        mastery.
      </p>
      <h2>Recent sessions</h2>
      {progress.sessions.length ? (
        <div className="session-list">
          {progress.sessions
            .slice(-10)
            .reverse()
            .map((s) => (
              <div key={s.id}>
                <span>
                  <strong>{s.exam ? "Mock exam" : "Practice"}</strong>
                  <small>
                    {new Date(s.at).toLocaleString()} ·{" "}
                    {Math.round(s.duration / 60)} min
                    {s.self ? ` · ${s.self} self-assessed` : ""}
                  </small>
                </span>
                <strong>
                  {s.correct}/{s.total}
                </strong>
              </div>
            ))}
        </div>
      ) : (
        <div className="empty compact">
          <p>Finish a practice session or mock exam to see it here.</p>
        </div>
      )}
      <div className="settings">
        <h2>Study data</h2>
        <p>
          Saved in this browser only. Clearing browser data removes it; there is
          no account sync.
        </p>
        <Button variant="danger" onClick={() => setReset(true)}>
          Reset all progress
        </Button>
      </div>
      <Confirm
        open={reset}
        onOpenChange={setReset}
        title="Reset your study progress?"
        description="This removes answers, sessions, bookmarks, card ratings and your saved session from this browser. This cannot be undone."
        label="Reset progress"
        onConfirm={() => update(() => fresh())}
      />
    </>
  );
}
export function Sources() {
  return (
    <>
      <Heading
        title="Built from your sources"
        description="Six lecture decks, five Quizlet sets, and explicit corrections where the sources disagree."
      />
      <div className="source-summary">
        <CheckCircle2 />
        <p>
          <strong>All 441 slides processed · all 50 flashcards imported</strong>
          <br />
          Slide text, tables, editable diagram appendices and embedded diagrams
          were inspected. Repeated artwork and administrative slides are tracked
          in the coverage inventory.
        </p>
      </div>
      <p>
        The question wording has been lightly edited for clarity. Source answers
        are retained alongside validated answers. One ambiguous SDK card is
        available for self-assessment and excluded from automatically scored
        exams. No identical flashcards were removed.
      </p>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Module</th>
              <th>Slides</th>
              <th>Original cards</th>
              <th>Added questions</th>
              <th>Sources</th>
            </tr>
          </thead>
          <tbody>
            {modules.map((m) => (
              <tr key={m.id}>
                <td>
                  {m.id}. {m.short}
                </td>
                <td>{m.slides}</td>
                <td>{originalCards.filter((q) => q.module === m.id).length}</td>
                <td>
                  {lectureQuestions.filter((q) => q.module === m.id).length}
                </td>
                <td>
                  {quizletUrls[m.id] ? (
                    <a
                      href={quizletUrls[m.id]}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Quizlet <ExternalLink size={14} />
                    </a>
                  ) : (
                    "No set supplied"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        {questions.length} unique question records. All sets accessed through
        Chrome on November 12, 2026 after the initial fetch returned HTTP 403.
      </p>
      <h2>Corrections you should know</h2>
      {originalCards
        .filter((q) => q.correction)
        .map((q) => (
          <details className="revision" key={q.id}>
            <summary>
              Module {q.module} · Flashcard {q.id.split("-")[1]}
              <span>Source note</span>
            </summary>
            <p>{q.prompt}</p>
            <p>
              <strong>Original answer:</strong> {q.originalAnswer}
            </p>
            <p>
              <strong>Clarification:</strong> {q.correction}
            </p>
            <p>
              <strong>Explanation:</strong> {q.explanation}
            </p>
            <a href={quizletUrls[q.module]} target="_blank" rel="noreferrer">
              Open original set
            </a>
          </details>
        ))}
      {modules.flatMap((m) =>
        m.topics
          .filter((t) => t.note)
          .map((t) => (
            <details className="revision" key={t.id}>
              <summary>
                Module {m.id} · {t.title}
              </summary>
              <p>{t.note}</p>
              {t.reference && (
                <a href={t.reference} target="_blank" rel="noreferrer">
                  AWS reference
                </a>
              )}
            </details>
          )),
      )}
      <h2>Lecture files</h2>
      <ul className="file-list">
        {modules.map((m) => (
          <li key={m.id}>{m.file}</li>
        ))}
      </ul>
      <p className="muted">
        The original lecture files are not redistributed. This app contains
        rewritten study notes and source references. Course-era details are
        labeled where they differ from current AWS behavior.
      </p>
    </>
  );
}
export function SearchPage() {
  const [query, setQuery] = useState("");
  const results = modules
    .flatMap((m) => m.topics.map((t) => ({ m, t })))
    .filter(({ t }) =>
      `${t.title} ${t.terms.join(" ")} ${t.definition} ${t.explanation}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
    );
  return (
    <>
      <Heading
        title="Find a concept"
        description="Search across topic names, terminology and explanations."
      />
      <label className="search-input">
        <Search size={21} />
        <input
          autoFocus
          aria-label="Search topics and terminology"
          value={query}
          placeholder="Try “presigned URL” or “capacity”…"
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      <p className="muted">{results.length} topics</p>
      <div className="search-results">
        {results.map(({ m, t }) => (
          <Link key={t.id} to={`/learn/${m.id}?topic=${t.id}`}>
            <span className="source-label">
              Module {m.id} · {m.short}
            </span>
            <h2>
              {t.title}
              <ArrowUpRight size={20} />
            </h2>
            <p>{t.definition}</p>
          </Link>
        ))}
      </div>
      {!results.length && (
        <div className="empty">
          <h2>No matching topics</h2>
          <p>Try a service name such as S3, IAM or DynamoDB.</p>
        </div>
      )}
    </>
  );
}
