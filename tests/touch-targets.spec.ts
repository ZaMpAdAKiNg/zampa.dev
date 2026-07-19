import { test, expect, type Page } from '@playwright/test';

// =============================================================================
// zampa.dev — touch-target regression guard (the repo's first automated test).
// -----------------------------------------------------------------------------
// INVARIANT under guard: EVERY interactive target whose tap area is expanded by
// a `::before` pseudo-element presents an EFFECTIVE hit area of at least 44x44
// CSS px at the tightest supported viewport (320x568), in both locales. That is
// the header brand, the header nav (incl. the language toggle), the hero handle,
// the project links, the /uses entry links, the /colophon section links, the
// "back home" links, and the footer nav.
//
// METHOD (frozen — do NOT eyeball, do NOT trust getBoundingClientRect or the
// pseudo-element's own box). We hit-test the RENDERED page with
// `document.elementsFromPoint`. A point "belongs" to a target when that target
// (or a descendant of it, e.g. a text span) is the TOP of the hit stack — i.e.
// nothing paints over it there. Starting from each target's centre we walk
// outward in all four directions until ownership stops. Each boundary is found
// by a coarse 0.5 px walk and then binary-refined to ~0.01 px.
//
// Two things can make a target too small, and they are measured SEPARATELY,
// because conflating them is what made the first cut of this guard permissive:
//
//   OWN   — the target's own tap box, measured with every other tap target
//           neutralised (`pointer-events: none`), so no neighbour can clip it.
//           This is the exact size of the thing the CSS builds.
//   LIVE  — the same walk with the page untouched: how much the target actually
//           owns once neighbours paint. A tightened gap or a shrunk floor lets
//           an adjacent ::before overlap and STEAL area; LIVE catches that.
//
// CALIBRATION (why the raw walk is not the answer). Chromium's hit test inflates
// every box's LOW edge by delta = 1 - 1/64 px ~ 0.984 px while leaving the high
// edge exact, so a raw walk over-reports a 44.00 px box as ~44.98 px — i.e. a
// 43.1 px target could read 44.0 and pass. The suite therefore measures delta at
// runtime against a synthetic control of known size and subtracts it from OWN,
// instead of hard-coding a browser quirk. OWN is then exact to ~0.02 px and the
// threshold sits 0.05 px below 44 — no room left for a sub-44 target to slip by.
// LIVE keeps the +delta inflation (a neighbour's inflated low edge cancels part
// of it), so it is compared as-is: its ~1 px resolution is far finer than the
// 10-25 px collapse a real overlap regression produces.
//
// One documented residue: when a target's expanded box sits flush against a
// viewport edge, the inflated margin falls off-screen and cannot be walked, so
// that target's OWN size is only pinned to within delta. Those rows are marked
// `~` in the output instead of being silently rounded either way.
//
// Three independent failure modes are guarded, because a green measurement is
// only worth something if the suite cannot pass vacuously:
//   1. THRESHOLD — every target reaches 44 px in both axes, OWN and LIVE.
//   2. COUNT     — every page asserts how many targets it expects per selector,
//                  so a typo'd or stale selector matching nothing turns the page
//                  RED instead of passing while measuring nothing.
//   3. COVERAGE  — every page re-derives, from the live DOM, the full set of
//                  interactive elements carrying an expanding ::before, and fails
//                  if any of them falls outside the measured selectors. A future
//                  component cannot silently add a tap target the guard ignores.
//
// And the guard is PROVEN to fire: `RED self-test` injects a synthetic bad-CSS
// regression and asserts the SAME measurement path reports a sub-44 target.
// =============================================================================

const MIN = 44;
const STEP = 0.5; // coarse walk step (px)
const FINE = 0.01; // binary-refinement precision per boundary (px)
const CAP = 200; // max walk distance per direction (px); far exceeds any real target
// Each of an axis's two boundaries is approached from inside, so a reading is
// short by at most FINE per side. The tolerance covers that (0.02) plus render
// jitter, and nothing more: a target at 43.9 px is a FAILURE, not a rounding win.
const TOL = 0.05;
const THRESHOLD = MIN - TOL; // 43.95
// Sanity bounds for the runtime-measured hit-test inflation. Chromium reports
// ~0.984; anything outside this range means the calibration itself is broken and
// no measurement derived from it can be trusted.
const DELTA_MAX = 2;

