/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly PUBLIC_UMAMI_WEBSITE_ID?: string;
  /** Optional. Only raises the GitHub REST rate limit; the contribution graph
   *  still needs GraphQL and is intentionally never fetched. Safe to omit. */
  readonly GITHUB_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
