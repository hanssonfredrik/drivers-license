# Technology Research: B-Körkortsappen

**Date**: 2026-03-17 | **Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

---

## 1. IndexedDB Wrapper for React

**Decision**: `idb` (by Jake Archibald)

**Rationale**:
- **Tiny footprint**: 1.4 KB gzipped (vs Dexie at 29.9 KB gzipped — 21× larger). With a 500 KB total bundle budget, every KB matters.
- **First-class TypeScript**: Built-in type declarations with `DBSchema` generics that enforce store names, key types, and value types at compile time. Perfect for `strict: true`.
- **API mirrors IndexedDB**: Thin promise-based wrapper over the native API, making it easy to reason about transactions. No new query language to learn.
- **Zero dependencies**: No transitive dependency risk.
- **Actively maintained**: 13.4M weekly downloads, v8.0.3 published mid-2025 by Jake Archibald (Chrome DevRel).
- **Sufficient for our needs**: The app stores progress records, bookmarks, quiz sessions, and gamification state — simple key-value and object store patterns. We don't need Dexie's advanced query DSL.

**Alternatives considered**:

| Library | Gzipped | TS Support | React Integration | Weekly Downloads | Last Publish | Verdict |
|---------|---------|------------|-------------------|------------------|-------------|---------|
| **idb** | **1.4 KB** | Built-in (`DBSchema` generics) | None (not needed — wrap in hooks) | 13.4M | 10 months ago | **Chosen** |
| **Dexie.js** | 29.9 KB | Built-in (`EntityTable` generics) | `dexie-react-hooks` (`useLiveQuery`) | 922K | 3 months ago | Overkill. Excellent query API and React hooks via `useLiveQuery`, but 21× heavier for CRUD operations we can express with plain `idb`. Dexie Cloud sync features are irrelevant (no backend). |
| **localForage** | ~7.8 KB | `@types` (DefinitelyTyped) | None | 5.4M | **5 years ago** | Dead project. Last published 2021. Simple key-value API only — no object store indexes, no schema versioning. WebSQL fallback code is dead weight. |

**Implementation note**: Create a `services/storage.ts` module that opens the DB with typed schemas and exposes async CRUD methods. Wrap in custom hooks (`useProgress`, `useBookmarks`, etc.) for React consumption.

---

## 2. PWA / Service Worker with Vite

**Decision**: `vite-plugin-pwa` (Workbox under the hood)

**Rationale**:
- **Zero-config for Vite**: Generates web app manifest, service worker, and registration script with minimal configuration. 2M+ weekly downloads, actively maintained (v1.2.0, 4 months ago).
- **Workbox precaching built-in**: Automatically precaches all Vite build output (JS, CSS, HTML). Static JSON data files (questions, signs) placed in `public/` or imported as assets will be included in the precache manifest.
- **Cache-first strategy**: Workbox's `generateSW` strategy precaches everything at install time — exactly the offline-first behavior needed (FR-013: "offline-capable after first visit").
- **Update flow**: Built-in `registerType: 'prompt'` mode shows a "New version available" prompt, letting users choose when to update. Perfect for a study app where mid-session interruption is undesirable.
- **React integration**: Official `@vite-pwa/assets-generator` for generating PWA icons from a single source image. Documentation includes React-specific examples for the update prompt.
- **Development support**: `devOptions: { enabled: true }` for testing SW behavior during development.

**Alternatives considered**:

| Approach | Verdict |
|----------|---------|
| **vite-plugin-pwa** | **Chosen**. Handles manifest generation, SW generation, precaching, and update flow in one plugin. |
| **Manual Workbox config** | Unnecessary complexity. You'd need to write `workbox-build` scripts, manually configure `InjectManifest`, handle registration yourself. Same end result with more boilerplate. Only justified if you need custom SW logic (push notifications, background sync) — we don't. |
| **@vite-pwa/assets-generator** | Complementary tool, not an alternative. Use it alongside `vite-plugin-pwa` for generating PWA icons (app icons for manifest.json). |

**Configuration sketch**:
```ts
VitePWA({
  registerType: 'prompt',
  workbox: {
    globPatterns: ['**/*.{js,css,html,json,svg,png,webp}'],
  },
  manifest: {
    name: 'B-Körkortsappen',
    short_name: 'Körkort',
    theme_color: '#...',
    lang: 'sv',
  },
})
```

