// @ts-check
import { defineConfig, envField } from 'astro/config';
import icon from 'astro-icon';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://bigtoestdev.github.io',
  base: '/kdbxvault',
  integrations: [icon()],
  // The settings of the site - from `.env` (sample: .env.example) or the environment of CI; checked at build time.
  env: {
    schema: {
      PUBLIC_GITHUB_APP_URL: envField.string({
        context: 'client',
        access: 'public',
        url: true,
        startsWith: 'https://github.com/',
      }),
      PUBLIC_GITHUB_CORE_URL: envField.string({
        context: 'client',
        access: 'public',
        url: true,
        startsWith: 'https://github.com/',
      }),
      // Optional: without it the card of the group is not shown
      PUBLIC_TELEGRAM_URL: envField.string({
        context: 'client',
        access: 'public',
        url: true,
        startsWith: 'https://t.me/',
        optional: true,
      }),
      // The API of GitHub and its raw files - the releases and the changelog of the app at build time; not in
      // the pages.
      GH_API_URL: envField.string({
        context: 'server',
        access: 'public',
        url: true,
        startsWith: 'https://',
      }),
      GH_RAW_URL: envField.string({
        context: 'server',
        access: 'public',
        url: true,
        startsWith: 'https://',
      }),
      // Optional: the token of GitHub for the releases at build time (CI - the token of the run); without it the
      // API gives 60 requests an hour. Never in the pages.
      GITHUB_TOKEN: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
