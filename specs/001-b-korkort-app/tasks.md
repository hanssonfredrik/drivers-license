# Tasks: B-Körkortsappen — Teoriträning för Svenskt B-Körkort

**Input**: Design documents from `/specs/001-b-korkort-app/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Not explicitly requested — test tasks are omitted. Testing infrastructure is configured in Setup for future use.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4, US5)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/` at repository root (SPA, no backend)
- Static data in `src/data/`, types in `src/types/`, services in `src/services/`
- Components colocated: `src/components/<group>/<Name>/index.tsx`
- Pages: `src/pages/<Name>/index.tsx`

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Initialize Vite + React + TypeScript project with tooling

- [X] T001 Initialize Vite 5 + React 18 + TypeScript project with `strict: true` in tsconfig.json, create directory structure per plan.md
- [X] T002 [P] Configure Tailwind CSS 3 with design tokens (colors, spacing, breakpoints) in tailwind.config.ts and add directives to src/index.css
- [X] T003 [P] Configure ESLint for TypeScript + React with recommended rules in eslint.config.js
- [X] T004 [P] Configure path aliases (`@/` → `src/`) in tsconfig.json and vite.config.ts
- [X] T005 [P] Install and configure vite-plugin-pwa with Swedish manifest in vite.config.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core type definitions, storage layer, question loading, app shell, and shared UI primitives that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T006 [P] Define Question, CategoryId, QuizAnswer, and StudyAnswer interfaces in src/types/question.ts
- [X] T007 [P] Define QuizSession interface with status discriminated union (`in-progress | completed | timed-out`) in src/types/quiz.ts
- [X] T008 [P] Define UserProgress interface in src/types/progress.ts
- [X] T009 [P] Define GamificationState, Badge, BadgeCondition discriminated union, and GamificationEvent union type in src/types/gamification.ts
- [X] T010 [P] Define RoadSign and SignCategoryId types in src/types/sign.ts
- [X] T011 Implement StorageService with IndexedDB schema (studyAnswers, quizSessions, bookmarks, gamification stores) using idb in src/services/storage.ts
- [X] T012 [P] Create seed question data JSON files (~15 questions each) for all 5 categories in src/data/questions/trafikregler.json, trafiksakerhet.json, fordonskannedom.json, miljo.json, personliga.json
- [X] T013 Implement QuestionBankService with dynamic import() lazy loading and in-memory cache per category in src/services/questionBank.ts
- [X] T014 Create App entry point with React Router v7 lazy routes for all pages in src/app/App.tsx and src/app/routes.tsx
- [X] T015 Create Layout component with responsive navigation (bottom nav on mobile, sidebar on desktop) in src/app/Layout.tsx
- [X] T016 [P] Create reusable Button component with size/variant props in src/components/common/Button/index.tsx
- [X] T017 [P] Create reusable Card component in src/components/common/Card/index.tsx
- [X] T018 [P] Create reusable ProgressBar component in src/components/common/ProgressBar/index.tsx

**Checkpoint**: Foundation ready — all types defined, storage operational, question bank loadable, app shell navigable. User story implementation can begin.

---

## Phase 3: User Story 1 — Plugga teori per ämnesområde (Priority: P1) 🎯 MVP

**Goal**: User can select one of 5 Trafikverket categories and study questions with immediate right/wrong feedback and explanations

**Independent Test**: Open app → tap "Instudering" → choose "Trafikregler" → answer a question → see green/red feedback + explanation → tap "Nästa" → repeat → see summary after last question

### Implementation for User Story 1

- [X] T019 [P] [US1] Create QuestionCard component displaying question text and optional image in src/components/question/QuestionCard/index.tsx
- [X] T020 [P] [US1] Create AnswerOption component with correct (green) / incorrect (red) visual states in src/components/question/AnswerOption/index.tsx
- [X] T021 [P] [US1] Create Explanation component showing post-answer explanation text in src/components/question/Explanation/index.tsx
- [X] T022 [P] [US1] Create QuestionImage component with lazy loading for image-based questions in src/components/question/QuestionImage/index.tsx
- [X] T023 [US1] Implement ProgressTrackerService with recordStudyAnswer and getTodayAnswerCount methods in src/services/progressTracker.ts
- [X] T024 [US1] Implement useStudySession hook (load questions, answer, next, reset, summary state) in src/hooks/useStudySession.ts
- [X] T025 [US1] Create HomePage with navigation cards to Instudering, Quiz, Statistik, Vägmärken, Bokmärken in src/pages/HomePage/index.tsx
- [X] T026 [US1] Create StudyPage with category selector, question flow, progress indicator, and end summary in src/pages/StudyPage/index.tsx

