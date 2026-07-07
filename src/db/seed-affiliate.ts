/**
 * İzgeTour — Affiliate placeholder seed (idempotent) — Supabase sürümü.
 *
 * Çalıştırma: npm run db:seed:affiliate
 *
 * İlker gerçek affiliate linklerini sonra girecek. Şimdilik placeholder kayıtlar
 * (enabled=false) ekleniyor ki sistem uçtan uca hazır olsun. Aktif olmadıkları
 * için /go endpoint'i bunları görmezden gelip fallback URL'ye yönlendirir.
 *
 * Template placeholder'ları: {origin} {destination} {date} {price}
 * booking_source değerleri price_cache'teki booking_source ile birebir eşleşmeli
 * (FAST, Kiwi, Skyscanner, Gotogate, GoogleFlights...).
 *
 * booking_source UNIQUE → upsert(onConflict='booking_source', ignoreDuplicates)
 * ile tekrar çalıştırılabilir (idempotent, mevcut kayıtları ezmez).
 */
import { getSupabaseAdmin } from './supabase-admin';

interface AffiliateSeed {
  booking_source: string;
  affiliate_url_template: string;
  commission_note: string;
  enabled: boolean;
}

const AFFILIATES: AffiliateSeed[] = [
  {
    booking_source: 'Kiwi',
    affiliate_url_template:
      'https://www.kiwi.com/en/search/results/{origin}/{destination}/{date}?affilid=PLACEHOLDER',
    commission_note: 'Placeholder — İlker gerçek affilid girecek.',
    enabled: false,
  },
  {
    booking_source: 'Skyscanner',
    affiliate_url_template:
      'https://www.skyscanner.net/transport/flights/{origin}/{destination}/{date}/?associateid=PLACEHOLDER',
    commission_note: 'Placeholder — associateid bekleniyor.',
    enabled: false,
  },
  {
    booking_source: 'FAST',
    affiliate_url_template:
      'https://skiplagged.com/flights/{origin}/{destination}/{date}?ref=PLACEHOLDER',
    commission_note: 'Placeholder — Skiplagged/FAST ref bekleniyor.',
    enabled: false,
  },
  {
    booking_source: 'Gotogate',
    affiliate_url_template:
      'https://www.gotogate.com/rf/search?origin={origin}&destination={destination}&outbound={date}&aid=PLACEHOLDER',
    commission_note: 'Placeholder — aid bekleniyor.',
    enabled: false,
  },
  {
    // İkincil sağlayıcı: Skiplagged 0 dönen rotalarda Google Flights fallback'i.
    booking_source: 'GoogleFlights',
    affiliate_url_template:
      'https://www.google.com/travel/flights?curr=USD&q=Flights%20from%20{origin}%20to%20{destination}%20on%20{date}%20oneway',
    commission_note: 'Google Flights doğrudan arama (affiliate değil; kullanıcıyı uçuşa götürür).',
    enabled: false,
  },
];

async function main(): Promise<void> {
  const sb = getSupabaseAdmin();

  const { error } = await sb
    .from('affiliate_links')
    .upsert(AFFILIATES, { onConflict: 'booking_source', ignoreDuplicates: true });
  if (error) throw new Error(`upsert: ${error.message}`);

  const { count: total } = await sb
    .from('affiliate_links')
    .select('*', { count: 'exact', head: true });
  const { count: enabled } = await sb
    .from('affiliate_links')
    .select('*', { count: 'exact', head: true })
    .eq('enabled', true);

  console.log(`[seed-affiliate] affiliate_links: ${total ?? 0} (aktif: ${enabled ?? 0})`);
}

main()
  .then(() => {
    console.log('[seed-affiliate] tamamlandı.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('[seed-affiliate] hata:', err);
    process.exit(1);
  });
