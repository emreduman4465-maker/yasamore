/* Aurelya — statik site üretici (tarayıcıda ve Node’da çalışır). build(data) → {dosyaYolu: metin | {b64}} */
(function (root) {
'use strict';
var L = { tr:{n:'Türkçe',dir:'ltr',loc:'tr_TR'}, en:{n:'English',dir:'ltr',loc:'en_US'}, de:{n:'Deutsch',dir:'ltr',loc:'de_DE'}, fr:{n:'Français',dir:'ltr',loc:'fr_FR'}, ar:{n:'العربية',dir:'rtl',loc:'ar_AR'} };
var U = {
 tr:{all:'Tüm ürünler',cats:'Kategoriler',ord:'WhatsApp ile sipariş ver',code:'Ürün kodu',cat:'Kategori',rel:'Benzer ürünler',home:'Ana sayfa',rights:'Tüm hakları saklıdır.',wa:'Merhaba, bu ürün hakkında bilgi almak istiyorum:',nf:'Sayfa bulunamadı',nfd:'Aradığınız sayfa mevcut değil.',feat:'Öne çıkan ürünler',skip:'İçeriğe geç',hero1:'Koleksiyonu keşfet',hero2:'WhatsApp’tan yaz',newin:'Yeni gelenler',coll:'Koleksiyonlar',items:'ürün',from:'Başlangıç fiyatı',v1:['Hızlı kargo','Siparişiniz özenle paketlenip hızla yola çıkar.'],v2:['Güvenli alışveriş','Sorunsuz ve güvenli sipariş süreci.'],v3:['Hediye paketi','Özel günler için şık paketleme.'],v4:['WhatsApp destek','Sorularınız için hemen yazın.'],story:'Hikâyemiz',storyD:'{store}, evinize sıcaklık ve ışıltı katan dekoratif ürünleri özenle seçer. Çerçevelerden sunumluklara, söz ve nişan setlerinden hediyelik objelere kadar her parça yaşam alanınıza zarafet katmak için burada.',contact:'İletişim',quick:'Hızlı bağlantılar',spec:'Ürün bilgileri',ship:'Teslimat ve iade',shipT:'Siparişler 1–3 iş günü içinde kargoya verilir. Teslimat ve iade koşulları için bize WhatsApp’tan yazabilirsiniz.',ctaT:'Aradığınızı bulamadınız mı?',ctaD:'Bize yazın, size özel öneriler sunalım.',col:'Koleksiyon',explore:'İncele',disc:'İndirim'},
 en:{all:'All products',cats:'Categories',ord:'Order via WhatsApp',code:'Product code',cat:'Category',rel:'Related products',home:'Home',rights:'All rights reserved.',wa:'Hello, I would like information about this product:',nf:'Page not found',nfd:'The page you are looking for does not exist.',feat:'Featured products',skip:'Skip to content',hero1:'Explore the collection',hero2:'Chat on WhatsApp',newin:'New arrivals',coll:'Collections',items:'items',from:'Starting at',v1:['Fast shipping','Your order is carefully packed and shipped quickly.'],v2:['Safe shopping','A smooth and secure ordering process.'],v3:['Gift wrapping','Elegant packaging for special occasions.'],v4:['WhatsApp support','Message us with any question.'],story:'Our story',storyD:'{store} carefully selects decorative pieces that bring warmth and sparkle to your home. From frames and serving pieces to engagement sets and gift objects, every item is here to add elegance to your space.',contact:'Contact',quick:'Quick links',spec:'Product details',ship:'Shipping & returns',shipT:'Orders ship within 1–3 business days. Message us on WhatsApp for shipping and return details.',ctaT:'Can’t find what you need?',ctaD:'Write to us and we’ll suggest something just for you.',col:'Collection',explore:'Explore',disc:'Sale'},
 de:{all:'Alle Produkte',cats:'Kategorien',ord:'Per WhatsApp bestellen',code:'Artikelnummer',cat:'Kategorie',rel:'Ähnliche Produkte',home:'Startseite',rights:'Alle Rechte vorbehalten.',wa:'Hallo, ich möchte Informationen zu diesem Produkt:',nf:'Seite nicht gefunden',nfd:'Die gesuchte Seite existiert nicht.',feat:'Beliebte Produkte',skip:'Zum Inhalt springen',hero1:'Kollektion entdecken',hero2:'Per WhatsApp schreiben',newin:'Neuheiten',coll:'Kollektionen',items:'Artikel',from:'Ab',v1:['Schneller Versand','Ihre Bestellung wird sorgfältig verpackt und zügig versendet.'],v2:['Sicher einkaufen','Ein reibungsloser, sicherer Bestellprozess.'],v3:['Geschenkverpackung','Elegante Verpackung für besondere Anlässe.'],v4:['WhatsApp-Support','Schreiben Sie uns bei Fragen.'],story:'Unsere Geschichte',storyD:'{store} wählt dekorative Stücke aus, die Ihrem Zuhause Wärme und Glanz verleihen. Von Rahmen über Servierstücke bis zu Verlobungssets und Geschenken – jedes Teil bringt Eleganz in Ihren Wohnraum.',contact:'Kontakt',quick:'Schnellzugriff',spec:'Produktdetails',ship:'Versand & Rückgabe',shipT:'Bestellungen werden innerhalb von 1–3 Werktagen versendet. Details zu Versand und Rückgabe per WhatsApp.',ctaT:'Nicht gefunden, was Sie suchen?',ctaD:'Schreiben Sie uns – wir beraten Sie gern.',col:'Kollektion',explore:'Ansehen',disc:'Sale'},
 fr:{all:'Tous les produits',cats:'Catégories',ord:'Commander par WhatsApp',code:'Référence',cat:'Catégorie',rel:'Produits similaires',home:'Accueil',rights:'Tous droits réservés.',wa:'Bonjour, je souhaite des informations sur ce produit :',nf:'Page introuvable',nfd:'La page demandée n’existe pas.',feat:'Produits phares',skip:'Aller au contenu',hero1:'Découvrir la collection',hero2:'Écrire sur WhatsApp',newin:'Nouveautés',coll:'Collections',items:'articles',from:'À partir de',v1:['Livraison rapide','Votre commande est soigneusement emballée et expédiée rapidement.'],v2:['Achat sécurisé','Un processus de commande simple et sûr.'],v3:['Emballage cadeau','Un emballage élégant pour les grandes occasions.'],v4:['Assistance WhatsApp','Écrivez-nous pour toute question.'],story:'Notre histoire',storyD:'{store} sélectionne des pièces décoratives qui apportent chaleur et éclat à votre maison. Des cadres aux pièces de service, des sets de fiançailles aux objets cadeaux, chaque pièce embellit votre intérieur.',contact:'Contact',quick:'Liens rapides',spec:'Détails du produit',ship:'Livraison et retours',shipT:'Les commandes sont expédiées sous 1 à 3 jours ouvrés. Écrivez-nous sur WhatsApp pour les conditions de livraison et de retour.',ctaT:'Vous ne trouvez pas ce que vous cherchez ?',ctaD:'Écrivez-nous, nous vous conseillerons volontiers.',col:'Collection',explore:'Découvrir',disc:'Promo'},
 ar:{all:'جميع المنتجات',cats:'الفئات',ord:'اطلب عبر واتساب',code:'رمز المنتج',cat:'الفئة',rel:'منتجات مشابهة',home:'الرئيسية',rights:'جميع الحقوق محفوظة.',wa:'مرحباً، أرغب في معلومات عن هذا المنتج:',nf:'الصفحة غير موجودة',nfd:'الصفحة المطلوبة غير موجودة.',feat:'منتجات مميزة',skip:'انتقل إلى المحتوى',hero1:'اكتشف المجموعة',hero2:'راسلنا على واتساب',newin:'وصل حديثاً',coll:'المجموعات',items:'منتج',from:'ابتداءً من',v1:['شحن سريع','يتم تغليف طلبك بعناية وشحنه بسرعة.'],v2:['تسوق آمن','عملية طلب سلسة وآمنة.'],v3:['تغليف هدايا','تغليف أنيق للمناسبات الخاصة.'],v4:['دعم واتساب','راسلنا لأي سؤال.'],story:'قصتنا',storyD:'تختار {store} قطع ديكور تضفي الدفء واللمعان على منزلك. من الإطارات وأدوات التقديم إلى أطقم الخطوبة والهدايا، كل قطعة تضيف الأناقة إلى مساحتك.',contact:'تواصل معنا',quick:'روابط سريعة',spec:'تفاصيل المنتج',ship:'الشحن والإرجاع',shipT:'يتم شحن الطلبات خلال 1–3 أيام عمل. راسلنا على واتساب لمعرفة تفاصيل الشحن والإرجاع.',ctaT:'لم تجد ما تبحث عنه؟',ctaD:'راسلنا وسنقترح عليك ما يناسبك.',col:'مجموعة',explore:'استعرض',disc:'خصم'},
};
var TRM = {'ç':'c','ğ':'g','ı':'i','ö':'o','ş':'s','ü':'u','â':'a','î':'i','û':'u'};
function slugify(s){ return String(s||'').toLowerCase().replace(/[çğıöşüâîû]/g,function(c){return TRM[c]}).replace(/&/g,' ve ').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,80); }
function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]}); }
function plain(s){ return String(s||'').replace(/\*\*/g,'').replace(/\s*;\s*-\s*/g,'. ').replace(/^\s*-\s*/,'').replace(/\s+/g,' ').trim(); }
function clip(s,n){ return s.length<=n?s:s.slice(0,n-1).replace(/\s+\S*$/,'')+'…'; }
function bullets(s){ return String(s||'').replace(/\*\*/g,'').split(/;\s*(?=-\s)|\n/).map(function(x){return x.replace(/^\s*-\s*/,'').trim()}).filter(Boolean); }
function tx(o,l){ return o&&typeof o==='object'?String(o[l]||'').trim():''; }