const HOME_PATHS = ['/', '/pt'];
const NOW_PATHS = ['/now', '/pt/now'];
const USES_PATHS = ['/uses', '/pt/uses'];
const COLOPHON_PATHS = ['/colophon', '/pt/colophon'];
const ALL_PATHS = [...HOME_PATHS, ...NOW_PATHS, ...USES_PATHS, ...COLOPHON_PATHS];

// A group of targets sharing a selector.
//   `min`   — how many VISIBLE elements this page must have. Fewer = RED (the
//             anti-vacuous-green assertion). More is allowed: content can grow,
//             and every extra element is measured like the rest.
//   `where` — 'top' pins the viewport to the document top (the header is
//             `position: sticky`, so its targets are only ever measured in their
//             real resting place); 'flow' scrolls each target to the middle of
//             the viewport, clear of the sticky header.
interface Group {
  sel: string;
  min: number;
  where: 'top' | 'flow';
}

const FOOT_NAV: Group = { sel: '.foot-nav a', min: 5, where: 'flow' };
const BACK: Group = { sel: '.back', min: 1, where: 'flow' };

// The header nav renders a different element on the homepage (in-page anchors)
// than on the secondary pages (cross-page links).
//
// NOTE on the homepage count: `@media (max-width: 560px)` in VariantB hides the
// "Method" and "Contact" anchors, so at 320 px the homepage nav shows exactly
// two links plus the language toggle. The expected count encodes that on
// purpose; `homepage nav collapses to 2 links + toggle` below asserts the hide
// itself, so the two facts cannot drift apart silently.
function groupsFor(path: string): Group[] {
  const isHome = path === '/' || path === '/pt';
  if (isHome) {
    return [
      { sel: '.brand', min: 1, where: 'top' },
      { sel: 'header nav.nav > a', min: 3, where: 'top' },
      { sel: '.handle', min: 1, where: 'flow' },
      { sel: '.proj-link', min: 2, where: 'flow' },
      FOOT_NAV,
    ];
  }
  const head: Group[] = [
    { sel: '.brand', min: 1, where: 'top' },
    { sel: 'header nav.head-nav > a', min: 2, where: 'top' },
  ];
  if (USES_PATHS.includes(path)) {
    return [...head, { sel: '.entry-name a', min: 8, where: 'flow' }, BACK, FOOT_NAV];
  }
  if (COLOPHON_PATHS.includes(path)) {
    return [...head, { sel: '.sec-link', min: 2, where: 'flow' }, BACK, FOOT_NAV];
  }
  return [...head, BACK, FOOT_NAV];
}

interface Reach {
  d: number;
  clamped: boolean;
}
interface Measured {
  sel: string;
  label: string;
  ownW: number;
  ownH: number;
  liveW: number;
  liveH: number;
  rectH: number;
  centerOwned: boolean;
  // The target's expanded box sits flush against a viewport edge, so its OWN
  // size is only known to within `delta` (see `ownSpan`). Reported, never hidden.
  clamped: boolean;
}
interface Uncovered {
  tag: string;
  cls: string;
  label: string;
  before: string;
}
interface MeasureOut {
  results: Measured[];
  counts: Record<string, number>;
  uncovered: Uncovered[];
  delta: number;
  devToolbarSeen: boolean;
}

