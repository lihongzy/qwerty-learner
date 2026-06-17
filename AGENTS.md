# Repository Guidelines

## Project Structure & Module Organization
`src/` contains the React + TypeScript frontend. Keep app bootstrapping, providers, router, and shell layout in `src/app/`. Put feature-specific UI and logic in `src/features/`. Shared UI primitives, reusable components, shared state, resources, utils, and db access belong in `src/shared/`. Static assets live under `src/assets/` and `public/`.

`src-tauri/` contains the desktop wrapper and Rust entry points in `src-tauri/src/`, plus Tauri config, capabilities, and icons. Generated output in `dist/` and `src-tauri/target/` is build artifact territory; do not edit it by hand.

## Skill Routing
When working in this repository, prefer the local skills under `.agents/skills/` and pick them by problem type instead of guessing ad hoc.

- Use `vercel-react-best-practices` for React performance analysis, effect/data-fetching review, rerender optimization, and client-side data access patterns.
- Use `frontend-design` for styling, theming, visual redesign, component polish, page aesthetics, and any UI beautification request.

For mixed requests, apply the smallest set that matches the task:
- React performance + data access: `vercel-react-best-practices`
- Visual redesign + performance review: `frontend-design` + `vercel-react-best-practices`

## Build, Test, and Development Commands
Use the scripts from `package.json`:

- `pnpm dev`: start the Vite frontend for local web development.
- `pnpm build`: run TypeScript checks and emit the production bundle to `dist/`.
- `pnpm preview`: serve the built frontend locally for a smoke test.
- `pnpm tauri dev`: launch the desktop app in Tauri dev mode.
- `pnpm tauri build`: create a desktop production build.
- `pnpm check:encoding`: validate that source files remain UTF-8 encoded.

## Coding Style & Naming Conventions
Prettier is the active formatter (`prettier.config.cjs`): 2-space indentation, single quotes, trailing commas, no semicolons, and Tailwind class sorting through `prettier-plugin-tailwindcss`. Run `pnpm prettier --write .` before opening a PR if you touched multiple UI files.

Use `PascalCase` for React components and feature folders, `camelCase` for hooks, utilities, and Jotai atoms, and `index.tsx` only when a folder exposes a single public entry. Keep modules focused and typed.

Prefer Tailwind utilities and shadcn/ui semantic tokens over custom CSS classes.

## Testing Guidelines
There is no dedicated automated test runner configured yet. Validate changes with `pnpm tsc --noEmit`, `pnpm check:encoding`, and `pnpm build` when appropriate. For desktop behavior, use `pnpm tauri dev`. If you add tests, place them next to the feature as `*.test.ts` or `*.test.tsx` and keep each file focused on one behavior.

## Commit & Pull Request Guidelines
Recent history favors short, imperative commit subjects, often written in Chinese, equivalent to messages like `更新 Tooltip 组件` or `增加词库和 Radix 支持`. Keep commits scoped to one change and phrase the subject as an action.

PRs should include a concise summary, affected areas, manual verification steps, and screenshots or recordings for UI changes. Link related issues or task notes when available.