**Checkpoint**: User Story 1 fully functional. User can study any category with immediate feedback. This is the MVP — stop and validate.

---

## Phase 4: User Story 2 — Provliknande quiz med tidsgräns (Priority: P2)

**Goal**: User can take a simulated knowledge test: 65 weighted questions, 50-minute countdown, no in-quiz feedback, result page with pass/fail and full question-by-question review

**Independent Test**: Start quiz → answer questions (no feedback shown) → submit or wait for timeout → see score with pass/fail (≥52 = pass) + category breakdown → tap "Granska svar" → review each question with explanations

### Implementation for User Story 2

- [X] T027 [P] [US2] Create Timer component with mm:ss countdown display and timeout callback in src/components/common/Timer/index.tsx
- [X] T028 [P] [US2] Create QuizProgress component showing current question number, total, and navigation dots in src/components/quiz/QuizProgress/index.tsx
- [X] T029 [US2] Implement QuizEngineService with generateQuiz (weighted distribution: TR 30%, TS 25%, FK 20%, M 15%, P 10%), recordAnswer, submitQuiz, getInProgressQuiz, and getCompletedQuiz in src/services/quizEngine.ts
- [X] T030 [US2] Implement useQuizSession hook (session lifecycle, timer sync, answer, submit, auto-submit on timeout) in src/hooks/useQuizSession.ts
- [X] T031 [US2] Create QuizPage with timer, question display (no feedback), question navigation, confirm-quit dialog in src/pages/QuizPage/index.tsx
- [X] T032 [P] [US2] Create QuizResult component showing total score, pass/fail badge, and per-category score breakdown in src/components/quiz/QuizResult/index.tsx
- [X] T033 [P] [US2] Create QuizReview component for scrollable question-by-question review with user answer, correct answer, and explanation in src/components/quiz/QuizReview/index.tsx
- [X] T034 [US2] Create QuizResultPage integrating QuizResult summary and QuizReview drill-down in src/pages/QuizResultPage/index.tsx

**Checkpoint**: User Stories 1 AND 2 functional. User can both study and take simulated exams.

---

## Phase 5: User Story 3 — Framsteg, statistik & gamification (Priority: P3)

**Goal**: User can view study progress per category (charts), quiz history over time, daily streak, XP level, and earned badges. Gamification events (XP, level-up, badge, streak milestone) trigger celebration animations.

**Independent Test**: Study some questions / complete a quiz → open Stats page → verify category accuracy chart, quiz history timeline, streak counter, XP bar, and badge grid display correctly. Earn enough XP to level up → verify confetti animation fires.

### Implementation for User Story 3

- [X] T035 [P] [US3] Create badge definition data with ~12 badges in src/data/gamification/badges.json
- [X] T036 [US3] Implement GamificationEngineService (getState, recordCorrectAnswer +10/+5 XP, recordQuizPassed +50 XP, updateStreak, badge unlock checks, level calculation) in src/services/gamificationEngine.ts
- [X] T037 [US3] Extend ProgressTrackerService with getProgress (category accuracy aggregation) and getQuizHistory methods in src/services/progressTracker.ts
- [X] T038 [US3] Implement useProgress hook (load aggregated progress, quiz history, loading/error/empty states) in src/hooks/useProgress.ts
- [X] T039 [US3] Implement useGamification hook (state, badges, pending events queue, dismiss) in src/hooks/useGamification.ts
- [X] T040 [US3] Implement useCelebration hook with canvas-confetti presets (quiz-passed, badge-earned, level-up, streak-milestone) in src/hooks/useCelebration.ts
- [X] T041 [P] [US3] Create CategoryChart component using Recharts ResponsiveContainer + BarChart for per-category accuracy in src/components/stats/CategoryChart/index.tsx
- [X] T042 [P] [US3] Create QuizHistory component using Recharts LineChart for score-over-time timeline in src/components/stats/QuizHistory/index.tsx
- [X] T043 [P] [US3] Create StreakDisplay component showing current and longest streak with fire icon in src/components/stats/StreakDisplay/index.tsx
- [X] T044 [P] [US3] Create XpLevelBar component showing current XP, level, and progress to next level in src/components/stats/XpLevelBar/index.tsx
- [X] T045 [P] [US3] Create BadgeGrid component showing earned (highlighted) and locked (greyed) badges in src/components/stats/BadgeGrid/index.tsx
- [X] T046 [US3] Create StatsPage composing CategoryChart, QuizHistory, StreakDisplay, XpLevelBar, and BadgeGrid with loading/empty states in src/pages/StatsPage/index.tsx
- [X] T047 [US3] Wire gamification into study and quiz flows: call recordCorrectAnswer in useStudySession, recordQuizPassed in useQuizSession, updateStreak on app init, fire celebration animations on events

