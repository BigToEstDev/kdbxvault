/** The facts of the site - one place, not in the markup. Addresses - from the environment (.env.example). */
import { PUBLIC_GITHUB_APP_URL } from 'astro:env/client';

export const SITE = {
  /** The name of the app (pass-docs: docs/policy/naming-and-license.md) - a brand, not translated. */
  name: 'KDBX Vault',
  /** The public repository of the app (not of the core). */
  githubAppUrl: PUBLIC_GITHUB_APP_URL,
} as const;
