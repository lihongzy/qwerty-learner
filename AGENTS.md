# Repository Guidelines

## Project Structure & Module Organization
`src/` contains the React + TypeScript frontend. Keep app bootstrapping in `src/app/`, shared UI in `src/components/`, route-level screens in `src/pages/`, state in `src/store/`, static resources in `src/resources/`, and utility code in `src/utils/`. Media and bundled assets live under `src/assets/` and `public/`.

`src-tauri/` contains the desktop wrapper and Rust entry points in `src-tauri/src/`, plus Tauri config, capabilities, and icons. Generated output in `dist/` and `src-tauri/target/` is build artifact territory; do not edit it by hand.

## Build, Test, and Development Commands
Use the scripts from `package.json`:

- `npm run dev`: start the Vite frontend for local web development.
- `npm run build`: run TypeScript checks and emit the production bundle to `dist/`.
- `npm run preview`: serve the built frontend locally for a smoke test.
- `npm run tauri dev`: launch the desktop app in Tauri dev mode.
- `npm run tauri build`: create a desktop production build.

## Coding Style & Naming Conventions
Prettier is the active formatter (`prettier.config.cjs`): 2-space indentation, single quotes, trailing commas, no semicolons, and Tailwind class sorting through `prettier-plugin-tailwindcss`. Run `npx prettier --write .` before opening a PR if you touched multiple UI files.

Use `PascalCase` for React components and page folders, `camelCase` for hooks, utilities, and Jotai atoms, and `index.tsx` only when a folder exposes a single public entry. Keep modules focused and typed.

## Testing Guidelines
There is no dedicated automated test runner configured yet. Validate changes with `npm run build` and, for desktop behavior, `npm run tauri dev`. If you add tests, place them next to the feature as `*.test.ts` or `*.test.tsx` and keep each file focused on one behavior.

## Commit & Pull Request Guidelines
Recent history favors short, imperative commit subjects, often written in Chinese, equivalent to messages like "update tooltip component" or "add dictionary and Radix support." Keep commits scoped to one change and phrase the subject as an action.

PRs should include a concise summary, affected areas, manual verification steps, and screenshots or recordings for UI changes. Link related issues or task notes when available.
