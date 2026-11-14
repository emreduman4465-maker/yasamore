# Yasamore — SEO'lu dekorasyon mağazası

Site `dist/` klasöründen yayınlanır (GitHub Pages / Vercel). Yönetim paneli **`/yonetim/`** adresindedir
(`https://alanadiniz.com/yonetim/`; kaynağı `dist/yonetim/`).

## Kurulum (bir kez)
1. Supabase'de proje açın → **SQL Editor**'de `supabase-kurulum.sql` dosyasını çalıştırın.
2. **Authentication → Users → Add user** ile e-posta/şifre oluşturun (Auto Confirm işaretli); SQL dosyasının
   sonundaki `insert into public.aurelya_admins …` satırında e-postanızı yazıp çalıştırın.
3. **Project Settings → API**'den Project URL ve Publishable (anon) anahtarı `dist/yonetim/config.js` içine yazın.
4. GitHub'da fine-grained token üretin (bu depo, **Contents: Read and write**). Panelde Yayınla sekmesine yapıştırın.
5. GitHub → Settings → Pages → Source: **GitHub Actions**.

## Panel
Ürünler (arama/filtre) · Kategoriler (çeviri/yeniden adlandırma) · Excel ile ürün ekle (şablon indirme, otomatik dil) ·
Site Ayarları (Logo ve Marka, İletişim, Ana sayfa, Hakkımızda, Diller ve Çeviri, SEO) · Yayınla · Hesap.
Değişiklikler panelde Supabase'e kaydedilir; **Yayınla** siteyi üretip `dist/`'e GitHub'a gönderir.

## Çeviri
Site Ayarları → Diller ve Çeviri'ye Anthropic API anahtarı girerseniz Claude ile çevrilir; girmezseniz
ücretsiz MyMemory servisi kullanılır (günlük sınırlı, daha düşük kalite).

## Alt kategoriler
Ürünün “Kategori” alanına `Ana > Alt` yazın (örn. `Sunumluklar > Lokumluklar`) ya da Kategoriler sekmesinde ana kategori kartındaki **+ Alt kategori** düğmesini kullanın. Sitede menüde açılır liste, kategori sayfasında alt kategori düğmeleri, `/kategori/ana/alt/` sayfaları, ana sayfada alt kategori çipleri ve altbilgide alt bağlantılar otomatik oluşur. Diğer dillerde görünmesi için alt kategoriye de çeviri girilmelidir (Kategoriler → “Eksik kategori çevirilerini otomatik tamamla”).

## Özel kod ve özel sayfalar
**Site Ayarları → Özel Kod:** Tüm sayfalara uygulanan CSS (style.css'in sonuna eklenir), Head HTML (`</head>` öncesi),
Sayfa sonu HTML (`</body>` öncesi) ve JavaScript (`/custom.js` olarak yüklenir). Pixel, Tag Manager, doğrulama kodu,
canlı destek vb. için kullanın.

**Site Ayarları → Özel Sayfalar:** Kendi HTML/CSS/JS'inizle sınırsız sayfa. Her sayfada adres (URL), dil başına başlık/açıklama/HTML,
sayfaya özel CSS/Head/JS, üst menü ve altbilgi bağlantısı, taslak ve noindex seçenekleri vardır.
Düzenler: *Metin sayfası*, *Serbest HTML* (menü+altbilgi var), *Tam genişlik*, *Boş sayfa* (menü/altbilgi yok; tam HTML belgesi yazabilirsiniz).
İçerik girilen her dilde `/slug/`, `/en/slug/` … adreslerinde yayınlanır ve sitemap'e eklenir.
Sistem adresleri (urun, kategori, yonetim, dil kodları, yasal sayfalar…) kullanılamaz. Veri Supabase'deki aynı satırda saklanır; ek SQL gerekmez.

## Toplu SEO / Merchant alanları ve XML
**Excel ile ürün ekle → Toplu SEO ve Merchant alanları:** Şablonu mevcut ürünlerle dolu indirin, doldurup yükleyin. Satırlar *Ürün kodu* ile eşleşir,
yalnızca dolu hücreler güncellenir (isterseniz “Boş hücreler değeri silsin”). Sütunlar: marka, GTIN (kontrol basamağı doğrulanır), MPN, durum, stok,
Google kategorisi, renk/malzeme/ölçü, varyant grubu, özel etiket 0–4, Merchant XML (dahil/dahil değil) ve her dil için SEO başlığı, SEO açıklaması,
Merchant başlığı, görsel alt metni.

**Ürünler:** Filtre (XML’de olanlar, kapsam dışı, fiyat/görsel eksik, Merchant alanı eksik, SEO girilmemiş) ve satırlarda durum rozetleri.
Ürünleri seçince **XML’e dahil et / XML’den çıkar / varsayılan** ve toplu alan atama (marka, Google kategorisi, kategori taşıma, durum, stok, etiketler…) çıkar.

**Site Ayarları → Google Merchant:** “XML kapsamı” = tüm ürünler (hariç tuttuklarım dışında) ya da yalnızca “XML’e dahil et” işaretlediklerim.
Üstteki XML durumu kartı dil bazında ürün sayısını ve eksikleri gösterir.


## Yeni (Pro) özellikler
**Canlı Merchant XML:** `https://alanadiniz.com/google-merchant.xml` (diğer diller `/en/google-merchant.xml` …) dosya değil canlı bağlantıdır; ürün ekleme/silme/fiyat/stok değişince kendiliğinden güncellenir. Ürün düzenleyicide **Stok adedi** girilirse akışa `sell_on_google_quantity` ve stok durumu yazılır (0 = stokta yok). Excel şablonunda **Stok adedi** sütunu vardır.

**WhatsApp siparişi:** Site Ayarları → İletişim'den numara (905xxxxxxxxx veya 05xx…) ve dil başına mesaj şablonu ({urun} {kod} {adet} {link}) girilir. Ürün sayfasında müşteri adedi seçer; WhatsApp mesajına ürün bağlantısı ve adet otomatik yazılır. Stokta olmayan üründe buton kapanır.

**Banner Stüdyosu (Site Ayarları → Banner Stüdyosu):** her banner için görsel/ürün seçimi, sığdırma (kırp / tam sığdır / esnet), yakınlık ve konum, 20 hazır şekil + özel clip-path, rozet, tıklama bağlantısı (ürün, kategori, URL, WhatsApp). Masaüstü ve telefon önizlemesinde banner **sürüklenerek taşınır, köşe tutamağıyla boyutlandırılır**; ayarlar cihaza göre ayrı kaydedilir ve otomatik yayına girer.

**Depo ve Veritabanı:** ürün silinince görselleri depodan otomatik silinir; ayrıca kullanılmayan görselleri tarayıp temizleyen araç ve veritabanı boyutu göstergesi vardır.

**Toplu otomatik SEO (Site Ayarları → SEO):** tüm ürünler ve diller için SEO başlığı/açıklaması, Merchant başlığı ve görsel alt metni tek tıkla üretilir.
