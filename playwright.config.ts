import { defineConfig, devices } from '@playwright/test';

// =============================================================================
// zampa.dev — Playwright config for the touch-target regression guard.
// -----------------------------------------------------------------------------
// The repo's FIRST automated test. It boots the site itself (astro dev — the
// Vercel adapter + `prerender = false` on the homepage rule out `astro preview`)
// and hit-tests every ::before-expanded touch target at the tightest supported
// viewport. Geometry is identical between dev and prod for these components
// (scoped styles, media queries and pseudo-elements are unchanged by dev mode).
//
// Viewport is pinned to 320x568 with a FIXED deviceScaleFactor of 2 so CI is
// deterministic. deviceScaleFactor does not change CSS-px geometry; it is fixed
// only to remove a source of run-to-run drift.
// =============================================================================

const PORT = 4321;
const HOST = '127.0.0.1';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  // In CI the `html` reporter is what the workflow uploads on failure: it keeps
  // the per-target measurement tables, so a red run is diagnosable from the
  // artifact alone. `open: 'never'` keeps it from trying to launch a browser.
  reporter: process.env.CI
    ? [['github'], ['list'], ['html', { open: 'never' }]]
    : [['list']],
  // Astro 7's dev server is a background daemon (the foreground command exits
  // once it is listening), which is incompatible with Playwright's `webServer`.
  // We manage the daemon ourselves in global setup/teardown instead.
  globalSetup: './tests/global-setup.ts',
  globalTeardown: './tests/global-teardown.ts',
  // Entrance animations are neutralised in the spec's `prep`, not here: this
  // Playwright build's `reducedMotion: 'reduce'` does not reach the page (probed
  // directly — `matchMedia('(prefers-reduced-motion: reduce)').matches` stays
  // false), so relying on it would silently reintroduce the reveal race.
  use: {
    baseURL: `http://${HOST}:${PORT}`,
    viewport: { width: 320, height: 568 },
    deviceScaleFactor: 2,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 320, height: 568 }, deviceScaleFactor: 2 },
    },
  ],
});
