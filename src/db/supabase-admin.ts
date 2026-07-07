/**
 * İzgeTour — Supabase server-side admin client (service_role).
 *
 * Repository katmanı bu client üzerinden okur/yazar. service_role RLS'i bypass
 * eder; SADECE sunucu tarafında (Server Component, route handler, worker, seed)
 * kullanılmalıdır. Tarayıcıya asla sızmamalı.
 *
 * Env:
 *  - NEXT_PUBLIC_SUPABASE_URL
 *  - SUPABASE_SERVICE_ROLE_KEY
 *
 * Next.js runtime'ında .env.local otomatik yüklenir. Worker/seed gibi standalone
 * tsx süreçlerinde ise env yüklü olmayabilir; bu yüzden bir kez .env.local
 * yüklemeyi deneriz (Node 24 process.loadEnvFile).
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Standalone süreçler (worker, seed) için .env.local'i best-effort yükle.
// Next.js zaten kendi env'ini yüklediğinden bu no-op / zararsızdır.
function ensureEnvLoaded(): void {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return;
  }
  const loader = (process as unknown as { loadEnvFile?: (path?: string) => void }).loadEnvFile;
  if (typeof loader === 'function') {
    for (const file of ['.env.local', '.env']) {
      try {
        loader.call(process, file);
        if (process.env.SUPABASE_SERVICE_ROLE_KEY) break;
      } catch {
        // dosya yoksa yut
      }
    }
  }
}

// Global singleton — Next dev hot-reload / worker tekrar importlarında çoğalmasın.
const globalForSupabase = globalThis as unknown as {
  __izgetourSupabaseAdmin?: SupabaseClient;
};

function createAdminClient(): SupabaseClient {
  ensureEnvLoaded();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error('[supabase-admin] NEXT_PUBLIC_SUPABASE_URL tanımlı değil.');
  }
  if (!serviceKey) {
    throw new Error('[supabase-admin] SUPABASE_SERVICE_ROLE_KEY tanımlı değil.');
  }

  return createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Uygulama genelinde tek service_role Supabase client döndürür.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (!globalForSupabase.__izgetourSupabaseAdmin) {
    globalForSupabase.__izgetourSupabaseAdmin = createAdminClient();
  }
  return globalForSupabase.__izgetourSupabaseAdmin;
}
