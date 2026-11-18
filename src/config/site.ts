/** The facts of the site - one place, not in the markup. Addresses - from the environment (.env.example). */
import {
  PUBLIC_BOOSTY_URL,
  PUBLIC_GITHUB_APP_URL,
  PUBLIC_GITHUB_CORE_URL,
  PUBLIC_OBTAINIUM_URL,
  PUBLIC_TELEGRAM_URL,
} from 'astro:env/client';
import { APP_NAME } from './brand';

/** `owner/repo` of a repository URL on GitHub. */
function repoOf(url: string): string {
  const [owner, repo] = new URL(url).pathname.split('/').filter(Boolean);
  if (!owner || !repo) throw new Error(`site: not a repository URL - ${url}`);
  return `${owner}/${repo}`;
}

export const SITE = {
  /** The name of the app - a brand, not translated (./brand.ts). */
  name: APP_NAME,
  /** The public repository of the app (not of the core). */
  githubAppUrl: PUBLIC_GITHUB_APP_URL,
  /** The same - `owner/repo`: the API, `gh attestation verify -R`. */
  githubAppRepo: repoOf(PUBLIC_GITHUB_APP_URL),
  /** Where bugs are reported - the issues of the app repository. */
  issuesUrl: `${PUBLIC_GITHUB_APP_URL}/issues`,
  /** The public repository of the core - the KDBX engine. */
  githubCoreUrl: PUBLIC_GITHUB_CORE_URL,
  /** The group in Telegram - optional; without it its card is not shown. */
  telegramUrl: PUBLIC_TELEGRAM_URL,
  /** The donation page on Boosty - optional; without it the donations page shows «soon» instead of the button. */
  boostyUrl: PUBLIC_BOOSTY_URL,
  /** Obtainium - updates of the APK from GitHub Releases; the site of the app. */
  obtainiumUrl: PUBLIC_OBTAINIUM_URL,
  /** Opens Obtainium on the phone with the app repository to add (its link `obtainium://add/<url>`). */
  obtainiumAddUrl: `obtainium://add/${PUBLIC_GITHUB_APP_URL}`,
  license: 'GPL-3.0',
} as const;
