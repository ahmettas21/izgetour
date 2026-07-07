-- ============================================================================
-- İzgeTour — Cache-First Flight Engine şeması
-- ----------------------------------------------------------------------------
-- Skiplagged verisi bir worker ile periyodik çekilip DB'ye yazılır,
-- site DB'den (price_cache) okur. FlareSolverr ile Cloudflare bypass edilir.
-- ============================================================================

-- gen_random_uuid() için gerekli
create extension if not exists "pgcrypto";

-- ─── 1) airports — havalimanı sözlüğü ───────────────────────────────────────
create table if not exists public.airports (
  code    text primary key,          -- IATA kodu (ör. IST)
  name    text not null,             -- havalimanı adı
  city    text not null,             -- şehir adı
  country text not null,             -- ülke
  lat     numeric,                   -- enlem
  lng     numeric                    -- boylam
);
comment on table public.airports is 'Havalimanı sözlüğü (IATA kodları)';

-- ─── 2) routes — rota tanımları + SEO landing meta ──────────────────────────
create table if not exists public.routes (
  id             uuid primary key default gen_random_uuid(),
  origin         text not null references public.airports(code),      -- kalkış IATA
  destination    text not null references public.airports(code),      -- varış IATA
  popular        boolean not null default false,                      -- popüler rota mı
  enabled        boolean not null default true,                       -- worker çeksin mi
  -- SEO landing sayfası alanları:
  slug           text unique,                                         -- ör. "istanbul-antalya"
  title_tr       text,
  title_en       text,
  description_tr text,
  description_en text,
  created_at     timestamptz not null default now(),
  unique (origin, destination)
);
comment on table public.routes is 'Rota tanımları ve SEO landing meta verileri';

-- ─── 3) price_cache — worker''ın yazdığı, sitenin okuduğu fiyat önbelleği ────
create table if not exists public.price_cache (
  id              uuid primary key default gen_random_uuid(),
  route_id        uuid references public.routes(id) on delete cascade,
  depart_date     date not null,                 -- gidiş tarihi
  airline_code    text,
  airline_name    text,
  flight_id       text,                          -- Skiplagged flight key
  departure_city  text,
  departure_code  text,
  arrival_city    text,
  arrival_code    text,
  departure_time  timestamptz,
  arrival_time    timestamptz,
  duration_minutes integer,
  stops           integer,
  price_usd       numeric,                       -- USD fiyat
  booking_source  text,                          -- en ucuz rezervasyon sitesi
  cabin           text,
  fetched_at      timestamptz not null default now(),
  raw             jsonb                          -- ham normalize edilmiş kayıt
);
comment on table public.price_cache is 'Worker tarafından doldurulan uçuş fiyat önbelleği';

create index if not exists idx_price_cache_route_date
  on public.price_cache (route_id, depart_date);
create index if not exists idx_price_cache_fetched_at
  on public.price_cache (fetched_at);

-- ─── 4) affiliate_links — rezervasyon kaynağı → affiliate URL şablonu ───────
create table if not exists public.affiliate_links (
  id                     uuid primary key default gen_random_uuid(),
  booking_source         text unique not null,   -- ör. "Kiwi", "Skyscanner"
  affiliate_url_template text not null,          -- {origin}{destination}{date} placeholder'lı
  commission_note        text,
  enabled                boolean not null default true,
  created_at             timestamptz not null default now()
);
comment on table public.affiliate_links is 'Rezervasyon kaynağı bazlı affiliate URL şablonları';

-- ─── 5) fetch_log — worker çekim günlüğü ────────────────────────────────────
create table if not exists public.fetch_log (
  id            uuid primary key default gen_random_uuid(),
  route_id      uuid,
  status        text,                            -- success / error
  flights_found integer,
  error         text,
  duration_ms   integer,
  created_at    timestamptz not null default now()
);
comment on table public.fetch_log is 'Worker çekim işlemlerinin günlüğü';

-- ============================================================================
-- RLS (Row Level Security)
-- ----------------------------------------------------------------------------
-- SELECT herkese açık (anon read), INSERT/UPDATE/DELETE yalnızca service_role.
-- ============================================================================

alter table public.airports        enable row level security;
alter table public.routes          enable row level security;
alter table public.price_cache     enable row level security;
alter table public.affiliate_links enable row level security;
alter table public.fetch_log       enable row level security;

-- airports: herkes okuyabilir
create policy "airports_anon_read" on public.airports
  for select using (true);

-- routes: herkes okuyabilir
create policy "routes_anon_read" on public.routes
  for select using (true);

-- price_cache: herkes okuyabilir
create policy "price_cache_anon_read" on public.price_cache
  for select using (true);

-- affiliate_links: herkes okuyabilir
create policy "affiliate_links_anon_read" on public.affiliate_links
  for select using (true);

-- Yazma politikaları: yalnızca service_role
create policy "airports_service_write" on public.airports
  for all to service_role using (true) with check (true);

create policy "routes_service_write" on public.routes
  for all to service_role using (true) with check (true);

