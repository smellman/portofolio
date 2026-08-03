// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // Cloudflare Pages (custom domain): https://portofolio.smellman.org/
  // ルート配信なので base は不要(= '/')。
  site: 'https://portofolio.smellman.org',
  trailingSlash: 'ignore',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
