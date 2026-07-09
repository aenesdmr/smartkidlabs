---
title: "Google'dan Yeni Merchant Listing Yapılandırılmış Veri Güncellemesi"
description: "Google, e-ticaret siteleri için Merchant Listing yapılandırılmış veri özelliklerini güncelledi. SEO ve satışlarınızı artıracak detaylar rehberimizde."
pubDate: 2026-07-09
category: seo-geo
author: Smartkid Labs
draft: false
---

# Google'dan Yeni Merchant Listing Yapılandırılmış Veri Güncellemesi: E-Ticaret SEO'sunda Yeni Dönem

Google, e-ticaret sitelerinin arama sonuçlarında çok daha zengin, dikkat çekici ve dönüşüm odaklı görünmesini sağlayan yapılandırılmış veri (Structured Data) protokollerinde önemli bir güncellemeye imza attı. Search Engine Journal ve sektörün önde gelen uzmanlarından Roger Montti (@martinibuster) tarafından aktarılan bilgilere göre, yeni "Merchant Listing" (Satıcı Listeleme) yapılandırılmış verileri, e-ticaret sitelerinin organik arama performansını doğrudan etkileyecek yeni özellikler sunuyor.

Bu rehberimizde, Google'ın bu son güncellemesinin detaylarını, e-ticaret SEO stratejinize nasıl entegre edeceğinizi ve teknik uygulama adımlarını detaylandırıyoruz.


## Merchant Listing Yapılandırılmış Verisi Nedir?

Merchant Listing yapılandırılmış verisi, e-ticaret sitelerindeki ürünlerin fiyat, stok durumu, kargo ücretleri, iade politikaları ve kullanıcı değerlendirmeleri gibi kritik ticari bilgileri doğrudan Google arama sonuçlarında (SERP) göstermeye yarayan özel bir şema (Schema.org) işaretlemesidir.

Klasik Product (Ürün) şemasından farklı olarak Merchant Listing, kullanıcılara doğrudan satın alma kararı verdirecek dinamik satıcı bilgilerine odaklanır. Bu sayede web siteniz, Google Görseller, Google Lens ve Google Alışveriş sekmelerinde çok daha görünür hale gelir.


## Yeni Güncelleme ile Neler Değişti?

Google'ın son güncellemesi, satıcıların arama sonuçlarında daha şeffaf ve güvenilir bilgiler sunmasını hedefliyor. Öne çıkan yenilikler şunlardır:

* **Detaylı Kargo ve İade Bilgileri:** Artık ürün şeması içinde kargo ücretlerinin yanı sıra tahmini teslimat süreleri ve iade politikaları (ücretsiz iade, iade süresi vb.) çok daha net tanımlanabiliyor.
* **Çoklu Satıcı Desteği (Multi-Merchant):** Aynı ürün sayfasında farklı satıcıların teklifleri varsa, bu yapılandırılmış veri sayesinde her bir satıcının fiyat ve stok durumu ayrı ayrı Google'a bildirilebiliyor.
* **Gelişmiş Hata Raporlama:** Google Search Console, Merchant Listing hatalarını artık daha spesifik ve çözülebilir uyarılarla raporluyor.


## Bu Güncelleme SEO Performansınızı Nasıl Etkiler?

E-ticaret siteleri için SEO, sadece anahtar kelimelerde üst sıralara çıkmaktan ibaret değildir. Önemli olan, arama sonuçlarındaki tıklama oranını (CTR) ve dönüşüm oranını artırmaktır. Yeni Merchant Listing güncellemesinin sağladığı avantajlar:

1. **Daha Yüksek Tıklama Oranı (CTR):** Fiyat, kargo ve puanlama gibi detayları arama sonucunda gören kullanıcılar, sitenize daha güvenle tıklar.
2. **Daha Düşük Hemen Çıkma Oranı (Bounce Rate):** Kullanıcı aradığı fiyat ve kargo şartlarını SERP üzerinde görüp geldiği için, sitenizdeki satın alma niyeti çok daha yüksek olur.
3. **Organik Alışveriş Sekmesinde Ücretsiz Listeleme:** Doğru yapılandırılmış veri kullanımı, Google Shopping (Alışveriş) sekmesindeki ücretsiz listelemelerde ürünlerinizin üst sıralarda çıkmasını sağlar.


## Adım Adım Merchant Listing Kurulumu

Web sitenizi bu yeni güncellemeye uyumlu hale getirmek için JSON-LD formatında yapılandırılmış verileri entegre etmeniz gerekir. İşte temel bir örnek şema yapısı:

```json
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Smartkid Premium SEO Kit",
  "image": [
    "https://example.com/photos/1x1/photo.jpg"
  ],
  "description": "E-ticaret siteleri için profesyonel SEO optimizasyon kiti.",
  "sku": "SK-SEO-001",
  "mpn": "925872",
  "offers": {
    "@type": "Offer",
    "url": "https://example.com/seo-kit",
    "priceCurrency": "TRY",
    "price": "1499.00",
    "priceValidUntil": "2026-12-31",
    "itemCondition": "https://schema.org/NewCondition",
    "availability": "https://schema.org/InStock",
    "shippingDetails": {
      "@type": "OfferShippingDetails",
      "shippingRate": {
        "@type": "MonetaryAmount",
        "value": "0",
        "currency": "TRY"
      }
    }
  }
}
```


## Profesyonel Destek Alın

Teknik SEO ve yapılandırılmış veri entegrasyonları, hatalı yapıldığında sitenizin arama görünürlüğüne zarar verebilecek hassas süreçlerdir. E-ticaret sitenizin Google algoritma güncellemelerine tam uyumlu çalışması, organik trafiğinizin ve satışlarınızın artması için uzman desteği almak kritik önem taşır.

Profesyonel Google & Meta reklam kampanyaları yönetimi ve SEO danışmanlığı için Smartkid.agency ekibiyle iletişime geçebilirsiniz. Uzman ekibimiz, teknik SEO süreçlerinizi baştan sona yöneterek dijitaldeki büyümenizi hızlandıracaktır.

---

## Dijital Dünyada Markanızı Büyütün!

Teknoloji ve pazarlama dünyasındaki bu hızlı değişimleri yakalamak, Google & Meta reklam kampanyalarınızı en yüksek verimlilikle yönetmek ve SEO uyumlu bir büyüme stratejisi oluşturmak için uzman desteği alabilirsiniz. 

**Smartkid.agency** ekibi olarak, markanızın dijital performansını artırmak ve dönüşümlerinizi katlamak için buradayız. 

Hemen [Smartkid.agency](https://smartkid.agency) web sitemizi ziyaret edin ve ücretsiz keşif görüşmesi randevunuzu oluşturun!
