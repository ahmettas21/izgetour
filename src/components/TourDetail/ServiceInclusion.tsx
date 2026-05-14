interface ServiceInclusionProps {
  inclusions: string[];
  exclusions: string[];
  locale: string;
}

export default function ServiceInclusion({ inclusions, exclusions, locale }: ServiceInclusionProps) {
  if (!inclusions || inclusions.length === 0) return null;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-5">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-emerald-700">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs">
            ✅
          </span>
          {locale === 'tr' ? 'Fiyata Dahil Hizmetler' : 'Included Services'}
        </h3>
        <ul className="space-y-2">
          {inclusions.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-emerald-800">
              <span className="mt-0.5 shrink-0 text-emerald-500">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-red-100 bg-red-50/50 p-5">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-red-700">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs">
            ❌
          </span>
          {locale === 'tr' ? 'Dahil Olmayan Hizmetler' : 'Excluded Services'}
        </h3>
        <ul className="space-y-2">
          {exclusions.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-red-800">
              <span className="mt-0.5 shrink-0 text-red-400">✕</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