var CSS = ":root{--ac:#b08d57;--acd:#8a6a38;--bg:#faf6ef;--card:#fff;--ink:#2a2420;--mut:#74685d;--line:#e9e0d1;--soft:#f3ebdd;--dk:#2a2018;--dkt:#f3e9d8}@media(prefers-color-scheme:dark){:root{--bg:#171310;--card:#221d19;--ink:#f1ebe2;--mut:#b0a598;--line:#3a342d;--soft:#2a2420;--dk:#0f0c0a}}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--ink);font:400 16px/1.65 Jost,system-ui,-apple-system,Segoe UI,sans-serif}a{color:inherit}img{max-width:100%}h1,h2,h3,.sf{font-family:\"Cormorant Garamond\",Georgia,serif;font-weight:500;line-height:1.1;margin:0}em{font-style:italic;color:var(--ac)}.w{max-width:1240px;margin:0 auto;padding:0 24px}.skip{position:absolute;left:-999px}.skip:focus{left:8px;top:8px;background:var(--card);padding:8px;z-index:99}.ann{background:var(--dk);color:var(--dkt);text-align:center;font-size:13px;letter-spacing:.06em;padding:8px 12px}.hdr{position:sticky;top:0;z-index:50;background:var(--bg);border-bottom:1px solid var(--line)}.hd{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:16px;padding:14px 24px}nav.mn{display:flex;gap:20px;font-size:14px;letter-spacing:.03em}nav.mn a{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:170px}nav.mn a{text-decoration:none;color:var(--mut);position:relative}nav.mn a:after{content:\"\";position:absolute;left:0;bottom:-4px;height:1px;width:0;background:var(--ac);transition:width .25s}nav.mn a:hover{color:var(--ink)}nav.mn a:hover:after{width:100%}.brand{display:flex;align-items:center;gap:10px;text-decoration:none;font:500 30px \"Cormorant Garamond\",Georgia,serif;letter-spacing:.03em}.brand img{height:64px;width:auto;max-width:260px;object-fit:contain}.lg{display:flex;gap:4px;justify-content:flex-end;font-size:12px}.lg a{text-decoration:none;color:var(--mut);padding:4px 8px;border-radius:99px}.lg a.on{background:var(--ink);color:var(--bg)}.mb{display:none;background:none;border:0;font-size:24px;color:var(--ink);cursor:pointer;justify-self:start}@media(max-width:900px){.hd{grid-template-columns:auto 1fr auto}.mb{display:block}nav.mn{display:none;position:absolute;left:0;right:0;top:100%;background:var(--bg);flex-direction:column;padding:18px 24px;border-bottom:1px solid var(--line)}nav.mn.open{display:flex}.brand{justify-self:center;font-size:24px}.brand img{max-height:var(--lm,54px);max-width:190px}}.eyebrow{font-size:12px;letter-spacing:.28em;text-transform:uppercase;color:var(--ac);display:flex;align-items:center;gap:12px}.eyebrow:before{content:\"\";width:40px;height:1px;background:var(--ac)}.hero{display:grid;grid-template-columns:1.05fr 1fr;gap:50px;align-items:center;padding:60px 0 56px}.hero h1{font-size:clamp(46px,7vw,96px);margin:16px 0 18px}.lead{color:var(--mut);max-width:520px;font-size:18px;margin:0}.cta{display:flex;gap:12px;flex-wrap:wrap;margin-top:26px}.btn{display:inline-block;background:var(--ac);color:#fff;text-decoration:none;padding:14px 28px;border-radius:99px;letter-spacing:.05em;font-size:14px;transition:transform .2s,background .2s}.btn:hover{background:var(--acd);transform:translateY(-2px)}.btn.o{background:transparent;color:var(--ink);border:1px solid var(--ink)}.btn.o:hover{background:var(--ink);color:var(--bg)}.hc{position:relative;display:grid;grid-template-columns:1fr 1fr;gap:14px;align-items:end}.hc:before{content:\"\";position:absolute;width:75%;aspect-ratio:1;border:1px solid var(--ac);border-radius:50%;right:-6%;top:-8%;opacity:.55}.arch{border-radius:999px 999px 18px 18px;overflow:hidden;background:var(--soft);position:relative}.arch img{width:100%;height:100%;object-fit:cover;display:block}.a1{aspect-ratio:3/4.3}.a2{aspect-ratio:3/3.2}.bdg{position:absolute;left:-10px;bottom:34px;background:var(--card);border:1px solid var(--line);border-radius:16px;padding:12px 18px;box-shadow:0 14px 34px rgba(0,0,0,.14);animation:fl 5s ease-in-out infinite;z-index:3;line-height:1.2}.bdg small{color:var(--mut);font-size:12px}@keyframes fl{50%{transform:translateY(-8px)}}@media(max-width:860px){.hero{grid-template-columns:1fr;padding-top:34px}}.mq{overflow:hidden;border-block:1px solid var(--line);background:var(--soft);padding:14px 0;white-space:nowrap}.mq div{display:inline-block;animation:mq 45s linear infinite;font:italic 500 28px \"Cormorant Garamond\",Georgia,serif;color:var(--acd)}.mq span{margin:0 26px}.mq i{color:var(--ac);font-style:normal;margin-inline-start:26px}@keyframes mq{to{transform:translateX(-50%)}}.sh{display:flex;justify-content:space-between;align-items:end;margin:76px 0 26px;gap:20px}.sh h2{font-size:clamp(34px,4.6vw,56px)}.sh a{font-size:14px;color:var(--ac);text-decoration:none;white-space:nowrap}.mo{display:grid;grid-template-columns:repeat(4,1fr);grid-auto-rows:230px;gap:16px}.mo a{position:relative;border-radius:18px;overflow:hidden;text-decoration:none;color:#fff;background:var(--soft)}.mo a:first-child{grid-column:span 2;grid-row:span 2}.mo img{width:100%;height:100%;object-fit:cover;transition:transform .6s;display:block}.mo a:hover img{transform:scale(1.07)}.mo a:after{content:\"\";position:absolute;inset:0;background:linear-gradient(transparent 40%,rgba(20,12,6,.75))}.mo b{position:absolute;left:20px;right:20px;bottom:16px;z-index:2;font:500 27px/1.15 \"Cormorant Garamond\",Georgia,serif}.mo small{display:block;font:400 12px Jost,sans-serif;letter-spacing:.12em;text-transform:uppercase;opacity:.85}@media(max-width:900px){.mo{grid-template-columns:repeat(2,1fr);grid-auto-rows:170px}.mo a:first-child{grid-row:span 1}}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:30px 20px}.card{text-decoration:none;display:block}.ph{aspect-ratio:1;background:linear-gradient(135deg,var(--soft),var(--line));overflow:hidden;border-radius:16px;position:relative}.ph img{width:100%;height:100%;object-fit:cover;display:block;transition:opacity .4s,transform .6s}.ph img.h{position:absolute;inset:0;opacity:0}.card:hover .ph img.h{opacity:1}.card:hover .ph img{transform:scale(1.04)}.bg{position:absolute;top:12px;left:12px;background:var(--ink);color:var(--bg);font-size:12px;padding:3px 11px;border-radius:99px;z-index:2}.card .b{padding:12px 2px}.card .c{font-size:11px;color:var(--ac);letter-spacing:.14em;text-transform:uppercase;min-height:16px}.card .n{margin:3px 0 6px;font:500 21px/1.2 \"Cormorant Garamond\",Georgia,serif;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.old{text-decoration:line-through;color:var(--mut);margin-inline-end:8px;font-size:14px}.pr{font-weight:500}.ed{background:var(--dk);color:var(--dkt);border-radius:28px;display:grid;grid-template-columns:1fr 1fr;gap:34px;align-items:center;padding:56px;margin:84px 0;overflow:hidden}.ed h2{font-size:clamp(36px,4.8vw,62px);margin:14px 0}.ed p{opacity:.8;max-width:460px}.ed .eyebrow{color:#d7b57e}.ed .eyebrow:before{background:#d7b57e}.ed .imgs{display:grid;grid-template-columns:1fr 1fr;gap:14px}.ed .arch{aspect-ratio:3/4}.ed .arch:nth-child(2){margin-top:44px}.ed .btn{background:#d7b57e;color:#2a2018}@media(max-width:800px){.ed{grid-template-columns:1fr;padding:30px}}.vs{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:20px}.v{text-align:center;padding:26px 18px;border:1px solid var(--line);border-radius:18px;background:var(--card)}.v svg{width:34px;height:34px;stroke:var(--ac);fill:none;stroke-width:1.5}.v h3{font-size:23px;margin:10px 0 4px}.v p{margin:0;color:var(--mut);font-size:14px}.st{display:grid;grid-template-columns:.9fr 1.1fr;gap:56px;align-items:center;margin:90px 0}.st .arch{aspect-ratio:4/5;max-width:420px;width:100%}.st h2{font-size:clamp(38px,5vw,66px);margin:14px 0}.st p{color:var(--mut);font-size:18px}@media(max-width:800px){.st{grid-template-columns:1fr}}.cb{text-align:center;padding:72px 20px;border-radius:28px;background:linear-gradient(135deg,var(--soft),var(--line));margin:0 0 20px}.cb h2{font-size:clamp(32px,4.2vw,54px)}.cb p{color:var(--mut)}footer{background:var(--dk);color:var(--dkt);margin-top:70px;padding:60px 0 28px}.fg{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:40px}.fg h4{font:500 24px \"Cormorant Garamond\",Georgia,serif;margin:0 0 12px}.fg a{display:block;text-decoration:none;opacity:.8;margin:4px 0}.fg a:hover{opacity:1;color:#d7b57e}.fg p{opacity:.75;max-width:380px;margin:0}.cp{border-top:1px solid rgba(255,255,255,.12);margin-top:36px;padding-top:18px;text-align:center;font-size:13px;opacity:.6}@media(max-width:800px){.fg{grid-template-columns:1fr}}.ph1{padding:46px 0 24px}.ph1 h1{font-size:clamp(40px,6vw,76px)}.crumb{font-size:13px;color:var(--mut);padding:22px 0 0}.crumb a{text-decoration:none}.pd{display:grid;grid-template-columns:1.05fr 1fr;gap:54px;padding:20px 0 30px;align-items:start}.gal{position:sticky;top:90px}.big{border-radius:20px;overflow:hidden;aspect-ratio:1;background:var(--soft)}.big img{width:100%;height:100%;object-fit:cover;display:block}.th{display:flex;gap:10px;margin-top:12px;flex-wrap:wrap}.th img{width:72px;height:72px;object-fit:cover;border-radius:12px;border:1px solid var(--line);cursor:pointer}.pd h1{font-size:clamp(34px,4.4vw,54px);margin:10px 0 12px}.price{font-size:30px;margin:8px 0 18px;display:flex;align-items:center;gap:12px;flex-wrap:wrap}.price .bg{position:static}ul.f{list-style:none;padding:0;margin:0 0 20px}ul.f li{padding:7px 0 7px 28px;position:relative;color:var(--mut)}ul.f li:before{content:\"\u2726\";position:absolute;left:0;color:var(--ac)}[dir=rtl] ul.f li{padding:7px 28px 7px 0}[dir=rtl] ul.f li:before{left:auto;right:0}.tr{display:flex;gap:16px;flex-wrap:wrap;margin:22px 0;font-size:13px;color:var(--mut)}.tr span:before{content:\"\u2713 \";color:var(--ac)}details{border-top:1px solid var(--line);padding:14px 0}details:last-of-type{border-bottom:1px solid var(--line)}summary{cursor:pointer;font:500 23px \"Cormorant Garamond\",Georgia,serif}details p{color:var(--mut);margin:8px 0 0}@media(max-width:800px){.pd{grid-template-columns:1fr}.gal{position:static}}.js .rv{opacity:0;transform:translateY(26px);transition:opacity .8s,transform .8s}.js .rv.in{opacity:1;transform:none}@media(prefers-reduced-motion:reduce){.js .rv{opacity:1;transform:none}.mq div,.bdg{animation:none}}nav.mn .dd{position:relative;padding:10px 0}nav.mn .dm{display:none;position:absolute;top:100%;left:-14px;min-width:230px;flex-direction:column;gap:2px;background:var(--card);border:1px solid var(--line);border-radius:14px;padding:8px;box-shadow:0 18px 40px rgba(0,0,0,.14);z-index:70}[dir=rtl] nav.mn .dm{left:auto;right:-14px}nav.mn .dd:hover .dm,nav.mn .dd:focus-within .dm{display:flex}nav.mn .dm a{max-width:none;padding:9px 14px;border-radius:9px;color:var(--ink)}nav.mn .dm a:after{display:none}nav.mn .dm a:hover{background:var(--soft)}@media(max-width:900px){nav.mn .dd{padding:0}nav.mn .dm{display:flex;position:static;border:0;box-shadow:none;background:none;padding:2px 0 6px 14px;min-width:0}}.chips{display:flex;gap:10px;flex-wrap:wrap;margin:6px 0 26px}.chips a{display:inline-flex;align-items:center;gap:8px;text-decoration:none;border:1px solid var(--line);background:var(--card);border-radius:99px;padding:8px 18px;font-size:14px;transition:background .2s,color .2s}.chips a small{font-size:11px;color:var(--mut)}.chips a:hover,.chips a.on{background:var(--ink);color:var(--bg);border-color:var(--ink)}.chips a:hover small,.chips a.on small{color:var(--bg);opacity:.75}.fg a.s{padding-inline-start:14px;font-size:14px;opacity:.65}.legal{max-width:820px;margin:0 auto;padding:10px 0 50px}.legal h1{font-size:clamp(34px,5vw,56px);margin:10px 0 18px}.legal h2{font-size:26px;margin:30px 0 8px}.legal p,.legal li{color:var(--mut)}.legal li{margin:4px 0}.legal mark{background:#ffe9a8;color:#2a2420;padding:0 4px;border-radius:4px}.legal b{color:var(--ink)}.lgl{display:flex;flex-wrap:wrap;gap:8px 22px;margin-top:34px;font-size:13px}.lgl a{text-decoration:none;opacity:.75}.lgl a:hover{opacity:1;color:#d7b57e}.fi{margin-top:14px;font-size:12px;opacity:.55;max-width:760px}.ck{display:none;position:fixed;left:16px;right:16px;bottom:16px;max-width:640px;margin:0 auto;background:var(--card);border:1px solid var(--line);border-radius:16px;padding:18px 20px;box-shadow:0 18px 50px rgba(0,0,0,.22);z-index:90;font-size:14px}.ck.show{display:block}.ck p{margin:0}.ck a{color:var(--ac)}.ck .b2{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px}.ck button{font:inherit;cursor:pointer;border-radius:99px;padding:9px 22px;border:1px solid var(--ink);background:var(--ink);color:var(--bg)}.ck button+button{background:transparent;color:var(--ink)}";
var JS = "function aurInit(){var els=document.querySelectorAll(\".rv:not(.in)\");if(!(\"IntersectionObserver\" in window)){els.forEach(function(e){e.classList.add(\"in\")})}else{var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add(\"in\");io.unobserve(e.target)}})},{threshold:.1});els.forEach(function(e){io.observe(e)})}var b=document.querySelector(\".mb\"),n=document.querySelector(\"nav.mn\");if(b&&n)b.onclick=function(){b.setAttribute(\"aria-expanded\",n.classList.toggle(\"open\"))}}document.addEventListener(\"click\",function(e){var t=e.target;if(t.dataset&&t.dataset.big){var b=document.getElementById(\"big\");if(b)b.src=t.dataset.big}});if(document.readyState!==\"loading\")aurInit();else document.addEventListener(\"DOMContentLoaded\",aurInit);";
JS += "(function(){var K='aur_ck',b=document.getElementById('ck');function ga(){var id=window.AUR_GA;if(!id||window.AUR_GAL)return;window.AUR_GAL=1;var s=document.createElement('script');s.async=1;s.src='https://www.googletagmanager.com/gtag/js?id='+id;document.head.appendChild(s);window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config',id)}var v;try{v=localStorage.getItem(K)}catch(e){}if(v==='1')ga();else if(!v&&b)b.className+=' show';document.addEventListener('click',function(e){var t=e.target;if(t.dataset&&t.dataset.ck){try{localStorage.setItem(K,t.dataset.ck)}catch(x){}if(b)b.className='ck';if(t.dataset.ck==='1')ga()}if(t.id==='ckopen'){e.preventDefault();if(b)b.className='ck show'}})})();";

