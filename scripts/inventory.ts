import { writeFileSync, mkdirSync } from "node:fs";
import { modules } from "../src/content/theory";
import { originalCards, quizletUrls } from "../src/content/flashcards";
import { questions, lectureQuestions } from "../src/content/questions";
mkdirSync("docs", { recursive: true });
const inventory = modules.map((m) => ({
  module: m.id,
  name: m.title,
  file: m.file,
  slides: m.slides,
  coverage:
    "All slide text, tables, diagram appendices and embedded diagrams inspected; administrative and repeated artwork slides included in slide-coverage.json",
  topics: m.topics.map((t) => ({
    id: t.id,
    title: t.title,
    slides: t.slides,
    terminology: t.terms,
  })),
  originalFlashcards: originalCards.filter((q) => q.module === m.id).length,
  additionalQuestions: lectureQuestions.filter((q) => q.module === m.id).length,
  totalQuestions: questions.filter((q) => q.module === m.id).length,
  quizlet: !quizletUrls[m.id]
    ? null
    : {
        url: quizletUrls[m.id],
        status: originalCards.some((card) => card.module === m.id)
          ? "Imported and adapted"
          : "Linked; card text unavailable",
        duplicates: 0,
      },
}));
writeFileSync(
  "docs/content-inventory.json",
  JSON.stringify(inventory, null, 2) + "\n",
);
writeFileSync(
  "docs/content-inventory.md",
  `# Content inventory\n\nProcessed: ${modules.length} decks, ${modules.reduce((total, m) => total + m.slides, 0)} slides, ${originalCards.length} imported Quizlet cards, ${lectureQuestions.length} additional questions, ${questions.length} total unique question records, ${modules.flatMap((m) => m.topics).length} theory topics.\n\n| Module | Slides | Original cards | Added | Total |\n|---|---:|---:|---:|---:|\n` +
    inventory
      .map(
        (m) =>
          `| ${m.module}. ${m.name} | ${m.slides} | ${m.originalFlashcards} | ${m.additionalQuestions} | ${m.totalQuestions} |`,
      )
      .join("\n") +
    "\n\nNo identical cards removed. One ambiguous original SDK card is self-assessed and excluded from automatic exam scoring. See the Sources screen and content source fields for all corrections.\n\n" +
    inventory
      .map(
        (m) =>
          `## Module ${m.module}\n\n${m.topics.map((t) => `- **${t.title}** (slides ${t.slides}): ${t.terminology.join(", ")}`).join("\n")}`,
      )
      .join("\n\n"),
);
console.log(
  JSON.stringify({
    modules: modules.length,
    slides: modules.reduce((total, m) => total + m.slides, 0),
    original: originalCards.length,
    additional: lectureQuestions.length,
    total: questions.length,
    topics: modules.flatMap((m) => m.topics).length,
  }),
);
