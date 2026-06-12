// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import keystatic from '@keystatic/astro';

const isDev = process.env.NODE_ENV === 'development' || process.argv.includes('dev');

// https://astro.build/config
export default defineConfig({
  output: 'static',
  integrations: [
    ...(isDev ? [keystatic()] : [])
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});