/* ---------- Yasal sayfalar (KVKK, gizlilik, çerez, mesafeli satış, iade, kullanım koşulları) ---------- */
var LGL = [['kvkk', 'kvkk'], ['gizlilik-politikasi', 'gizlilik'], ['cerez-politikasi', 'cerez'], ['mesafeli-satis-sozlesmesi', 'mesafeli'], ['iade-ve-degisim', 'iade'], ['kullanim-kosullari', 'kosullar']];
var CP_RESERVED = ['urun', 'urunler', 'kategori', 'yonetim', 'api', 'assets', 'en', 'de', 'fr', 'ar', 'tr', '404', 'sitemap', 'robots', 'style', 'app', 'custom', 'google-merchant'].concat(LGL.map(function (x) { return x[0]; }));
var LN = {
  tr: { kvkk: 'KVKK Aydınlatma Metni', gizlilik: 'Gizlilik Politikası', cerez: 'Çerez Politikası', mesafeli: 'Mesafeli Satış Sözleşmesi', iade: 'İade ve Değişim', kosullar: 'Kullanım Koşulları', ckt: 'Bu site, ziyaret deneyimini ölçmek için analitik çerezler kullanır. Tercihinizi seçebilirsiniz.', cka: 'Kabul et', ckr: 'Reddet', cko: 'Çerez tercihleri', ckl: 'Çerez Politikası' },
  en: { kvkk: 'Privacy Notice (KVKK)', gizlilik: 'Privacy Policy', cerez: 'Cookie Policy', mesafeli: 'Distance Sales Agreement', iade: 'Returns & Exchanges', kosullar: 'Terms of Use', ckt: 'This site uses analytics cookies to measure visits. You can choose your preference.', cka: 'Accept', ckr: 'Reject', cko: 'Cookie settings', ckl: 'Cookie Policy' },
  de: { kvkk: 'Datenschutzhinweis (KVKK)', gizlilik: 'Datenschutzerklärung', cerez: 'Cookie-Richtlinie', mesafeli: 'Fernabsatzvertrag', iade: 'Rückgabe & Umtausch', kosullar: 'Nutzungsbedingungen', ckt: 'Diese Website verwendet Analyse-Cookies. Sie können Ihre Auswahl treffen.', cka: 'Akzeptieren', ckr: 'Ablehnen', cko: 'Cookie-Einstellungen', ckl: 'Cookie-Richtlinie' },
  fr: { kvkk: 'Avis de confidentialité (KVKK)', gizlilik: 'Politique de confidentialité', cerez: 'Politique relative aux cookies', mesafeli: 'Contrat de vente à distance', iade: 'Retours et échanges', kosullar: 'Conditions d’utilisation', ckt: 'Ce site utilise des cookies d’analyse. Vous pouvez choisir votre préférence.', cka: 'Accepter', ckr: 'Refuser', cko: 'Préférences cookies', ckl: 'Politique cookies' },
  ar: { kvkk: 'إشعار الخصوصية (KVKK)', gizlilik: 'سياسة الخصوصية', cerez: 'سياسة ملفات تعريف الارتباط', mesafeli: 'عقد البيع عن بُعد', iade: 'الإرجاع والاستبدال', kosullar: 'شروط الاستخدام', ckt: 'يستخدم هذا الموقع ملفات تعريف ارتباط تحليلية. يمكنك اختيار تفضيلك.', cka: 'قبول', ckr: 'رفض', cko: 'تفضيلات ملفات الارتباط', ckl: 'سياسة ملفات الارتباط' }
};
function legalDocs(S, hasGa) {
  var g = S.legal || {}, miss = [], brand = esc(S.name || ''), site = esc(String(S.siteUrl || '').replace(/\/+$/, ''));
  var f = function (k, label, optional) { var v = String(g[k] || '').trim(); if (!v) { if (optional) return ''; if (miss.indexOf(label) < 0) miss.push(label); return '<mark>[' + label + ' giriniz]</mark>'; } return esc(v); };
  var co = f('company', 'Ticari unvan'), ad = f('address', 'Adres'), vd = f('taxOffice', 'Vergi dairesi'), vn = f('taxNo', 'Vergi no'), ph = (function () { var v = String(g.phone || (S.whatsapp ? '+' + S.whatsapp : '')).trim(); if (!v) { miss.push('Telefon'); return '<mark>[Telefon giriniz]</mark>'; } return esc(v); })();
  var em = (function () { var v = String(S.email || '').trim(); if (!v) { miss.push('E-posta'); return '<mark>[E-posta giriniz]</mark>'; } return esc(v); })();
  var mer = f('mersis', 'MERSİS', true), kep = f('kep', 'KEP', true);
  var info = '<p><b>Ticari unvan:</b> ' + co + '<br><b>Marka / Web sitesi:</b> ' + brand + ' — ' + site + '<br><b>Adres:</b> ' + ad + '<br><b>Vergi dairesi / Vergi no:</b> ' + vd + ' / ' + vn + (mer ? '<br><b>MERSİS no:</b> ' + mer : '') + '<br><b>Telefon:</b> ' + ph + '<br><b>E-posta:</b> ' + em + (kep ? '<br><b>KEP adresi:</b> ' + kep : '') + '</p>';
  var H = function (t) { return '<h2>' + t + '</h2>'; }, Pp = function (t) { return '<p>' + t + '</p>'; }, UL = function (a) { return '<ul>' + a.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>'; };
  var today = new Date().toISOString().slice(0, 10).split('-').reverse().join('.');
  var upd = Pp('<small>Son güncelleme: ' + today + '</small>');
  var D = {};

  D.kvkk = upd + Pp(`${brand} olarak kişisel verilerinizin güvenliğine önem veriyoruz. Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) m.10 ve Aydınlatma Yükümlülüğünün Yerine Getirilmesinde Uyulacak Usul ve Esaslar Hakkında Tebliğ kapsamında, veri sorumlusu sıfatıyla sizi bilgilendirmek amacıyla hazırlanmıştır.`) +
    H('1. Veri sorumlusu') + info +
    H('2. İşlenen kişisel veriler ve toplanma yöntemi') + UL([
      '<b>Kimlik ve iletişim bilgileri:</b> ad-soyad, telefon numarası, e-posta, teslimat/fatura adresi — WhatsApp, e-posta veya telefon üzerinden sipariş ve talepleriniz sırasında, sözlü/yazılı/elektronik yolla toplanır.',
      '<b>Müşteri işlem bilgileri:</b> sipariş içeriği, fiyat, teslimat ve iade kayıtları, talep ve şikâyetleriniz.',
      '<b>İşlem güvenliği ve kullanım bilgileri:</b> IP adresi, tarayıcı ve cihaz bilgisi, ziyaret edilen sayfalar — siteyi ziyaret ettiğinizde otomatik yollarla ve çerezler aracılığıyla toplanır (ayrıntı için Çerez Politikası).',
      '<b>Pazarlama bilgileri:</b> yalnızca açık rızanız bulunması hâlinde, kampanya ve duyuru iletişimi için iletişim tercihleriniz.'
    ]) +
    H('3. Kişisel verilerin işlenme amaçları') + UL(['Sipariş ve taleplerinizin alınması, sözleşmenin kurulması ve ifası, ürünün teslimi', 'Faturalandırma, muhasebe ve mali yükümlülüklerin yerine getirilmesi', 'İade, değişim, cayma ve ayıplı mal süreçlerinin yürütülmesi', 'Müşteri ilişkileri, destek ve şikâyet yönetimi', 'Web sitesinin güvenliğinin sağlanması ve performansının iyileştirilmesi', 'Hukuki yükümlülüklerin yerine getirilmesi ve yetkili kurumlara bilgi verilmesi', 'Açık rızanız hâlinde ticari elektronik ileti gönderimi']) +
    H('4. Hukuki sebepler') + Pp('Verileriniz KVKK m.5/2 kapsamında; (c) bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması, (ç) veri sorumlusunun hukuki yükümlülüğünü yerine getirmesi, (e) bir hakkın tesisi, kullanılması veya korunması için zorunlu olması ve (f) temel hak ve özgürlüklerinize zarar vermemek kaydıyla veri sorumlusunun meşru menfaati hukuki sebeplerine; pazarlama ve isteğe bağlı çerezler bakımından ise açık rızanıza dayanılarak işlenir.') +
    H('5. Kişisel verilerin aktarılması') + Pp('Kişisel verileriniz; yukarıdaki amaçlarla sınırlı olarak ve KVKK m.8 ile m.9 hükümlerine uygun şekilde; kargo ve lojistik firmalarına, (varsa) ödeme kuruluşları ve bankalara, mali müşavir/muhasebe hizmeti sağlayıcılarına, web sitesi barındırma, altyapı ve (açık rızanız hâlinde) analitik hizmet sağlayıcılarına ve mevzuatın gerektirdiği hâllerde yetkili kamu kurum ve kuruluşlarına aktarılabilir. Hizmet sağlayıcıların bir kısmı yurt dışında bulunabilir; bu durumda aktarım KVKK m.9 uyarınca yapılır.') +
    H('6. Saklama süresi') + Pp('Verileriniz, işleme amacının gerektirdiği süre ve ilgili mevzuatta (Türk Ticaret Kanunu, Vergi Usul Kanunu, Tüketicinin Korunması Hakkında Kanun vb.) öngörülen saklama süreleri boyunca saklanır; sürenin sonunda silinir, yok edilir veya anonim hâle getirilir.') +
    H('7. KVKK m.11 kapsamındaki haklarınız') + UL(['Kişisel verilerinizin işlenip işlenmediğini öğrenme', 'İşlenmişse buna ilişkin bilgi talep etme', 'İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme', 'Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme', 'Eksik veya yanlış işlenmişse düzeltilmesini isteme', 'KVKK m.7 çerçevesinde silinmesini veya yok edilmesini isteme ve bu işlemlerin aktarıldığı üçüncü kişilere bildirilmesini isteme', 'İşlenen verilerin münhasıran otomatik sistemlerle analiz edilmesi suretiyle aleyhinize bir sonuç doğmasına itiraz etme', 'Kanuna aykırı işleme nedeniyle zarara uğramanız hâlinde zararın giderilmesini talep etme']) +
    H('8. Başvuru yöntemi') + Pp(`Haklarınıza ilişkin taleplerinizi, kimliğinizi tespit edecek bilgi ve belgelerle birlikte; yukarıda belirtilen adrese yazılı olarak, ${kep ? 'KEP adresimize ' : ''}veya ${em} e-posta adresine iletebilirsiniz. Talepleriniz niteliğine göre en geç 30 gün içinde ücretsiz olarak sonuçlandırılır; işlemin ayrıca bir maliyet gerektirmesi hâlinde Kişisel Verileri Koruma Kurulu’nca belirlenen tarife uygulanabilir. Başvurunuzun reddedilmesi, cevabın yetersiz bulunması veya süresinde cevap verilmemesi hâlinde, cevabı öğrendiğiniz tarihten itibaren 30 gün ve her hâlde başvuru tarihinden itibaren 60 gün içinde Kişisel Verileri Koruma Kurulu’na şikâyette bulunabilirsiniz.`);

  D.gizlilik = upd + Pp(`${brand} (“Site”) olarak ziyaretçilerimizin ve müşterilerimizin gizliliğine saygı duyuyoruz. Bu politika, Site’yi kullanırken hangi bilgilerin nasıl işlendiğini özetler. Ayrıntılı bilgi için KVKK Aydınlatma Metni’ni inceleyiniz.`) +
    H('Hizmet sağlayıcı') + info +
    H('Hangi bilgileri topluyoruz?') + UL(['Siparişiniz veya talebiniz için WhatsApp, e-posta ya da telefonla paylaştığınız ad-soyad, telefon, adres ve sipariş bilgileri', 'Siteyi ziyaretiniz sırasında otomatik toplanan teknik veriler (IP adresi, tarayıcı türü, cihaz, ziyaret edilen sayfalar)', 'Çerez tercihleriniz']) +
    H('Bilgileri nasıl kullanıyoruz?') + Pp('Bilgileriniz yalnızca siparişlerinizi ve taleplerinizi yerine getirmek, size destek sağlamak, yasal yükümlülüklerimize uymak ve Site’yi iyileştirmek için kullanılır. Kişisel verileriniz satılmaz; yalnızca hizmetin sunulması için gerekli olduğu ölçüde kargo, barındırma ve benzeri hizmet sağlayıcılarla paylaşılır.') +
    H('Üçüncü taraf hizmetler') + Pp('Site; yazı tipleri için Google Fonts, sipariş iletişimi için WhatsApp (Meta) bağlantıları kullanır' + (hasGa ? ' ve onayınız hâlinde ziyaret istatistikleri için Google Analytics kullanır' : '') + '. Bu hizmetler kendi gizlilik politikalarına tabidir ve bağlantı sırasında IP adresiniz bu sağlayıcılara iletilebilir. Sitemiz üçüncü taraf sitelere bağlantı içerebilir; bu sitelerin içeriğinden ve gizlilik uygulamalarından sorumlu değiliz.') +
    H('Güvenlik') + Pp('Kişisel verilerinizin hukuka aykırı işlenmesini ve erişilmesini önlemek için makul idari ve teknik tedbirler alırız. Ancak internet üzerinden iletimin tamamen güvenli olduğu garanti edilemez.') +
    H('Haklarınız ve iletişim') + Pp(`KVKK m.11 kapsamındaki haklarınızı kullanmak veya sorularınız için ${em} adresine yazabilirsiniz.`) +
    H('Değişiklikler') + Pp('Bu politika gerektiğinde güncellenebilir; güncel sürüm bu sayfada yayımlanır.');

  D.cerez = upd + Pp(`Bu politika, ${brand} web sitesinde kullanılan çerezleri ve tercihlerinizi nasıl yönetebileceğinizi açıklar. Çerezler, siteyi ziyaret ettiğinizde cihazınıza kaydedilen küçük metin dosyalarıdır.`) +
    H('Kullanılan çerez ve benzeri teknolojiler') + UL(['<b>Zorunlu:</b> Çerez tercihinizi hatırlamak için tarayıcınızın yerel depolamasında yalnızca tercih bilginiz saklanır. Siteyi çalıştırmak için zorunludur, açık rıza gerektirmez.', hasGa ? '<b>Analitik (Google Analytics):</b> Ziyaretçi sayısı ve sayfa kullanımı gibi istatistikleri anonim/toplu olarak ölçmek için kullanılır. <u>Yalnızca “Kabul et” seçeneğini işaretlemeniz hâlinde</u> yüklenir.' : '<b>Analitik ve pazarlama:</b> Şu anda sitede analitik veya pazarlama amaçlı çerez kullanılmamaktadır.', '<b>Üçüncü taraf içerik:</b> Google Fonts yazı tipleri yüklenirken, sağlayıcı sunucularına teknik bağlantı kurulur.']) +
    H('Tercihlerinizi yönetme') + Pp((hasGa ? 'Sayfa altındaki “Çerez tercihleri” bağlantısından seçiminizi istediğiniz zaman değiştirebilirsiniz. ' : '') + 'Ayrıca tarayıcı ayarlarınızdan çerezleri silebilir veya engelleyebilirsiniz; bu durumda sitenin bazı özellikleri etkilenebilir.') +
    H('Hukuki dayanak') + Pp('Zorunlu olmayan çerezler, 6698 sayılı KVKK ve 6563 sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanun kapsamında açık rızanıza dayanılarak kullanılır. Ayrıntılar için KVKK Aydınlatma Metni’ne bakınız.') +
    H('İletişim') + Pp(`Sorularınız için: ${em}`);

  D.mesafeli = upd + Pp('Bu sözleşme, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümlerine uygun olarak, aşağıdaki taraflar arasında akdedilmiştir. Sipariş, ALICI’nın SATICI ile WhatsApp, e-posta veya telefon yoluyla iletişime geçerek ürünün temel nitelikleri, fiyatı ve teslimat bilgisini kabul etmesiyle kurulur.') +
    H('Madde 1 – Taraflar') + '<p><b>SATICI</b></p>' + info + Pp('<b>ALICI:</b> Sipariş sırasında ad-soyad, telefon ve teslimat adresi bilgilerini bildiren tüketicidir. ALICI’nın bilgileri sipariş/fatura kayıtlarında yer alır.') +
    H('Madde 2 – Konu') + Pp('Sözleşmenin konusu, ALICI’nın SATICI’ya ait web sitesinde (' + site + ') tanıtılan ve sipariş ettiği ürünün/ürünlerin satışı ve teslimine ilişkin olarak tarafların hak ve yükümlülükleridir.') +
    H('Madde 3 – Ürün bilgileri ve fiyat') + Pp('Ürünün cinsi, miktarı, marka/modeli, temel nitelikleri ve satış fiyatı ilgili ürün sayfasında ve sipariş sırasında ALICI’ya bildirilen bilgilerde yer alır. Sipariş onayında bildirilen toplam bedel (varsa kargo ve diğer masraflar dâhil) ALICI tarafından kabul edilmiştir. Ürün görsellerindeki renkler ekran ayarlarına göre farklılık gösterebilir.') +
    H('Madde 4 – Ödeme') + Pp('Ödeme yöntemi (havale/EFT veya SATICI’nın sipariş sırasında bildirdiği diğer yöntemler) sipariş sırasında kararlaştırılır. Ödeme yapılmayan siparişler hazırlanmayabilir.') +
    H('Madde 5 – Teslimat') + Pp('Ürün, ALICI’nın bildirdiği adrese kargo ile teslim edilir. Teslimat süresi, ürünün ALICI’ya veya gösterdiği adresteki kişiye teslim edildiği tarihte başlayan süreç olup, sipariş tarihinden itibaren en geç 30 gündür. SATICI’nın sipariş sırasında bildirdiği süre bu süreyi aşamaz. Ürün stokta bulunmuyorsa ALICI bilgilendirilir ve ödeme yapılmışsa bedel en geç 14 gün içinde iade edilir. Teslimat sırasında ambalajda hasar bulunması hâlinde ürünün kargo görevlisi huzurunda tutanak altına alınması ve SATICI’ya bildirilmesi önerilir.') +
    H('Madde 6 – Cayma hakkı') + Pp('ALICI, ürünün kendisine veya gösterdiği adresteki kişiye tesliminden itibaren <b>14 (on dört) gün</b> içinde, herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir. Cayma hakkının kullanıldığına dair bildirim, bu süre içinde yukarıdaki iletişim bilgilerinden biri aracılığıyla yazılı olarak SATICI’ya iletilmelidir. Cayma bildirimi sonrasında ALICI, 10 gün içinde ürünü SATICI’ya geri göndermelidir.') +
    H('Madde 7 – Cayma hakkının kullanılamayacağı hâller') + Pp('Mesafeli Sözleşmeler Yönetmeliği m.15 uyarınca, özellikle aşağıdaki sözleşmelerde cayma hakkı kullanılamaz:') + UL(['ALICI’nın istekleri veya kişisel ihtiyaçları doğrultusunda hazırlanan, kişiye özel (ör. isim/tarih işlenmiş, özel ölçü/tasarım) mallar', 'Çabuk bozulabilen veya son kullanma tarihi geçebilecek mallar', 'Teslimden sonra ambalajı, bandı, mührü veya paketi açılmış olan; iadesi sağlık ve hijyen açısından uygun olmayan mallar', 'Teslimden sonra başka ürünlerle karışan ve doğası gereği ayrıştırılması mümkün olmayan mallar', 'Yönetmelikte sayılan diğer hâller']) +
    H('Madde 8 – İade ve geri ödeme') + Pp('Cayma hâlinde SATICI, cayma bildiriminin kendisine ulaştığı tarihten itibaren en geç <b>14 gün</b> içinde, ALICI’dan tahsil ettiği tüm ödemeleri (ALICI’nın seçtiği standart teslimat dışındaki ek masraflar hariç, teslimat bedeli dâhil) ödemede kullanılan yöntemle iade eder. Ürün; kullanılmamış, hasarsız, eksiksiz ve mümkünse orijinal ambalajı ile iade edilmelidir. Cayma hâlinde iade gönderim bedeli ALICI’ya aittir; SATICI’nın anlaşmalı kargo ile gönderim yapması hâlinde bu bedel SATICI tarafından karşılanır. Ayıplı veya yanlış gönderilen üründe iade bedeli SATICI’ya aittir. Ürünün değerinde, ALICI’nın kusuru ile ortaya çıkan bir azalma varsa ALICI bundan sorumludur.') +
    H('Madde 9 – Ayıplı mal') + Pp('ALICI, ayıplı mal hâlinde 6502 sayılı Kanun’un 11. maddesinde yer alan seçimlik haklara (malı kabulden vazgeçme, ayıp oranında bedelden indirim isteme, ücretsiz onarım veya ayıpsız misli ile değiştirilmesini isteme) sahiptir. Ayıp, teslim tarihinden itibaren 2 yıllık zamanaşımı süresi içinde ileri sürülebilir.') +
    H('Madde 10 – Kişisel veriler') + Pp('ALICI’nın kişisel verileri, KVKK Aydınlatma Metni’nde belirtilen amaç ve şekilde işlenir.') +
    H('Madde 11 – Uyuşmazlık çözümü') + Pp('Bu sözleşmeden doğan uyuşmazlıklarda, her yıl Ticaret Bakanlığı tarafından ilan edilen parasal sınırlar dâhilinde ALICI’nın veya SATICI’nın yerleşim yerindeki Tüketici Hakem Heyetleri, bu sınırı aşan durumlarda Tüketici Mahkemeleri yetkilidir.') +
    H('Madde 12 – Yürürlük') + Pp('ALICI, sipariş vermekle bu sözleşmenin tüm koşullarını okuduğunu, ön bilgilendirmeyi aldığını ve kabul ettiğini beyan eder. Sözleşme, siparişin SATICI tarafından onaylanmasıyla yürürlüğe girer.');

  D.iade = upd + Pp(`${brand} olarak memnuniyetinizi önemsiyoruz. İade ve değişim işlemleri 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği’ne uygun yürütülür.`) +
    H('14 gün içinde cayma / iade') + Pp('Ürünü teslim aldığınız tarihten itibaren 14 gün içinde, gerekçe göstermeksizin iade edebilirsiniz. Ürün kullanılmamış, hasarsız, eksiksiz ve mümkünse orijinal ambalajında olmalıdır.') +
    H('İade nasıl yapılır?') + UL([`Bizimle ${em} adresi, telefon veya WhatsApp üzerinden iade talebinizi sipariş bilgilerinizle birlikte iletin.`, 'Onay sonrası ürünü 10 gün içinde bildirilen adrese gönderin.', 'Ürün tarafımıza ulaşıp kontrol edildikten sonra bedel, en geç 14 gün içinde ödeme yaptığınız yöntemle iade edilir.']) +
    H('İade kabul edilmeyen ürünler') + UL(['Kişiye özel hazırlanan/özelleştirilen ürünler', 'Ambalajı açılmış ve hijyen açısından iadesi uygun olmayan ürünler', 'Kullanılmış, hasar görmüş veya eksik parçalı ürünler', 'Yasal olarak cayma hakkı kapsamı dışında kalan diğer ürünler']) +
    H('Hasarlı, ayıplı veya hatalı ürün') + Pp('Ürün hasarlı geldiyse veya yanlış ürün gönderildiyse, teslimden sonra mümkün olan en kısa sürede fotoğraflarla birlikte bize ulaşın. Bu durumda iade/değişim gönderim bedeli tarafımızca karşılanır. Ayıplı mal hâlinde Kanun’un tanıdığı seçimlik haklarınız (bedel iadesi, bedel indirimi, onarım veya değişim) saklıdır.') +
    H('Değişim') + Pp('Değişim talepleri stok durumuna göre değerlendirilir. Değişim istediğiniz ürünü iade edip yeni sipariş verebilir veya bize yazarak değişim için yol haritası isteyebilirsiniz.') +
    H('İletişim') + info;

  D.kosullar = upd + Pp(`Bu web sitesini (${site}) kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız.`) +
    H('Genel') + Pp(`Site, ${co} tarafından işletilmektedir. Site’deki bilgiler genel bilgilendirme amaçlıdır; ürün bilgileri, fiyatlar ve stok durumu önceden haber verilmeksizin değiştirilebilir.`) +
    H('Sipariş') + Pp('Site üzerinden ürünler tanıtılır; siparişler WhatsApp, e-posta veya telefon yoluyla alınır. Sipariş, SATICI’nın onayı ile kesinleşir. Mesafeli Satış Sözleşmesi ve İade ve Değişim sayfaları geçerlidir.') +
    H('Fikri mülkiyet') + Pp('Site’deki tüm metin, görsel, logo, tasarım ve diğer içerikler SATICI’ya veya lisans verenlere aittir; izinsiz kopyalanamaz, çoğaltılamaz, dağıtılamaz veya ticari amaçla kullanılamaz.') +
    H('Doğruluk ve sorumluluk') + Pp('İçeriklerin doğru ve güncel olması için azami özen gösterilir; ancak yazım hataları, görsel renk farklılıkları veya teknik aksaklıklar olabilir. Site’ye erişimin kesintisiz veya hatasız olacağı garanti edilmez. Yasaların izin verdiği ölçüde, Site’nin kullanımından doğan dolaylı zararlardan sorumluluk kabul edilmez; tüketici mevzuatından doğan haklarınız saklıdır.') +
    H('Üçüncü taraf bağlantılar') + Pp('Site, üçüncü taraf sitelere bağlantı içerebilir; bu sitelerin içeriğinden SATICI sorumlu değildir.') +
    H('Gizlilik') + Pp('Kişisel verilerinizin işlenmesine ilişkin bilgi için KVKK Aydınlatma Metni, Gizlilik Politikası ve Çerez Politikası’na bakınız.') +
    H('Uygulanacak hukuk ve yetki') + Pp('Bu koşullara Türk hukuku uygulanır. Tüketici işlemlerinde Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri, diğer uyuşmazlıklarda SATICI’nın bulunduğu yerdeki mahkemeler ve icra daireleri yetkilidir.') +
    H('İletişim') + info;

  return { docs: LGL.map(function (x) { return { slug: x[0], key: x[1], html: D[x[1]] }; }), missing: miss };
}

function build(data, opt) {
  opt = opt || {};
  var S = data.settings || {}, seo = S.seo || {}, files = {}, assets = {};
  var base = String(S.siteUrl || 'https://example.com').replace(/\/+$/, '');
  var cur = S.currency || 'TRY';
  var M = S.merchant || {};
  var pbrand = function (p) { return String(p.brand || M.brand || S.name || '').trim(); };
  var avail = function (p) { return ({ in_stock: 1, out_of_stock: 1, preorder: 1, backorder: 1 })[p.availability] ? p.availability : (p.stock === false ? 'out_of_stock' : 'in_stock'); };
  var SCHAV = { in_stock: 'InStock', out_of_stock: 'OutOfStock', preorder: 'PreOrder', backorder: 'BackOrder' }, SCHCOND = { 'new': 'NewCondition', refurbished: 'RefurbishedCondition', used: 'UsedCondition' };
  var clampN = function (v, a, b, d) { v = +v; return isFinite(v) && v > 0 ? Math.min(b, Math.max(a, v)) : d; };
  var BN = S.banners || {}, RAT = { portrait: '3/4', square: '1/1', landscape: '4/3', tall: '2/3' }, bcss = '';
  if (BN.shape === 'round') bcss += '.arch{border-radius:22px}'; else if (BN.shape === 'square') bcss += '.arch{border-radius:0}';
  if (BN.fit === 'contain') bcss += '.arch img,.mo img{object-fit:contain}';
  if (RAT[BN.heroRatio]) bcss += '.hc .a1,.hc .a2{aspect-ratio:' + RAT[BN.heroRatio] + '}';
  if (RAT[BN.edRatio]) bcss += '.ed .arch{aspect-ratio:' + RAT[BN.edRatio] + '}';
  if (RAT[BN.storyRatio]) bcss += '.st .arch{aspect-ratio:' + RAT[BN.storyRatio] + '}';
  if (+BN.tileH > 0) bcss += '@media(min-width:901px){.mo{grid-auto-rows:' + clampN(BN.tileH, 120, 500, 230) + 'px}}';
  bcss += '.wb{margin:26px 0 0;border-radius:18px;overflow:hidden;background:var(--soft)}.wb a{display:block}.wb img{width:100%;height:var(--wh,320px);object-fit:cover;display:block}@media(max-width:800px){.wb img{height:var(--whm,180px)}}';
  var xe = function (s) { return String(s == null ? '' : s).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]; }); };
  var langs = (S.langs || ['tr']).filter(function (l) { return L[l]; });
  if (langs.indexOf('tr') < 0) langs.unshift('tr');
  var report = { pages: 0, warnings: [] };
  /* Özel kod (tüm sayfalar) ve özel sayfalar — Site Ayarları → Özel Kod / Özel Sayfalar */
  var CU = S.custom || {}, hasCjs = !!String(CU.js || '').trim();
  var jsx = function (s) { return String(s || '').replace(/<\/script/gi, '<\\/script'); };
  var cssx = function (s) { return String(s || '').replace(/<\/style/gi, '<\\/style'); };
  var CP = [], cpSeen = {}, cpRes = CP_RESERVED.concat(Object.keys(L));
  (S.cpages || []).forEach(function (c) {
    if (!c || c.draft === '1') return;
    var sl = slugify(c.slug || '');
    if (!sl) { report.warnings.push('Özel sayfa adresi boş: "' + (tx(c.title, 'tr') || '?') + '" (Site Ayarları → Özel Sayfalar)'); return; }
    if (cpRes.indexOf(sl) > -1 || cpSeen[sl]) { report.warnings.push('Özel sayfa adresi başka bir sayfayla çakışıyor, atlandı: /' + sl + '/'); return; }
    cpSeen[sl] = 1; CP.push(Object.assign({}, c, { slug: sl }));
  });
  var cpTitle = function (c, l) { return tx(c.title, l) || tx(c.title, 'tr') || c.slug; };
  var cpLink = function (l, k) { return CP.filter(function (c) { return c[k] === '1' && tx(c.html, l); }).map(function (c) { return '<a href="' + (l === 'tr' ? '' : '/' + l) + '/' + c.slug + '/">' + esc(cpTitle(c, l)) + '</a>'; }).join(''); };

  function asset(src) {
    if (!src) return '';
    if (!/^data:/.test(src)) return src;
    if (assets[src]) return assets[src];
    var m = /^data:([^;,]+)(;base64)?,([\s\S]*)$/.exec(src); if (!m) return '';
    var ext = {'image/svg+xml':'svg','image/png':'png','image/jpeg':'jpg','image/webp':'webp','image/gif':'gif','image/x-icon':'ico'}[m[1]] || 'bin';
    var h = 5381; for (var i = 0; i < src.length; i++) h = ((h << 5) + h + src.charCodeAt(i)) >>> 0;
    var p = '/assets/img/' + h.toString(36) + '.' + ext;
    files[p.slice(1)] = { b64: m[2] ? m[3] : btoa(unescape(encodeURIComponent(decodeURIComponent(m[3])))) };
    return (assets[src] = p);
  }
  var abs = function (u) { return /^https?:/.test(u) ? u : base + (u.charAt(0) === '/' ? u : '/' + u); };

  var used = {};
  var P = (data.products || []).filter(function (p) { return p.name && p.name.tr; }).map(function (p) {
    var q = Object.assign({}, p), s = slugify(q.slug || q.name.tr) || slugify(q.code) || 'urun', n = s, i = 2;
    while (used[n]) n = s + '-' + (i++); used[n] = 1; q.slug = n;
    q.images = (q.images || []).map(asset).filter(Boolean); return q;
  });
  var has = function (p, l) { return l === 'tr' || !!tx(p.name, l); };
  var cparts = function (p) { return String(p.cat || '').split('>').map(function (x) { return x.trim(); }).filter(Boolean); };
  var top = function (p) { return cparts(p)[0] || ''; };
  var subOf = function (p) { return cparts(p)[1] || ''; };
  var cats = {}, catList = [], usedSlug = {};
  P.forEach(function (p) {
    var t = top(p); if (!t) return;
    if (!cats[t]) { var bs = slugify(t) || 'kategori', sl = bs, k = 2; while (usedSlug[sl]) sl = bs + '-' + (k++); usedSlug[sl] = 1; cats[t] = { name: t, slug: sl, items: [], subs: [], subMap: {} }; catList.push(cats[t]); }
    var c = cats[t]; c.items.push(p);
    var sb = subOf(p);
    if (sb) {
      if (!c.subMap[sb]) { var bs2 = slugify(sb) || 'alt-kategori', sl2 = bs2, k2 = 2; while (c.subs.some(function (x) { return x.slug === sl2; })) sl2 = bs2 + '-' + (k2++); c.subMap[sb] = { name: t + ' > ' + sb, label: sb, slug: sl2, items: [], parent: c }; c.subs.push(c.subMap[sb]); }
      c.subMap[sb].items.push(p);
    }
  });
  var nmap = function (m, k) { var o = m || {}; return o[k] || o[String(k).replace(/\./g, '')]; };
  var cname = function (c, l) { return l === 'tr' ? c.name : tx(nmap(data.catNames, c.name), l); };
  var sname = function (sc, l) { return l === 'tr' ? sc.label : tx(nmap(data.catNames, sc.name), l); };
  var pre = function (l) { return l === 'tr' ? '' : '/' + l; };
  var purl = function (p, l) { return pre(l) + '/urun/' + p.slug + '/'; };
  var curl = function (c, l) { return pre(l) + '/kategori/' + c.slug + '/'; };
  var surl = function (sc, l) { return pre(l) + '/kategori/' + sc.parent.slug + '/' + sc.slug + '/'; };
  var vsubs = function (c, l) { return c.subs.filter(function (sc) { return sname(sc, l) && sc.items.some(function (p) { return has(p, l); }); }); };
  var money = function (n, l) { return new Intl.NumberFormat(l === 'ar' ? 'ar-u-nu-latn' : (l === 'tr' ? 'tr-TR' : l), { style: 'currency', currency: cur, maximumFractionDigits: 0 }).format(n); };
  var ttl = function (t) { return (seo.titleTemplate || '{title} | {store}').replace('{title}', t).replace('{store}', S.name || ''); };
  var logo = asset(S.logo), ogImg = asset(seo.ogImage) || logo;
  var sale = function (p) { return p.sale && p.sale > 0 && p.sale < p.price; };
  var legalFoot = function (l) {
    var N = LN[l] || LN.tr, g = S.legal || {}, fi = [g.company, g.address, (g.taxOffice || g.taxNo) ? 'VKN: ' + [g.taxOffice, g.taxNo].filter(Boolean).join(' / ') : '', g.mersis ? 'MERSİS: ' + g.mersis : ''].filter(Boolean).map(esc).join(' · ');
    return '<div class="lgl">' + LGL.map(function (x) { return '<a href="/' + x[0] + '/">' + esc(N[x[1]]) + '</a>'; }).join('') + (seo.gaId ? '<a href="#" id="ckopen">' + esc(N.cko) + '</a>' : '') + '</div>' + (fi ? '<div class="fi">' + fi + '</div>' : '');
  };
  var banner = function (l) {
    if (!seo.gaId) return ''; var N = LN[l] || LN.tr;
    return '<div class="ck" id="ck" role="dialog" aria-live="polite"><p>' + esc(N.ckt) + ' <a href="/cerez-politikasi/">' + esc(N.ckl) + '</a></p><div class="b2"><button type="button" data-ck="1">' + esc(N.cka) + '</button><button type="button" data-ck="0">' + esc(N.ckr) + '</button></div></div>';
  };

  function card(p, l) {
    var im = p.images[0], im2 = p.images[1], cc = cats[top(p)], scx = cc && subOf(p) && cc.subMap[subOf(p)], cn = (scx && sname(scx, l)) || (cc && cname(cc, l)) || (l === 'tr' ? String(p.cat || '').split('>').pop().trim() : '');
    var n = tx(p.name, l) || p.name.tr;
    return '<a class="card rv" href="' + purl(p, l) + '"><div class="ph">' + (sale(p) ? '<span class="bg">-%' + Math.round(100 - p.sale / p.price * 100) + '</span>' : '') + (im ? '<img src="' + esc(im) + '" alt="' + esc(n) + '" width="600" height="600" loading="lazy">' : '') + (im2 ? '<img class="h" src="' + esc(im2) + '" alt="" width="600" height="600" loading="lazy">' : '') + '</div><div class="b"><div class="c">' + esc(cn) + '</div><h3 class="n">' + esc(n) + '</h3>' + (sale(p) ? '<span class="old">' + money(p.price, l) + '</span><span class="pr">' + money(p.sale, l) + '</span>' : '<span class="pr">' + money(p.price, l) + '</span>') + '</div></a>';
  }

  function page(o) {
    if (o.raw != null) return emit(o.raw, o);
    var l = o.l, ui = U[l], alts = o.alts || {}, url = base + o.path, desc = clip(plain(o.desc || ''), 158);
    var wa = S.whatsapp ? 'https://wa.me/' + esc(S.whatsapp) : '';
    var h = '<!doctype html><html lang="' + l + '" dir="' + L[l].dir + '"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">';
    h += '<title>' + esc(o.title) + '</title><meta name="description" content="' + esc(desc) + '">';
    if (seo.keywords && o.home) h += '<meta name="keywords" content="' + esc(seo.keywords) + '">';
    h += '<meta name="robots" content="' + (o.noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large') + '">';
    if (!o.noindex) { h += '<link rel="canonical" href="' + url + '">'; Object.keys(alts).forEach(function (k) { h += '<link rel="alternate" hreflang="' + k + '" href="' + base + alts[k] + '">'; }); if (alts.tr) h += '<link rel="alternate" hreflang="x-default" href="' + base + alts.tr + '">'; }
    h += '<meta property="og:type" content="' + (o.type || 'website') + '"><meta property="og:site_name" content="' + esc(S.name) + '"><meta property="og:title" content="' + esc(o.title) + '"><meta property="og:description" content="' + esc(desc) + '"><meta property="og:url" content="' + url + '"><meta property="og:locale" content="' + L[l].loc + '">';
    var oi = o.img || ogImg; if (oi) h += '<meta property="og:image" content="' + esc(abs(oi)) + '"><meta name="twitter:image" content="' + esc(abs(oi)) + '">';
    h += '<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="' + esc(o.title) + '"><meta name="twitter:description" content="' + esc(desc) + '"><meta name="theme-color" content="' + esc(S.accent || '#b08d57') + '">';
    if (logo) h += '<link rel="icon" href="' + esc(logo) + '">';
    if (seo.gscToken) h += '<meta name="google-site-verification" content="' + esc(seo.gscToken) + '">';
    h += '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Jost:wght@300;400;500&display=swap"><link rel="stylesheet" href="/style.css"><script>document.documentElement.className+=" js"</script><noscript><style>.js .rv{opacity:1!important;transform:none!important}</style></noscript>';
    (o.ld || []).forEach(function (j) { h += '<script type="application/ld+json">' + JSON.stringify(j).replace(/</g, '\\u003c') + '</script>'; });
    if (seo.gaId) h += '<script>window.AUR_GA="' + esc(seo.gaId) + '"</script>';
    if (CU.head) h += CU.head;
    if (o.headX) h += o.headX;
    var ann = tx(S.announce, l);
    h += '</head><body>' + (ann ? '<div class="ann">' + esc(ann) + '</div>' : '') + '<a class="skip" href="#main">' + ui.skip + '</a><header class="hdr"><div class="hd"><button class="mb" aria-label="Menu" aria-expanded="false">☰</button><nav class="mn" aria-label="' + ui.cats + '">';
    catList.filter(function (c) { return cname(c, l) && c.items.some(function (p) { return has(p, l); }); }).slice(0, 4).forEach(function (c) { var vs = vsubs(c, l); if (vs.length) h += '<div class="dd"><a href="' + curl(c, l) + '">' + esc(cname(c, l)) + '</a><div class="dm">' + vs.map(function (sc) { return '<a href="' + surl(sc, l) + '">' + esc(sname(sc, l)) + '</a>'; }).join('') + '</div></div>'; else h += '<a href="' + curl(c, l) + '">' + esc(cname(c, l)) + '</a>'; });
    h += '<a href="' + pre(l) + '/urunler/">' + ui.all + '</a>' + cpLink(l, 'menu') + '</nav><a class="brand" href="' + pre(l) + '/">' + (logo ? '<img src="' + esc(logo) + '" alt="' + esc(S.name) + '" style="height:' + (Math.min(160, Math.max(24, +S.logoSize || 64))) + 'px;--lm:' + (Math.min(120, Math.max(24, +S.logoSizeM || Math.min(54, +S.logoSize || 54)))) + 'px">' : '') + (logo && S.logoOnly === '1' ? '' : '<span>' + esc(S.name) + '</span>') + '</a><div class="lg">';
    langs.forEach(function (k) { h += '<a class="' + (k === l ? 'on' : '') + '" hreflang="' + k + '" lang="' + k + '" href="' + (alts[k] || pre(k) + '/') + '">' + k.toUpperCase() + '</a>'; });
    var about = clip(plain(tx(S.about, l) || ui.storyD.replace('{store}', S.name)), 150);
    h += '</div></div></header><main id="main">' + (o.full ? o.body : '<div class="w">' + o.body + '</div>') + '</main><footer><div class="w"><div class="fg"><div><h4>' + esc(S.name) + '</h4><p>' + esc(about) + '</p></div><div><h4>' + ui.quick + '</h4><a href="' + pre(l) + '/">' + ui.home + '</a><a href="' + pre(l) + '/urunler/">' + ui.all + '</a>';
    catList.forEach(function (c) { if (!cname(c, l) || !c.items.some(function (p) { return has(p, l); })) return; h += '<a href="' + curl(c, l) + '">' + esc(cname(c, l)) + '</a>'; vsubs(c, l).forEach(function (sc) { h += '<a class="s" href="' + surl(sc, l) + '">' + esc(sname(sc, l)) + '</a>'; }); });
    h += cpLink(l, 'footer') + '</div><div><h4>' + ui.contact + '</h4>' + (wa ? '<a rel="nofollow noopener" href="' + wa + '">WhatsApp</a>' : '') + (S.email ? '<a href="mailto:' + esc(S.email) + '">' + esc(S.email) + '</a>' : '') + (S.instagram ? '<a rel="noopener" href="' + esc(S.instagram) + '">Instagram</a>' : '') + '</div></div>' + legalFoot(l) + '<div class="cp">© ' + new Date().getFullYear() + ' ' + esc(S.name) + '. ' + ui.rights + '</div></div></footer>' + banner(l) + (CU.body || '') + (hasCjs ? '<script src="/custom.js" defer></script>' : '') + '<script src="/app.js"></script>' + (o.bodyX || '') + '</body></html>';
    emit(h, o);
  }
  function emit(h, o) {
    if (opt.rel !== false) {
      var depth = o.path.split('/').filter(Boolean).length, R = depth ? new Array(depth + 1).join('../') : './';
      h = h.replace(/(href|src|data-big)="\/(?!\/)([^"]*)"/g, function (m, a, u) { if (opt.local && (u === '' || /\/$/.test(u))) u += 'index.html'; return a + '="' + R + u + '"'; });
    }
    var f = o.path.replace(/^\//, '') + (/\/$/.test(o.path) ? 'index.html' : ''); files[f] = h; report.pages++;
    if (!o.noindex) sitemap.push({ path: o.path, alts: o.alts || {}, img: o.sitemapImg });
  }
    var sitemap = [];
  var allAlts = function (fn) { var a = {}; langs.forEach(function (k) { var v = fn(k); if (v) a[k] = v; }); return a; };

  langs.forEach(function (l) {
    var ui = U[l], lp = P.filter(function (p) { return has(p, l); });
    var hi = lp.filter(function (p) { return p.images[0]; }), sub = tx(S.heroSub, l), ttl1 = tx(S.heroTitle, l) || S.name;
    var B = S.banners || {};
    var pick = function (k, fb) {
      var b = B[k] || {};
      if (typeof b.img === 'string' && b.img) return { src: b.img, alt: tx(b.alt, l) || S.name };
      if (b.code) { var q = lp.filter(function (x) { return x.code && x.code === String(b.code).trim() && x.images[0]; })[0]; if (q) return { src: q.images[0], alt: tx(q.name, l) }; }
      return fb || null;
    };
    var h1 = pick('hero1', hi[0]), h2 = pick('hero2', hi[1]);
    var wb = B.wide || {}, wsrc = typeof wb.img === 'string' ? wb.img : '', wlink = wb.link && typeof wb.link === 'object' ? tx(wb.link, l) : '';
    if (!/^(https?:\/\/|\/|#)/.test(wlink)) wlink = '';
    var wide = wsrc ? '<div class="wb" style="--wh:' + clampN(wb.h, 80, 900, 320) + 'px;--whm:' + clampN(wb.hm, 60, 600, 180) + 'px">' + (wlink ? '<a href="' + esc(wlink) + '">' : '') + '<img src="' + esc(wsrc) + '" alt="' + esc(tx(wb.alt, l) || S.name) + '" loading="lazy">' + (wlink ? '</a>' : '') + '</div>' : '';
    var wa = S.whatsapp ? 'https://wa.me/' + esc(S.whatsapp) : '';
    var prices = lp.map(function (p) { return sale(p) ? p.sale : p.price; }).filter(function (x) { return x > 0; }), minP = prices.length ? Math.min.apply(null, prices) : 0;
    var cl = catList.filter(function (c) { return cname(c, l) && c.items.some(function (p) { return has(p, l); }); });
    var chips = function (c, cur) { var vs = vsubs(c, l); return vs.length ? '<div class="chips">' + (cur ? '<a href="' + curl(c, l) + '">' + esc(cname(c, l)) + '</a>' : '') + vs.map(function (sc) { return '<a' + (sc === cur ? ' class="on"' : '') + ' href="' + surl(sc, l) + '">' + esc(sname(sc, l)) + '<small>' + sc.items.filter(function (p) { return has(p, l); }).length + '</small></a>'; }).join('') + '</div>' : ''; };
    var ar = function (p, c) { return '<div class="arch ' + c + '"><img src="' + esc(p.src || p.images[0]) + '" alt="' + esc(p.src ? p.alt : tx(p.name, l)) + '" width="600" height="800"' + (c === 'a1' ? ' fetchpriority="high"' : '') + '></div>'; };
    var hero = '<section class="hero"><div><div class="eyebrow">' + esc(tx(S.eyebrow, l) || S.name) + '</div><h1>' + esc(ttl1).replace(/\*(.+?)\*/g, '<em>$1</em>') + '</h1>' + (sub ? '<p class="lead">' + esc(sub) + '</p>' : '') + '<div class="cta"><a class="btn" href="' + pre(l) + '/urunler/">' + ui.hero1 + '</a>' + (wa ? '<a class="btn o" rel="nofollow noopener" href="' + wa + '">' + ui.hero2 + '</a>' : '') + '</div></div><div class="hc">' + (h1 ? ar(h1, 'a1') : '') + (h2 ? ar(h2, 'a2') : '') + (minP ? '<div class="bdg"><small>' + ui.from + '</small><br><b class="sf" style="font-size:26px">' + money(minP, l) + '</b></div>' : '') + '</div></section>';
    var words = cl.map(function (c) { return cname(c, l); }); if (!words.length) words = [S.name];
    var strip = ''; for (var r = 0; r < Math.max(1, Math.ceil(8 / words.length)); r++) words.forEach(function (w) { strip += '<span>' + esc(w) + '<i>✦</i></span>'; });
    var mq = '<div class="mq" aria-hidden="true"><div>' + strip + strip + '</div></div>';
    var rest = '';
    if (cl.length) rest += '<div class="sh rv"><h2>' + ui.coll + '</h2></div><div class="mo">' + cl.slice(0, 5).map(function (c) { var it = c.items.filter(function (p) { return has(p, l); }), f = it.filter(function (p) { return p.images[0]; })[0], ci = nmap(data.catImg, c.name), cs = typeof ci === 'string' && ci ? ci : (f ? f.images[0] : ''); return '<a class="rv" href="' + curl(c, l) + '">' + (cs ? '<img src="' + esc(cs) + '" alt="' + esc(cname(c, l)) + '" loading="lazy" width="600" height="600">' : '') + '<b><small>' + it.length + ' ' + ui.items + '</small>' + esc(cname(c, l)) + '</b></a>'; }).join('') + '</div>';
    var allSubs = []; cl.forEach(function (c) { vsubs(c, l).forEach(function (sc) { allSubs.push(sc); }); });
    if (allSubs.length) rest += '<div class="chips rv" style="margin-top:22px">' + allSubs.slice(0, 18).map(function (sc) { return '<a href="' + surl(sc, l) + '">' + esc(sname(sc, l)) + '<small>' + esc(cname(sc.parent, l)) + '</small></a>'; }).join('') + '</div>';
    rest += '<div class="sh rv"><h2>' + ui.newin + '</h2><a href="' + pre(l) + '/urunler/">' + ui.all + ' →</a></div><div class="grid">' + lp.slice(0, 8).map(function (p) { return card(p, l); }).join('') + '</div>';
    var fc = cats[S.featuredCat] && cname(cats[S.featuredCat], l) ? cats[S.featuredCat] : (cl[1] || cl[0]);
    if (fc) { var fi = fc.items.filter(function (p) { return has(p, l) && p.images[0]; }); if (fi.length) rest += '<section class="ed rv"><div><div class="eyebrow">' + ui.col + '</div><h2>' + esc(cname(fc, l)) + '</h2><p>' + esc(tx(nmap(data.catDesc, fc.name), l) || ui.hero1) + '</p><div class="cta"><a class="btn" href="' + curl(fc, l) + '">' + ui.explore + '</a></div></div><div class="imgs">' + ar(pick('ed1', fi[0]), '') + ar(pick('ed2', fi[1] || fi[0]), '') + '</div></section>'; }
    var ic = ['<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/>', '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>', '<rect x="3" y="9" width="18" height="12" rx="1"/><path d="M12 9v12M3 13h18M12 9c-3 0-4-4-1.5-4S12 9 12 9zm0 0c3 0 4-4 1.5-4S12 9 12 9z"/>', '<path d="M4 5h16v11H9l-5 4z"/>'];
    rest += '<div class="vs" style="margin-top:70px">' + [ui.v1, ui.v2, ui.v3, ui.v4].map(function (v, i) { return '<div class="v rv"><svg viewBox="0 0 24 24" aria-hidden="true">' + ic[i] + '</svg><h3>' + v[0] + '</h3><p>' + v[1] + '</p></div>'; }).join('') + '</div>';
    var sp = pick('story', hi[2] || hi[0]), ab = tx(S.about, l) || ui.storyD.replace('{store}', S.name);
    rest += '<section class="st rv">' + (sp ? ar(sp, '') : '<div></div>') + '<div><div class="eyebrow">' + ui.story + '</div><h2>' + esc(S.name) + '</h2><p>' + esc(ab) + '</p></div></section>';
    rest += '<section class="cb rv"><h2>' + ui.ctaT + '</h2><p>' + ui.ctaD + '</p>' + (wa ? '<a class="btn" rel="nofollow noopener" href="' + wa + '">' + ui.hero2 + '</a>' : '') + '</section>';
    var sameAs = String(seo.sameAs || '').split(/[\s,]+/).filter(Boolean); if (S.instagram) sameAs.push(S.instagram);
    var org = { '@context': 'https://schema.org', '@type': 'Organization', name: S.name, url: base + '/', logo: logo ? abs(logo) : undefined, sameAs: sameAs.length ? sameAs : undefined };
    var web = { '@context': 'https://schema.org', '@type': 'WebSite', name: S.name, url: base + pre(l) + '/', inLanguage: l };
    page({ l: l, path: pre(l) + '/', home: true, full: true, title: tx(seo.homeTitle, l) || S.name, desc: tx(seo.siteDesc, l) || sub, ld: [org, web], body: '<div class="w">' + hero + wide + '</div>' + mq + '<div class="w">' + rest + '</div>', alts: allAlts(function (k) { return pre(k) + '/'; }) });

        page({ l: l, path: pre(l) + '/urunler/', title: ttl(ui.all), desc: tx(seo.siteDesc, l), body: '<nav class="crumb"><a href="' + pre(l) + '/">' + ui.home + '</a> › ' + ui.all + '</nav><h1>' + ui.all + '</h1><h2 class="s" style="display:none"></h2><div class="grid" style="margin-top:20px">' + lp.map(function (p) { return card(p, l); }).join('') + '</div>', alts: allAlts(function (k) { return pre(k) + '/urunler/'; }) });

    cl.forEach(function (c) {
      var it = c.items.filter(function (p) { return has(p, l); }); if (!it.length) return;
      var n = cname(c, l);
      page({ l: l, path: curl(c, l), title: tx((nmap(data.catSeo, c.name) || {}).title, l) || ttl(n), desc: tx((nmap(data.catSeo, c.name) || {}).desc, l) || tx(nmap(data.catDesc, c.name), l) || (n + ' — ' + S.name), img: it[0].images[0],
        ld: [{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: ui.home, item: base + pre(l) + '/' }, { '@type': 'ListItem', position: 2, name: n }] }],
        body: '<nav class="crumb"><a href="' + pre(l) + '/">' + ui.home + '</a> › ' + esc(n) + '</nav><div class="ph1"><h1>' + esc(n) + '</h1></div>' + chips(c, null) + '<div class="grid">' + it.map(function (p) { return card(p, l); }).join('') + '</div>',
        alts: allAlts(function (k) { var ok = cname(c, k) && c.items.some(function (p) { return has(p, k); }); return ok ? curl(c, k) : ''; }) });
    });

    cl.forEach(function (c) {
      vsubs(c, l).forEach(function (sc) {
        var it = sc.items.filter(function (p) { return has(p, l); }); if (!it.length) return;
        var n = sname(sc, l), cn2 = cname(c, l);
        page({ l: l, path: surl(sc, l), title: tx((nmap(data.catSeo, sc.name) || {}).title, l) || ttl(n + ' - ' + cn2), desc: tx((nmap(data.catSeo, sc.name) || {}).desc, l) || tx(nmap(data.catDesc, sc.name), l) || (n + ' — ' + cn2 + ' — ' + S.name), img: it[0].images[0],
          ld: [{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: ui.home, item: base + pre(l) + '/' }, { '@type': 'ListItem', position: 2, name: cn2, item: base + curl(c, l) }, { '@type': 'ListItem', position: 3, name: n }] }],
          body: '<nav class="crumb"><a href="' + pre(l) + '/">' + ui.home + '</a> › <a href="' + curl(c, l) + '">' + esc(cn2) + '</a> › ' + esc(n) + '</nav><div class="ph1"><h1>' + esc(n) + '</h1></div>' + chips(c, sc) + '<div class="grid">' + it.map(function (p) { return card(p, l); }).join('') + '</div>',
          alts: allAlts(function (k) { var ok = cname(c, k) && sname(sc, k) && sc.items.some(function (p) { return has(p, k); }); return ok ? surl(sc, k) : ''; }) });
      });
    });

    lp.forEach(function (p) {
      var n = tx(p.name, l), d = tx(p.desc, l), ps = p.seo || {}, price = sale(p) ? p.sale : p.price, c = cats[top(p)], cn = c && cname(c, l), sc = cn && subOf(p) && c.subMap[subOf(p)], sn = sc && sname(sc, l);
      var t = tx(ps.title, l) || ttl(n), md = tx(ps.desc, l) || plain(d) || n;
      var url = base + purl(p, l);
      var ld = [{ '@context': 'https://schema.org', '@type': 'Product', name: n, description: plain(d) || n, sku: p.code || undefined, image: p.images.map(abs), brand: { '@type': 'Brand', name: pbrand(p) }, gtin: p.gtin || undefined, mpn: p.mpn || undefined, color: p.color || undefined, material: p.material || undefined, category: cn || undefined, offers: { '@type': 'Offer', url: url, priceCurrency: cur, price: Number(price).toFixed(2), availability: 'https://schema.org/' + SCHAV[avail(p)], itemCondition: 'https://schema.org/' + (SCHCOND[p.condition || M.condition] || 'NewCondition') } },
        { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: ui.home, item: base + pre(l) + '/' }].concat(cn ? [{ '@type': 'ListItem', position: 2, name: cn, item: base + curl(c, l) }] : []).concat(sn ? [{ '@type': 'ListItem', position: 3, name: sn, item: base + surl(sc, l) }] : []).concat([{ '@type': 'ListItem', position: 2 + (cn ? 1 : 0) + (sn ? 1 : 0), name: n }]) }];
      var rel = P.filter(function (q) { return q !== p && top(q) === top(p) && has(q, l); }).sort(function (a, b) { return (subOf(b) === subOf(p)) - (subOf(a) === subOf(p)); }).slice(0, 4);
      var msg = encodeURIComponent(ui.wa + ' ' + n + (p.code ? ' (' + p.code + ')' : '') + ' ' + url);
      var disc = sale(p) ? Math.round(100 - p.sale / p.price * 100) : 0, wab = S.whatsapp ? 'https://wa.me/' + esc(S.whatsapp) + '?text=' + msg : '';
      var body = '<nav class="crumb"><a href="' + pre(l) + '/">' + ui.home + '</a>' + (cn ? ' › <a href="' + curl(c, l) + '">' + esc(cn) + '</a>' : '') + (sn ? ' › <a href="' + surl(sc, l) + '">' + esc(sn) + '</a>' : '') + ' › ' + esc(n) + '</nav><article class="pd"><div class="gal"><div class="big">' + (p.images[0] ? '<img id="big" src="' + esc(p.images[0]) + '" alt="' + esc(tx(ps.alt, l) || n) + '" width="900" height="900" fetchpriority="high">' : '') + '</div>' + (p.images.length > 1 ? '<div class="th">' + p.images.map(function (u, i) { return '<img src="' + esc(u) + '" data-big="' + esc(u) + '" alt="' + esc(n) + ' ' + (i + 1) + '" width="72" height="72" loading="lazy">'; }).join('') + '</div>' : '') + '</div><div><div class="eyebrow">' + esc(cn || '') + '</div><h1>' + esc(n) + '</h1><div class="price">' + (sale(p) ? '<span class="old">' + money(p.price, l) + '</span>' : '') + money(price, l) + (disc ? '<span class="bg">-%' + disc + '</span>' : '') + '</div><ul class="f">' + bullets(d).map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul><div class="cta">' + (wab ? '<a class="btn" rel="nofollow noopener" href="' + wab + '">' + ui.ord + '</a>' : '') + '<a class="btn o" href="' + pre(l) + '/urunler/">' + ui.all + '</a></div><div class="tr"><span>' + ui.v1[0] + '</span><span>' + ui.v2[0] + '</span><span>' + ui.v3[0] + '</span></div><details open><summary>' + ui.spec + '</summary><p>' + (p.code ? ui.code + ': ' + esc(p.code) + '<br>' : '') + (cn ? ui.cat + ': ' + esc(cn) + (sn ? ' › ' + esc(sn) : '') : '') + '</p></details><details><summary>' + ui.ship + '</summary><p>' + ui.shipT + '</p></details></div></article>' + (rel.length ? '<div class="sh"><h2>' + ui.rel + '</h2></div><div class="grid">' + rel.map(function (q) { return card(q, l); }).join('') + '</div>' : '');
            page({ l: l, path: purl(p, l), type: 'product', title: t, desc: md, img: p.images[0], ld: ld, body: body, sitemapImg: p.images[0], alts: allAlts(function (k) { return has(p, k) ? purl(p, k) : ''; }) });
      if (!tx(ps.desc, l) && !d) report.warnings.push(p.slug + ' [' + l + ']: açıklama yok');
      if (!p.images.length) report.warnings.push(p.slug + ': görsel yok');
    });
  });

  var lg = legalDocs(S, !!seo.gaId);
  lg.missing.forEach(function (m) { report.warnings.push('Yasal bilgi eksik: ' + m + ' (Site Ayarları → Yasal Bilgiler)'); });
  lg.docs.forEach(function (d) {
    var t = LN.tr[d.key];
    page({ l: 'tr', path: '/' + d.slug + '/', title: ttl(t), desc: t + ' — ' + (S.name || ''), body: '<nav class="crumb"><a href="/">' + U.tr.home + '</a> › ' + esc(t) + '</nav><article class="legal"><h1>' + esc(t) + '</h1>' + d.html + '</article>', alts: {} });
  });

  /* Özel sayfalar */
  CP.forEach(function (c) {
    langs.forEach(function (l) {
      var html = tx(c.html, l); if (!html) return;
      var ui = U[l], title = cpTitle(c, l), pth = pre(l) + '/' + c.slug + '/', ni = c.noindex === '1', lay = c.layout || 'text';
      var desc = tx(c.desc, l) || html.replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]*>/g, ' ');
      var alts = allAlts(function (k) { return tx(c.html, k) ? pre(k) + '/' + c.slug + '/' : ''; });
      var px = c.css ? '<style>' + cssx(c.css) + '</style>' : '', hx = String(c.head || '');
      var jx = String(c.js || '').trim() ? '<script>' + jsx(c.js) + '</script>' : '';
      if (lay === 'raw') {
        var hl = Object.keys(alts).map(function (k) { return '<link rel="alternate" hreflang="' + k + '" href="' + base + alts[k] + '">'; }).join('');
        var doc = /<html[\s>]/i.test(html) ? html : '<!doctype html><html lang="' + l + '" dir="' + L[l].dir + '"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + esc(title) + '</title><meta name="description" content="' + esc(clip(plain(desc), 158)) + '"><meta name="robots" content="' + (ni ? 'noindex,follow' : 'index,follow') + '">' + (ni ? '' : '<link rel="canonical" href="' + base + pth + '">' + hl) + px + hx + '</head><body>' + html + jx + '</body></html>';
        page({ l: l, path: pth, raw: doc, noindex: ni, alts: alts });
        return;
      }
      var body = lay === 'text'
        ? '<nav class="crumb"><a href="' + pre(l) + '/">' + ui.home + '</a> › ' + esc(title) + '</nav><article class="legal cpg">' + (c.hideTitle === '1' ? '' : '<h1>' + esc(title) + '</h1>') + html + '</article>'
        : '<div class="cpg">' + html + '</div>';
      page({ l: l, path: pth, title: ttl(title), desc: desc, noindex: ni, full: lay === 'wide', body: body, alts: alts, headX: px + hx, bodyX: jx });
    });
  });

  files['404.html'] = '<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>404 — ' + esc(S.name) + '</title><link rel="stylesheet" href="/style.css"></head><body><main class="w hero"><h1>404</h1><p>' + U.tr.nfd + ' <a href="/">' + U.tr.home + '</a></p></main></body></html>';
  var today = new Date().toISOString().slice(0, 10);
  files['sitemap.xml'] = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n' + sitemap.map(function (u) {
    return '<url><loc>' + base + u.path + '</loc><lastmod>' + today + '</lastmod>' + Object.keys(u.alts).map(function (k) { return '<xhtml:link rel="alternate" hreflang="' + k + '" href="' + base + u.alts[k] + '"/>'; }).join('') + (u.img ? '<image:image><image:loc>' + esc(abs(u.img)) + '</image:loc></image:image>' : '') + '</url>';
  }).join('\n') + '\n</urlset>\n';
  files['robots.txt'] = 'User-agent: *\nAllow: /\n\nSitemap: ' + base + '/sitemap.xml\n';
  files['style.css'] = CSS.replace('--ac:#b08d57', '--ac:' + (S.accent || '#b08d57')) + '\n' + bcss + (String(CU.css || '').trim() ? '\n/* özel CSS */\n' + CU.css + '\n' : '');
  if (hasCjs) files['custom.js'] = String(CU.js);

  /* Google Merchant Center ürün akışı (RSS 2.0 + g: alanları). Her dil için ayrı dosya. */
  report.feed = {};
  langs.forEach(function (l) {
    var out = [], skip = 0, ship = String(M.shipPrice == null ? '' : M.shipPrice).trim().replace(',', '.');
    P.forEach(function (p) {
      if (!has(p, l) || p.nofeed === '1') return;
      var ps = p.seo || {}, n = tx(ps.mtitle, l) || tx(p.name, l), d = plain(tx(p.desc, l)) || n, price = Number(p.price) || 0;
      var imgs = (p.images || []).filter(Boolean).map(abs);
      if (!(price > 0) || !imgs.length || !n) { skip++; if (l === 'tr') report.warnings.push('Feed dışı: ' + (p.code || p.slug) + (price > 0 ? '' : ' (fiyat yok)') + (imgs.length ? '' : ' (görsel yok)')); return; }
      var c = cats[top(p)], cn = c && cname(c, l), sc = cn && subOf(p) && c.subMap[subOf(p)], sn = sc && sname(sc, l);
      var pt = cn ? cn + (sn ? ' > ' + sn : '') : '', gc = p.gcat || M.gcat || '', x = [];
      x.push('<g:id>' + xe(p.code || p.slug) + '</g:id>', '<title>' + xe(n.slice(0, 150)) + '</title>', '<description>' + xe(d.slice(0, 5000)) + '</description>', '<link>' + xe(base + purl(p, l)) + '</link>', '<g:image_link>' + xe(imgs[0]) + '</g:image_link>');
      imgs.slice(1, 11).forEach(function (u) { x.push('<g:additional_image_link>' + xe(u) + '</g:additional_image_link>'); });
      x.push('<g:availability>' + avail(p) + '</g:availability>', '<g:price>' + price.toFixed(2) + ' ' + xe(cur) + '</g:price>');
      if (sale(p)) x.push('<g:sale_price>' + Number(p.sale).toFixed(2) + ' ' + xe(cur) + '</g:sale_price>');
      x.push('<g:condition>' + (SCHCOND[p.condition || M.condition] ? (p.condition || M.condition) : 'new') + '</g:condition>');
      if (pbrand(p)) x.push('<g:brand>' + xe(pbrand(p)) + '</g:brand>');
      if (p.gtin) x.push('<g:gtin>' + xe(p.gtin) + '</g:gtin>');
      if (p.mpn) x.push('<g:mpn>' + xe(p.mpn) + '</g:mpn>');
      if (!p.gtin && !p.mpn) x.push('<g:identifier_exists>no</g:identifier_exists>');
      if (gc) x.push('<g:google_product_category>' + xe(gc) + '</g:google_product_category>');
      if (pt) x.push('<g:product_type>' + xe(pt) + '</g:product_type>');
      if (p.color) x.push('<g:color>' + xe(p.color) + '</g:color>');
      if (p.material) x.push('<g:material>' + xe(p.material) + '</g:material>');
      if (p.size) x.push('<g:size>' + xe(p.size) + '</g:size>');
      if (p.group) x.push('<g:item_group_id>' + xe(p.group) + '</g:item_group_id>');
      if (ship !== '' && isFinite(+ship)) x.push('<g:shipping><g:country>' + xe(M.shipCountry || 'TR') + '</g:country><g:service>' + xe(M.shipService || 'Standart') + '</g:service><g:price>' + Number(ship).toFixed(2) + ' ' + xe(cur) + '</g:price></g:shipping>');
      [0, 1, 2, 3, 4].forEach(function (i) { if (p['label' + i]) x.push('<g:custom_label_' + i + '>' + xe(p['label' + i]) + '</g:custom_label_' + i + '>'); });
      out.push('<item>' + x.join('') + '</item>');
    });
    files[(l === 'tr' ? '' : l + '/') + 'google-merchant.xml'] = '<?xml version="1.0" encoding="UTF-8"?>\n<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0"><channel><title>' + xe(S.name) + '</title><link>' + xe(base + pre(l) + '/') + '</link><description>' + xe(S.name) + ' — Google Merchant Center</description>\n' + out.join('\n') + '\n</channel></rss>\n';
    report.feed[l] = { items: out.length, skipped: skip };
  });
  files['app.js'] = JS;
  report.sitemapUrls = sitemap.length;
  return { files: files, report: report };
}
root.AurelyaBuild = { build: build, slugify: slugify, LANGS: L, reserved: CP_RESERVED };
if (typeof module !== 'undefined') module.exports = root.AurelyaBuild;
})(typeof window !== 'undefined' ? window : globalThis);
