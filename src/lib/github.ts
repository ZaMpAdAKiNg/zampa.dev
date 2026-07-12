// =============================================================================
// zampa.dev — BUILD-TIME GitHub signal
// -----------------------------------------------------------------------------
// Runs server-side only (build time, or on-demand when a page sets
// `prerender = false`). NEVER call this from a client component — call it in a
// page's frontmatter and pass the result down via props. The call is memoized:
// N pages = 1 fetch, which also respects the unauthenticated 60 req/h rate cap.
//
// It fetches PUBLIC REST metrics (account age, public repo count, recent event
// activity). The contribution graph needs GraphQL + a token, so we intentionally
// DO NOT fetch it — this is a graceful degradation to REST-only signal.
//
// If the API fails or times out (Vercel's shared build IP can hit the 60 req/h
// limit and return 403), we fall back to real values captured at authoring time
// instead of throwing — a throw here would fail the whole `astro build`.
// =============================================================================

export interface GithubData {
  handle: string;
  profileUrl: string;
  /** ISO timestamp of account creation. */
  createdAt: string;
  /** Whole/one-decimal years since createdAt, computed at run time. */
  accountAgeYears: number;
  publicRepos: number;
  followers: number;
  /** Count of recent public events (activity proxy; window ≤ 100). */
  recentEventCount: number;
  /** ISO timestamp of the most recent public event, or null. */
  lastActiveAt: string | null;
  /** Source of the data: live REST call vs the hardcoded fallback. */
  source: 'rest' | 'fallback';
  /** true when the fallback was used (i.e. the live REST call failed). */
  degraded: boolean;
  /** Always false — the contribution graph (GraphQL) is never fetched. */
  includesContributionGraph: false;
}

const HANDLE = 'ZaMpAdAKiNg';

function yearsSince(iso: string): number {
  const ms = Date.now() - new Date(iso).getTime();
  const years = ms / (365.25 * 24 * 60 * 60 * 1000);
  return Math.max(0, Math.round(years * 10) / 10);
}

// Real values captured 2026-07-11 from the public REST API. Fallback only.
const FALLBACK_CREATED_AT = '2022-12-01T22:01:41Z';

function fallback(): GithubData {
  return {
    handle: HANDLE,
    profileUrl: `https://github.com/${HANDLE}`,
    createdAt: FALLBACK_CREATED_AT,
    accountAgeYears: yearsSince(FALLBACK_CREATED_AT),
    publicRepos: 7,
    followers: 4,
    recentEventCount: 32,
    lastActiveAt: '2026-07-09T04:46:10Z',
    source: 'fallback',
    degraded: true,
    includesContributionGraph: false,
  };
}

async function fetchJson(url: string, signal: AbortSignal): Promise<any> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'zampa.dev-build',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  const token = import.meta.env.GITHUB_TOKEN ?? process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { signal, headers });
  if (!res.ok) throw new Error(`GitHub ${res.status} for ${url}`);
  return res.json();
}

async function load(): Promise<GithubData> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const [user, events] = await Promise.all([
      fetchJson(`https://api.github.com/users/${HANDLE}`, controller.signal),
      fetchJson(
        `https://api.github.com/users/${HANDLE}/events/public?per_page=100`,
        controller.signal,
      ),
    ]);
    const evs = Array.isArray(events) ? events : [];
    const createdAt: string = user?.created_at ?? FALLBACK_CREATED_AT;
    return {
      handle: user?.login ?? HANDLE,
      profileUrl: user?.html_url ?? `https://github.com/${HANDLE}`,
      createdAt,
      accountAgeYears: yearsSince(createdAt),
      publicRepos: typeof user?.public_repos === 'number' ? user.public_repos : 7,
      followers: typeof user?.followers === 'number' ? user.followers : 4,
      recentEventCount: evs.length,
      lastActiveAt: evs[0]?.created_at ?? null,
      source: 'rest',
      degraded: false,
      includesContributionGraph: false,
    };
  } catch {
    return fallback();
  } finally {
    clearTimeout(timer);
  }
}

let cached: Promise<GithubData> | null = null;

/**
 * Memoized build-time GitHub signal. Call once per page in the frontmatter:
 *   const githubData = await getGithubData();
 * then pass `githubData` down via props. Do NOT refetch in child components.
 */
export function getGithubData(): Promise<GithubData> {
  if (!cached) cached = load();
  return cached;
}
