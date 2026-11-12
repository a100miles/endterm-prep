# Endterm Prep.

A personal study application for the first six AWS Academy Cloud Developing modules. It combines rewritten lecture notes, the five supplied Quizlet sets, practice questions, timed mock exams and browser-local progress.

**Website:** https://a100miles.github.io/endterm-prep/

## Study modes

- Learn: 43 source-referenced topics, examples, misconceptions, comparison tables, code, quick revision and an RCU/WCU calculator.
- Flashcards: 50 original cards plus optional lecture-based study cards; flip, shuffle, module filters, known/unknown ratings and keyboard controls.
- Practice: module, difficulty, count, format, timing and order filters; feedback after submission; bookmarks and explicit short-answer self-assessment.
- Mock exam: 40 questions by default, balanced across available modules, absolute-deadline timer, answer navigation, confirmation and detailed results. Short answers are excluded from automated exams.
- Review and progress: latest incorrect answers, bookmarks, difficult cards, evidence-based topic recommendations, module statistics and recent sessions.
- Search, dark mode, responsive navigation, accessible labels/focus and reduced-motion support.

## Content and accuracy

All six supplied decks (441 slides including administrative slides and diagram appendices) and all five Quizlet sets were inspected. The app contains **158 unique questions: 50 imported and 108 additional**, and 43 theory topics. The original decks and extracted slide images are not redistributed.

Source wording has been normalized for clarity. Original answers and correction notes remain in the data and Sources screen. In particular:

- S3 time-limited access: the source incorrectly chooses an endpoint URL; scoring uses a presigned URL.
- S3 website endpoint: the source's HTTPS scheme is invalid; the question explicitly tests the intended hostname.
- IAM inline policies: the deck incorrectly labels them resource-based; identity inline permission policies are identity-based.
- DynamoDB cuisine/rating index: the source answer is unresolved; the lecture supports a GSI.
- The SDK resource-API card has an extra valid choice despite asking for two. It is self-assessed and excluded from automatic exams.
- Historical S3 size limits and global-table consistency descriptions are labeled, with current documentation links.

See [content inventory](docs/content-inventory.md), [structured inventory](docs/content-inventory.json), and [slide coverage](docs/slide-coverage.json). There were no identical imported cards to deduplicate. Supplemental AWS documentation supports corrections, rather than silently replacing course-era material.

## Development

Requires Node.js 24 and npm.

```sh
npm ci
npm run dev
npm test
npm run inventory
npm run build
npm run preview
```

Vite serves the app under `/endterm-prep/`. React Router uses hash routes, so refreshing a nested study page works on GitHub Pages without server rewrite rules. Fonts are bundled locally; the deployed app does not require a font CDN or backend.

## Project structure

`src/content/` contains typed theory, flashcard and question data independently of the UI. `src/lib/engine.ts` implements grading, balanced question selection and deadline calculations. `src/lib/store.tsx` handles versioned local persistence. `src/pages/` contains study flows, and `src/components/ui/` contains locally owned shadcn-style Radix components.

## Persistence and scoring

Progress is stored under `endterm-prep-v1` in LocalStorage. It includes answers, bookmarks, card ratings, read topics, theme and a saved active session. It stays on the same browser/origin and does not sync to an account. Reset requires confirmation. Malformed or incompatible saved data falls back safely.

Choice questions require the complete correct set with no partial credit. Blank answers match allowed strings after case/whitespace normalization. Short answers are explicitly self-assessed against a reference answer. Accuracy includes all submitted attempts; coverage counts distinct attempted questions and is not a claim of mastery. Review uses the latest result to identify unresolved mistakes.

Timers use an absolute deadline, so refreshes and background tabs do not extend the allowed time. Expired sessions submit automatically on recovery. Ending a session scores unanswered items as incorrect. Submissions use stable IDs to avoid double-counting answers.

## Deployment

The GitHub Actions workflow tests and builds on pushes to `main`, uploads `dist`, and deploys to Pages. In repository Settings → Pages, select **GitHub Actions** as the build source. The Vite base path is `/endterm-prep/`.

For first-time setup after authenticating as `a100miles`:

```sh
gh repo create a100miles/endterm-prep --public --source=. --remote=origin
git push -u origin main
gh api --method POST repos/a100miles/endterm-prep/pages -f build_type=workflow
```

Existing Pages sites may require PATCH rather than POST. Do not commit tokens, source lecture files, local test state or node_modules.

## Verification

Automated tests validate provenance and counts, all answer formats, every question's rendering, balanced exams, exact-set scoring, normalized blanks, manual short-answer grading, timer expiry, single-count submission, confirmation and persistence. Desktop/mobile browser checks cover study navigation and interactive flows. See `docs/verification.md` for the final results.

This independent study tool is not an official AWS exam and does not predict which questions will appear on your university endterm.
