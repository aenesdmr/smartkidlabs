// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import keystatic from '@keystatic/astro';
import sitemap from '@astrojs/sitemap';

const isDev = process.env.NODE_ENV === 'development' || process.argv.includes('dev');

// https://astro.build/config
export default defineConfig({
  site: 'https://smartkidlabs.com',
  output: 'static',
  integrations: [
    sitemap(),
    ...(isDev ? [keystatic()] : [])
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});