**Checkpoint**: User Stories 1, 2, AND 3 functional. Full study → quiz → stats → gamification loop works end-to-end.

---

## Phase 6: User Story 4 — Vägmärken och skyltar-referens (Priority: P4)

**Goal**: User can browse all Swedish road signs organized by 8 categories, view each sign with image and detailed description

**Independent Test**: Open "Vägmärken" → see 8 sign categories → tap "Varningsmärken" → see list of warning signs with SVG images → tap a sign → see detailed description and related traffic rules

### Implementation for User Story 4

- [X] T048 [P] [US4] Create signs.json metadata with sample sign definitions (id, name, category, descriptions) in src/data/signs/signs.json
- [X] T049 [P] [US4] Add sample SVG files for road signs (~10-20 representative signs) in src/data/signs/svg/
- [X] T050 [US4] Implement SignCatalogService (getCategories, getByCategory, getById, getSignImageUrl) in src/services/signCatalog.ts
- [X] T051 [P] [US4] Create SignCard component with lazy-loaded SVG image and sign name in src/components/signs/SignCard/index.tsx
- [X] T052 [P] [US4] Create SignDetail component with full description, context, and related rule in src/components/signs/SignDetail/index.tsx
- [X] T053 [P] [US4] Create SignCategoryList component showing 8 sign categories with counts in src/components/signs/SignCategoryList/index.tsx
- [X] T054 [US4] Create SignsPage with category browsing (list → grid → detail) using route params in src/pages/SignsPage/index.tsx

**Checkpoint**: User Stories 1–4 functional. App is a complete study tool with questions, quizzes, stats, and sign reference.

---

## Phase 7: User Story 5 — Bokmärk svåra frågor (Priority: P5)

**Goal**: User can bookmark difficult questions during study and revisit them in a dedicated bookmarks section

**Independent Test**: Study a category → tap bookmark icon on a question → open "Bokmärken" → see bookmarked questions → study them → remove a bookmark → verify it disappears from list

### Implementation for User Story 5

- [X] T055 [US5] Implement useBookmarks hook (toggle, list, isBookmarked with optimistic UI) in src/hooks/useBookmarks.ts
- [X] T056 [US5] Add bookmark toggle icon button to QuestionCard component with visual bookmarked state in src/components/question/QuestionCard/index.tsx
- [X] T057 [US5] Create BookmarksPage with bookmarked question list and study flow (reuses question components) in src/pages/BookmarksPage/index.tsx

**Checkpoint**: All 5 user stories functional. Feature-complete.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final quality pass — error pages, PWA assets, accessibility, responsive polish, performance

- [X] T058 [P] Create NotFoundPage for unmatched routes in src/pages/NotFoundPage/index.tsx
- [X] T059 [P] Add PWA icons (192px, 512px) and configure manifest.json with Swedish metadata in public/manifest.json and public/icons/
- [X] T060 Verify responsive design across all pages at mobile (375px), tablet (768px), and desktop (1024px+) breakpoints
- [X] T061 Add keyboard navigation support and verify WCAG AA color contrast on all interactive elements
- [X] T062 Performance audit: verify lazy route loading, JSON code-splitting, and total JS bundle < 500 KB gzipped
- [X] T063 Run quickstart.md validation: npm install, npm run dev, npm run build, npm run lint all succeed

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — **BLOCKS all user stories**
- **US1 (Phase 3)**: Depends on Foundational — no other story dependencies
- **US2 (Phase 4)**: Depends on Foundational — independent of US1 (shares QuestionBank)
- **US3 (Phase 5)**: Depends on Foundational + US1 + US2 (needs study/quiz data to display stats, wires gamification into both hooks)
- **US4 (Phase 6)**: Depends on Foundational only — fully independent of US1–US3
- **US5 (Phase 7)**: Depends on Foundational + US1 (reuses QuestionCard component with added bookmark button)
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Independence

```
                    ┌─── US1 (P1) ───────┐
                    │                     │
Phase 2 ───────────┼─── US2 (P2) ───┐    ├──→ US3 (P3) ──→ Phase 8
(Foundational)      │                │    │
                    ├─── US4 (P4) ───┼────┘
                    │                │
                    └─── US5 (P5) *  ┘
                         (* needs US1 QuestionCard)
```

- **US1, US2, US4** can all start in parallel after Phase 2
- **US5** can start after US1's QuestionCard is built (T019)
- **US3** should start after US1 + US2 are complete (needs data flow to wire gamification)