---

## 3. Chart Library for Statistics Visualization

**Decision**: Recharts

**Rationale**:
- **React-native API**: Declarative JSX-based composition (`<BarChart>`, `<LineChart>`, `<XAxis>`, `<Tooltip>`). Feels natural in a React codebase — no imperative canvas setup.
- **Built on SVG**: Renders accessible, responsive SVG charts. Works well on mobile with `<ResponsiveContainer>`.
- **TypeScript support**: Built-in type declarations. 17.1M weekly downloads — the largest React charting community.
- **Covers our use cases**: Bar chart for category accuracy, line chart for quiz history — both are first-class Recharts components with minimal configuration.
- **Tree-shakeable**: v3.x supports ES module tree-shaking. Importing only `BarChart` + `LineChart` with axes and tooltips lands around ~60-70 KB gzipped (not the full 135 KB).
- **Actively maintained**: v3.8.0 published days ago.

**Alternatives considered**:

| Library | Gzipped (full) | Approach | Weekly Downloads | Verdict |
|---------|----------------|----------|------------------|---------|
| **Recharts** | ~135 KB (full), ~60-70 KB (tree-shaken for bar+line) | Declarative React SVG | 17.1M | **Chosen** |
| **Chart.js + react-chartjs-2** | ~67 KB (chart.js) + 3 KB (wrapper) | Canvas-based, imperative registration | 2.7M (wrapper) | Strong alternative. Smaller total bundle and excellent performance for large datasets. However: canvas rendering is less accessible (no DOM nodes for screen readers), requires imperative `Chart.register()` calls, and responsive behavior needs extra `<div>` wrapper tricks. For 2 simple charts, Recharts' declarative API wins on DX. |
| **visx** (Airbnb) | Varies (modular) | Low-level D3 + React primitives | 58K | Too low-level. You assemble charts from primitives (`@visx/axis`, `@visx/shape`, `@visx/scale`). Great for bespoke visualizations, overkill for standard bar/line charts. Small community. |
| **nivo** | ~50 KB per chart type | High-level, lots of chart types | 1.4M (@nivo/core) | Beautiful defaults but heavier per chart type than Recharts. Less flexible customization. Smaller ecosystem. |

**Bundle impact note**: With the 500 KB gzipped budget, Recharts tree-shaken for two chart types fits comfortably. The statistics page should be lazy-loaded via `React.lazy()` so chart code is only fetched when users navigate to it.

---

## 4. Animation Library for Gamification Rewards

**Decision**: `canvas-confetti` for celebrations + CSS animations/transitions for UI feedback

**Rationale**:
- **Confetti is the core need**: The gamification spec calls for celebratory moments (quiz passed, badge unlocked, level up, streak milestone). Confetti is the highest-impact celebration effect.
- **Tiny and purpose-built**: `canvas-confetti` is 4.2 KB gzipped, zero dependencies, uses Canvas 2D (offloads to Web Worker via `useWorker: true` for zero main-thread jank on mobile).
- **No framework coupling**: Works by calling `confetti()` — trivially wrapped in a React hook. No React-specific library needed.
- **CSS handles the rest**: Badge unlock shimmer, XP bar fill, level-up scale-in — these are simple transitions achievable with CSS `@keyframes` and `transition`. No need for a JS animation library for these.
- **Reduced motion support**: Built-in `disableForReducedMotion` option respects `prefers-reduced-motion`.

**Alternatives considered**:

| Library | Gzipped | Use Case | Weekly Downloads | Verdict |
|---------|---------|----------|------------------|---------|
| **canvas-confetti** | **4.2 KB** | Confetti/fireworks | 7.8M | **Chosen** for celebrations |
| **CSS animations** | **0 KB** | Transitions, shimmer, scale | — | **Chosen** for UI feedback |
| **Motion (framer-motion)** | ~50 KB (tree-shaken) | Full animation suite | 30.5M | Massively popular but massive overkill. We don't need layout animations, gesture handling, `AnimatePresence`, or shared layout transitions. Adding 50 KB for badge shimmer animations that CSS handles in 0 KB is unjustifiable under a 500 KB budget. |
| **react-spring** | ~20 KB | Spring physics animations | 780K | Declining community (780K weekly). Spring physics are elegant but unnecessary for confetti bursts + simple CSS transitions. |

