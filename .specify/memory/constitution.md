<!--
  Sync Impact Report
  ==================
  Version change: N/A → 1.0.0 (initial ratification)

  Added principles:
    - I.   TypeScript Strictness
    - II.  Component Architecture
    - III. Utility-First Styling
    - IV.  Separation of Concerns
    - V.   Explicit State Handling

  Added sections:
    - Technology Constraints
    - Development Workflow
    - Governance

  Removed sections: none

  Templates requiring updates:
    - .specify/templates/plan-template.md        ✅ no updates needed
    - .specify/templates/spec-template.md         ✅ no updates needed
    - .specify/templates/tasks-template.md        ✅ no updates needed

  Follow-up TODOs: none
-->

# Drivers License Constitution

## Core Principles

### I. TypeScript Strictness

All source code MUST be written in TypeScript with `strict: true`
enabled in tsconfig. The `any` type is forbidden unless a written
justification proves no alternative exists. At system boundaries
(API responses, external data, user input), use `unknown` and narrow
with type guards. Component props MUST be defined with `interface`,
named `<ComponentName>Props`. Discriminated unions MUST be used for
complex state shapes.

**Rationale**: Strict typing catches defects at compile time,
documents intent, and makes refactors safe. Banning `any` forces
developers to model data accurately.

### II. Component Architecture

Every React component MUST be a functional component declared with
the `function` keyword — class components are prohibited. Each
component MUST reside in its own file (one component per file).
Components MUST be small and focused on a single responsibility;
reusable logic MUST be extracted into custom hooks. `useMemo` and
`useCallback` MUST only be introduced when a measured performance
need is demonstrated. State MUST be lifted only as high as
necessary — no higher. Controlled components MUST be used for all
form inputs.

**Rationale**: Small, focused components are easier to test, review,
and compose. Avoiding premature memoization keeps code simple and
avoids false confidence in performance fixes.

### III. Utility-First Styling

All styling MUST follow a utility-first approach using Tailwind CSS.
Custom CSS files MUST NOT be created unless Tailwind utilities
cannot express the design. When component-specific style groups
recur, extract them into Tailwind `@apply` directives inside a
component-scoped layer or into reusable component abstractions —
never into global utility classes. Design tokens (colors, spacing,
typography, breakpoints) MUST be defined in `tailwind.config.ts` and
referenced via Tailwind utilities, not hard-coded values. Responsive
design MUST use Tailwind's mobile-first breakpoint prefixes
(`sm:`, `md:`, `lg:`, etc.). Dark mode, when supported, MUST use
Tailwind's `dark:` variant. Class lists MUST be kept readable; when
a class string exceeds ~80 characters, split across multiple lines
or use a `cn()` / `clsx()` helper for conditional classes.

**Rationale**: Utility-first CSS co-locates style with markup,
eliminates naming debates, and produces smaller production bundles
via Tailwind's purge. Centralizing design tokens enforces visual
consistency.

### IV. Separation of Concerns

Business logic MUST NOT live inside React components. Domain logic
MUST be placed in hooks (`use*.ts`) or service modules
(`services/*.ts`). Data-fetching MUST be encapsulated in dedicated
hooks or service functions — components consume the result. API
response types MUST be defined in a shared types directory and
validated at the boundary. Vite environment variables MUST be
accessed exclusively via `import.meta.env` and prefixed with
`VITE_`.

**Rationale**: Separating logic from presentation makes both
independently testable and allows the UI layer to change without
touching business rules.

### V. Explicit State Handling

Every component that fetches data MUST handle loading, error, and
empty states explicitly — no implicit assumptions about data
availability. Async operations MUST surface errors to the user with
meaningful messages. Conditional rendering MUST NOT hide broken
states behind a spinner forever; timeouts or retry mechanisms MUST
be considered where appropriate.

**Rationale**: Users deserve clear feedback. Unhandled states cause
blank screens, silent failures, and support tickets.

## Technology Constraints

| Concern          | Requirement                                              |
|------------------|----------------------------------------------------------|
| Framework        | React 18+ with Vite                                     |
| Language         | TypeScript, `strict: true`                               |
| Styling          | Tailwind CSS (utility-first, config in `tailwind.config.ts`) |
| Components       | Functional only, `function` keyword, hooks               |
| Imports          | Absolute via path alias `@/`                             |
| Exports          | Named exports; default exports prohibited                |
| File naming      | PascalCase for components, camelCase for utilities       |
| Code splitting   | Dynamic `import()` at route level                        |
| Env variables    | `import.meta.env.VITE_*`                                 |
| Barrel files     | Prohibited except public API surfaces                    |

## Development Workflow

1. **Install**: `npm install`
2. **Dev server**: `npm run dev`
3. **Lint**: `npm run lint` — MUST pass before any commit
4. **Test**: `npm run test` — MUST pass before any merge
5. **Build**: `npm run build` (runs `tsc && vite build`)
6. **Preview**: `npm run preview`
7. **Commits**: Follow Conventional Commits (`feat:`, `fix:`,
   `chore:`, `docs:`, `refactor:`, `test:`)

## Governance

This constitution is the authoritative source for project standards.
All code reviews MUST verify compliance with its principles.

**Amendment procedure**: Any team member may propose a change via a
pull request to this file. The PR MUST include:
  - A description of what changes and why
  - An updated version number following semantic versioning
  - Updates to any dependent templates or docs affected

**Versioning policy**:
  - MAJOR: Principle removed or redefined incompatibly
  - MINOR: New principle or section added, or existing guidance
    materially expanded
  - PATCH: Clarifications, typo fixes, non-semantic rewording

**Compliance review**: At least once per quarter, the team SHOULD
review the constitution for relevance and accuracy.

**Version**: 1.0.0 | **Ratified**: 2026-03-17 | **Last Amended**: 2026-03-17
