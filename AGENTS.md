# Project Guidelines

## Tech Stack

- React 18+ with Vite
- TypeScript (strict mode)
- Functional components with hooks only — no class components

## Code Style

- Use `function` declarations for components: `function MyComponent() {}`
- Use arrow functions for callbacks, handlers, and utility functions
- Prefer named exports over default exports
- Use absolute imports via path aliases (e.g., `@/components/Button`)
- Destructure props in function parameters
- Colocate component files: `ComponentName/index.tsx`, `ComponentName.module.css`

## TypeScript

- Enable `strict: true` in tsconfig — never use `any` unless absolutely unavoidable
- Define component props with `interface` (not `type`) and name them `ComponentNameProps`
- Use `React.FC` sparingly — prefer explicit return types or inferred types
- Use discriminated unions for complex state
- Prefer `unknown` over `any` at system boundaries; narrow with type guards

## React Patterns

- Keep components small and focused — extract logic into custom hooks
- Use `useMemo` and `useCallback` only when there is a measured performance need
- Lift state only as high as necessary
- Prefer controlled components for forms
- Handle loading, error, and empty states explicitly in every data-fetching component

## Vite

- Use `import.meta.env` for environment variables (prefix with `VITE_`)
- Keep `vite.config.ts` minimal — avoid unnecessary plugins
- Use dynamic `import()` for route-level code splitting

## Build & Test

```sh
npm install        # Install dependencies
npm run dev        # Start dev server
npm run build      # Production build (runs tsc && vite build)
npm run preview    # Preview production build locally
npm run lint       # Lint with ESLint
npm run test       # Run tests
```

## Conventions

- File naming: PascalCase for components (`UserCard.tsx`), camelCase for utilities (`formatDate.ts`)
- One component per file
- Keep business logic out of components — use hooks or service modules
- Avoid barrel files (`index.ts` re-exports) except for public API surfaces
- Commit messages follow Conventional Commits (`feat:`, `fix:`, `chore:`, etc.)
