import { execSync } from 'node:child_process';
import { chromium } from '@playwright/test';

// -----------------------------------------------------------------------------
// Boot the site ourselves. Astro 7's `astro dev` runs as a background daemon:
// the foreground command exits as soon as the server is listening, which is
// incompatible with Playwright's `webServer` (it expects a long-lived foreground
// process and would report "exited early"). So we drive the daemon directly:
// stop any stale instance, start a fresh one, and poll until it answers.
// `global-teardown.ts` stops it again.
// -----------------------------------------------------------------------------

const BASE = 'http://127.0.0.1:4321/';

async function waitUp(timeoutMs: number): Promise<void> {
  const start = Date.now();
  let lastErr: unknown = null;
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(BASE);
      if (res.ok) return;
      lastErr = new Error(`HTTP ${res.status}`);
    } catch (e) {
      lastErr = e;
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`astro dev never became ready at ${BASE} within ${timeoutMs}ms (last: ${String(lastErr)})`);
}

export default async function globalSetup(): Promise<void> {
  try {
    execSync('npx astro dev stop', { stdio: 'ignore' });
  } catch {
    /* nothing running — fine */
  }
  // Start the daemon EXPLICITLY in the background (documented flag) so the
  // foreground command always returns and `execSync` never blocks — critical in
  // CI's non-TTY environment, where relying on implicit daemonization could hang
  // the job to its timeout.
  execSync('npm run dev -- --port 4321 --host 127.0.0.1 --background', { stdio: 'inherit' });
  await waitUp(90_000);
  await warm();
}

// Warm every route once in a real browser BEFORE the suite measures. Astro's
// dev server compiles routes on first hit, and the SSR homepage (prerender =
// false) triggers a Vite dep pre-bundle + full page reload on that first load —
// which would otherwise destroy the execution context mid-measurement. Doing it
// here makes the actual tests hit an already-warm, reload-free server.
async function warm(): Promise<void> {
  const paths = ['/', '/pt', '/now', '/uses', '/colophon', '/pt/now', '/pt/uses', '/pt/colophon'];
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    for (const p of paths) {
      await page.goto(`http://127.0.0.1:4321${p}`, { waitUntil: 'load' }).catch(() => {});
      await page.waitForLoadState('networkidle').catch(() => {});
      await page.waitForTimeout(400);
    }
  } finally {
    await browser.close();
  }
}
