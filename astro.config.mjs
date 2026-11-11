// @ts-check
import { defineConfig, envField } from 'astro/config';
import icon from 'astro-icon';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'static',
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
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