### Within Each User Story

1. Components marked [P] can be built in parallel
2. Services before hooks (hooks depend on services)
3. Hooks before pages (pages consume hooks)
4. Core implementation → integration → page assembly

### Parallel Opportunities

**Phase 1**: T002, T003, T004, T005 all in parallel (after T001)
**Phase 2**: T006–T010 (all types) in parallel → then T011 + T012 in parallel → then T013, T014, T015 → T016, T017, T018 in parallel
**Phase 3 (US1)**: T019, T020, T021, T022 in parallel → T023 → T024 → T025, T026
**Phase 4 (US2)**: T027, T028 in parallel → T029 → T030 → T031, T032, T033 in parallel → T034
**Phase 5 (US3)**: T035 (data) in parallel with nothing blocking → T036, T037 → T038, T039, T040 → T041–T045 in parallel → T046 → T047
**Phase 6 (US4)**: T048, T049 in parallel → T050 → T051, T052, T053 in parallel → T054
**Phase 7 (US5)**: T055 → T056 → T057
**Phase 8**: T058, T059 in parallel → T060, T061, T062 → T063

---

## Parallel Example: Phase 2 (Foundational)

```
Batch 1 (all types — different files):
  T006: Define Question types in src/types/question.ts
  T007: Define QuizSession types in src/types/quiz.ts
  T008: Define UserProgress types in src/types/progress.ts
  T009: Define Gamification types in src/types/gamification.ts
  T010: Define RoadSign types in src/types/sign.ts

Batch 2 (storage + seed data — different concerns):
  T011: Implement StorageService in src/services/storage.ts
  T012: Create seed question JSON files in src/data/questions/

Batch 3 (depends on types + storage):
  T013: Implement QuestionBankService in src/services/questionBank.ts
  T014: Create App shell in src/app/App.tsx + routes.tsx
  T015: Create Layout in src/app/Layout.tsx

Batch 4 (shared components — different files):
  T016: Button in src/components/common/Button/index.tsx
  T017: Card in src/components/common/Card/index.tsx
  T018: ProgressBar in src/components/common/ProgressBar/index.tsx
```

## Parallel Example: User Story 1 (Phase 3)

```
Batch 1 (all question display components — different files):
  T019: QuestionCard in src/components/question/QuestionCard/index.tsx
  T020: AnswerOption in src/components/question/AnswerOption/index.tsx
  T021: Explanation in src/components/question/Explanation/index.tsx
  T022: QuestionImage in src/components/question/QuestionImage/index.tsx

Batch 2 (service + hook — sequential dependency):
  T023: ProgressTrackerService in src/services/progressTracker.ts
  T024: useStudySession hook in src/hooks/useStudySession.ts

Batch 3 (pages — depend on components + hooks):
  T025: HomePage in src/pages/HomePage/index.tsx
  T026: StudyPage in src/pages/StudyPage/index.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1 — Study by category
4. **STOP and VALIDATE**: User can select a category and study with feedback
5. Deploy/demo the MVP

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. **US1** → Study mode works → Deploy (MVP!)
3. **US2** → Quiz simulation works → Deploy
4. **US3** → Stats + gamification → Deploy (engagement loop complete)
5. **US4** → Road signs reference → Deploy (complete study tool)
6. **US5** → Bookmarks → Deploy (personalized learning)
7. Polish → PWA, accessibility, performance → Final release

### Suggested Sprint Mapping

| Sprint | Phases | Deliverable |
|--------|--------|-------------|
| Sprint 1 | Phase 1 + Phase 2 | Foundation (not user-facing) |
| Sprint 2 | Phase 3 (US1) | MVP: Study by category |
| Sprint 3 | Phase 4 (US2) | Quiz simulation |
| Sprint 4 | Phase 5 (US3) | Stats + gamification |
| Sprint 5 | Phase 6 + 7 (US4 + US5) | Signs + bookmarks |
| Sprint 6 | Phase 8 | Polish, PWA, accessibility |

---

## Notes

- Seed question data (T012, T048, T049) contains sample questions/signs for development. Full content (1000+ questions, ~300 signs) is content authoring work tracked separately.
- Badge definitions (T035) include ~12 initial badges; more can be added as content.
- The gamification wiring task (T047) touches existing hooks from US1/US2 — schedule after those stories are stable.
- All pages use `React.lazy()` for route-level code-splitting per research.md decision #7.
- Statistics charts (T041, T042) use Recharts — lazy-loaded with the StatsPage chunk.
- Road sign SVGs are referenced by URL, not inlined as React components, per research.md decision #6.
