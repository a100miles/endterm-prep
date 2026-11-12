---
name: Endterm Prep
description: A focused, warm-paper study workspace.
colors:
  bg: "#f5f4ef"
  panel: "#fffefa"
  text: "#252b29"
  muted: "#646a66"
  line: "#dedfd7"
  accent: "#236454"
  tint: "#e7eee8"
  warn: "#72501c"
  warn-bg: "#f6eedc"
  error: "#aa3c35"
  success: "#236454"
  dark-bg: "#181e1b"
  dark-panel: "#222a25"
  dark-text: "#f0f1e9"
  dark-muted: "#b0bcb3"
  dark-line: "#3f4a42"
  dark-accent: "#a8d1b5"
  dark-tint: "#303f34"
  dark-warn: "#ebc586"
  dark-warn-bg: "#3a3325"
  dark-error: "#ffaaa1"
  sidebar: "#232e28"
  sidebar-text: "#f4f4ed"
  nav-text: "#c8d2cb"
  nav-hover: "#303e35"
  nav-active: "#415448"
  code-bg: "#1f2925"
  code-text: "#e1efe6"
typography:
  display:
    fontFamily: "Manrope Variable, sans-serif"
    fontSize: "clamp(30px,3.5vw,44px)"
    fontWeight: 650
    lineHeight: 1.25
    letterSpacing: "-.035em"
  headline:
    fontFamily: "Manrope Variable, sans-serif"
    fontSize: "24px"
    fontWeight: 650
    lineHeight: 1.25
    letterSpacing: "-.025em"
  title:
    fontFamily: "Manrope Variable, sans-serif"
    fontSize: "17px"
    fontWeight: 650
    lineHeight: 1.25
    letterSpacing: "-.015em"
  body:
    fontFamily: "Manrope Variable, sans-serif"
    fontSize: "15px"
    lineHeight: 1.65
  lesson:
    fontFamily: "Manrope Variable, sans-serif"
    fontSize: "14px"
    lineHeight: 1.9
  label:
    fontFamily: "Manrope Variable, sans-serif"
    fontSize: "13px"
    fontWeight: 600
  code:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "12px"
    lineHeight: 1.85
rounded:
  chip: "5px"
  nav: "7px"
  control: "8px"
  option: "9px"
  feedback: "10px"
  code: "12px"
  card: "13px"
  large-card: "14px"
spacing:
  action-gap: "12px"
  module-gap: "17px"
  form-gap: "22px"
  topic-padding: "30px"
  main-inline: "46px"
  mobile-inline: "20px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.panel}"
    rounded: "{rounded.control}"
    padding: "11px 17px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    padding: "11px 17px"
  button-outline-hover:
    backgroundColor: "{colors.tint}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    rounded: "{rounded.control}"
    padding: "11px 17px"
  button-ghost-hover:
    backgroundColor: "{colors.tint}"
    textColor: "{colors.text}"
  button-danger:
    backgroundColor: "transparent"
    textColor: "{colors.error}"
    rounded: "{rounded.control}"
    padding: "11px 17px"
  input:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    padding: "11px 12px"
  module-card:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.card}"
    padding: "22px"
  badge:
    backgroundColor: "{colors.tint}"
    textColor: "{colors.accent}"
    rounded: "{rounded.chip}"
    padding: "3px 9px"
---

# Design System: Endterm Prep

## Overview

**Creative North Star: "The Focused Study Workspace"**

Warm paper, dark typography and subtle green accents support sustained reading and recall. Rounded cards and familiar controls follow the user's minimal Linear/Notion/Quizlet direction. Content accuracy takes priority over decoration.

The implemented system is restrained and mostly flat. A dark navigation rail anchors the pale reading area; tonal panels distinguish examples, selected answers and progress. Dark mode preserves the same hierarchy with deep green surfaces and lighter foregrounds.

**Key Characteristics:**

- Warm neutral surfaces with muted green actions.
- Readable sans-serif text and technical monospace.
- Rounded, bordered cards with generous reading space.
- Visible keyboard focus and reduced-motion support.

This document records `src/styles.css` and the implemented components. No raster image assets ship with this visual system.

## Colors

### Primary

The deep green `accent` drives primary buttons, links, progress, selection and focus. Pale sage `tint` supplies related surface emphasis. `success` shares the accent value.

### Secondary

Amber `warn` on `warn-bg` marks source cautions and negative feedback. Red `error` identifies incorrect answer borders and destructive controls. Preserve text and icons alongside these states.

### Neutral

Warm `bg` surrounds near-white `panel` cards. Charcoal `text`, gray-green `muted` and soft `line` separate hierarchy without heavy contrast. The navigation rail has its own stable dark palette. Code blocks use a separate dark green background and pale text.

The `data-theme="dark"` root remaps the semantic colors to the corresponding `dark-` tokens; success uses `dark-accent`. The rail and code block palettes remain fixed.

## Typography

