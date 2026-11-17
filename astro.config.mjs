import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import { SITE_URL } from './site.config.mjs';

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  adapter: vercel(),
  trailingSlash: 'never',
  devToolbar: {
    enabled: false,
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/api/'),
    }),
  ],
  compressHTML: true,
});
