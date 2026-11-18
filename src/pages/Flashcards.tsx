import { moduleLabel } from "../content/foundations";
import { matchesCourse, type Config } from "../lib/engine";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Shuffle,
  Check,
  X,
  RotateCcw,
} from "lucide-react";
import { questions, topicById } from "../content/questions";
import { modules } from "../content/theory";
import { shuffle } from "../lib/engine";
import { useStudy } from "../lib/store";
import { Button } from "../components/ui/button";
import { Heading, Meter } from "./Study";
export default function Flashcards() {
  const [params] = useSearchParams();
  const { progress, update } = useStudy();
  const [module, setModule] = useState(0);
  const [course, setCourse] = useState<Config["course"]>(
    params.get("course") === "foundations" ? "foundations" : "all",
  );
  const [source, setSource] = useState(
    params.has("course") || params.has("unknown") ? "all" : "original",
  );
  const [unknown, setUnknown] = useState(params.has("unknown"));
  const [order, setOrder] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [query, setQuery] = useState("");
  const pool = useMemo(
    () =>
      questions.filter(
        (q) =>
          matchesCourse(q.module, course) &&
          (!module || q.module === module) &&
          (source === "all" || q.source === "From Flashcards") &&
          (!unknown || progress.known[q.id] === false),
      ),
    [course, module, source, unknown, progress.known],
  );
  const cards = useMemo(
    () =>
      order.length
        ? [...pool].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id))
        : pool,
    [pool, order],
  );
  const safeIndex = Math.min(index, Math.max(0, cards.length - 1));
  const card = cards[safeIndex];
  const move = (n: number) => {
    setIndex((i) => Math.max(0, Math.min(cards.length - 1, i + n)));
    setFlipped(false);
  };
  const rate = (known: boolean) => {
    if (!card) return;
    update((p) => ({ ...p, known: { ...p.known, [card.id]: known } }));
    if (!(unknown && known)) move(1);
    else setFlipped(false);
  };
  useEffect(() => {
    setIndex(0);
    setFlipped(false);
  }, [course, module, source, unknown]);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest("input,select,textarea")) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        move(1);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        move(-1);
      }
      if (
        e.code === "Space" &&
        !(e.target as HTMLElement).closest("button,a")
      ) {
        e.preventDefault();
        setFlipped((f) => !f);
      }
      if (e.key === "1" && flipped) rate(false);
      if (e.key === "2" && flipped) rate(true);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });
  return (
    <>
      <Heading
        title="Cloud flashcards"
        description="Think of your answer first. Flip the card, then rate your recall."
      />
      <div className="filters">
        <label>
          Course
          <select
            value={course}
            onChange={(e) => {
              setCourse(e.target.value as Config["course"]);
              setModule(0);
            }}
          >
            <option value="all">Both courses</option>
            <option value="foundations">Cloud Foundations</option>
            <option value="developing">Cloud Developing</option>
          </select>
        </label>
        <label>
          Module
          <select
            value={module}
            onChange={(e) => setModule(Number(e.target.value))}
          >
            <option value={0}>All modules</option>
            {modules
              .filter((m) => matchesCourse(m.id, course))
              .map((m) => (
                <option value={m.id} key={m.id}>
                  {moduleLabel(m.id)} · {m.short}
                </option>
              ))}
          </select>
        </label>
        <label>
          Card source
          <select value={source} onChange={(e) => setSource(e.target.value)}>
            <option value="original">Original Quizlet cards</option>
            <option value="all">All study questions</option>
          </select>
        </label>
        <label className="check-label">
          <input
            type="checkbox"
            checked={unknown}
            onChange={(e) => setUnknown(e.target.checked)}
          />
          Only “Don’t know”
        </label>
        <Button
          variant="outline"
          onClick={() => {
            setOrder(shuffle(cards.map((c) => c.id)));
            setIndex(0);
            setFlipped(false);
          }}
          disabled={!cards.length}
        >
          <Shuffle size={17} />
          Shuffle
        </Button>
      </div>
      {!card ? (
        <div className="empty">
          <Check size={32} />
          <h2>
            {unknown
              ? "No difficult cards in this selection."
              : "No cards in this selection."}
          </h2>
          <p>
            {module === 1 && source === "original"
              ? "No Module 1 Quizlet set was supplied. Select all study questions for lecture-based cards."
              : unknown
                ? "Rate cards “Don’t know” to collect them here."
                : "Try All study questions to include cards based on the lectures."}
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setUnknown(false);
              setSource("all");
            }}
          >
            Show all study questions
          </Button>
        </div>
      ) : (
        <div className="flash-workspace">
          <div className="flash-meta">
            <span>
              {moduleLabel(card.module)} · {topicById[card.topic]?.title}
            </span>
            <span>
              {safeIndex + 1} / {cards.length}
            </span>
          </div>
          <Meter
            value={((safeIndex + 1) / cards.length) * 100}
            label="Flashcard position"
          />
          <button
            className={`flashcard ${flipped ? "flipped" : ""}`}
            onClick={() => setFlipped(!flipped)}
            aria-label={
              flipped ? "Show question" : "Flip card to reveal answer"
            }
            aria-describedby={flipped ? "flash-answer" : "flash-question"}
          >
            <span className="flash-inner">
              <span
                id="flash-question"
                className="flash-face front"
                aria-hidden={flipped}
              >
                <span className="card-source">{card.source}</span>
                <strong>{card.prompt}</strong>
                {card.options && (
                  <span className="flash-options">
                    {card.options.map((o, i) => (
                      <span key={o}>
                        {i + 1}. {o}
                      </span>
                    ))}
                  </span>
                )}
                <span className="flip-hint">
                  Click or press Space to reveal
                </span>
              </span>
              <span
                id="flash-answer"
                className="flash-face back"
                aria-hidden={!flipped}
              >
                <span className="card-source">Answer & explanation</span>
                <strong>{card.answer.join(" · ")}</strong>
                <span>{card.explanation}</span>
                {card.correction && (
                  <span className="source-note">
                    <b>Source correction</b>
                    <br />
                    {card.correction}
                    <br />
                    <b>Original:</b> {card.originalAnswer}
                  </span>
                )}
                <span className="flip-hint">Click to return to question</span>
              </span>
            </span>
          </button>
          <div className="flash-controls">
            <Button
              variant="outline"
              size="icon"
              aria-label="Previous card"
              disabled={safeIndex === 0}
              onClick={() => move(-1)}
            >
              <ArrowLeft />
            </Button>
            <div className="actions">
              <Button
                variant="outline"
                disabled={!flipped}
                onClick={() => rate(false)}
              >
                <X size={17} />
                Don’t know <kbd>1</kbd>
              </Button>
              <Button disabled={!flipped} onClick={() => rate(true)}>
                <Check size={17} />
                Know it <kbd>2</kbd>
              </Button>
            </div>
            <Button
              variant="outline"
              size="icon"
              aria-label="Next card"
              disabled={safeIndex === cards.length - 1}
              onClick={() => move(1)}
            >
              <ArrowRight />
            </Button>
          </div>
          <div className="flash-footer">
            <Link to={`/learn/${card.module}?topic=${card.topic}`}>
              Read the topic <ArrowRight size={14} />
            </Link>
            <span>
              {progress.known[card.id] === undefined
                ? "Not rated"
                : progress.known[card.id]
                  ? "Marked: Know it"
                  : "Marked: Don’t know"}
            </span>
          </div>
          <details className="source-details">
            <summary>Source reference</summary>
            <p>{card.reference}</p>
          </details>
          <details className="question-library">
            <summary>Browse this deck · {cards.length} cards</summary>
            <label>
              Find a question
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <ul>
              {cards.map(
                (item, position) =>
                  item.prompt
                    .toLowerCase()
                    .includes(query.trim().toLowerCase()) && (
                    <li key={item.id}>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setIndex(position);
                          setFlipped(false);
                          document
                            .querySelector<HTMLButtonElement>(".flashcard")
                            ?.focus();
                        }}
                      >
                        {position + 1}. {item.prompt}
                      </Button>
                    </li>
                  ),
              )}
            </ul>
          </details>
          <p className="keyboard-help">
            <kbd>←</kbd> <kbd>→</kbd> Move · <kbd>Space</kbd> Flip ·{" "}
            <kbd>1</kbd> Don’t know · <kbd>2</kbd> Know it
          </p>
          {safeIndex === cards.length - 1 && (
            <Button
              variant="ghost"
              onClick={() => {
                setIndex(0);
                setFlipped(false);
              }}
            >
              <RotateCcw size={16} />
              Back to the first card
            </Button>
          )}
        </div>
      )}
    </>
  );
}
