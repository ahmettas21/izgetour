import { getTranslations } from 'next-intl/server';
import { currentUser } from '@/data/users';
import { bookings } from '@/data/bookings';
import { CalendarDays, Wallet, Building2, MapPin, Plane, FileText, User, Gift } from 'lucide-react';

const STATUS_MAP: Record<string, { class: string; dot: string }> = {
  confirmed: { class: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  pending: { class: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  completed: { class: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  cancelled: { class: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
};

const TYPE_ICON_MAP: Record<string, React.ElementType> = {
  hotel: Building2,
  tour: MapPin,
  flight: Plane,
  visa: FileText,
};

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('dashboard');

  const totalSpent = bookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.amount, 0);

  const activeBookings = bookings.filter((b) => b.status === 'confirmed' || b.status === 'pending').length;

  const stats = [
    { label: t('izgePoints'), value: currentUser.izgePoints.toLocaleString(), icon: Gift, color: 'text-amber-500 bg-amber-50' },
    { label: t('activeBookings'), value: activeBookings.toString(), icon: CalendarDays, color: 'text-emerald-500 bg-emerald-50' },
    { label: t('totalSpent'), value: `₺${totalSpent.toLocaleString()}`, icon: Wallet, color: 'text-blue-500 bg-blue-50' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-zinc-900">{t('title')}</h1>
        <p className="mt-2 text-lg text-zinc-500">{t('welcome')}, {currentUser.name} 👋</p>
      </div>

      {/* Stats Cards */}
      <div className="mb-12 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-zinc-200 bg-white p-5">
            <div className={`mb-3 inline-flex rounded-xl p-2.5 ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div className="text-2xl font-bold text-zinc-900">{stat.value}</div>
            <div className="mt-1 text-sm text-zinc-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Booking History */}
        <div className="lg:col-span-2">
          <h2 className="mb-5 text-xl font-bold text-zinc-900">{t('bookingHistory')}</h2>
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50 text-left text-xs font-medium uppercase text-zinc-500">
                    <th className="px-5 py-3">{t('bookingId')}</th>
                    <th className="px-5 py-3">{t('type')}</th>
                    <th className="px-5 py-3">{t('date')}</th>
                    <th className="px-5 py-3">{t('amount')}</th>
                    <th className="px-5 py-3">{t('status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {bookings.map((booking) => {
                    const statusStyle = STATUS_MAP[booking.status];
                    const Icon = TYPE_ICON_MAP[booking.type];
                    const typeLabel = t(booking.type);
                    const desc = locale === 'tr' ? booking.description : booking.descriptionEn;
                    const statusLabel = t(booking.status);

                    return (
                      <tr key={booking.id} className="group hover:bg-zinc-50">
                        <td className="px-5 py-4">
                          <div className="font-medium text-zinc-900">{booking.id}</div>
                          <div className="mt-0.5 max-w-[200px] truncate text-xs text-zinc-400">{desc}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="flex items-center gap-1.5 text-zinc-600">
                            {Icon && <Icon className="h-3.5 w-3.5" />}
                            {typeLabel}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-zinc-600">{booking.date}</td>
                        <td className="px-5 py-4 font-medium text-zinc-900">₺{booking.amount.toLocaleString()}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle.class}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
                            {statusLabel}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* User Profile Sidebar */}
        <div>
          <div className="sticky top-24 rounded-2xl border border-zinc-200 bg-white p-6">
            <div className="mb-5 flex flex-col items-center">
              <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-[#0066CC]/10 text-3xl font-bold text-[#0066CC]">
                {currentUser.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <h3 className="text-lg font-bold text-zinc-900">{currentUser.name}</h3>
              <p className="text-sm text-zinc-500">{currentUser.email}</p>
            </div>

            <div className="space-y-3 border-t border-zinc-100 pt-5">
              <div className="flex items-center gap-3 text-sm">
                <User className="h-4 w-4 text-zinc-400" />
                <div>
                  <div className="text-zinc-400">{t('profile')}</div>
                  <div className="font-medium text-zinc-800">{currentUser.name}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CalendarDays className="h-4 w-4 text-zinc-400" />
                <div>
                  <div className="text-zinc-400">{t('memberSince')}</div>
                  <div className="font-medium text-zinc-800">{currentUser.joinDate}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Gift className="h-4 w-4 text-amber-400" />
                <div>
                  <div className="text-zinc-400">{t('izgePoints')}</div>
                  <div className="font-medium text-amber-700">{currentUser.izgePoints.toLocaleString()} Puan</div>
                </div>
              </div>
            </div>

            {/* Upcoming */}
            <div className="mt-6 border-t border-zinc-100 pt-5">
              <h4 className="mb-3 text-sm font-semibold text-zinc-800">{t('upcomingBookings')}</h4>
              <div className="space-y-3">
                {bookings.filter((b) => b.status === 'confirmed').map((b) => {
                  const desc = locale === 'tr' ? b.description : b.descriptionEn;
                  return (
                    <div key={b.id} className="rounded-xl bg-zinc-50 p-3">
                      <div className="text-sm font-medium text-zinc-800">{desc}</div>
                      <div className="mt-1 text-xs text-zinc-400">{b.date}</div>
                    </div>
                  );
                })}
                {bookings.filter((b) => b.status === 'confirmed').length === 0 && (
                  <p className="text-sm text-zinc-400">{t('upcomingBookings')} —</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
