function aurInit(){var els=document.querySelectorAll(".rv:not(.in)");if(!("IntersectionObserver" in window)){els.forEach(function(e){e.classList.add("in")})}else{var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.1});els.forEach(function(e){io.observe(e)})}var b=document.querySelector(".mb"),n=document.querySelector("nav.mn");if(b&&n)b.onclick=function(){b.setAttribute("aria-expanded",n.classList.toggle("open"))}}document.addEventListener("click",function(e){var t=e.target;if(t.dataset&&t.dataset.big){var b=document.getElementById("big");if(b)b.src=t.dataset.big}});if(document.readyState!=="loading")aurInit();else document.addEventListener("DOMContentLoaded",aurInit);(function(){var K='aur_ck',b=document.getElementById('ck');function ga(){var id=window.AUR_GA;if(!id||window.AUR_GAL)return;window.AUR_GAL=1;var s=document.createElement('script');s.async=1;s.src='https://www.googletagmanager.com/gtag/js?id='+id;document.head.appendChild(s);window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config',id)}var v;try{v=localStorage.getItem(K)}catch(e){}if(v==='1')ga();else if(!v&&b)b.className+=' show';document.addEventListener('click',function(e){var t=e.target;if(t.dataset&&t.dataset.ck){try{localStorage.setItem(K,t.dataset.ck)}catch(x){}if(b)b.className='ck';if(t.dataset.ck==='1')ga()}if(t.id==='ckopen'){e.preventDefault();if(b)b.className='ck show'}})})();(function(){var w=document.getElementById('wab');if(!w)return;var q=document.getElementById('qn'),b=w.getAttribute('data-wa');function n(){var m=+q.max||99,v=Math.floor(+q.value)||1;return Math.max(1,Math.min(m,v))}function u(){w.href=b.split('%7Badet%7D').join(n())}document.addEventListener('click',function(e){var t=e.target;if(t&&t.getAttribute&&t.getAttribute('data-q')){q.value=Math.max(1,Math.min(+q.max||99,n()+ +t.getAttribute('data-q')));u()}});if(q){q.addEventListener('input',u);q.addEventListener('change',function(){q.value=n();u()})}u()})();
(function(){
var d=document,MAP={'ç':'c','ğ':'g','ı':'i','ö':'o','ş':'s','ü':'u','â':'a','î':'i','û':'u'};
function nz(s){s=String(s||'').toLowerCase().replace(/[çğıöşüâîû]/g,function(c){return MAP[c]});try{s=s.normalize('NFKD').replace(/[̀-ͯ]/g,'')}catch(e){}return s}
function cp(s){return nz(s).replace(/[^a-z0-9؀-ۿ]+/g,'')}
function match(hay,hayC,q){var t=nz(q).split(/\s+/).filter(Boolean);for(var i=0;i<t.length;i++){var c=cp(t[i]);if(hay.indexOf(t[i])<0&&!(c&&hayC.indexOf(c)>-1))return false}return true}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
var lang=d.documentElement.lang||'tr';
/* ---- Arama kutuları (üst menü + ana sayfa): canlı öneri ---- */
var IDX={};
function loadIdx(url,cb){
  if(IDX[url]){cb(IDX[url]);return}
  if(!window.fetch){cb([]);return}
  fetch(url).then(function(r){return r.json()}).then(function(j){IDX[url]=j.map(function(x){x._h=nz(x.n+' '+(x.k||'')+' '+(x.c||''));x._c=cp(x.n+' '+(x.k||'')+' '+(x.c||''));return x});cb(IDX[url])}).catch(function(){IDX[url]=[];cb([])});
}
function initForm(f){
  var inp=f.querySelector('input[type=search]'),box=f.querySelector('.sr'),url=f.getAttribute('data-idx'),root=f.getAttribute('data-root')||'/',act=-1,cur=[];
  function fx(u){u=String(u||'');return /^(https?:|data:|\/\/)/.test(u)?u:root+u.replace(/^\//,'')}
  if(!inp||!box)return;
  function close(){box.hidden=true;box.innerHTML='';act=-1}
  function paint(){
    var q=inp.value.trim();if(!q){close();return}
    loadIdx(url,function(all){
      if(inp.value.trim()!==q)return;
      cur=all.filter(function(x){return match(x._h,x._c,q)}).slice(0,8);
      var h='';
      cur.forEach(function(x,i){
        h+='<a href="'+esc(fx(x.u))+'" data-i="'+i+'">'+(x.i?'<img src="'+esc(fx(x.i))+'" alt="" loading="lazy" width="44" height="44">':'<span class="ni"></span>')+'<span class="tx"><b>'+esc(x.n)+'</b><small>'+(x.k?esc(f.getAttribute('data-code'))+': '+esc(x.k):esc(x.c||''))+'</small></span><span class="px">'+(x.o?'<s>'+esc(x.o)+'</s>':'')+esc(x.p)+'</span></a>';
      });
      if(!cur.length)h='<div class="no">'+esc(f.getAttribute('data-none'))+'</div>';
      else h+='<a class="all" href="'+esc(f.getAttribute('action'))+'?q='+encodeURIComponent(q)+'">'+esc(f.getAttribute('data-all'))+' →</a>';
      box.innerHTML=h;box.hidden=false;act=-1;
    });
  }
  inp.addEventListener('input',paint);
  inp.addEventListener('focus',function(){if(inp.value.trim())paint()});
  inp.addEventListener('keydown',function(e){
    var as=box.querySelectorAll('a[data-i]');
    if(e.key==='ArrowDown'||e.key==='ArrowUp'){if(!as.length)return;e.preventDefault();act=(act+(e.key==='ArrowDown'?1:-1)+as.length)%as.length;as.forEach(function(a,i){a.classList.toggle('on',i===act)})}
    else if(e.key==='Enter'&&act>-1&&as[act]){e.preventDefault();location.href=as[act].getAttribute('href')}
    else if(e.key==='Escape'){close();var h=d.querySelector('.hdr');if(h)h.classList.remove('so')}
  });
  d.addEventListener('click',function(e){if(!f.contains(e.target))close()});
}
Array.prototype.forEach.call(d.querySelectorAll('form.sx'),initForm);
var sbt=d.querySelector('.sbt'),hdr=d.querySelector('.hdr');
if(sbt&&hdr)sbt.addEventListener('click',function(){var o=hdr.classList.toggle('so');sbt.setAttribute('aria-expanded',o);if(o){var i=hdr.querySelector('.sbar input');if(i)setTimeout(function(){i.focus()},30)}});
/* ---- Liste araç çubuğu: arama + sıralama + filtre + "daha fazla" ---- */
var tb=d.querySelector('.tb'),g=d.getElementById('pg');
if(tb&&g){
  var cards=Array.prototype.slice.call(g.querySelectorAll('.card')),
      $=function(s){return tb.querySelector(s)},
      qi=$('.tq input'),ss=$('.ts'),mn=$('.pmin'),mx=$('.pmax'),stk=$('.fstk'),sl=$('.fsale'),cnt=$('.tc'),emp=d.getElementById('pe'),more=d.getElementById('pm'),rst=$('.trs'),
      per=+tb.getAttribute('data-per')||0,shown=per,def=tb.getAttribute('data-def')||'new',coll=null;
  try{coll=new Intl.Collator(lang,{numeric:true,sensitivity:'base'})}catch(e){}
  var cmpS=function(a,b){return coll?coll.compare(a,b):(a<b?-1:a>b?1:0)};
  cards.forEach(function(c,k){
    c._i=+c.getAttribute('data-i');if(isNaN(c._i))c._i=k;
    c._p=+c.getAttribute('data-p')||0;c._n=c.getAttribute('data-n')||'';c._k=c.getAttribute('data-k')||'';c._d=+c.getAttribute('data-d')||0;
    c._a=c.getAttribute('data-a')!=='0';c._s=c.getAttribute('data-s')==='1';
    var raw=c.getAttribute('data-q')||c._n;c._h=nz(raw);c._c=cp(raw);
  });
  var SORT={
    'new':function(a,b){return a._i-b._i},
    'pa':function(a,b){return a._p-b._p||a._i-b._i},
    'pd':function(a,b){return b._p-a._p||a._i-b._i},
    'na':function(a,b){return cmpS(a._n,b._n)},
    'nd':function(a,b){return cmpS(b._n,a._n)},
    'ka':function(a,b){return cmpS(a._k||'￿',b._k||'￿')||a._i-b._i},
    'disc':function(a,b){return b._d-a._d||a._i-b._i}
  };
  function readUrl(){
    var u={};try{(location.search||'').replace(/^\?/,'').split('&').forEach(function(p){if(!p)return;var kv=p.split('=');u[decodeURIComponent(kv[0])]=decodeURIComponent((kv[1]||'').replace(/\+/g,' '))})}catch(e){}
    return u;
  }
  function writeUrl(st){
    if(!window.history||!history.replaceState||location.protocol==='about:'||location.protocol==='data:')return;
    var p=[];
    if(st.q)p.push('q='+encodeURIComponent(st.q));
    if(st.s&&st.s!==def)p.push('sort='+st.s);
    if(st.min)p.push('min='+st.min);if(st.max)p.push('max='+st.max);
    if(st.stk)p.push('stock=1');if(st.sale)p.push('sale=1');
    try{history.replaceState(null,'',location.pathname+(p.length?'?'+p.join('&'):'')+location.hash)}catch(e){}
  }
  function state(){return{q:qi?qi.value.trim():'',s:ss?ss.value:def,min:mn?mn.value:'',max:mx?mx.value:'',stk:stk&&stk.checked,sale:sl&&sl.checked}}
  function apply(keepShown){
    var st=state(),mi=parseFloat(String(st.min).replace(',','.')),ma=parseFloat(String(st.max).replace(',','.'));
    var list=cards.filter(function(c){
      if(st.q&&!match(c._h,c._c,st.q))return false;
      if(!isNaN(mi)&&c._p<mi)return false;
      if(!isNaN(ma)&&c._p>ma)return false;
      if(st.stk&&!c._a)return false;
      if(st.sale&&!c._s)return false;
      return true;
    });
    list.sort(SORT[st.s]||SORT['new']);
    if(!keepShown)shown=per;
    var frag=d.createDocumentFragment(),n=0;
    cards.forEach(function(c){c.hidden=true});
    list.forEach(function(c,k){frag.appendChild(c);c.hidden=!!(per&&k>=shown);if(!c.hidden)n++});
    cards.forEach(function(c){if(list.indexOf(c)<0)frag.appendChild(c)});
    g.appendChild(frag);
    if(cnt)cnt.textContent=(tb.getAttribute('data-cnt')||'{n}').replace('{n}',list.length);
    if(emp)emp.hidden=list.length>0;
    if(more){var rem=list.length-n;more.hidden=rem<=0;if(rem>0)more.textContent=(tb.getAttribute('data-more')||'+{n}').replace('{n}',Math.min(rem,per||rem))}
    var dirty=!!(st.q||st.min||st.max||st.stk||st.sale||st.s!==def);
    if(rst)rst.hidden=!dirty;
    writeUrl(st);
  }
  var u=readUrl();
  if(u.q&&qi)qi.value=u.q;
  if(u.sort&&ss&&SORT[u.sort])ss.value=u.sort;else if(ss)ss.value=def;
  if(u.min&&mn)mn.value=u.min;if(u.max&&mx)mx.value=u.max;
  if(u.stock==='1'&&stk)stk.checked=true;if(u.sale==='1'&&sl)sl.checked=true;
  var tm;
  [qi,mn,mx].forEach(function(e){if(e)e.addEventListener('input',function(){clearTimeout(tm);tm=setTimeout(function(){apply()},120)})});
  [ss,stk,sl].forEach(function(e){if(e)e.addEventListener('change',function(){apply()})});
  if(more)more.addEventListener('click',function(){shown+=per;apply(true)});
  if(rst)rst.addEventListener('click',function(){if(qi)qi.value='';if(mn)mn.value='';if(mx)mx.value='';if(stk)stk.checked=false;if(sl)sl.checked=false;if(ss)ss.value=def;apply()});
  var fm=tb.querySelector('form');if(fm)fm.addEventListener('submit',function(e){e.preventDefault();apply()});
  var ft=$('.ftg');if(ft)ft.addEventListener('click',function(){var o=tb.classList.toggle('fo');ft.setAttribute('aria-expanded',o)});
  apply();
  window.AURLIST={apply:apply};
}
})();