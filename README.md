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
