# Data Model: B-Körkortsappen

**Date**: 2026-03-17 | **Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

---

## Entity Overview

```
Question ──┐
           ├── belongs to ──→ Category (1:N)
           ├── has optional ──→ QuestionImage (1:0..1)
           └── referenced by ──→ Bookmark (N:M via user)

Category ──→ groups Questions

QuizSession ──→ contains QuizAnswers ──→ references Questions

UserProgress ──→ aggregates from QuizSessions + StudySessions

Streak ──→ derived from UserProgress daily activity

Badge ──→ unlocked by GamificationEngine rules

XpLevel ──→ derived from accumulated XP
  
RoadSign ──→ belongs to SignCategory
```

---

## Entities

### Question

Represents a single theory question from the question bank.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier (e.g., `"tr-001"`, `"ts-042"`) |
| `category` | `CategoryId` | One of the five Trafikverket categories |
| `text` | `string` | Question text in Swedish |
| `options` | `[string, string, string, string]` | Exactly 4 answer options (tuple) |
| `correctIndex` | `0 \| 1 \| 2 \| 3` | Index of the correct answer |
| `explanation` | `string` | Explanation shown after answering (study mode) |
| `imageId` | `string \| null` | Reference to an image asset, null if text-only |

**Validation rules**:
- `options` must have exactly 4 items, all non-empty strings
- `correctIndex` must be 0, 1, 2, or 3
- `explanation` must be non-empty
- `category` must be a valid `CategoryId`

---

### CategoryId (enum)

Discriminated union representing Trafikverket's five official knowledge areas.

| Value | Swedish Name | Quiz Weight |
|-------|-------------|-------------|
| `"trafikregler"` | Trafikregler | 30 % (~20 frågor) |
| `"trafiksakerhet"` | Trafiksäkerhet | 25 % (~16 frågor) |
| `"fordonskannedom"` | Fordonskännedom och manövrering | 20 % (~13 frågor) |
| `"miljo"` | Miljö | 15 % (~10 frågor) |
| `"personliga"` | Personliga förutsättningar | 10 % (~6 frågor) |

---

### QuizSession

Represents a single quiz attempt. Persisted in IndexedDB.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique ID (UUID or timestamp-based) |
| `startedAt` | `string` (ISO 8601) | When the quiz was started |
| `completedAt` | `string \| null` (ISO 8601) | When completed, null if in-progress |
| `status` | `"in-progress" \| "completed" \| "timed-out"` | Quiz lifecycle state |
| `answers` | `QuizAnswer[]` | One per question, ordered by presentation |
| `totalQuestions` | `65` | Always 65 |
| `score` | `number \| null` | Total correct, null if in-progress |
| `passed` | `boolean \| null` | `score >= 52`, null if in-progress |
| `categoryScores` | `Record<CategoryId, { correct: number; total: number }> \| null` | Breakdown per category |
| `timeRemainingMs` | `number` | Milliseconds left when ended/paused |

**Validation rules**:
- `answers.length` must equal `totalQuestions` when `status` is `"completed"` or `"timed-out"`
- `score` is computed from `answers`, not stored independently (denormalized for display)
- Only one session may have `status: "in-progress"` at a time

**State transitions**:
```
(new) → in-progress → completed (all answered or user submits)
                    → timed-out (timer reaches 0)
```

---

### QuizAnswer

A single answer within a quiz session.

| Field | Type | Description |
|-------|------|-------------|
| `questionId` | `string` | Reference to `Question.id` |
| `selectedIndex` | `0 \| 1 \| 2 \| 3 \| null` | User's chosen option, null if skipped |
| `isCorrect` | `boolean \| null` | Computed after quiz ends |

---

### StudyAnswer

Records a single answer during study mode. Stored in IndexedDB for progress tracking.

| Field | Type | Description |
|-------|------|-------------|
| `questionId` | `string` | Reference to `Question.id` |
| `category` | `CategoryId` | Denormalized for fast aggregation |
| `selectedIndex` | `0 \| 1 \| 2 \| 3` | User's chosen option |
| `isCorrect` | `boolean` | Whether the answer was correct |
| `answeredAt` | `string` (ISO 8601) | Timestamp |

---

### Bookmark

A saved question for targeted revision. Stored in IndexedDB.

| Field | Type | Description |
|-------|------|-------------|
| `questionId` | `string` | Reference to `Question.id` |
| `createdAt` | `string` (ISO 8601) | When bookmarked |

---

### UserProgress (computed view, not stored directly)

Aggregated from `StudyAnswer[]` and `QuizSession[]`. Computed on read, not persisted.

