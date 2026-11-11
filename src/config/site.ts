/** The facts of the site - one place, not in the markup. Addresses - from the environment (.env.example). */
import {
  PUBLIC_GITHUB_APP_URL,
  PUBLIC_GITHUB_CORE_URL,
  PUBLIC_TELEGRAM_URL,
} from 'astro:env/client';

export const SITE = {
  /** The name of the app (pass-docs: docs/policy/naming-and-license.md) - a brand, not translated. */
  name: 'KDBX Vault',
  /** The public repository of the app (not of the core). */
  githubAppUrl: PUBLIC_GITHUB_APP_URL,
  /** Where bugs are reported - the issues of the app repository. */
  issuesUrl: `${PUBLIC_GITHUB_APP_URL}/issues`,
  /** The public repository of the core - the KDBX engine. */
  githubCoreUrl: PUBLIC_GITHUB_CORE_URL,
  /** The group in Telegram - optional; without it its card is not shown. */
  telegramUrl: PUBLIC_TELEGRAM_URL,
  license: 'GPL-3.0',
} as const;
