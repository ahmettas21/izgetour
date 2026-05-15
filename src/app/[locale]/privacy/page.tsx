import type { Metadata } from 'next';

export const metadata = (): Metadata => ({
  title: 'Gizlilik Politikası – İzgetour',
});

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
      <h1 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
        Gizlilik Politikası
      </h1>
      <p className="mt-2 text-sm text-[var(--muted)]">Son güncelleme: 15 Mayıs 2026</p>

      <div className="mt-8 space-y-6 text-[var(--foreground)] leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold">1. Toplanan Bilgiler</h2>
          <p className="mt-2 text-[var(--muted)]">
            İzgetour olarak, size daha iyi hizmet verebilmek için ad, soyad, e-posta adresi,
            telefon numarası ve seyahat tercihleriniz gibi kişisel bilgilerinizi toplayabiliriz.
            Bu bilgiler yalnızca rezervasyon sürecinde ve müşteri hizmetlerimiz tarafından
            kullanılmaktadır.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">2. Bilgilerin Kullanımı</h2>
          <p className="mt-2 text-[var(--muted)]">
            Topladığımız bilgiler; rezervasyonlarınızı yönetmek, size özel teklifler sunmak,
            ödemeleri işlemek ve yasal yükümlülüklerimizi yerine getirmek amacıyla kullanılır.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">3. Bilgi Paylaşımı</h2>
          <p className="mt-2 text-[var(--muted)]">
            Kişisel bilgileriniz, yasal zorunluluk halleri dışında üçüncü taraflarla
            paylaşılmaz. Rezervasyon sürecinde otel, havayolu ve tur operatörleri gibi
            hizmet sağlayıcılarla sınırlı bilgi paylaşımı yapılabilir.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">4. Çerezler</h2>
          <p className="mt-2 text-[var(--muted)]">
            Web sitemiz, kullanıcı deneyimini iyileştirmek amacıyla çerezler kullanmaktadır.
            Çerez tercihlerinizi tarayıcı ayarlarınızdan yönetebilirsiniz.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">5. İletişim</h2>
          <p className="mt-2 text-[var(--muted)]">
            Gizlilik politikamız hakkında sorularınız için{' '}
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
