// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Statična stran za Cloudflare Pages. Kontaktni obrazec teče kot
// Cloudflare Pages Function (mapa /functions), zato adapter ni potreben.
export default defineConfig({
  site: 'https://sitecraftstudio.si',
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
  prefetch: false,
});
