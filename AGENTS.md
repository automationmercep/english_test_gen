# AGENTS.md

## Source of truth

Before changing this repository, read `CLAUDE.md` in full. It contains the
detailed project architecture, data model, testing conventions, Firebase
integration notes, and deployment setup. Treat it as the primary project
documentation; keep this file short and complementary.

## Project rules

- This is a no-build, client-side application. The main runtime files are
  `index.html`, `app.js`, `styles.css`, `firebase.js`, and
  `lib/pure-logic.js`.
- Keep all user-facing interface text in Polish unless the task explicitly
  requires another language.
- Preserve the offline-first behavior. Firebase is an optional synchronization
  layer and must not become a requirement for using the application.
- Put side-effect-free, unit-testable logic in `lib/pure-logic.js`. Keep DOM,
  `localStorage`, timers, and application state out of that file.
- For Playwright scenarios, keep `specs/*.md` and the corresponding
  `tests/*.spec.ts` aligned. Use a real browser to verify UI behavior instead
  of inferring it only from source code.
- Playwright Test MCP is configured for both tools: `.mcp.json` is used by
  Claude and `.codex/config.toml` is used by Codex. Keep the server name and
  launch command aligned in both files when changing MCP configuration.
- Do not commit local artifacts such as `output/`, `playwright-report/`,
  `test-results/`, `.playwright-cli/`, `.playwright-mcp/`, or local settings.

## Verification

Run checks appropriate to the changed area. Before merging a user-facing or
behavioral change, run both complete suites unless the user asks otherwise:

```powershell
npm run test:unit
npx playwright test
```

For small changes, targeted tests may be used during development, but they do
not replace the complete pre-merge run. Also run `git diff --check` before
committing.

## Git and deployment

- Work on a `codex/` feature branch unless the user requests another branch.
- Commit only files related to the requested change; preserve unrelated local
  modifications and untracked files.
- Open a pull request against `main` and merge only after required checks pass.
- GitHub Pages publishes the repository root directly from `main`; there is no
  application build step. Do not run `firebase deploy` for the live site unless
  the user explicitly asks to switch deployment targets.
- After merging, verify the Pages deployment for the merge commit before
  reporting that the new version is live.
