import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// zampa.dev — foundation config.
// - Static by default. Pages that consume the build-time GitHub signal opt into
//   on-demand rendering with `export const prerender = false`; ISR (below) then
//   re-generates them at most once per day so the signal stays fresh WITHOUT any
//   client-side calls. See src/lib/github.ts.
// - i18n: EN at the root, PT under /pt. `Astro.currentLocale` resolves the active
//   locale; the getLang()/useContent() helpers in src/lib/i18n.ts wrap it.
export default defineConfig({
  site: 'https://zampa.dev',
  adapter: vercel({
    isr: {
      // Re-validate on-demand routes at most once every 24h.
      expiration: 60 * 60 * 24,
    },
  }),
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      // Emit reciprocal <xhtml:link hreflang> entries so the sitemap mirrors the
      // per-page alternates. Excludes the 301 redirect stubs automatically.
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', pt: 'pt-BR' },
      },
    }),
  ],
  // Old design-review routes (chooser + variant A/B split) collapsed into the
  // homepage. 301 so any links/crawls already pointing at them consolidate.
  redirects: {
    '/a': { status: 301, destination: '/' },
    '/b': { status: 301, destination: '/' },
    '/pt/a': { status: 301, destination: '/pt' },
    '/pt/b': { status: 301, destination: '/pt' },
  },
});