// In-page hit-test. Self-contained (only reads its cfg arg + browser globals) so
// it serialises cleanly into `page.evaluate`. Used by BOTH the green sweep and
// the RED self-test, so the proof exercises the real guard path.
//
// Scrolling happens INSIDE this function: `scroll-behavior` is forced to `auto`
// by `prep`, so every scroll lands synchronously and the very next layout read
// already reflects it. No timers, no polling, no swallowed waits.
const MEASURE_FN = (cfg: {
  groups: Group[];
  step: number;
  fine: number;
  cap: number;
  audit: boolean;
}): MeasureOut => {
  const { groups, step, fine, cap, audit } = cfg;
  // Remove the astro dev toolbar synchronously, right before hit-testing. It is
  // a fixed-position dev-only overlay (a custom element with a shadow root that
  // resists CSS hiding); a custom element cannot re-mount during this synchronous
  // block, so from here on it cannot appear in any hit stack. (`devToolbarSeen`
  // stays a tripwire in case a future overlay slips through.)
  document.querySelectorAll('astro-dev-toolbar').forEach((n) => n.remove());
  let devToolbarSeen = false;

  const visible = (el: Element): boolean =>
    typeof el.checkVisibility === 'function'
      ? el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })
      : getComputedStyle(el).display !== 'none';

  const top = (x: number, y: number): Element | null => {
    const t = document.elementsFromPoint(x, y)[0] || null;
    // Only flag the dev toolbar when it is the TOP of the stack — that is the
    // only case where it could STEAL a target's area and corrupt a measurement.
    if (t && (t.tagName || '').toLowerCase() === 'astro-dev-toolbar') devToolbarSeen = true;
    return t;
  };
  const owns = (el: Element, x: number, y: number): boolean => {
    if (x < 0 || y < 0 || x >= window.innerWidth || y >= window.innerHeight) return false;
    const t = top(x, y);
    return !!t && (t === el || el.contains(t));
  };
  const inside = (x: number, y: number): boolean =>
    x >= 0 && y >= 0 && x < window.innerWidth && y < window.innerHeight;
  // Distance from the centre, along (dx,dy), at which ownership ends: coarse
  // walk to bracket the boundary, then bisect to `fine`. `lo` is always an owned
  // point and `hi` an unowned one, so the result never exceeds the true boundary.
  // `clamped` records that the walk ran out of viewport rather than out of
  // ownership — the boundary is off-screen and was never actually observed.
  const reach = (el: Element, cx: number, cy: number, dx: number, dy: number): Reach => {
    let lo = 0;
    let d = step;
    while (d <= cap && owns(el, cx + dx * d, cy + dy * d)) {
      lo = d;
      d += step;
    }
    let hi = Math.min(lo + step, cap);
    while (hi - lo > fine) {
      const mid = (lo + hi) / 2;
      if (owns(el, cx + dx * mid, cy + dy * mid)) lo = mid;
      else hi = mid;
    }
    // `hi` is the first non-owned point. If it is off-screen, ownership did not
    // end there — the viewport did, and the real boundary is unobservable.
    return { d: lo, clamped: !inside(cx + dx * hi, cy + dy * hi) };
  };
  // Chromium inflates a box's LOW edge (the -x / -y side) by `delta` and leaves
  // the high edge exact, so an isolated target's own size is `low - delta + high`.
  // When the low walk was viewport-clamped, that inflated margin lies off-screen
  // and was never traversed: subtracting delta there would under-report a
  // compliant target, so the raw reach is kept and the axis is flagged.
  const ownSpan = (lowR: Reach, highR: Reach, delta: number) => ({
    v: lowR.d - (lowR.clamped ? 0 : delta) + highR.d,
    clamped: lowR.clamped || highR.clamped,
  });
  const liveSpan = (el: Element, cx: number, cy: number): { w: number; h: number } => ({
    w: reach(el, cx, cy, -1, 0).d + reach(el, cx, cy, 1, 0).d,
    h: reach(el, cx, cy, 0, -1).d + reach(el, cx, cy, 0, 1).d,
  });

  // CALIBRATION — measure Chromium's hit-test inflation against a control box of
  // known size, so the correction is observed rather than assumed.
  const CTRL = 44;
  const host = document.createElement('div');
  host.style.cssText = `position:fixed;left:50%;top:50%;width:${CTRL}px;height:${CTRL}px;transform:translate(-50%,-50%);z-index:2147483000`;
  document.body.appendChild(host);
  const ctrlRect = host.getBoundingClientRect();
  const ctrl = liveSpan(host, ctrlRect.left + ctrlRect.width / 2, ctrlRect.top + ctrlRect.height / 2);
  host.remove();
  const delta = Math.round(((ctrl.w + ctrl.h) / 2 - CTRL) * 1000) / 1000;

  const round = (n: number) => Math.round(n * 100) / 100;
  const results: Measured[] = [];
  const counts: Record<string, number> = {};

  // Every tap target on the page, in one list: the isolation pass needs to
  // neutralise all of them but the one under measurement.
  const all: Element[] = [];
  for (const g of groups) {
    counts[g.sel] = 0;
    document.querySelectorAll(g.sel).forEach((el) => {
      // Elements hidden by a media query (the homepage nav collapses below
      // 560 px) are not tap targets and are not counted. Everything else is
      // measured — including an element that has collapsed to nothing, which
      // must surface as a violation rather than be quietly skipped.
      if (!visible(el)) return;
      counts[g.sel]++;
      if (!all.includes(el)) {
        all.push(el);
        results.push({
          sel: g.sel,
          label: ((el.textContent || '').replace(/\s+/g, ' ').trim() || el.getAttribute('aria-label') || '·').slice(0, 18),
          ownW: 0,
          ownH: 0,
          liveW: 0,
          liveH: 0,
          rectH: 0,
          centerOwned: false,
          clamped: false,
        });
      }
    });
  }

  all.forEach((el, i) => {
    const g = groups.find((gr) => el.matches(gr.sel));
    if (g && g.where === 'top') window.scrollTo(0, 0);
    else el.scrollIntoView({ block: 'center', inline: 'nearest' });

    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const r = results[i];
    r.rectH = round(rect.height);
    r.centerOwned = owns(el, cx, cy);
    if (!r.centerOwned) return;

    // LIVE — the page exactly as it renders.
    const live = liveSpan(el, cx, cy);
    r.liveW = round(live.w);
    r.liveH = round(live.h);

    // OWN — same walk with every other tap target unable to win the hit stack.
    // `pointer-events` is inherited, so neutralising the element also neutralises
    // its ::before, which is the thing that would otherwise clip this target.
    const muted = all.filter((o) => o !== el) as HTMLElement[];
    muted.forEach((o) => o.style.setProperty('pointer-events', 'none', 'important'));
    const w = ownSpan(reach(el, cx, cy, -1, 0), reach(el, cx, cy, 1, 0), delta);
    const h = ownSpan(reach(el, cx, cy, 0, -1), reach(el, cx, cy, 0, 1), delta);
    muted.forEach((o) => o.style.removeProperty('pointer-events'));
    r.ownW = round(w.v);
    r.ownH = round(h.v);
    r.clamped = w.clamped || h.clamped;
  });

  // COVERAGE AUDIT — re-derive the in-scope set from the live DOM instead of
  // trusting the selector list above, and report anything the list misses.
  const uncovered: Uncovered[] = [];
  if (audit) {
    const interactive = 'a,button,summary,input,select,textarea,[role="button"],[role="link"],[tabindex]';
    document.querySelectorAll(interactive).forEach((el) => {
      if (!visible(el)) return;
      const b = getComputedStyle(el, '::before');
      const w = parseFloat(b.width) || 0;
      const h = parseFloat(b.height) || 0;
      // "Expanding ::before" = an absolutely-positioned pseudo-element sized to
      // at least ~44 px in some axis. That is the tap-area idiom this repo uses.
      if (b.content === 'none' || b.position !== 'absolute' || (w < 40 && h < 40)) return;
      if (groups.some((g) => el.matches(g.sel))) return;
      uncovered.push({
        tag: el.tagName.toLowerCase(),
        cls: typeof el.className === 'string' ? el.className : '',
        label: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 24),
        before: `${w.toFixed(1)}x${h.toFixed(1)}`,
      });
    });
  }

  return { results, counts, uncovered, delta, devToolbarSeen };
};

