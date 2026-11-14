-- Yasamore yönetim paneli: Supabase kurulumu. SQL Editor'de BİR KEZ çalıştırın.
-- (Şark Dokusu ile aynı Supabase projesini kullanabilirsiniz; tablo/fonksiyon adları ayrıdır.)

-- 1) Site verisi (tek satır: id = 'main')
create table if not exists public.aurelya_site (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- 2) Yönetici listesi
create table if not exists public.aurelya_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

create or replace function public.aurelya_is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.aurelya_admins where user_id = auth.uid());
$$;
grant execute on function public.aurelya_is_admin() to anon, authenticated;

-- 3) Güvenlik: yalnızca yöneticiler okuyup yazabilir
alter table public.aurelya_site enable row level security;
alter table public.aurelya_admins enable row level security;
drop policy if exists "yonetici okur" on public.aurelya_site;
drop policy if exists "yonetici yazar" on public.aurelya_site;
create policy "yonetici okur"  on public.aurelya_site for select to authenticated using (public.aurelya_is_admin());
create policy "yonetici yazar" on public.aurelya_site for all    to authenticated using (public.aurelya_is_admin()) with check (public.aurelya_is_admin());

-- 4) Görsel deposu (herkes görebilir, yalnızca yönetici yükler)
insert into storage.buckets (id, name, public) values ('aurelya-assets', 'aurelya-assets', true)
on conflict (id) do update set public = true;
drop policy if exists "aurelya gorsel okuma" on storage.objects;
drop policy if exists "aurelya gorsel yonetim" on storage.objects;
create policy "aurelya gorsel okuma" on storage.objects for select to anon, authenticated using (bucket_id = 'aurelya-assets');
create policy "aurelya gorsel yonetim" on storage.objects for all to authenticated
  using (bucket_id = 'aurelya-assets' and public.aurelya_is_admin())
  with check (bucket_id = 'aurelya-assets' and public.aurelya_is_admin());

-- 5) YÖNETİCİ EKLE: önce Authentication > Users > "Add user" ile e-posta/şifre ile kullanıcı oluşturun
--    (Auto Confirm User işaretli), sonra e-postayı aşağıya yazıp bu satırı çalıştırın:
insert into public.aurelya_admins (user_id) select id from auth.users where email = 'yasamore@dekor.com'
on conflict (user_id) do nothing;

-- 6) CANLI SİTE İÇİN OKUMA İZNİ (panel değişiklikleri sitede anında görünsün)
--    Site, ürün verisini herkese açık anahtarla okur. Veri zaten sitede yayınlanan içeriktir;
--    YAZMA yine yalnızca yöneticilerdedir.
drop policy if exists "herkes site okur" on public.aurelya_site;
create policy "herkes site okur" on public.aurelya_site for select to anon using (id = 'main');
