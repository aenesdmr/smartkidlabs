---
title: "Meta Conversions API Kurulum Rehberi | Smartkid Labs"
description: "Meta Conversions API (Dönüşümler API'si) nedir, nasıl kurulur? Adım adım entegrasyon yöntemleri ve veri kaybını önleme stratejileri rehberimizde."
pubDate: 2026-06-14
category: meta-ads
author: Smartkid Labs
draft: false
---

# Meta Conversions API (Dönüşümler API'si) Kurulum ve Entegrasyon Rehberi

Dijital pazarlama dünyası, üçüncü taraf çerezlerin (third-party cookies) aşamalı olarak kaldırılması ve iOS 14+ güncellemeleri gibi gizlilik odaklı değişikliklerle büyük bir dönüşüm yaşıyor. Geleneksel tarayıcı tabanlı izleme yöntemleri (Meta Piksel), artık dönüşüm verilerini eksiksiz bir şekilde raporlamak ve reklam optimizasyonu sağlamak için tek başına yeterli değil.

İşte bu noktada devreye **Meta Conversions API (Dönüşümler API'si - CAPI)** giriyor. Bu rehberde, reklam performansınızı artırmak ve veri kaybını önlemek için Meta Conversions API'yi nasıl kuracağınızı ve optimize edeceğinizi adım adım ele alacağız.

---

## Meta Conversions API (CAPI) Nedir?

Meta Conversions API, web sitenizdeki, uygulamanızdaki veya fiziksel mağazanızdaki pazarlama olaylarını (satın alma, sepete ekleme, form doldurma vb.) doğrudan sunucunuzdan (server-side) Meta sunucularına güvenli bir şekilde aktarmanızı sağlayan bir veri entegrasyon aracıdır.

Meta Piksel tarayıcı üzerinde çalışırken, Conversions API doğrudan sunucu düzeyinde çalışır. Bu sayede reklam engelleyiciler (ad blockers), tarayıcı kısıtlamaları veya bağlantı kesintilerinden etkilenmeden daha tutarlı ve güvenilir bir veri akışı sağlar.

### Neden Conversions API Kullanmalısınız?

* **Veri Kaybını En aza İndirir:** Tarayıcı kısıtlamaları nedeniyle ölçümlenemeyen dönüşümleri yakalar.
* **Reklam Optimizasyonunu İyileştirir:** Daha fazla veri, Meta yapay zeka ve makine öğrenimi algoritmalarının hedef kitlenizi daha doğru bulmasını sağlar.
* **Daha Düşük Edinme Başına Maliyet (CPA):** Hedefleme ve veri kalitesi arttıkça, reklam bütçenizi daha verimli kullanırsınız.
* **Özelleştirilmiş Olay Ölçümü:** Çevrimdışı dönüşümler veya CRM verileri gibi tarayıcı dışı olayları da Meta'ya aktarabilirsiniz.

---

## Conversions API Kurulum Yöntemleri

Meta, işletmelerin teknik altyapılarına ve kaynaklarına göre farklı Conversions API kurulum yöntemleri sunmaktadır. En yaygın kullanılan üç yöntem şunlardır:

### 1. Hazır Partner Entegrasyonları (Kodsuz Kurulum)

Eğer web siteniz Shopify, WordPress (WooCommerce), Magento, Wix veya Google Tag Manager gibi popüler bir altyapıyı kullanıyorsa, kod yazmadan birkaç tıklama ile entegrasyon sağlayabilirsiniz.

### 2. Google Tag Manager (Server-Side) Kurulumu

En popüler ve esnek yöntemlerden biridir. Google Cloud Platform (GCP) veya Stape.io gibi bir sunucu sağlayıcı üzerinden kendi sunucu tarafı etiketleme konteynerinizi kurarak Conversions API entegrasyonunu gerçekleştirebilirsiniz.

### 3. Doğrudan API Entegrasyonu (Manuel Kurulum)

Yazılım ekibiniz veya bir geliştirici yardımıyla, Meta'nın API dokümantasyonunu kullanarak doğrudan sunucunuz üzerinden özel bir entegrasyon oluşturabilirsiniz. En yüksek düzeyde kontrol sağlar.

---

## Adım Adım WordPress/WooCommerce ile CAPI Kurulumu

En yaygın kullanılan yöntemlerden biri olan WordPress ve WooCommerce altyapısında Conversions API kurulumunu adım adım gerçekleştirelim:

### Adım 1: Meta Pixel ve Conversions API Erişim Jetonu (Access Token) Alma

1. **Meta Business Suite** paneline gidin ve **Olay Yöneticisi (Events Manager)** sekmesini açın.
2. Veri kaynağınızı (Pikselinizi) seçin ve üst menüdeki **Ayarlar (Settings)** sekmesine tıklayın.
3. Sayfayı aşağı kaydırarak **Dönüşümler API'si (Conversions API)** bölümünü bulun.
4. **Erişim Jetonu Oluştur (Generate Access Token)** bağlantısına tıklayın.
5. Oluşturulan uzun karakter dizisini kopyalayın ve güvenli bir yerde saklayın.

### Adım 2: Pixel Your Site Eklentisini Kurma

WordPress sitenizde tarayıcı ve sunucu olaylarını senkronize bir şekilde yönetmek için en popüler eklentilerden biri *Pixel Your Site*'dır.

1. WordPress panelinizden **Eklentiler > Yeni Ekle** bölümüne gidin.
2. **Pixel Your Site** eklentisini aratın, kurun ve etkinleştirin.
3. Eklenti ayarlarına gidin ve **Meta Pixel (formerly Facebook Pixel)** seçeneğinin yanındaki "Settings" butonuna tıklayın.
4. **Pixel ID** alanına Meta Piksel kimliğinizi yapıştırın.
5. **Send events directly from your server (Conversions API)** seçeneğini aktif hale getirin.
6. Adım 1'de kopyaladığınız **Access Token** değerini buradaki ilgili alana yapıştırın.
7. Değişiklikleri kaydedin.

---

## Veri Tekilleştirme (Deduplication) ve Olay Eşleşme Kalitesi

Conversions API kurulumunda en çok dikkat edilmesi gereken iki kritik kavram vardır: **Tekilleştirme (Deduplication)** ve **Olay Eşleşme Kalitesi (Event Match Quality)**.

### Olay Tekilleştirme (Deduplication) Nedir?

Meta'ya hem tarayıcı (Piksel) hem de sunucu (CAPI) üzerinden aynı olayın (örneğin satın alma) verisini gönderdiğinizde, Meta bu iki verinin aynı kullanıcıya ait olduğunu anlamalıdır. Aksi takdirde, raporlarınızda çift sayım (duplicate) gerçekleşir.

Bunu önlemek için her iki kanaldan gönderilen olaylara aynı **Olay Kimliği (Event ID)** ve **Olay Adı (Event Name)** eklenmelidir. Meta, aynı Event ID ile gelen iki olaydan birini otomatik olarak eler.

### Olay Eşleşme Kalitesi Nasıl Artırılır?

Meta'nın gelen veriyi kendi kullanıcı tabanıyla eşleştirebilmesi için olaylarla birlikte kullanıcı parametreleri de gönderilmelidir. Göndermeniz gereken bazı kritik parametreler şunlardır:

* E-posta adresi (hashlenmiş / SHA-256)
* Telefon numarası (hashlenmiş / SHA-256)
* Ad ve Soyad
* Şehir ve Ülke
* IP Adresi ve Kullanıcı Aracısı (User Agent)

Bu parametreleri ne kadar eksiksiz ve doğru gönderirseniz, olay eşleşme kaliteniz (10 üzerinden puanlanır) o kadar yüksek olur ve reklam hedeflemeniz o kadar keskinleşir.

---

## Kurulum Testi ve Doğrulama

Kurulumu tamamladıktan sonra sistemin sorunsuz çalıştığından emin olmak için şu adımları takip edin:

1. **Olay Yöneticisi**'ne gidin ve ilgili Pikseli seçin.
2. **Olayları Test Et (Test Events)** sekmesine tıklayın.
3. Web sitenizin URL'sini yazarak test modunu başlatın.
4. Sitenizde sepete ekleme veya satın alma gibi işlemler gerçekleştirin.
5. Test ekranında olayların hem **Browser (Tarayıcı)** hem de **Server (Sunucu)** olarak listelendiğini ve eşleştiğini kontrol edin.

---

## Sonuç ve Profesyonel Destek

Meta Conversions API kurulumu, teknik altyapı gerektiren ve yakından takip edilmesi gereken kritik bir süreçtir. Doğru yapılandırılmamış bir API entegrasyonu, bütçenizin yanlış optimize edilmesine ve veri kaybına yol açabilir.

Profesyonel Google & Meta reklam kampanyaları yönetimi, ileri düzey ölçümleme ve SEO danışmanlığı için Smartkid.agency ekibiyle iletişime geçebilirsiniz. Uzman ekibimizle reklam performansınızı en üst seviyeye taşıyalım.

---

## Dijital Dünyada Markanızı Büyütün!

Teknoloji ve pazarlama dünyasındaki bu hızlı değişimleri yakalamak, Google & Meta reklam kampanyalarınızı en yüksek verimlilikle yönetmek ve SEO uyumlu bir büyüme stratejisi oluşturmak için uzman desteği alabilirsiniz. 

**Smartkid.agency** ekibi olarak, markanızın dijital performansını artırmak ve dönüşümlerinizi katlamak için buradayız. 

Hemen [Smartkid.agency](https://smartkid.agency) web sitemizi ziyaret edin ve ücretsiz keşif görüşmesi randevunuzu oluşturun!
