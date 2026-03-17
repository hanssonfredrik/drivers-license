# Implementation Plan: B-Körkortsappen — Teoriträning för Svenskt B-Körkort

**Branch**: `001-b-korkort-app` | **Date**: 2026-03-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-b-korkort-app/spec.md`

## Summary

En responsiv webbapplikation (mobile-first, fungerar även på desktop) för teoriträning inför svenskt B-körkort. Appen innehåller 1 000+ flervalsfrågor fördelade på Trafikverkets fem ämnesområden, med instuderingsläge (direkt feedback), provliknande quiz (65 frågor / 50 min), vägmärkes-referens, framstegsstatistik och gamification (streaks, badges, XP/nivåer). All data lagras lokalt — ingen backend. Byggs med React 18 + Vite + TypeScript (strict) + Tailwind CSS. Offline-kapabel via Service Worker.

## Technical Context

**Language/Version**: TypeScript 5.x, `strict: true`
**Primary Dependencies**: React 18+, React Router 6, Tailwind CSS 3, Vite 5, vite-plugin-pwa (Workbox), clsx, Vitest, Testing Library
**Storage**: IndexedDB (via idb wrapper) för framsteg/statistik/quiz-sessions; statiska JSON-filer för frågebank och vägmärken bundlas i build
**Testing**: Vitest + React Testing Library + Playwright (E2E)
**Target Platform**: Moderna webbläsare (Chrome, Safari, Firefox, Edge), mobile-first responsive — fungerar på mobil, surfplatta och desktop
**Project Type**: Single-page web application (SPA)
**Performance Goals**: Första interaktiva fråga synlig < 3 s på genomsnittlig mobil (SC-003), total bundle < 500 KB gzipped (exkl. bilder)
**Constraints**: Offline-kapabel efter första besök (FR-013), all frågedata bundlad lokalt, ingen backend/API, WCAG AA färgkontrast
**Scale/Scope**: 1 000+ frågor, ~200 bildfrågor (SVG), ~300 vägmärken, ~10 vyer, enbart klient-side

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. TypeScript Strictness | ✅ PASS | `strict: true` i tsconfig. Alla interfaces namnges `<Component>Props`. Frågedata typas med discriminated unions. |
| II. Component Architecture | ✅ PASS | Enbart funktionella komponenter med `function`. Logik i hooks (`useQuiz`, `useStudy`, `useProgress`). En komponent per fil. |
| III. Utility-First Styling | ✅ PASS | Tailwind CSS med design tokens i `tailwind.config.ts`. Mobile-first breakpoints (`sm:`, `md:`, `lg:`). `clsx()` för villkorliga klasser. |
| IV. Separation of Concerns | ✅ PASS | Domänlogik i `services/` och `hooks/`. Frågedata i statiska JSON-filer. Komponenter konsumerar resultat. |
| V. Explicit State Handling | ✅ PASS | Alla datadrivna vyer hanterar loading, error och empty states explicit. Quiz-timer, offline-status. |

**Gate result: PASS** — Inga violations. Planeringen kan fortsätta.

### Post-Design Re-evaluation (after Phase 1)

| Principle | Status | Notes |
|-----------|--------|-------|
| I. TypeScript Strictness | ✅ PASS | Data model uses discriminated unions (`CategoryId`, `QuizSession.status`, `Badge`, `GamificationEvent`). All interfaces named per convention. `unknown` at storage boundaries. |
| II. Component Architecture | ✅ PASS | One component per file, logic in hooks/services. No class components. No premature memoization in contracts. |
| III. Utility-First Styling | ✅ PASS | No custom CSS in design. Tailwind tokens for spacing/colors. Mobile-first breakpoints confirmed in responsive strategy. |
| IV. Separation of Concerns | ✅ PASS | 6 service modules with clean interfaces. Hooks bridge services → components. Data in static JSON. IndexedDB abstracted behind `StorageService`. |
| V. Explicit State Handling | ✅ PASS | Quiz state machine (in-progress → completed/timed-out). `GamificationEvent` union for UI reactions. All hooks will expose loading/error states. |

**Post-design gate: PASS** — Design artifacts are fully consistent with constitution.

## Project Structure

### Documentation (this feature)

```text
specs/001-b-korkort-app/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (internal interfaces)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── App.tsx                    # Root component, router setup
│   ├── routes.tsx                 # Route definitions with lazy loading
│   └── Layout.tsx                 # Shell layout: nav, content area
├── components/
│   ├── common/                    # Shared UI primitives
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── ProgressBar/
│   │   ├── Timer/
│   │   └── Badge/
│   ├── question/                  # Question display components
│   │   ├── QuestionCard/
│   │   ├── AnswerOption/
│   │   ├── Explanation/
│   │   └── QuestionImage/
│   ├── quiz/                      # Quiz-specific components
│   │   ├── QuizProgress/
│   │   ├── QuizResult/
│   │   └── QuizReview/
│   ├── stats/                     # Statistics & gamification
│   │   ├── CategoryChart/
│   │   ├── QuizHistory/
│   │   ├── StreakDisplay/
│   │   ├── XpLevelBar/
│   │   └── BadgeGrid/
│   └── signs/                     # Road sign reference
│       ├── SignCard/
│       ├── SignDetail/
│       └── SignCategoryList/
├── pages/
│   ├── HomePage/
│   ├── StudyPage/
│   ├── QuizPage/
│   ├── QuizResultPage/
│   ├── StatsPage/
│   ├── SignsPage/
│   ├── BookmarksPage/
│   └── NotFoundPage/
├── hooks/
│   ├── useStudySession.ts
│   ├── useQuizSession.ts
│   ├── useProgress.ts
│   ├── useBookmarks.ts
│   ├── useGamification.ts
│   └── usePersistedState.ts
├── services/
│   ├── questionBank.ts            # Load & filter questions from static data
│   ├── quizEngine.ts              # Quiz generation, scoring, distribution logic
│   ├── progressTracker.ts         # Stats aggregation, streak calculation
│   ├── gamificationEngine.ts      # XP, levels, badge unlock logic
│   ├── storage.ts                 # IndexedDB wrapper (idb)
│   └── signCatalog.ts             # Road sign data access
├── data/
│   ├── questions/
│   │   ├── trafikregler.json
│   │   ├── trafiksakerhet.json
│   │   ├── fordonskannedom.json
│   │   ├── miljo.json
│   │   └── personliga.json
│   ├── signs/
│   │   ├── signs.json
│   │   └── svg/                   # SVG files for road signs
│   └── gamification/
│       └── badges.json
├── types/
│   ├── question.ts
│   ├── quiz.ts
│   ├── progress.ts
│   ├── sign.ts
│   └── gamification.ts
├── assets/
│   └── images/                    # Question images (traffic situations)
├── index.css                      # Tailwind directives
└── main.tsx                       # Vite entry point

tests/
├── unit/
│   ├── services/
│   └── hooks/
├── integration/
│   └── pages/
└── e2e/
    ├── study.spec.ts
    ├── quiz.spec.ts
    └── navigation.spec.ts

public/
├── manifest.json                  # PWA manifest
└── icons/                         # App icons for PWA
```

**Structure Decision**: Single project (SPA) — no backend required. All data is static JSON bundled at build time. IndexedDB for user-generated data (progress, bookmarks, quiz sessions). PWA via vite-plugin-pwa for offline support.

## Complexity Tracking

> No constitution violations — this section is empty.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| *(none)*  |            |                                     |
