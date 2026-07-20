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

// Predefined Evergreen Topics to ensure balanced categories (Guides & How-tos)
const EVERGREEN_TOPICS = [
  // Google Ads
  { title: "Google Ads Bütçe Sınırlı Uyarısı Nedir ve Nasıl Çözülür?", source: "Evergreen", category: "google-ads" },
  { title: "Performance Max (PMax) Kampanyaları ile Maksimum Dönüşüm Elde Etme Kılavuzu", source: "Evergreen", category: "google-ads" },
  { title: "Google Ads Kalite Puanı Artırma Yolları: Adım Adım Rehber", source: "Evergreen", category: "google-ads" },
  { title: "Arama Ağı Reklamlarında Doğru Anahtar Kelime Eşleme Türü Nasıl Seçilir?", source: "Evergreen", category: "google-ads" },
  { title: "Google Ads Negatif Anahtar Kelime Listeleri Nasıl Oluşturulur?", source: "Evergreen", category: "google-ads" },
  { title: "Yeniden Pazarlama (Remarketing) Kampanyaları ile Dönüşüm Oranlarını Katlayın", source: "Evergreen", category: "google-ads" },
  { title: "Google Ads Tıklama Başına Maliyet (TBM) Düşürme Yöntemleri", source: "Evergreen", category: "google-ads" },
  { title: "Google Ads Dönüşüm İzleme Kodları Nasıl Kurulur?", source: "Evergreen", category: "google-ads" },

  // Meta Ads
  { title: "Meta Pixel (Facebook Piksel) Nedir ve Web Sitesine Nasıl Kurulur?", source: "Evergreen", category: "meta-ads" },
  { title: "Meta Conversions API (Dönüşümler API'si) Kurulum ve Entegrasyon Rehberi", source: "Evergreen", category: "meta-ads" },
  { title: "Meta Reklamlarında Doğru Hedef Kitle (Lookalike & Custom Audience) Seçimi", source: "Evergreen", category: "meta-ads" },
  { title: "Facebook ve Instagram Reklam Hesaplarının Kapatılma Nedenleri ve Çözümleri", source: "Evergreen", category: "meta-ads" },
  { title: "CBO (Kampanya Bütçe Optimizasyonu) ve ABO (Reklam Seti Bütçe Optimizasyonu) Farkı", source: "Evergreen", category: "meta-ads" },
  { title: "Düşük Bütçeli Meta Reklamlarında Maksimum Verim Alma Stratejileri", source: "Evergreen", category: "meta-ads" },
  { title: "Sosyal Medya Reklamlarında Kreatif Test Etme (Creative Testing) Metotları", source: "Evergreen", category: "meta-ads" },
  { title: "iOS 14+ Sonrası Meta Reklamlarında Dönüşüm Kayıplarını Önleme Yolları", source: "Evergreen", category: "meta-ads" },

  // SEO & GEO
  { title: "Yapılandırılmış Veri (Schema Markup) Nedir? SEO'ya Etkisi ve Kurulumu", source: "Evergreen", category: "seo-geo" },
  { title: "Brave Search ve Perplexity Gibi Yapay Zeka Arama Motorları İçin SEO (GEO) Taktikleri", source: "Evergreen", category: "seo-geo" },
  { title: "Teknik SEO Denetimi (Audit) Nasıl Yapılır? Kapsamlı Kontrol Listesi", source: "Evergreen", category: "seo-geo" },
  { title: "Core Web Vitals (Önemli Web Verileri) Nedir ve Sayfa Hızı Nasıl Optimize Edilir?", source: "Evergreen", category: "seo-geo" },
  { title: "Anahtar Kelime Araştırması Nasıl Yapılır? En İyi Ücretsiz Araçlar ve Taktikler", source: "Evergreen", category: "seo-geo" },
  { title: "Görsel Optimizasyonu ile Google Görsel Arama Trafiğini Artırın", source: "Evergreen", category: "seo-geo" },
  { title: "Dahili Linkleme (Internal Linking) Stratejileri ile Site Otoritesini Dağıtın", source: "Evergreen", category: "seo-geo" },
  { title: "Rakip SEO Analizi Nasıl Yapılır? Rakiplerinizin Trafik Kaynaklarını Keşfedin", source: "Evergreen", category: "seo-geo" },

  // Troubleshooting & Guides
  { title: "Google Merchant Center Askıya Alınan Hesaplar Nasıl Düzeltilir?", source: "Evergreen", category: "troubleshooting-guides" },
  { title: "Google Analytics 4 (GA4) Veri Kaybı ve İzleme Hataları Nasıl Çözülür?", source: "Evergreen", category: "troubleshooting-guides" },
  { title: "Meta Business Manager Eşleştirme ve Yetkilendirme Hataları ve Çözümleri", source: "Evergreen", category: "troubleshooting-guides" },
  { title: "Google Tag Manager (GTM) Tetikleyici ve Etiket Hataları Nasıl Giderilir?", source: "Evergreen", category: "troubleshooting-guides" },
  { title: "Web Sitenizde Kırık Linkleri (404 Hataları) Bulma ve Yönlendirme Kılavuzu", source: "Evergreen", category: "troubleshooting-guides" },
  { title: "Google Search Console 'Dizin Oluşturma' (Indexing) Hataları ve Çözüm Yolları", source: "Evergreen", category: "troubleshooting-guides" },
  { title: "Meta Piksel 'Çift Olay Tetikleme' (Duplicate Event) Hatası Nasıl Giderilir?", source: "Evergreen", category: "troubleshooting-guides" },
  { title: "Google Ads 'Politika İhlali' Nedir? Reklam Onaylanmama Sorunları Nasıl Çözülür?", source: "Evergreen", category: "troubleshooting-guides" },

  // Digital Marketing & Growth
  { title: "Dönüşüm Oranı Optimizasyonu (CRO) Nedir? Satışlarınızı Artıracak Testler", source: "Evergreen", category: "digital-marketing-growth" },
  { title: "A/B Testi Nasıl Yapılır? Dijital Pazarlamada Doğru Test Senaryoları", source: "Evergreen", category: "digital-marketing-growth" },
  { title: "Landing Page (Açılış Sayfası) Tasarımında Dikkat Edilmesi Gereken 10 Altın Kural", source: "Evergreen", category: "digital-marketing-growth" },
  { title: "E-Ticarette Sepeti Terk Etme Oranlarını Düşürme Yöntemleri", source: "Evergreen", category: "digital-marketing-growth" },
  { title: "B2B İşletmeler İçin Nitelikli Lead (Müşteri Adayı) Toplama Stratejileri", source: "Evergreen", category: "digital-marketing-growth" },
  { title: "Müşteri Yaşam Boyu Değeri (LTV) Nedir ve Nasıl Artırılır?", source: "Evergreen", category: "digital-marketing-growth" }
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

// Helper to strip non-printable/control characters that break YAML parsing
function cleanText(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
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
4. Categorize the post into exactly one of these slugs: google-ads, meta-ads, seo-geo, digital-marketing-growth, tech-marketing-news, troubleshooting-guides. ${article.category ? `IMPORTANT: This article belongs to the category: "${article.category}", you MUST output this exact slug in the "category" JSON field.` : ''}
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
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`;
    
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
    let selectedArticle = null;
    let selectedSlug = '';

    // 1. Try to fetch RSS feeds
    let rssArticles = [];
    try {
      rssArticles = await getRecentArticles();
    } catch (err) {
      console.log('Failed to fetch RSS feeds, continuing to evergreen topics...', err.message);
    }

    // 2. Check if there is an unwritten RSS article
    if (rssArticles.length > 0) {
      for (const art of rssArticles) {
        const slug = slugify(art.title);
        const filePath = path.join(process.cwd(), 'src/content/blog', `${slug}.md`);
        
        if (!fs.existsSync(filePath)) {
          selectedArticle = art;
          selectedSlug = slug;
          break;
        }
      }
    }

    // 3. Fallback to Evergreen Topics if no RSS article was found
    if (!selectedArticle) {
      console.log('No new RSS articles found. Checking evergreen topics...');
      for (const topic of EVERGREEN_TOPICS) {
        const slug = slugify(topic.title);
        const filePath = path.join(process.cwd(), 'src/content/blog', `${slug}.md`);
        
        if (!fs.existsSync(filePath)) {
          selectedArticle = topic;
          selectedSlug = slug;
          break;
        }
      }
    }

    if (!selectedArticle) {
      console.log('All recent RSS articles and evergreen topics have already been published. Exiting.');
      return;
    }

    console.log(`Selected Topic: "${selectedArticle.title}" (${selectedArticle.source})`);

    let generated = null;
    let success = false;
    let attempts = 0;
    const maxAttempts = 3;

    while (!success && attempts < maxAttempts) {
      attempts++;
      try {
        if (attempts > 1) {
          console.log(`Attempt ${attempts}/${maxAttempts} to generate content...`);
        }
        generated = await generateContent(selectedArticle);
        success = true;
      } catch (err) {
        console.error(`Error on attempt ${attempts}:`, err.message);
        if (attempts < maxAttempts) {
          console.log('Waiting 15 seconds before retry...');
          await new Promise(resolve => setTimeout(resolve, 15000));
        } else {
          throw err;
        }
      }
    }

    // Format the final file content with Frontmatter and programmatically append a beautiful CTA
    const ctaSection = `

---

## Dijital Dünyada Markanızı Büyütün!

Teknoloji ve pazarlama dünyasındaki bu hızlı değişimleri yakalamak, Google & Meta reklam kampanyalarınızı en yüksek verimlilikle yönetmek ve SEO uyumlu bir büyüme stratejisi oluşturmak için uzman desteği alabilirsiniz. 

**Smartkid.agency** ekibi olarak, markanızın dijital performansını artırmak ve dönüşümlerinizi katlamak için buradayız. 

Hemen [Smartkid.agency](https://smartkid.agency) web sitemizi ziyaret edin ve ücretsiz keşif görüşmesi randevunuzu oluşturun!`;

    const cleanedTitle = cleanText(generated.title).replace(/"/g, '\\"');
    const cleanedDescription = cleanText(generated.description).replace(/"/g, '\\"');
    const cleanedContent = cleanText(generated.content).trim();

    const fileContent = `---
title: "${cleanedTitle}"
description: "${cleanedDescription}"
pubDate: ${new Date().toISOString().split('T')[0]}
category: ${generated.category}
author: Smartkid Labs
draft: false
---

${cleanedContent}${ctaSection}
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
