/**
 * İzgeTour — Affiliate placeholder seed (idempotent).
 *
 * Çalıştırma: npm run db:seed:affiliate
 *
 * İlker gerçek affiliate linklerini sonra girecek. Şimdilik placeholder kayıtlar
 * (enabled=false) ekleniyor ki sistem uçtan uca hazır olsun. Aktif olmadıkları
 * için /go endpoint'i bunları görmezden gelip fallback URL'ye yönlendirir.
 *
 * Template placeholder'ları: {origin} {destination} {date} {price}
 * bookingSource değerleri price_cache'teki booking_source ile birebir eşleşmeli
 * (FAST, Kiwi, Skyscanner, Gotogate...).
 */
import { randomUUID } from 'node:crypto';
import { getDb, getRawSqlite } from './index';
import { affiliateLinks, type NewAffiliateLink } from './schema';

type AffiliateSeed = Omit<NewAffiliateLink, 'id'>;

const AFFILIATES: AffiliateSeed[] = [
  {
    bookingSource: 'Kiwi',
    affiliateUrlTemplate:
      'https://www.kiwi.com/en/search/results/{origin}/{destination}/{date}?affilid=PLACEHOLDER',
    commissionNote: 'Placeholder — İlker gerçek affilid girecek.',
    enabled: false,
  },
  {
    bookingSource: 'Skyscanner',
    affiliateUrlTemplate:
      'https://www.skyscanner.net/transport/flights/{origin}/{destination}/{date}/?associateid=PLACEHOLDER',
    commissionNote: 'Placeholder — associateid bekleniyor.',
    enabled: false,
  },
  {
    bookingSource: 'FAST',
    affiliateUrlTemplate:
      'https://skiplagged.com/flights/{origin}/{destination}/{date}?ref=PLACEHOLDER',
    commissionNote: 'Placeholder — Skiplagged/FAST ref bekleniyor.',
    enabled: false,
  },
  {
    bookingSource: 'Gotogate',
    affiliateUrlTemplate:
      'https://www.gotogate.com/rf/search?origin={origin}&destination={destination}&outbound={date}&aid=PLACEHOLDER',
    commissionNote: 'Placeholder — aid bekleniyor.',
    enabled: false,
  },
  {
    // İkincil sağlayıcı: Skiplagged 0 dönen rotalarda Google Flights fallback'i.
    bookingSource: 'GoogleFlights',
    affiliateUrlTemplate:
      'https://www.google.com/travel/flights?curr=USD&q=Flights%20from%20{origin}%20to%20{destination}%20on%20{date}%20oneway',
    commissionNote: 'Google Flights doğrudan arama (affiliate değil; kullanıcıyı uçuşa götürür).',
    enabled: false,
  },
];

function main() {
  const db = getDb();

  const rows: NewAffiliateLink[] = AFFILIATES.map((a) => ({ id: randomUUID(), ...a }));
  // bookingSource unique → onConflictDoNothing ile tekrar çalıştırılabilir (idempotent).
  db.insert(affiliateLinks).values(rows).onConflictDoNothing().run();

  const raw = getRawSqlite();
  const total = (raw.prepare('SELECT COUNT(*) AS c FROM affiliate_links').get() as { c: number }).c;
  const enabled = (
    raw.prepare('SELECT COUNT(*) AS c FROM affiliate_links WHERE enabled = 1').get() as { c: number }
  ).c;

  console.log(`[seed-affiliate] affiliate_links: ${total} (aktif: ${enabled})`);
}

try {
  main();
  console.log('[seed-affiliate] tamamlandı.');
  process.exit(0);
} catch (err) {
  console.error('[seed-affiliate] hata:', err);
  process.exit(1);
}
