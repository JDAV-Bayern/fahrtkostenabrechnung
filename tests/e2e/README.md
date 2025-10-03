# Playwright E2E scaffold

## Getting started

1. Install new tooling if you have not yet run `npm install` since this change. Playwright also needs the browser binaries once via `npx playwright install`.
2. Run the Angular dev server automatically through the test runner with `npm run test:e2e`. The command uses the configuration in `playwright.config.ts` and will reuse an existing server when one is already running.
3. Optional helpers are available at `tests/e2e/fixtures.ts`. Import `{ test, expect }` from that module to get typed page objects for each reimbursement step and the info pages.
4. The sample reimbursement test uploads a dummy receipt and parses the generated PDF using `pdf-parse`; `npm install` fetches all required tools automatically.

## Page objects

Reusable page models live in `tests/e2e/poms`. They cover the individual reimbursement steps, modal dialogs for expenses, and the informational pages. Extend or adjust them as you add scenarios—each class keeps selectors close to the component markup so tests remain readable.
