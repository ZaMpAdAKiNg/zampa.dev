# zampa.dev — standing rules

## Identity & privacy contract (retroactive, present, future)

This repo belongs to the **ZaMpA** public identity. It is treated as public —
even while the GitHub repo is private — because it can be opened at any time
and history is permanent.

**Never commit, in any form (files, commit messages, branch names, issues,
PRs, comments, wiki, releases, CI logs):**

- Legal/real names, or any identity other than ZaMpA.
- Names of employers, clients, or non-public projects. The only projects that
  may appear are ZaMpA's public ones (the ones already linked on the site).
- Personal contact details: e-mail addresses, phone numbers, physical
  addresses, government IDs.
- Local filesystem paths (macOS/Windows home-directory paths), machine names,
  internal hostnames.
- Credentials of any kind: tokens, API keys, `.env` contents, session cookies.
- Screenshots, QA reports, scratchpads, or harness/session state — these stay
  local and gitignored (`qa-report*.md`, `scratchpad-evidence.md`,
  `.remember/`, `.overclock-app/`).

**Retroactive:** the full history (all commits, all refs) was audited clean on
2026-07-12. If a violation is ever found in history, rewrite history to remove
it *before* the next push — do not just delete the file in a new commit.

**Present:** before every commit, review the staged diff against the list
above. A local pre-commit hook enforces a denylist; do not bypass it
(`--no-verify`) without a human decision.

**Future:** this rule applies to every future contribution, human or agent.
When in doubt whether something identifies the author beyond the ZaMpA
identity, leave it out and ask.

## Working notes

- Copy lives in `src/data/content.ts` (single source of truth, EN + PT).
- Deploys: automatic — every push to `master` triggers a Vercel production
  deploy (Git integration). Manual fallback: `vercel build --prod && vercel
  deploy --prebuilt --prod`.
- `vercel.json` holds host-based redirects (`x.zampa.dev` → X profile);
  Astro `redirects` in `astro.config.mjs` hold path-based ones.
