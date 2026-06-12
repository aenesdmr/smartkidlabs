import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    category: z.enum([
      'google-ads',
      'meta-ads',
      'seo-geo',
      'digital-marketing-growth',
      'tech-marketing-news',
      'troubleshooting-guides'
    ]),
    author: z.string().default('Smartkid Labs'),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
