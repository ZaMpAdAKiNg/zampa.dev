# zampa.dev

Personal site of **ZaMpA** — solo developer, orchestrating agents.

Live at [zampa.dev](https://zampa.dev) · [/pt](https://zampa.dev/pt) em português.

## Stack

- [Astro 7](https://astro.build) — static by default; routes that consume the
  build-time GitHub signal opt into on-demand rendering with ISR (24h) via
  [`@astrojs/vercel`](https://docs.astro.build/en/guides/integrations-guide/vercel/).
- Bilingual EN/PT — EN at the root, PT under `/pt`, single source of truth for
  copy in `src/data/content.ts`.
- Zero client-side JS for content. The GitHub activity signal is fetched
  server-side at render time (`src/lib/github.ts`) — no tokens, public API only.

## Develop

```sh
npm install
npm run dev      # local dev server
npm run build    # production build
npm run check    # astro check (types)
```

Deploys go through Vercel. `vercel.json` carries host-level redirects
(e.g. `x.zampa.dev` → the bird site).

## Content policy

This repository is part of a public identity. Everything in it — files,
history, issues, commit messages — is treated as public, permanently.
See [`CLAUDE.md`](CLAUDE.md) for the standing content rules that apply
to every commit, past, present and future.
