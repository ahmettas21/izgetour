import type { Metadata } from 'next';

export const metadata = (): Metadata => ({
  title: 'Kullanım Şartları – İzgetour',
});

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
      <h1 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
        Kullanım Şartları
      </h1>
      <p className="mt-2 text-sm text-[var(--muted)]">Son güncelleme: 15 Mayıs 2026</p>

      <div className="mt-8 space-y-6 text-[var(--foreground)] leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold">1. Kabul</h2>
          <p className="mt-2 text-[var(--muted)]">
            İzgetour web sitesini kullanarak bu kullanım şartlarını kabul etmiş sayılırsınız.
            Şartları kabul etmiyorsanız siteyi kullanmayınız.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">2. Hizmetler</h2>
          <p className="mt-2 text-[var(--muted)]">
            İzgetour, tur paketleri, otel rezervasyonları ve uçuş biletlemesi gibi seyahat
            hizmetleri sunmaktadır. Tüm hizmetler, bağlı iş ortaklarımız aracılığıyla
            sağlanır.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">3. Rezervasyon ve Ödeme</h2>
          <p className="mt-2 text-[var(--muted)]">
            Rezervasyonlar, belirtilen ödeme koşullarına bağlı olarak tamamlanır. İptal ve
            değişiklik politikaları, rezervasyon anında bildirilen şartlara tabidir.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">4. Sorumluluk</h2>
          <p className="mt-2 text-[var(--muted)]">
            İzgetour, hizmet sağlayıcıların (oteller, havayolları, tur operatörleri)
            kaynaklanan aksaklıklardan doğrudan sorumlu değildir. Müşterilerimizin
            mağduriyetini önlemek için elimizden geleni yaparız.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">5. Değişiklikler</h2>
          <p className="mt-2 text-[var(--muted)]">
            Bu kullanım şartları önceden haber verilmeksizin değiştirilebilir. Güncel
            şartlar her zaman bu sayfada yayımlanır.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">6. İletişim</h2>
          <p className="mt-2 text-[var(--muted)]">
            Sorularınız için{' '}
            <a href="mailto:info@izgetour.com" className="text-[var(--brand)] hover:underline">
              info@izgetour.com
            </a>{' '}
            adresinden bize ulaşabilirsiniz.
          </p>
        </section>
      </div>
    </main>
  );
}