async function prep(page: Page, path: string): Promise<void> {
  await page.goto(path, { waitUntil: 'load' });
  // Hide the astro dev toolbar (fixed at viewport bottom; dev-only chrome, absent
  // in prod) so it never occludes anything during hit-testing, and force instant
  // scrolling — the site uses smooth scroll, which would leave targets mid-flight
  // when the measurement scrolls them into view.
  // Three things must be neutralised before a single point is hit-tested:
  //   - the astro dev toolbar (fixed at the viewport bottom; dev-only chrome,
  //     absent in prod) so it never occludes a target;
  //   - smooth scrolling, which would leave targets mid-flight when the
  //     measurement scrolls them into view;
  //   - the entrance reveal. `.reveal` elements start at `opacity: 0` and are
  //     un-hidden by an IntersectionObserver callback, so a measurement that
  //     wins the race sees them as invisible and skips them entirely — the exact
  //     vacuous-green failure this suite guards against (it is what hid `.handle`
  //     and `.proj-link` from the first cut of this guard). This pins them to the
  //     END state, byte-for-byte the same declarations the site itself applies
  //     under `prefers-reduced-motion: reduce`, so no geometry changes.
  await page.addStyleTag({
    content:
      'astro-dev-toolbar{display:none !important;pointer-events:none !important}' +
      'html{scroll-behavior:auto !important}' +
      '.reveal{opacity:1 !important;transform:none !important;transition:none !important}',
  });
  // No ENTRANCE animation may still be running when the walk starts. The config
  // asks for reduced motion, which disables them at the source; this asserts the
  // result rather than assuming it, and fails loudly (no `.catch`) if a future
  // animation escapes the reduced-motion path. Endlessly looping decoration (the
  // status-dot pulse, the caret blink) is excluded by definition: it never
  // settles, and it decorates no tap target.
  await page.waitForFunction(
    () =>
      document.getAnimations().every((a) => {
        const timing = a.effect?.getTiming();
        return timing?.iterations === Infinity || a.playState !== 'running';
      }),
    undefined,
    { timeout: 5000 },
  );
}

