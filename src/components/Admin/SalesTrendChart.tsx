'use client';

import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import type { WeeklySalesPoint } from '@/data/hubs/admins';

const Chart = dynamic(
  () =>
    import('recharts').then((mod) => {
      const { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } = mod;
      return function SalesTrendChartInner({ data }: { data: WeeklySalesPoint[] }) {
        const t = useTranslations('admin');
        return (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0066CC" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0066CC" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="week"
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v: number | string) =>
                  Number(v) >= 1000 ? `${(Number(v) / 1000).toFixed(0)}K` : String(v)
                }
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
                width={48}
              />
              <Tooltip
                formatter={(value) => {
                  const num =
                    typeof value === 'number'
                      ? value
                      : typeof value === 'string'
                        ? Number(value)
                        : 0;
                  return [`₺${num.toLocaleString('tr-TR')}`, t('sales')];
                }}
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid #e5e7eb',
                  fontSize: 13,
                }}
                cursor={{ stroke: '#0066CC', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#0066CC"
                strokeWidth={2.5}
                fill="url(#colorSales)"
                dot={{ fill: '#0066CC', strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: '#0066CC' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      };
    }),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[280px] items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#0066CC] border-t-transparent" />
      </div>
    ),
  }
);

type Props = {
  data: WeeklySalesPoint[];
};

export default function SalesTrendChart({ data }: Props) {
  const t = useTranslations('admin');

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-zinc-900">{t('weeklySalesTrend')}</h3>
        <span className="text-xs text-zinc-400">{t('last7Days')}</span>
      </div>
      <Chart data={data} />
    </div>
  );
}
