/* =========================================================
   İzgetour PWA Service Worker — Cache Strategy v3
   Routing layers:
     1. Navigation         → network-first (fresh page)
     2. Critical pages      → network-first (fresh data)
     3. API / _next/data   → network-first + structured fallback
     4. Static assets      → cache-first + stale-while-revalidate
     5. External CDN/fonts  → cache-first (long TTL, immutable)
   ========================================================= */

const CACHE_VERSION = 'v4';
const CACHE_NAME = `izgetour-pwa-${CACHE_VERSION}`;
const CDN_CACHE_NAME = `izgetour-cdn-${CACHE_VERSION}`;
const NAV_CACHE_NAME = `izgetour-nav-${CACHE_VERSION}`;

// Critical page routes — always fetched fresh when online
const CRITICAL_ROUTES = [
  '/',
  '/offline',
];

// Precache shell on install
const PRECACHE_URLS = ['/offline', '/manifest.webmanifest'];

// --- Install: precache shell + CDN cache ---
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((c) => c.addAll(PRECACHE_URLS)),
      caches.open(CDN_CACHE_NAME),
    ]).then(() => self.skipWaiting())
  );
});

// --- Activate: cleanup old caches ---
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const allKeys = await caches.keys();
      const currentPrefixes = [
        'izgetour-pwa-',
        'izgetour-cdn-',
        'izgetour-nav-',
      ];
      await Promise.all(
        allKeys
          .filter((k) => !currentPrefixes.some((p) => k.startsWith(p)))
          .map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

// =========================================================
// Fetch handler — routing by request type
// =========================================================
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Skip non-GET, chrome-extension, and blob requests
  if (req.method !== 'GET' || url.protocol === 'chrome-extension:') return;

  // --- 1. Navigation: network-first with nav cache ---
  if (req.mode === 'navigate') {
    event.respondWith(handleNavigation(req));
    return;
  }

  // --- 2. Critical page routes: network-first (even if navigation) ---
  if (CRITICAL_ROUTES.some((r) => url.pathname === r || url.pathname.endsWith(r))) {
    event.respondWith(handleCritical(req));
    return;
  }

  // --- 3. API / _next/data: network-first + structured fallback ---
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/_next/data/')
  ) {
    event.respondWith(handleApi(req));
    return;
  }

  // --- 4. External CDN (fonts, unpkg, cdnjs): cache-first ---
  if (
    url.origin !== self.location.origin &&
    (url.hostname.includes('fonts.googleapis.com') ||
      url.hostname.includes('fonts.gstatic.com') ||
      url.hostname.includes('fonts.googleapis') ||
      url.hostname.includes('unpkg.com') ||
      url.hostname.includes('cdnjs.cloudflare.com'))
  ) {
    event.respondWith(handleCdn(req));
    return;
  }

  // --- 5. Static assets: cache-first + stale-while-revalidate ---
  const isStatic =
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/images/') ||
    /\.(css|js|png|jpg|jpeg|webp|svg|ico|woff2?|ttf|eot|avif)$/.test(
      url.pathname
    );

  if (isStatic) {
    event.respondWith(handleStatic(req));
    return;
  }

  // --- 6. Default: network-only ---
});

// =========================================================
// Strategy: Navigation (network-first, nav cache)
// =========================================================
async function handleNavigation(req) {
  // Try network first — cache clone for offline fallback
  try {
    const res = await fetch(req);
    if (res.ok) {
      const cache = await caches.open(NAV_CACHE_NAME);
      cache.put(req, res.clone());
    }
    return res;
  } catch {
    // Network failed — try nav cache
    const cached = await caches.match(req);
    if (cached) return cached;
    // Final fallback to offline page
    return (
      (await caches.match('/offline')) ||
      new Response('Offline', { status: 503 })
    );
  }
}

// =========================================================
// Strategy: Critical pages (network-first, persist result)
// =========================================================
async function handleCritical(req) {
  try {
    const res = await fetch(req);
    if (res.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(req, res.clone());
    }
    return res;
  } catch {
    const cached = await caches.match(req);
    if (cached) return cached;
    return (
      (await caches.match('/offline')) ||
      new Response('Offline', { status: 503 })
    );
  }
}

// =========================================================
// Strategy: API / _next/data (network-first + JSON fallback)
// =========================================================
async function handleApi(req) {
  try {
    const res = await fetch(req);
    if (res.ok && req.method === 'GET') {
      const cache = await caches.open(CACHE_NAME);
      cache.put(req, res.clone());
    }
    return res;
  } catch {
    if (req.method === 'GET') {
      const cached = await caches.match(req);
      if (cached) return cached;
    }
    return new Response(
      JSON.stringify({
        error: 'Offline',
        message: 'Bu istek çevrimdışıyken yapılamaz.',
        cached: false,
      }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// =========================================================
// Strategy: Static assets (cache-first + background SWR)
// =========================================================
async function handleStatic(req) {
  const cached = await caches.match(req);
  if (cached) {
    // Revalidate in background — serve stale immediately
    fetch(req)
      .then((res) => {
        if (res.ok) {
          caches.open(CACHE_NAME).then((c) => c.put(req, res));
        }
      })
      .catch(() => {
        /* offline — stale cached version is fine */
      });
    return cached;
  }

  // Not cached yet — fetch, cache, return
  try {
    const res = await fetch(req);
    if (res.ok) {
      const copy = res.clone();
      caches.open(CACHE_NAME).then((c) => c.put(req, copy));
    }
    return res;
  } catch {
    return cached || new Response('Resource unavailable offline', {
      status: 503,
    });
  }
}

// =========================================================
// Strategy: External CDN / fonts (cache-first, long TTL)
// Uses dedicated CDN cache so stale-while-revalidate doesn't
// pollute the app cache with font bytes.
// =========================================================
async function handleCdn(req) {
  const cached = await caches.match(req);
  if (cached) {
    // Revalidate silently in background
    fetch(req)
      .then((res) => {
        if (res.ok) {
          caches.open(CDN_CACHE_NAME).then((c) => c.put(req, res));
        }
      })
      .catch(() => {
        /* offline — serve cached */
      });
    return cached;
  }

  try {
    const res = await fetch(req);
    if (res.ok) {
      const copy = res.clone();
      caches.open(CDN_CACHE_NAME).then((c) => c.put(req, copy));
    }
    return res;
  } catch {
    return cached || new Response('CDN resource unavailable', {
      status: 503,
    });
  }
}

// =========================================================
// Background Sync — queued booking actions recover when online
// =========================================================
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-bookings') {
    event.respondWith(syncBookings());
  }
});

async function syncBookings() {
  console.log('[SW] Background sync: sync-bookings');
  // TODO: replay queued booking actions from IndexedDB
}
