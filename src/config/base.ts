/**
 * The prefix of the site (`base` in astro.config.mjs): the site may live under a path (GitHub Pages -
 * `/kdbxvault/`), so every own link and file of `public/` goes through `withBase`.
 */
const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '');

/** `path` from the root of the site (`/`, `/donate`, `/#download`) - with the prefix of the site. */
export function withBase(path: string): string {
  return `${BASE}${path.startsWith('/') ? path : `/${path}`}`;
}
