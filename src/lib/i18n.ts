// =============================================================================
// zampa.dev — i18n helper
// -----------------------------------------------------------------------------
// Route map (routing.prefixDefaultLocale = false):
//   EN (default)   PT
//   /              /pt
//   /now           /pt/now
//   /a             /pt/a       (owned by variant worker A)
//   /b             /pt/b       (owned by variant worker B)
//
// A page resolves its language + localized content in ONE call:
//   import { useContent } from '../lib/i18n';
//   const { lang, t } = useContent(Astro);   // lang: Lang, t: SiteContent
// Then build internal links with localizeHref(path, lang).
// =============================================================================

import { content, type Lang, type SiteContent } from '../data/content';

export const LANGS: readonly Lang[] = ['en', 'pt'] as const;
export const DEFAULT_LANG: Lang = 'en';

/** Minimal shape of the Astro global we read — keeps the helper testable. */
interface AstroLike {
  currentLocale?: string;
}

/** Resolve the active language from the Astro page context. */
export function getLang(astro: AstroLike): Lang {
  return astro.currentLocale === 'pt' ? 'pt' : 'en';
}

/** Get the active language AND its localized content in one call. */
export function useContent(astro: AstroLike): { lang: Lang; t: SiteContent } {
  const lang = getLang(astro);
  return { lang, t: content[lang] };
}

/** The other language, for a toggle. */
export function otherLang(lang: Lang): Lang {
  return lang === 'en' ? 'pt' : 'en';
}

/**
 * Localize an internal path for a language.
 *   localizeHref('/now', 'pt') -> '/pt/now'
 *   localizeHref('/now', 'en') -> '/now'
 *   localizeHref('/', 'pt')    -> '/pt'
 * Absolute URLs (http...) and in-page anchors (#...) pass through untouched.
 */
export function localizeHref(path: string, lang: Lang): string {
  if (/^(https?:)?\/\//.test(path) || path.startsWith('#') || path.startsWith('mailto:')) {
    return path;
  }
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (lang === 'en') return clean;
  return clean === '/' ? '/pt' : `/pt${clean}`;
}

/**
 * Given the CURRENT path and current lang, produce the href of the same page in
 * the other language — for the language toggle.
 *   switchLangHref('/now', 'en') -> '/pt/now'
 *   switchLangHref('/pt/now', 'pt') -> '/now'
 */
export function switchLangHref(currentPath: string, lang: Lang): string {
  const stripped = currentPath.replace(/^\/pt(\/|$)/, '/').replace(/\/$/, '') || '/';
  return localizeHref(stripped, otherLang(lang));
}
