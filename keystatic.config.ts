import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  collections: {
    blog: collection({
      label: 'Blog Posts',
      slugField: 'title',
      path: 'src/content/blog/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({
          label: 'Description',
          validation: { length: { min: 50, max: 200 } }
        }),
        pubDate: fields.date({
          label: 'Publish Date',
          defaultValue: { kind: 'today' }
        }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Google Ads', value: 'google-ads' },
            { label: 'Meta Ads', value: 'meta-ads' },
            { label: 'SEO & GEO', value: 'seo-geo' },
            { label: 'Digital Marketing & Growth', value: 'digital-marketing-growth' },
            { label: 'Tech & Marketing News', value: 'tech-marketing-news' },
            { label: 'Troubleshooting & Guides', value: 'troubleshooting-guides' }
          ],
          defaultValue: 'google-ads',
        }),
        author: fields.text({ label: 'Author', defaultValue: 'Smartkid Labs' }),
        draft: fields.checkbox({ label: 'Draft', defaultValue: false }),
        content: fields.document({
          label: 'Content',
          formatting: true,
          dividers: true,
          links: true,
          images: {
            directory: 'public/images/blog',
            publicPath: '/images/blog/',
          },
        }),
      },
    }),
  },
});