| Field | Type | Description |
|-------|------|-------------|
| `totalAnswered` | `number` | Total study answers given |
| `categoryAccuracy` | `Record<CategoryId, { correct: number; total: number }>` | Per-category accuracy |
| `quizHistory` | `{ date: string; score: number; passed: boolean }[]` | Chronological quiz results |
| `currentStreak` | `number` | Consecutive days with ≥1 answer |
| `longestStreak` | `number` | All-time best streak |
| `lastActiveDate` | `string` (ISO 8601 date) | Last date with activity |

---

### Gamification State

Persisted in IndexedDB as a single record.

| Field | Type | Description |
|-------|------|-------------|
| `totalXp` | `number` | Accumulated experience points |
| `level` | `number` | Current level (derived from `totalXp`) |
| `earnedBadgeIds` | `string[]` | List of unlocked badge IDs |
| `streakDays` | `number` | Current consecutive days |
| `longestStreakDays` | `number` | All-time record |
| `lastActivityDate` | `string` (ISO 8601 date) | For streak calculation |

**XP rules**:
- +10 XP per correct study answer
- +5 XP per correct quiz answer
- +50 XP bonus for passing a quiz
- +25 XP bonus for streak milestones (7, 14, 30 days)

**Level formula**: `level = floor(sqrt(totalXp / 100))` — yields level 1 at 100 XP, level 10 at 10 000 XP.

---

### Badge

Static definition of a milestone badge. Stored in `data/gamification/badges.json`.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique badge ID (e.g., `"first-quiz"`) |
| `name` | `string` | Display name in Swedish (e.g., `"Första quizet"`) |
| `description` | `string` | How to earn it |
| `icon` | `string` | SVG icon filename or emoji |
| `condition` | `BadgeCondition` | Trigger rule (see below) |

**BadgeCondition** (discriminated union):

| Type | Fields | Example |
|------|--------|---------|
| `"total-answers"` | `{ count: number }` | 100 total answers |
| `"quiz-passed"` | `{ count: number }` | 1st, 5th, 10th passed quiz |
| `"streak"` | `{ days: number }` | 7-day, 14-day, 30-day streak |
| `"category-mastery"` | `{ category: CategoryId; accuracy: number; minAnswers: number }` | 80% accuracy in Trafikregler with ≥50 answers |
| `"level-reached"` | `{ level: number }` | Reached level 5, 10, etc. |

---

### RoadSign

Static sign definition for the reference section. Stored in `data/signs/signs.json`.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique ID matching SVG filename (e.g., `"A1"`) |
| `name` | `string` | Official name in Swedish |
| `signCategory` | `SignCategoryId` | Category of road sign |
| `description` | `string` | Short description |
| `detailedDescription` | `string` | Full explanation with context |
| `relatedRule` | `string \| null` | Applicable traffic rule reference |

---

### SignCategoryId (enum)

| Value | Swedish Name |
|-------|-------------|
| `"varning"` | Varningsmärken |
| `"forbud"` | Förbudsmärken |
| `"pabud"` | Påbudsmärken |
| `"information"` | Informationsmärken |
| `"tillaggstavla"` | Tilläggstavlor |
| `"vagmarkering"` | Vägmarkeringar |
| `"lokaliseringsmarke"` | Lokaliseringsmärken |
| `"anvisning"` | Anvisningsmärken |

---

## IndexedDB Schema

Database name: `korkort-app`

| Store | Key | Indexes | Description |
|-------|-----|---------|-------------|
| `studyAnswers` | `auto` (incrementing) | `questionId`, `category`, `answeredAt` | Study mode answers |
| `quizSessions` | `id` | `status`, `startedAt` | Quiz attempts |
| `bookmarks` | `questionId` | `createdAt` | Bookmarked questions |
| `gamification` | `"singleton"` (literal key) | — | Single gamification state record |

**Version**: 1 (initial schema)

---

## Data Flow Diagrams

### Study Mode
```
User selects category
  → questionBank.getByCategory(categoryId) → loads JSON
  → Renders QuestionCard
  → User answers → StudyAnswer saved to IndexedDB
  → gamificationEngine.recordAnswer(isCorrect)
  → XP updated, badge check, streak check
  → Next question
```

### Quiz Mode
```
User starts quiz
  → quizEngine.generateQuiz() → loads all 5 JSONs
  → Selects 65 weighted questions → QuizSession(status: "in-progress") saved
  → Timer starts (50 min)
  → User answers questions (no feedback)
  → On submit or timeout:
    → quizEngine.score(session) → marks answers, computes scores
    → QuizSession(status: "completed"|"timed-out") updated
    → gamificationEngine.recordQuiz(session)
    → Render QuizResult → option to review all answers
```
