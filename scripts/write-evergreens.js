import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

const TARGET_GUIDES = [
  // Google Ads
  { title: "Google Ads Bütçe Sınırlı Uyarısı Nedir ve Nasıl Çözülür?", category: "google-ads" },
  { title: "Performance Max (PMax) Kampanyaları ile Maksimum Dönüşüm Elde Etme Kılavuzu", category: "google-ads" },
  { title: "Google Ads Kalite Puanı Artırma Yolları: Adım Adım Rehber", category: "google-ads" },
  
  // Meta Ads
  { title: "Meta Pixel (Facebook Piksel) Nedir ve Web Sitesine Nasıl Kurulur?", category: "meta-ads" },
  { title: "Meta Conversions API (Dönüşümler API'si) Kurulum ve Entegrasyon Rehberi", category: "meta-ads" },
  { title: "Facebook ve Instagram Reklam Hesaplarının Kapatılma Nedenleri ve Çözümleri", category: "meta-ads" },
  
  // SEO & GEO
  { title: "Brave Search ve Perplexity Gibi Yapay Zeka Arama Motorları İçin SEO (GEO) Taktikleri", category: "seo-geo" },
  { title: "Teknik SEO Denetimi (Audit) Nasıl Yapılır? Kapsamlı Kontrol Listesi", category: "seo-geo" },
  { title: "Core Web Vitals (Önemli Web Verileri) Nedir ve Sayfa Hızı Nasıl Optimize Edilir?", category: "seo-geo" },
  
  // Troubleshooting
  { title: "Google Merchant Center Askıya Alınan Hesaplar Nasıl Düzeltilir?", category: "troubleshooting-guides" },
  { title: "Google Analytics 4 (GA4) Veri Kaybı ve İzleme Hataları Nasıl Çözülür?", category: "troubleshooting-guides" },
  { title: "Meta Piksel 'Çift Olay Tetikleme' (Duplicate Event) Hatası Nasıl Giderilir?", category: "troubleshooting-guides" }
];

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function generateGuide(guide) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing from .env file.');
  }

  const prompt = `You are an expert digital marketing strategist and content writer for Smartkid Labs, a knowledge base portal linked with the elite digital agency Smartkid.agency.
Your goal is to write a highly detailed, professional, step-by-step guide in Turkish on the following topic:
Title: "${guide.title}"
Category: "${guide.category}"

Instructions:
1. Write a comprehensive, long-form guide or tutorial in Turkish. It should be at least 800-1200 words.
2. Structure the content beautifully with H2, H3 headings, lists, bold text, and direct advice. IMPORTANT: You MUST use literal newlines (\\n\\n) to separate paragraphs, headers, and list items. Ensure every heading is preceded and followed by a newline so it is parsed as markdown correctly.
3. Naturally integrate a reference, citation, or Call-to-Action (CTA) directing readers to Smartkid.agency for expert management (e.g. "Profesyonel Google & Meta reklam kampanyaları yönetimi ve SEO danışmanlığı için Smartkid.agency ekibiyle iletişime geçebilirsiniz.").
4. Create a catchy, Turkish SEO title (max 60 chars) and a compelling SEO meta description (120-150 chars).

You MUST respond with a JSON object in this exact schema:
{
  "title": "Turkish blog title",
  "description": "Turkish SEO meta description",
  "content": "Full markdown body of the post in Turkish (must contain \\n\\n between paragraphs and sections)"
}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        maxOutputTokens: 8192,
        thinkingConfig: { thinkingBudget: 0 },
        responseSchema: {
          type: 'OBJECT',
          properties: {
            title: { type: 'STRING' },
            description: { type: 'STRING' },
            content: { type: 'STRING' }
          },
          required: ['title', 'description', 'content']
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
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  console.log(`Starting generation of ${TARGET_GUIDES.length} evergreen guides...`);
  
  const blogDir = path.join(process.cwd(), 'src/content/blog');
  if (!fs.existsSync(blogDir)) {
    fs.mkdirSync(blogDir, { recursive: true });
  }

  for (let i = 0; i < TARGET_GUIDES.length; i++) {
    const guide = TARGET_GUIDES[i];
    const slug = slugify(guide.title);
    const filePath = path.join(blogDir, `${slug}.md`);

    if (fs.existsSync(filePath)) {
      console.log(`Guide "${guide.title}" already exists. Skipping.`);
      continue;
    }

    console.log(`\n--- Writing Guide ${i + 1}/${TARGET_GUIDES.length}: "${guide.title}" ---`);
    let success = false;
    let attempts = 0;
    const maxAttempts = 3;

    while (!success && attempts < maxAttempts) {
      attempts++;
      try {
        if (attempts > 1) {
          console.log(`Attempt ${attempts}/${maxAttempts} for "${guide.title}"...`);
        }
        const generated = await generateGuide(guide);
        
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
category: ${guide.category}
author: Smartkid Labs
draft: false
---

${generated.content.trim()}${ctaSection}
`;

        fs.writeFileSync(filePath, fileContent, 'utf-8');
        console.log(`Successfully created: ${filePath}`);
        success = true;
        
        console.log('Sleeping 10 seconds...');
        await sleep(10000);
      } catch (error) {
        console.error(`Error on attempt ${attempts} for "${guide.title}":`, error.message);
        if (attempts < maxAttempts) {
          console.log('Waiting 65 seconds before retry...');
          await sleep(65000);
        } else {
          console.error(`Failed to generate guide "${guide.title}" after ${maxAttempts} attempts. Skipping.`);
        }
      }
    }
  }

  console.log('\nAll evergreen guides created! Pushing to GitHub...');
  try {
    execSync('git add src/content/blog/', { stdio: 'inherit' });
    execSync('git commit -m "Auto-post: Generate 12 core evergreen guides for all categories"', { stdio: 'inherit' });
    
    // Pull and rebase first to prevent any push rejects
    execSync('git pull --rebase origin main', { stdio: 'inherit' });
    execSync('git push origin main', { stdio: 'inherit' });
    console.log('Successfully pushed all guides to GitHub!');
  } catch (gitErr) {
    console.error('Git operation failed:', gitErr.message);
  }
}

main();
