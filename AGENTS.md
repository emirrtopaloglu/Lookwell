# Repository Guidelines

## Project Structure & Module Organization
Expo Router screens live in `app/`; keep UI fragments alongside their routes and split shared logic into `components/`, `hooks/`, `stores/`, and `utils/`. Place static assets under `assets/` by type (for example, `assets/images`). Type declarations belong in `types/`, and reusable constants live in `constants/`. Review `prompts/` before major architectural or product changes, and treat `scripts/` tooling—especially `reset-project.js`—as shared infrastructure that should only change with team consensus.

## Build, Test, and Development Commands
- `npm run start`: Launch the Expo Dev Tools and Metro bundler.
- `npm run android` / `npm run ios` / `npm run web`: Start the bundler targeting a specific platform.
- `npm run lint`: Run Expo’s ESLint rules; resolve findings before committing.
- `npm run reset-project`: Clear caches and reinstall modules when local state is corrupted.

## Coding Style & Naming Conventions
Write modern TypeScript with no `any`. Prefer exported `type`/`interface` declarations from module roots or `types/`. Follow React Native `StyleSheet` patterns and avoid introducing new styling libraries. Name route files in kebab-case (e.g., `app/(auth)/sign-in.tsx`), shared components in PascalCase (`components/Button.tsx`), and hooks with the `use` prefix.

## Testing Guidelines
Use Jest with React Native Testing Library (`jest-expo`) for snapshots and interactions. Mirror source paths for tests: `components/Button.test.tsx`. Place mocks close to their consumers or under `__mocks__`. Stub network calls with MSW or lightweight utilities. Target >80% coverage on screen logic and document any exceptions in pull requests. Run tests with `npx jest` or the Expo preset when added to the scripts.

## Commit & Pull Request Guidelines
Follow Conventional Commits (`feat:`, `fix:`, `chore:`) as seen in the history. Keep commits focused, lint-clean, and include relevant screenshots or screen recordings for UI work. In PRs, link hackathon tasks or issues, call out testing results (for example, “Tested on iOS simulator”), and request reviews from domain owners touched by the change.

## Security & Configuration Tips
Never expose Fal.ai or Adapty keys in client code; use the worker proxy described in `prompts/architecture.md`. Store secrets in ignored `.env` files and confirm access during review. Purge temporary media uploads after use to uphold privacy commitments.
