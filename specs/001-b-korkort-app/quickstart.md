# Quickstart: B-Körkortsappen

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** 9+

## Setup

```bash
# Clone and enter the project
git clone <repo-url>
cd drivers-license
git checkout 001-b-korkort-app

# Install dependencies
npm install
```

## Development

```bash
# Start dev server (Vite, hot reload)
npm run dev
# → http://localhost:5173

# Run linter
npm run lint

# Run unit tests (Vitest)
npm run test

# Run tests in watch mode
npm run test -- --watch
```

## Production Build

```bash
# Type-check + build
npm run build

# Preview production build locally
npm run preview
# → http://localhost:4173
```

## Key Dependencies

| Package | Purpose | Size (gzip) |
|---------|---------|-------------|
| react, react-dom | UI framework | ~42 KB |
| react-router | Client-side routing | ~14 KB |
| idb | IndexedDB wrapper | ~1.4 KB |
| recharts | Statistics charts | ~60-70 KB |
| canvas-confetti | Celebration effects | ~4.2 KB |
| vite-plugin-pwa | PWA/offline support | build-only |
| tailwindcss | Utility-first CSS | build-only |

## Project Structure

```
src/
├── components/     # Shared UI components
├── pages/          # Route-level pages (lazy-loaded)
├── hooks/          # Custom React hooks
├── services/       # Business logic (QuizEngine, Storage, etc.)
├── data/           # Static JSON question banks + sign catalog
│   ├── questions/  # One JSON per category
│   └── signs/      # Sign metadata + SVG assets
├── types/          # Shared TypeScript interfaces
├── utils/          # Pure utility functions
├── App.tsx         # Router + layout
└── main.tsx        # Entry point
```

## Environment Variables

All prefixed with `VITE_` per Vite convention. Currently none required — the app runs fully client-side with no backend.

## PWA / Offline

The app uses `vite-plugin-pwa` with Workbox for offline support. In development, PWA is disabled by default. To test PWA behavior:

```bash
npm run build
npm run preview
# Open in Chrome → DevTools → Application → Service Workers
```

## Testing Strategy

- **Unit**: Vitest + React Testing Library for services and components
- **E2E**: Playwright for critical user flows (quiz completion, study session)
- **Target**: Services 80%+ coverage, critical paths covered by E2E