**Body and headings:** Manrope Variable, sans-serif. **Technical text:** JetBrains Mono, monospace, used in preformatted code and the timer. Inline code inherits its surrounding font in the current implementation.

The hierarchy is explicitly sized rather than a uniform modular ratio. Display, headline and title values are normative above. Card headings use (21px); lesson definitions use (17px/1.7, weight 550); lesson prose uses the lesson role and a maximum (72ch) line length. Small metadata ranges from (10–12px). Buttons use (13px/1.4, weight 600). Progress numerals use (27–44px), with tabular figures in the statistics strip. On phones the page heading is (32px), lesson prose (13px), and flashcard prompts (17px).

## Layout

Desktop uses a fixed (224px) rail, a (76px) top bar and a centered main area capped at (1380px), padded (44px 46px 68px). Module cards form three equal columns with the module gap. Lessons pair a (190px) sticky topic index with reading content capped at (800px); quizzes pair the question with a (190px) navigator. Forms use two columns; calculator fields use three.

- At max-width (1200px): the rail becomes (200px), main horizontal padding (28px), modules use two columns, and lesson/quiz side columns narrow.
- At max-width (850px): page headings and continue-study panels stack, lesson navigation becomes a wrapping row, quiz navigation moves above the question, and search results become one column.
- At max-width (640px): a sticky (65px) mobile header replaces the visible rail. The (240px) drawer slides in below it with a scrim; the closed drawer is hidden. Main padding is (27px 20px 45px), modules and forms become single-column, and flashcard controls wrap.
- At min-width (1600px): main top padding increases to (55px), continue-panel padding to (40px), and module padding to (27px).

Tables scroll horizontally with a (520px) minimum width; long prose and source paths wrap. Action groups wrap instead of clipping.

## Elevation & Depth

Cards are flat at rest and rely on tonal surfaces and thin borders. The confirmation dialog is the only shadowed surface, using `0 20px 70px #0003`, above a `#101b14aa` overlay. The mobile drawer scrim uses `#0e201888`. No decorative image layers are present.

## Shapes

Controls have softly rounded corners; cards use the larger card radii. Chips stay compact with the chip radius. Borders are generally (1px). Progress tracks are (5px) high with (10px) rounded clipping. Flashcards and dialogs share the large-card radius.

## Components

### Buttons

The React Button supports `default`, `outline`, `ghost` and `danger` variants, plus `default`, `sm` and `icon` sizes. Primary uses accent on panel text and darkens on hover with `brightness(.94)`. Outline uses a line border, changing to accent with a tinted fill on hover. Ghost starts muted and adopts tinted fill with normal text on hover. Danger uses red text and border; it has no separate hover color rule.

Default buttons have a (44px) minimum height, small buttons (35px) with (7px 10px) padding, and icon buttons a (44px) width. Background and border transitions last (.15s). Disabled controls use (.45) opacity and a not-allowed cursor.

### Cards and chips

Module cards use a panel fill, line border and card radius; their border changes to `#8ba899` on hover. Topic cards use (30px) padding. Configuration panels use (32px) padding and the large-card radius. Badges use tinted backgrounds, green text and (11px) semibold labels; term chips use outlined muted labels.

### Inputs and answer choices

Inputs, selects and textareas use panel fill, line borders, control radius and (44px) minimum height. Checkboxes and radios use the accent color and (17px) dimensions. Answer rows use the option radius and (17px 15px) padding; hover fills the row with the page background. Selected and correct choices have a green border and tint; incorrect choices have an error border.

### Navigation

Rail links use (13px) text and (11px 14px) padding. Hover uses the rail hover background and white text; the active link uses the active background and white text. The question navigator marks answered buttons with tint and the current question with a (2px) accent outline offset (2px).

### Flashcards and motion

The flashcard is a full-width button with (1600px) perspective, a grid of two backface-hidden faces, and a (180deg) Y rotation to reveal the tinted reverse. Faces have at least (390px) height and (32px 35px) desktop padding. Flip duration is (.45s), easing `cubic-bezier(.16,1,.3,1)`. Progress width transitions use (.3s ease-out); the mobile drawer uses (.2s).

### Focus and dialogs

All focus-visible elements receive a (3px) accent outline offset (4px). The skip link becomes visible on focus. Confirmation dialogs use Radix Dialog, a centered width of `min(480px, calc(100vw - 36px))`, (30px) padding and trailing actions.

Under `prefers-reduced-motion: reduce`, all animations and transitions are disabled and scroll behavior is automatic. The flashcard state still changes without its transition.

## Do's and Don'ts

### Do:

- Do reuse semantic theme variables for surfaces, text, borders and feedback.
- Do preserve visible keyboard focus and reduced-motion behavior.
- Do keep long explanations within the established reading width.
- Do pair answer-state colors with the implemented textual feedback.

### Don't:

- Don't apply dialog shadows to the flat card system.
- Don't hide source cautions through low-contrast decorative styling.
- Don't replace the established sans-serif and technical monospace pairing with decorative type.