**Implementation note**: Create a `hooks/useCelebration.ts` hook that fires `confetti()` with predefined presets (quiz-passed, badge-earned, level-up). CSS utility classes in Tailwind for `animate-bounce`, `animate-pulse`, custom `@keyframes` for shimmer effects.

---

## 5. Question Data Format

**Decision**: Multiple JSON files per category, statically imported with dynamic `import()`

**Rationale**:
- **Natural code-splitting by category**: Five JSON files matching Trafikverket's categories (`trafikregler.json`, `trafiksakerhet.json`, `fordonskannedom.json`, `miljo.json`, `personliga.json`). When a user selects "Trafikregler" for study mode, only that file is loaded.
- **Vite handles JSON natively**: `import data from './questions/trafikregler.json'` is processed by Vite at build time with zero config. Each JSON file becomes a separate chunk when using `() => import('./questions/trafikregler.json')`.
- **Lazy loading for quiz**: The quiz engine can `Promise.all()` the imports for all 5 categories only when a quiz starts, keeping the initial page load fast.
- **TypeScript type safety**: Define a `Question` interface in `types/question.ts` and assert the imported JSON against it using a runtime validation or `satisfies` operator.
- **Good caching behavior**: Each category JSON file gets its own content hash in the Vite build. Updating questions in one category doesn't invalidate the cache for others.

**Alternatives considered**:

| Approach | Verdict |
|----------|---------|
| **Multiple JSON per category** | **Chosen**. Natural code-splitting, lazy-loadable, good cache invalidation granularity. |
| **Single large JSON file** | All 1000+ questions in one file (~200-400 KB JSON). No code-splitting — the entire question bank loads upfront. Wasteful when user only wants to study one category. Also: one question edit invalidates the entire cache. |
| **TypeScript const arrays** | `export const trafikregler: Question[] = [...]`. Gets compiled into JS, no separate chunk — it's part of the module graph. Harder to lazy-load without wrapper modules. Also bloats the TS compiler's work during development. JSON files are leaner for pure data. |

**File structure**:
```
src/data/questions/
├── trafikregler.json       (~300 questions)
├── trafiksakerhet.json     (~250 questions)
├── fordonskannedom.json    (~200 questions)
├── miljo.json              (~150 questions)
└── personliga.json         (~100 questions)
```

**Loading pattern**:
```ts
// Study mode — load one category
const questions = await import(`../data/questions/${categoryId}.json`);

// Quiz mode — load all weighted
const [tr, ts, fk, mi, pe] = await Promise.all([
  import('../data/questions/trafikregler.json'),
  import('../data/questions/trafiksakerhet.json'),
  import('../data/questions/fordonskannedom.json'),
  import('../data/questions/miljo.json'),
  import('../data/questions/personliga.json'),
]);
```

---

## 6. SVG Road Signs

**Decision**: Static SVG files referenced by URL (Vite asset imports), with selective inline SVG via `vite-plugin-svgr` for interactive signs

**Rationale**:
- **~300 SVGs would bloat the JS bundle as inline components**: Each SVG-as-React-component adds ~1-5 KB to the JS bundle. 300 signs × ~3 KB avg = ~900 KB of JS — well over the entire 500 KB budget, and none of it is tree-shakeable since the sign catalog renders dynamically.
- **Static file references are cacheable**: `import signUrl from './svg/A1.svg'` gives a hashed URL. The browser caches SVGs individually as static assets, separate from JS. Only signs the user actually views are fetched.
- **Lazy image loading**: In the signs catalog, use `<img src={signUrl} loading="lazy" alt="..." />` for native lazy loading. Only visible signs are fetched — critical for a list of 300 items on mobile.
- **Accessibility**: `alt` text on `<img>` tags provides screen reader support. For the detail view, a text description accompanies each sign (from signs.json data).
- **vite-plugin-svgr for exceptions**: If specific signs need CSS styling or animation (e.g., highlighting a sign part in a question), they can be selectively imported as React components with `import Sign from './A1.svg?react'`.

**Alternatives considered**:

| Approach | Verdict |
|----------|---------|
| **Static SVG files via URL** | **Chosen**. Best caching, lazy-loadable, minimal JS bundle impact. |
| **Inline SVG components (vite-plugin-svgr for all)** | Each sign becomes a React component in the JS bundle. 300 signs makes this catastrophic for bundle size. No benefit since signs don't need JS interactivity in the catalog/reference view. |
| **SVG sprite sheet** | A single `<svg>` sprite with `<symbol>` elements, referenced via `<use href="#sign-id">`. Pros: single HTTP request. Cons: the entire sprite (~300 signs, potentially 500+ KB) must load upfront — no lazy loading individual signs. Also less browser caching granularity and harder to manage at 300 items. |

**File structure**:
```
src/data/signs/
├── signs.json              # Metadata: id, name, category, description
└── svg/
    ├── A1.svg              # Individual SVG files
    ├── A2.svg
    ├── ...
    └── X99.svg
```

**Rendering pattern**:
```tsx
// SignCard component — lazy-loaded images
function SignCard({ sign }: SignCardProps) {
  return (
    <img
      src={new URL(`../data/signs/svg/${sign.id}.svg`, import.meta.url).href}
      alt={sign.name}
      loading="lazy"
      width={64}
      height={64}
    />
  );
}
```

---

## 7. Routing

**Decision**: React Router v7 (successor to v6) with lazy routes

**Rationale**:
- **React Router v7 is current**: As of 2026, `react-router-dom` v7.13.1 is the latest stable (published days ago, 24M weekly downloads). Note: v7 is the rebranded successor to v6 — `react-router-dom` now re-exports from `react-router`. The plan references "v6" but the actual install will be v7, which is the direct upgrade path.
- **Lazy routes for code-splitting**: `React.lazy(() => import('./pages/QuizPage'))` with `<Suspense>` splits each page into its own chunk. Critical for staying under 500 KB — the stats page (with Recharts) and signs page (with 300 SVG references) should only load when navigated to.
- **~10 pages is the sweet spot**: React Router handles this scale trivially. No need for file-based routing or type-safe route generation at this size.
- **Battle-tested**: The most widely adopted React router with massive ecosystem support, excellent documentation, and predictable release cadence.

**Alternatives considered**:

| Library | Weekly Downloads | Type Safety | Verdict |
|---------|-----------------|-------------|---------|
| **React Router v7** | 24.1M | Good (typed params via `useParams<>()`) | **Chosen**. Industry standard, minimal learning curve, perfect fit for ~10-page SPA. |
| **TanStack Router** | 2.1M | Excellent (fully type-safe routes, params, search params) | Impressive type-safe routing with built-in search param validation and caching. However: adds complexity (file-based route generation via codegen, router devtools, loader patterns). For a ~10-page app with simple `/study/:category` and `/quiz/:id` routes, the type-safety benefits don't justify the learning curve and extra tooling. Better suited for larger apps with complex nested routes and search params. |

**Route structure**:
```tsx
const routes = [
  { path: '/', lazy: () => import('./pages/HomePage') },
  { path: '/study/:category', lazy: () => import('./pages/StudyPage') },
  { path: '/quiz', lazy: () => import('./pages/QuizPage') },
  { path: '/quiz/:id/result', lazy: () => import('./pages/QuizResultPage') },
  { path: '/stats', lazy: () => import('./pages/StatsPage') },
  { path: '/signs', lazy: () => import('./pages/SignsPage') },
  { path: '/signs/:category', lazy: () => import('./pages/SignsPage') },
  { path: '/bookmarks', lazy: () => import('./pages/BookmarksPage') },
  { path: '*', lazy: () => import('./pages/NotFoundPage') },
];
```

---

## Summary of Decisions

| # | Topic | Decision | Gzipped Size |
|---|-------|----------|-------------|
| 1 | IndexedDB wrapper | `idb` | 1.4 KB |
| 2 | PWA / Service Worker | `vite-plugin-pwa` | Build-time only |
| 3 | Chart library | `recharts` (tree-shaken) | ~60-70 KB |
| 4 | Animation / Gamification | `canvas-confetti` + CSS | 4.2 KB |
| 5 | Question data format | Multiple JSON per category | Data (not JS) |
| 6 | SVG road signs | Static URL refs + selective SVGR | Assets (not JS) |
| 7 | Routing | React Router v7 + lazy routes | ~14 KB |

**Estimated dependency JS budget**: ~80-90 KB gzipped for these choices, well within the 500 KB total budget (leaving ample room for React, Tailwind CSS, application code, and data).
