# Internal Service Contracts: B-Körkortsappen

**Date**: 2026-03-17

> This project has no external API — it is a pure client-side SPA. These contracts
> define the **internal service interfaces** between the service layer and the
> React hook/component layer.

---

## 1. QuestionBank Service

**File**: `src/services/questionBank.ts`

```typescript
interface QuestionBankService {
  /** Load all questions for a single category (lazy, cached) */
  getByCategory(categoryId: CategoryId): Promise<Question[]>;

  /** Load all questions across all categories */
  getAll(): Promise<Question[]>;

  /** Get a single question by ID */
  getById(questionId: string): Promise<Question | undefined>;

  /** Get questions by an array of IDs (for bookmarks) */
  getByIds(questionIds: string[]): Promise<Question[]>;
}
```

**Behavior**:
- First call per category triggers `import()` of the JSON file
- Subsequent calls return from in-memory cache
- Questions are shuffled on load (Fisher-Yates)

---

## 2. QuizEngine Service

**File**: `src/services/quizEngine.ts`

```typescript
interface QuizEngineService {
  /** Generate a new quiz with weighted distribution */
  generateQuiz(): Promise<QuizSession>;

  /** Record an answer for the in-progress quiz */
  recordAnswer(sessionId: string, questionId: string, selectedIndex: number): Promise<void>;

  /** Submit the quiz (or auto-submit on timeout) */
  submitQuiz(sessionId: string): Promise<QuizSession>;

  /** Get the current in-progress quiz (if any) */
  getInProgressQuiz(): Promise<QuizSession | null>;

  /** Get a completed quiz by ID (for review) */
  getCompletedQuiz(sessionId: string): Promise<QuizSession | null>;
}
```

**Distribution logic**:
| Category | Weight | Questions |
|----------|--------|-----------|
| trafikregler | 30% | 20 |
| trafiksakerhet | 25% | 16 |
| fordonskannedom | 20% | 13 |
| miljo | 15% | 10 |
| personliga | 10% | 6 |
| **Total** | **100%** | **65** |

---

## 3. ProgressTracker Service

**File**: `src/services/progressTracker.ts`

```typescript
interface ProgressTrackerService {
  /** Record a study-mode answer */
  recordStudyAnswer(answer: Omit<StudyAnswer, 'answeredAt'>): Promise<void>;

  /** Get aggregated progress data */
  getProgress(): Promise<UserProgress>;

  /** Get all quiz history (most recent first) */
  getQuizHistory(): Promise<QuizSession[]>;

  /** Get today's activity count */
  getTodayAnswerCount(): Promise<number>;
}
```

---

## 4. GamificationEngine Service

**File**: `src/services/gamificationEngine.ts`

```typescript
interface GamificationEngineService {
  /** Get current gamification state */
  getState(): Promise<GamificationState>;

  /** Award XP and check for level-up / badges */
  recordCorrectAnswer(source: 'study' | 'quiz'): Promise<GamificationEvent[]>;

  /** Record a passed quiz for bonus XP and badge checks */
  recordQuizPassed(): Promise<GamificationEvent[]>;

  /** Update streak (called on each app open / answer) */
  updateStreak(): Promise<GamificationEvent[]>;

  /** Get all badge definitions */
  getAllBadges(): Promise<Badge[]>;
}

/** Events returned for UI to display celebrations */
type GamificationEvent =
  | { type: 'xp-earned'; amount: number; newTotal: number }
  | { type: 'level-up'; newLevel: number }
  | { type: 'badge-earned'; badge: Badge }
  | { type: 'streak-milestone'; days: number };
```

---

## 5. Storage Service

**File**: `src/services/storage.ts`

```typescript
interface StorageService {
  /** Study answers */
  addStudyAnswer(answer: StudyAnswer): Promise<void>;
  getStudyAnswers(filter?: { category?: CategoryId; since?: string }): Promise<StudyAnswer[]>;

  /** Quiz sessions */
  saveQuizSession(session: QuizSession): Promise<void>;
  getQuizSession(id: string): Promise<QuizSession | null>;
  getQuizSessions(filter?: { status?: QuizSession['status'] }): Promise<QuizSession[]>;

  /** Bookmarks */
  addBookmark(questionId: string): Promise<void>;
  removeBookmark(questionId: string): Promise<void>;
  getBookmarks(): Promise<Bookmark[]>;
  isBookmarked(questionId: string): Promise<boolean>;

  /** Gamification */
  getGamificationState(): Promise<GamificationState>;
  saveGamificationState(state: GamificationState): Promise<void>;
}
```

---

## 6. SignCatalog Service

**File**: `src/services/signCatalog.ts`

```typescript
interface SignCatalogService {
  /** Get all sign categories */
  getCategories(): SignCategoryId[];

  /** Get signs by category */
  getByCategory(categoryId: SignCategoryId): Promise<RoadSign[]>;

  /** Get a single sign by ID */
  getById(signId: string): Promise<RoadSign | undefined>;

  /** Get the SVG asset URL for a sign */
  getSignImageUrl(signId: string): string;
}
```

---

## Hook Contracts

These hooks connect services to React components.

| Hook | Service(s) Used | Returns |
|------|----------------|---------|
| `useStudySession(categoryId)` | QuestionBank, ProgressTracker, Gamification | `{ question, answer(), next(), summary, events }` |
| `useQuizSession()` | QuizEngine, Gamification | `{ session, answer(), submit(), timeRemaining, events }` |
| `useProgress()` | ProgressTracker | `{ progress, quizHistory, isLoading }` |
| `useBookmarks()` | Storage, QuestionBank | `{ bookmarks, toggle(), isBookmarked() }` |
| `useGamification()` | GamificationEngine | `{ state, badges, pendingEvents, dismiss() }` |
| `usePersistedState<T>(key)` | Storage | `[value, setValue]` (like useState with IndexedDB backing) |
