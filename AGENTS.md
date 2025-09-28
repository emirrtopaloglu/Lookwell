# Repository Guidelines

## Project Structure & Module Organization
- `app/` holds Expo Router routes and feature screens; co-locate UI fragments under route directories.
- `components/`, `hooks/`, and `constants/` contain reusable building blocks—keep them framework-agnostic and typed.
- `assets/` stores static media; group by type (e.g., `assets/images`).
- `prompts/` documents product, architecture, and agent mandates—reread before major changes.
- `scripts/` houses maintenance tooling such as `reset-project.js`; avoid modifying without consensus.

## Build, Test, and Development Commands
- `npm run start` launches Expo Dev Tools for local development.
- `npm run android`, `npm run ios`, and `npm run web` start the bundler targeting specific platforms.
- `npm run lint` runs Expo’s ESLint config; resolve all findings before pushing.
- `npm run reset-project` cleans caches and node modules—use only when local state is corrupt.

## Coding Style & Naming Conventions
- Use TypeScript everywhere; forbid `any`. Prefer explicit `type`/`interface` exports from `types/` or module roots.
- Follow React Native StyleSheet patterns; do not introduce new styling libraries.
- Name files with kebab-case for routes (`app/(auth)/sign-in.tsx`) and PascalCase for shared components (`components/Button.tsx`).
- Keep functions pure and short; extract shared utilities into `utils/` when reuse emerges.

## Testing Guidelines
- Snapshot and interaction tests should rely on Jest + React Native Testing Library; colocate under `__tests__/` when added.
- Name test files `<Component>.test.tsx` and mirror the source path.
- Stub network calls with MSW or lightweight mocks; ensure paywall logic and Fal.ai polling paths are covered before releases.
- Aim for >80% coverage on screen logic; document gaps in PR descriptions when unavoidable.

## Commit & Pull Request Guidelines
- Use Conventional Commits (`feat:`, `fix:`, `chore:`) as in the existing history.
- Keep commits focused and lint-clean; include screenshots or screen recordings for UI changes.
- Reference related issues or hackathon tasks in the PR body; summarise testing steps (e.g., "Tested on iOS simulator").
- Request review from domain owners (frontend, backend, product) when touching their areas, and link to relevant prompt docs.

## Security & Configuration Tips
- Never expose Fal.ai or Adapty keys in the client; proxy them through the worker layer described in `prompts/architecture.md`.
- Store environment secrets in `.env` files ignored by Git, and validate access in reviews.
- Purge uploaded media in temporary storage after use to uphold the privacy commitments outlined in the PRD.