create policy "price_cache_service_write" on public.price_cache
  for all to service_role using (true) with check (true);

create policy "affiliate_links_service_write" on public.affiliate_links
  for all to service_role using (true) with check (true);

-- fetch_log: yalnızca service_role (okuma dahil, internal log)
create policy "fetch_log_service_all" on public.fetch_log
  for all to service_role using (true) with check (true);

-- ============================================================================
-- SEED — havalimanları
-- ============================================================================
insert into public.airports (code, name, city, country, lat, lng) values
  ('IST', 'İstanbul Havalimanı',                'İstanbul',  'Türkiye', 41.2753, 28.7519),
  ('AYT', 'Antalya Havalimanı',                 'Antalya',   'Türkiye', 36.8987, 30.8005),
  ('ADB', 'İzmir Adnan Menderes Havalimanı',    'İzmir',     'Türkiye', 38.2924, 27.1570),
  ('ESB', 'Ankara Esenboğa Havalimanı',         'Ankara',    'Türkiye', 40.1281, 32.9951),
  ('TZX', 'Trabzon Havalimanı',                 'Trabzon',   'Türkiye', 40.9951, 39.7897),
  ('BJV', 'Bodrum-Milas Havalimanı',            'Bodrum',    'Türkiye', 37.2506, 27.6644),
  ('ADA', 'Adana Şakirpaşa Havalimanı',         'Adana',     'Türkiye', 36.9822, 35.2804),
  ('GZT', 'Gaziantep Havalimanı',               'Gaziantep', 'Türkiye', 36.9472, 37.4787)
on conflict (code) do nothing;

-- ============================================================================
-- SEED — 10 popüler TR rotası (SEO landing meta ile)
-- ============================================================================
insert into public.routes
  (origin, destination, popular, enabled, slug, title_tr, title_en, description_tr, description_en)
values
  ('IST', 'AYT', true, true, 'istanbul-antalya',
    'İstanbul - Antalya Uçak Bileti',
    'Istanbul to Antalya Flights',
    'İstanbul Antalya arası en ucuz uçak biletlerini karşılaştırın ve anında rezervasyon yapın.',
    'Compare the cheapest flights from Istanbul to Antalya and book instantly.'),
  ('IST', 'ADB', true, true, 'istanbul-izmir',
    'İstanbul - İzmir Uçak Bileti',
    'Istanbul to Izmir Flights',
    'İstanbul İzmir arası uygun fiyatlı uçuşları keşfedin.',
    'Discover affordable flights from Istanbul to Izmir.'),
  ('IST', 'ESB', true, true, 'istanbul-ankara',
    'İstanbul - Ankara Uçak Bileti',
    'Istanbul to Ankara Flights',
    'İstanbul Ankara arası en iyi uçuş fırsatları burada.',
    'Best flight deals from Istanbul to Ankara.'),
  ('ESB', 'ADB', true, true, 'ankara-izmir',
    'Ankara - İzmir Uçak Bileti',
    'Ankara to Izmir Flights',
    'Ankara İzmir arası uçak biletlerini karşılaştırın.',
    'Compare flights from Ankara to Izmir.'),
  ('IST', 'TZX', true, true, 'istanbul-trabzon',
    'İstanbul - Trabzon Uçak Bileti',
    'Istanbul to Trabzon Flights',
    'İstanbul Trabzon arası en ucuz uçuşları bulun.',
    'Find the cheapest flights from Istanbul to Trabzon.'),
  ('IST', 'BJV', true, true, 'istanbul-bodrum',
    'İstanbul - Bodrum Uçak Bileti',
    'Istanbul to Bodrum Flights',
    'İstanbul Bodrum arası tatil uçuşlarını karşılaştırın.',
    'Compare holiday flights from Istanbul to Bodrum.'),
  ('ADB', 'AYT', true, true, 'izmir-antalya',
    'İzmir - Antalya Uçak Bileti',
    'Izmir to Antalya Flights',
    'İzmir Antalya arası uygun uçuş seçenekleri.',
    'Affordable flight options from Izmir to Antalya.'),
  ('IST', 'ADA', true, true, 'istanbul-adana',
    'İstanbul - Adana Uçak Bileti',
    'Istanbul to Adana Flights',
    'İstanbul Adana arası en iyi bilet fiyatları.',
    'Best ticket prices from Istanbul to Adana.'),
  ('ESB', 'AYT', true, true, 'ankara-antalya',
    'Ankara - Antalya Uçak Bileti',
    'Ankara to Antalya Flights',
    'Ankara Antalya arası uçuşları hızlıca karşılaştırın.',
    'Quickly compare flights from Ankara to Antalya.'),
  ('IST', 'GZT', true, true, 'istanbul-gaziantep',
    'İstanbul - Gaziantep Uçak Bileti',
    'Istanbul to Gaziantep Flights',
    'İstanbul Gaziantep arası en ucuz uçak biletleri.',
    'Cheapest flights from Istanbul to Gaziantep.')
on conflict (origin, destination) do nothing;
