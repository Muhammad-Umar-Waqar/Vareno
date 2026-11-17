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
      filter: (page) =>
        !page.includes('/api/') &&
        !page.includes('/404') &&
        !page.endsWith('/robots.txt') &&
        !page.endsWith('/llms.txt') &&
        !page.endsWith('/rss.xml'),
      serialize(item) {
        const url = item.url.replace(/\/$/, '');
        const root = SITE_URL.replace(/\/$/, '');
        if (url === root || url === `${root}/`) {
          item.priority = 1.0;
          item.changefreq = 'daily';
        } else if (
          url.includes('/release-date') ||
          url.includes('/tricks') ||
          url.includes('/price') ||
          url.includes('/map') ||
          url.includes('/platforms') ||
          url.includes('/trailers')
        ) {
          item.priority = 0.9;
          item.changefreq = 'daily';
        } else if (url.includes('/characters/') || url.includes('/blog')) {
          item.priority = 0.8;
          item.changefreq = 'weekly';
        } else if (url.includes('/tools/')) {
          item.priority = 0.7;
          item.changefreq = 'monthly';
        } else {
          item.priority = 0.5;
          item.changefreq = 'monthly';
        }
        item.lastmod = new Date();
        return item;
      },
    }),
  ],
  compressHTML: true,
});
