import { it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { StudyProvider } from "../lib/store";
import Flashcards from "./Flashcards";
afterEach(cleanup);
it("associates both flashcard faces with the button for screen readers", () => {
  localStorage.clear();
  render(
    <MemoryRouter>
      <StudyProvider>
        <Flashcards />
      </StudyProvider>
    </MemoryRouter>,
  );
  const front = screen.getByRole("button", {
    name: "Flip card to reveal answer",
  });
  expect(front).toHaveAccessibleDescription(
    /The systems development lifecycle/,
  );
  fireEvent.click(front);
  expect(
    screen.getByRole("button", { name: "Show question" }),
  ).toHaveAccessibleDescription(/Develop, deploy, and maintain/);
});
