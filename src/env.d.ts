/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  /** Optional. Only raises the GitHub REST rate limit; the contribution graph
   *  still needs GraphQL and is intentionally never fetched. Safe to omit. */
  readonly GITHUB_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
