/**
 * İzgeTour — Adana ADA→COV veri düzeltmesi (idempotent).
 *
 * Neden: Eski Adana Şakirpaşa (ADA) havalimanı kapandı; Skiplagged yalnızca
 * aktif Çukurova (COV) havalimanını indeksliyor. ADA her yönde 0 uçuş döner.
 * Bu script mevcut DB'yi güvenli şekilde COV'a taşır (DROP/DELETE airport YOK).
 *
 * Yapılanlar:
 *  1. COV havalimanını ekle (yoksa) — seed de eklenir, burada da garanti.
 *  2. istanbul-adana rotasının destination'ını ADA→COV UPDATE et (slug korunur).
 *  3. Bu rotaya ait ESKİ ADA price_cache satırlarını temizle (bayat veri).
 *
 * Çalıştırma: npm run db:fix:adana   (veya tsx src/db/fix-adana.ts)
 */
import { getRawSqlite } from './index';

function main() {
  const raw = getRawSqlite();

  // 1) COV havalimanı garanti (idempotent)
  raw
    .prepare(
      `INSERT INTO airports (code, name, city, country, lat, lng)
       VALUES ('COV', 'Adana Çukurova Havalimanı', 'Adana', 'Türkiye', 36.9086, 35.2794)
       ON CONFLICT(code) DO NOTHING`,
    )
    .run();

  // 2) Rota destination ADA→COV (slug 'istanbul-adana' AYNEN korunur)
  const upd = raw
    .prepare(
      `UPDATE routes SET destination = 'COV'
       WHERE slug = 'istanbul-adana' AND destination = 'ADA'`,
    )
    .run();

  // İlgili rota id'sini al (cache temizliği için)
  const route = raw
    .prepare(`SELECT id, origin, destination FROM routes WHERE slug = 'istanbul-adana'`)
    .get() as { id: string; origin: string; destination: string } | undefined;

  // 3) Bu rotaya ait bayat ADA (destination_code='ADA') cache satırlarını temizle
  let cleaned = 0;
  if (route) {
    const del = raw
      .prepare(
        `DELETE FROM price_cache WHERE route_id = ? AND arrival_code = 'ADA'`,
      )
      .run(route.id);
    cleaned = del.changes;
  }

  console.log(
    `[fix-adana] route güncellendi: ${upd.changes} satır, ` +
      `route=${route ? `${route.origin}->${route.destination}` : 'YOK'}, ` +
      `bayat ADA cache temizlendi: ${cleaned} satır.`,
  );
}

try {
  main();
  console.log('[fix-adana] tamamlandı.');
  process.exit(0);
} catch (err) {
  console.error('[fix-adana] hata:', err);
  process.exit(1);
}