async function measure(page: Page, groups: Group[], audit = false): Promise<MeasureOut> {
  const out = await page.evaluate(MEASURE_FN, { groups, step: STEP, fine: FINE, cap: CAP, audit });
  expect(out.devToolbarSeen, 'dev toolbar must never be in the hit stack').toBe(false);
  expect(out.delta, `hit-test calibration out of range (delta=${out.delta})`).toBeGreaterThanOrEqual(0);
  expect(out.delta, `hit-test calibration out of range (delta=${out.delta})`).toBeLessThan(DELTA_MAX);
  return out;
}

// Astro's dev server can fire a one-time Vite full reload on a route's very
// first browser load (SSR dep pre-bundle), destroying the execution context
// mid-measurement. Global setup warms every route to avoid it; this is the
// belt-and-suspenders retry in case a cold run still races. Only that one error
// is retried — every other failure propagates immediately.
async function withNavRetry<T>(fn: () => Promise<T>): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < 3; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      if (/Execution context was destroyed|because of a navigation/i.test(String(e))) continue;
      throw e;
    }
  }
  throw lastErr;
}

function violations(results: Measured[]): Measured[] {
  return results.filter(
    (r) =>
      !r.centerOwned ||
      r.ownW < THRESHOLD ||
      r.ownH < THRESHOLD ||
      r.liveW < THRESHOLD ||
      r.liveH < THRESHOLD,
  );
}

function brief(rows: Measured[]): string {
  return JSON.stringify(
    rows.map((r) => ({ l: r.label, own: `${r.ownW}x${r.ownH}`, live: `${r.liveW}x${r.liveH}`, owned: r.centerOwned })),
  );
}

function table(path: string, results: Measured[], delta: number): string {
  const rows = results.map(
    (r) =>
      `  ${(r.label + ' '.repeat(18)).slice(0, 18)} own ${r.ownW.toFixed(2).padStart(6)}w x ${r.ownH
        .toFixed(2)
        .padStart(6)}h   live ${r.liveW.toFixed(2).padStart(6)}w x ${r.liveH
        .toFixed(2)
        .padStart(6)}h  ${r.clamped ? '~' : ' '} [${r.sel}]`,
  );
  const mins = [
    Math.min(...results.map((r) => r.ownW)),
    Math.min(...results.map((r) => r.ownH)),
    Math.min(...results.map((r) => r.liveW)),
    Math.min(...results.map((r) => r.liveH)),
  ];
  const edge = results.filter((r) => r.clamped).map((r) => r.label);
  return (
    `${path}  (${results.length} targets, hit-test delta ${delta.toFixed(3)}px)\n${rows.join('\n')}\n` +
    `  -> min own ${mins[0].toFixed(2)}w / ${mins[1].toFixed(2)}h   min live ${mins[2].toFixed(2)}w / ${mins[3].toFixed(2)}h` +
    (edge.length ? `\n  ~ viewport-flush (own known to +-delta): ${edge.join(', ')}` : '')
  );
}

// ---------------------------------------------------------------------------
// GREEN sweep: every in-scope target >= 44x44 effective, both locales.
// ---------------------------------------------------------------------------
for (const path of ALL_PATHS) {
  test(`touch targets >= 44x44 @ 320x568 — ${path}`, async ({ page }) => {
    const groups = groupsFor(path);
    const { results, counts, uncovered, delta } = await withNavRetry(async () => {
      await prep(page, path);
      return measure(page, groups, true);
    });

    console.log('\n' + table(path, results, delta));

    // (2) COUNT — no page may pass while measuring nothing.
    for (const g of groups) {
      expect(counts[g.sel], `visible targets matching "${g.sel}" on ${path}`).toBeGreaterThanOrEqual(g.min);
    }

    // (3) COVERAGE — nothing tap-expanded may live outside the measured set.
    expect(uncovered, `tap-expanded targets on ${path} not covered by the guard: ${JSON.stringify(uncovered)}`).toEqual(
      [],
    );

    // METHOD sanity: the ::before is what makes these targets tappable, so every
    // one of them must own materially more height than its own text box. If a
    // target ever read back its bare box, the ownership walk failed to capture
    // the pseudo-element — a measurement bug, which must not masquerade as a
    // pass (nor as a UI regression).
    const unexpanded = results.filter((r) => r.centerOwned && r.ownH <= r.rectH + 1);
    expect(unexpanded, `::before expansion not captured on ${path} (method bug): ${brief(unexpanded)}`).toEqual([]);

    // (1) THRESHOLD.
    const bad = violations(results);
    expect(bad, `sub-44 targets on ${path}: ${brief(bad)}`).toEqual([]);
  });
}

