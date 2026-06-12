import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import Parser from 'rss-parser';
import dotenv from 'dotenv';

dotenv.config();

const parser = new Parser();

// RSS Feeds to scrape
const FEEDS = [
  { name: 'Search Engine Land', url: 'https://searchengineland.com/feed' },
  { name: 'Search Engine Journal', url: 'https://www.searchenginejournal.com/feed' },
  { name: 'TechCrunch', url: 'https://techcrunch.com/feed' },
  { name: 'Google Product News', url: 'https://blog.google/products/ads-commerce/rss/' }
];

// Helper to convert title to slug
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function getRecentArticles() {
  const articles = [];
  console.log('Scraping RSS feeds...');
  for (const feed of FEEDS) {
    try {
      const parsed = await parser.parseURL(feed.url);
      console.log(`Successfully parsed ${feed.name}: ${parsed.items.length} items found.`);
      for (const item of parsed.items) {
        articles.push({
          title: item.title,
          link: item.link,
          pubDate: new Date(item.pubDate || item.date || Date.now()),
          source: feed.name
        });
      }
    } catch (error) {
      console.error(`Error scraping ${feed.name}:`, error.message);
    }
  }
  // Sort by date descending
  return articles.sort((a, b) => b.pubDate - a.pubDate);
}

async function generateContent(article) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('API key is missing! Please set GEMINI_API_KEY or OPENAI_API_KEY in .env file.');
  }

  const prompt = `You are an expert digital marketing strategist and content writer for Smartkid Labs, a knowledge base portal linked with the elite digital agency Smartkid.agency.
Your goal is to write a highly detailed, professional, and SEO-optimized blog post in Turkish based on the following recent news/topic:
Title: "${article.title}"
Source: "${article.source}"

Instructions:
1. Write a comprehensive, long-form guide or news analysis in Turkish. It should be at least 800-1200 words.
2. Structure the content beautifully with H2, H3 headings, lists, bold text, and direct advice. IMPORTANT: You MUST use literal newlines (\\n\\n) to separate paragraphs, headers, and list items. Ensure every heading is preceded and followed by a newline so it is parsed as markdown correctly.
3. Naturally integrate a reference, citation, or Call-to-Action (CTA) directing readers to Smartkid.agency for expert management (e.g. "Profesyonel Google & Meta reklam kampanyaları yönetimi ve SEO danışmanlığı için Smartkid.agency ekibiyle iletişime geçebilirsiniz.").
4. Categorize the post into exactly one of these slugs: google-ads, meta-ads, seo-geo, digital-marketing-growth, tech-marketing-news, troubleshooting-guides.
5. Create a catchy, Turkish SEO title (max 60 chars) and a compelling SEO meta description (120-150 chars).

You MUST respond with a JSON object in this exact schema:
{
  "title": "Turkish blog title",
  "description": "Turkish SEO meta description",
  "category": "selected-category-slug",
  "content": "Full markdown body of the post in Turkish (must contain \\n\\n between paragraphs and sections)"
}`;

  if (process.env.GEMINI_API_KEY) {
    console.log('Generating content using Gemini API...');
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          maxOutputTokens: 8192,
          thinkingConfig: {
            thinkingBudget: 0
          },
          responseSchema: {
            type: 'OBJECT',
            properties: {
              title: { type: 'STRING' },
              description: { type: 'STRING' },
              category: {
                type: 'STRING',
                enum: ['google-ads', 'meta-ads', 'seo-geo', 'digital-marketing-growth', 'tech-marketing-news', 'troubleshooting-guides']
              },
              content: { type: 'STRING' }
            },
            required: ['title', 'description', 'category', 'content']
          }
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errText}`);
    }

    const resData = await response.json();
    const jsonText = resData.candidates[0].content.parts[0].text;
    return JSON.parse(jsonText);

  } else {
    console.log('Generating content using OpenAI API...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: 'You are a helpful marketing assistant that writes blog content and outputs strictly structured JSON.' },
          { role: 'user', content: prompt }
        ]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errText}`);
    }

    const resData = await response.json();
    const jsonText = resData.choices[0].message.content;
    return JSON.parse(jsonText);
  }
}

async function run() {
  try {
    const articles = await getRecentArticles();
    if (articles.length === 0) {
      console.log('No articles found in feeds. Exiting.');
      return;
    }

    // Try to find a feed article we haven't written about yet
    let selectedArticle = null;
    let selectedSlug = '';

    for (const art of articles) {
      const slug = slugify(art.title);
      const filePath = path.join(process.cwd(), 'src/content/blog', `${slug}.md`);
      
      if (!fs.existsSync(filePath)) {
        selectedArticle = art;
        selectedSlug = slug;
        break;
      }
    }

    if (!selectedArticle) {
      console.log('All recent articles have already been published. Exiting.');
      return;
    }

    console.log(`Selected Topic: "${selectedArticle.title}" (${selectedArticle.source})`);

    const generated = await generateContent(selectedArticle);

    // Format the final file content with Frontmatter and programmatically append a beautiful CTA
    const ctaSection = `

---

## Dijital Dünyada Markanızı Büyütün!

Teknoloji ve pazarlama dünyasındaki bu hızlı değişimleri yakalamak, Google & Meta reklam kampanyalarınızı en yüksek verimlilikle yönetmek ve SEO uyumlu bir büyüme stratejisi oluşturmak için uzman desteği alabilirsiniz. 

**Smartkid.agency** ekibi olarak, markanızın dijital performansını artırmak ve dönüşümlerinizi katlamak için buradayız. 

Hemen [Smartkid.agency](https://smartkid.agency) web sitemizi ziyaret edin ve ücretsiz keşif görüşmesi randevunuzu oluşturun!`;

    const fileContent = `---
title: "${generated.title.replace(/"/g, '\\"')}"
description: "${generated.description.replace(/"/g, '\\"')}"
pubDate: ${new Date().toISOString().split('T')[0]}
category: ${generated.category}
author: Smartkid Labs
draft: false
---

${generated.content.trim()}${ctaSection}
`;

    const blogDir = path.join(process.cwd(), 'src/content/blog');
    if (!fs.existsSync(blogDir)) {
      fs.mkdirSync(blogDir, { recursive: true });
    }

    const finalPath = path.join(blogDir, `${selectedSlug}.md`);
    fs.writeFileSync(finalPath, fileContent, 'utf-8');
    console.log(`Successfully created new article: ${finalPath}`);

    // Run Git auto-push if configured
    if (process.env.GIT_AUTO_PUSH === 'true') {
      console.log('Git auto-push is enabled. Committing and pushing...');
      try {
        execSync(`git add "${finalPath}"`, { stdio: 'inherit' });
        execSync(`git commit -m "Auto-post: ${generated.title}"`, { stdio: 'inherit' });
        execSync('git push', { stdio: 'inherit' });
        console.log('Successfully pushed to GitHub!');
      } catch (gitErr) {
        console.error('Failed to auto-push to Git:', gitErr.message);
      }
    }

  } catch (error) {
    console.error('Automation failed:', error);
  }
}

run();
