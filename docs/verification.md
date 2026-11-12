# Verification

Verified on 2026-11-12.

## Automated checks

- 175 tests: source counts and provenance; unique IDs and prompts; valid answer keys; all five formats; every question rendered; balanced mock exams; exact-set and normalized-blank scoring; explicit self-assessment; confirmation; deadline expiry; persistence and single-count submissions; flashcard accessible descriptions.
- TypeScript and Vite production build succeed.
- npm audit reports zero vulnerabilities after updating the test runner.
- The design detector returned no findings.

## Browser checks

- Desktop dashboard and flashcard layout visually inspected and captured.
- Flashcard flip, unknown rating, unknown-only filter and progression exercised.
- Practice filters, answer submission, correct feedback and bookmarking exercised.
- Reload preserves the submitted answer and feedback.
- Exam setup, switching questions, retained answer, submission cancellation, final confirmation, score and module breakdown exercised.
- Mobile viewport reported clientWidth = scrollWidth = 375; navigation opened and closed.
- Computer Use stopped after repeated screenshot timeouts because it could not confidently determine the active Windows browser URL. No further browser interaction was attempted. A final mobile screenshot and dark-mode visual review remain unverified. Responsive code and theme controls are implemented.
- The independent finish reviewer approved the desktop composition and confirmed fixes for mobile offscreen focus exposure and flashcard accessible descriptions. Its visual verdict is limited to the supplied desktop captures.

## Content checks

Six decks, 441 slides, 43 theory topics, 50 original flashcards, 108 additional questions, 158 total question records. No duplicate imported cards removed. All five Quizlet sets became accessible in Chrome; none remain inaccessible.

Original errors and historical differences are disclosed in the Sources screen, theory notes and question metadata. The ambiguous original resource-API question uses self-assessment. Short answers are excluded from automatic mock-exam scoring.

## Deployment verification

The GitHub Actions workflow runs tests and builds before deployment. Final live status is recorded in the delivery response after checking the workflow and HTTP asset availability. Hash routing supports nested-route refreshes without a server rewrite.