// ---------------------------------------------------------------------------
// The 320 px homepage nav invariant (VariantB hides Method + Contact below
// 560 px). Asserted explicitly so the expected nav count above can never drift
// away from the media query that justifies it.
// ---------------------------------------------------------------------------
test('homepage nav collapses to 2 links + toggle at 320px', async ({ page }) => {
  for (const path of HOME_PATHS) {
    const seen = await withNavRetry(async () => {
      await prep(page, path);
      return page.evaluate(() => {
        const links = [...document.querySelectorAll('header nav.nav > a')];
        const shown = links.filter((a) => a.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }));
        return {
          total: links.length,
          shown: shown.length,
          toggles: shown.filter((a) => a.classList.contains('lang')).length,
        };
      });
    });
    console.log(`\n[nav] ${path}: ${seen.shown}/${seen.total} links visible, ${seen.toggles} language toggle`);
    expect(seen.total, `${path} declares the full nav in markup`).toBe(5);
    expect(seen.shown, `${path} shows only 2 nav links + toggle at 320px`).toBe(3);
    expect(seen.toggles, `${path} keeps the language toggle at 320px`).toBe(1);
  }
});

// ---------------------------------------------------------------------------
// RED self-test: prove the guard fires. Two synthetic regressions, one per
// failure mode, asserted through the SAME measurement path as the green sweep:
//   - a tightened footer row-gap (the documented #1 vector) lets the ::before
//     boxes of wrapped rows overlap and steal area  -> caught by LIVE;
//   - a shrunk ::before floor makes the target itself too small -> caught by OWN,
//     which no amount of neighbour clearance can hide.
// ---------------------------------------------------------------------------
test('RED self-test: synthetic regressions are detected by the guard', async ({ page }) => {
  const foot = [FOOT_NAV];

  const base = await withNavRetry(async () => {
    await prep(page, '/');
    return measure(page, foot);
  });
  expect(violations(base.results), 'footer is green before perturbation').toEqual([]);
  console.log('\n[RED] baseline:\n' + table('/ (footer)', base.results, base.delta));

  // Vector 1 — neighbour theft.
  await page.addStyleTag({ content: '.foot-nav{row-gap:0.1rem !important}' });
  const stolen = await measure(page, foot);
  const firedLive = stolen.results.filter((r) => !r.centerOwned || r.liveH < THRESHOLD || r.liveW < THRESHOLD);
  console.log(
    '\n[RED] vector 1 — row-gap 1.65rem -> 0.1rem (neighbour theft):\n' +
      table('/ (footer)', stolen.results, stolen.delta) +
      `\n  -> LIVE violations: ${firedLive.length} ${brief(firedLive)}`,
  );
  expect(firedLive.length, 'LIVE must detect the synthetic overlap regression').toBeGreaterThan(0);

  // Vector 2 — the target itself shrinks. Reload first so vector 1 is gone.
  const shrunk = await withNavRetry(async () => {
    await prep(page, '/');
    await page.addStyleTag({ content: '.foot-nav a::before{height:30px !important;width:30px !important}' });
    return measure(page, foot);
  });
  const firedOwn = shrunk.results.filter((r) => r.ownH < THRESHOLD || r.ownW < THRESHOLD);
  console.log(
    '\n[RED] vector 2 — ::before 44px -> 30px (target shrunk):\n' +
      table('/ (footer)', shrunk.results, shrunk.delta) +
      `\n  -> OWN violations: ${firedOwn.length} ${brief(firedOwn)}`,
  );
  expect(firedOwn.length, 'OWN must detect the synthetic shrink regression').toBeGreaterThan(0);

  // Revert: a fresh load drops the injected <style>; footer must be green again.
  const restored = await withNavRetry(async () => {
    await prep(page, '/');
    return measure(page, foot);
  });
  expect(violations(restored.results), 'footer green again after revert').toEqual([]);
  console.log('\n[RED] reverted -> ' + table('/ (footer)', restored.results, restored.delta));
});
