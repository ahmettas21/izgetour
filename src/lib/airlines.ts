/**
 * İzgeTour — Havayolu normalizasyonu ve marka görselleri.
 *
 * Amaç: DB'de tutarsız gelen havayolu adlarını ("Pegasus" / "Pegasus Airlines")
 * tek merkezden düzgün tam ada çevirmek ve harici logo servisine bağımlı
 * olmadan koddan renkli monogram/badge üretebilmek.
 *
 * Kullanım:
 *   const a = resolveAirline(carrierCode, airlineName);
 *   a.name  -> "Pegasus"
 *   a.badge -> { bg, fg, label }  (monogram için)
 */

export interface AirlineBrand {
  /** IATA kodu (varsa) */
  code: string;
  /** Görünen tam ad (normalize) */
  name: string;
  /** Monogram badge: arka plan, yazı rengi, kısa etiket (2 harf) */
  badge: { bg: string; fg: string; label: string };
}

/** IATA koduna göre kanonik ad + marka rengi. */
const AIRLINE_MAP: Record<string, { name: string; bg: string; fg: string }> = {
  TK: { name: 'Turkish Airlines', bg: '#C8102E', fg: '#FFFFFF' },
  PC: { name: 'Pegasus', bg: '#FDB913', fg: '#1A1A1A' },
  VF: { name: 'AJet', bg: '#00A8E1', fg: '#FFFFFF' },
  XQ: { name: 'SunExpress', bg: '#F58220', fg: '#FFFFFF' },
  A3: { name: 'Aegean Airlines', bg: '#00509E', fg: '#FFFFFF' },
  LH: { name: 'Lufthansa', bg: '#05164D', fg: '#F9BA00' },
  QR: { name: 'Qatar Airways', bg: '#5C0632', fg: '#FFFFFF' },
  FZ: { name: 'flydubai', bg: '#001A70', fg: '#FF6A13' },
  EK: { name: 'Emirates', bg: '#D71921', fg: '#FFFFFF' },
  KU: { name: 'Kuwait Airways', bg: '#003C71', fg: '#FFFFFF' },
  J2: { name: 'Azerbaijan Airlines', bg: '#00609C', fg: '#FFFFFF' },
  AH: { name: 'Air Algérie', bg: '#00843D', fg: '#FFFFFF' },
  W6: { name: 'Wizz Air', bg: '#C6007E', fg: '#FFFFFF' },
  FR: { name: 'Ryanair', bg: '#073590', fg: '#F1C933' },
  U2: { name: 'easyJet', bg: '#FF6600', fg: '#FFFFFF' },
};

/** Ada göre normalize (kod yoksa isimden kanonik ada eşle). */
const NAME_ALIASES: Record<string, string> = {
  'pegasus airlines': 'Pegasus',
  pegasus: 'Pegasus',
  'turkish airlines': 'Turkish Airlines',
  thy: 'Turkish Airlines',
  ajet: 'AJet',
  'anadolu jet': 'AJet',
  anadolujet: 'AJet',
  sunexpress: 'SunExpress',
  'aegean airlines': 'Aegean Airlines',
  aegean: 'Aegean Airlines',
  flydubai: 'flydubai',
  'fly dubai': 'flydubai',
  emirates: 'Emirates',
  'emirates and flydubai': 'Emirates',
};

/** Deterministik renk paleti (bilinmeyen havayolları için). */
const FALLBACK_PALETTE = [
  { bg: '#0F62FE', fg: '#FFFFFF' },
  { bg: '#198038', fg: '#FFFFFF' },
  { bg: '#8A3FFC', fg: '#FFFFFF' },
  { bg: '#D62728', fg: '#FFFFFF' },
  { bg: '#1192E8', fg: '#FFFFFF' },
  { bg: '#B28600', fg: '#FFFFFF' },
];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/** "turkish airlines" -> "TA", "Pegasus" -> "PE" (2 harflik monogram). */
function monogram(name: string, code: string): string {
  const clean = name.trim();
  if (!clean) return (code || '✈').slice(0, 2).toUpperCase();
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase();
}

/**
 * Havayolu kodu ve/veya adından normalize marka bilgisi üretir.
 * Harici görsele bağımlı değildir — badge her zaman koddan üretilir.
 */
export function resolveAirline(
  code: string | null | undefined,
  name: string | null | undefined,
): AirlineBrand {
  const rawCode = (code ?? '').trim().toUpperCase();
  const rawName = (name ?? '').trim();

  // 1) IATA koduyla eşleşme
  const byCode = rawCode ? AIRLINE_MAP[rawCode] : undefined;
  if (byCode) {
    return {
      code: rawCode,
      name: byCode.name,
      badge: { bg: byCode.bg, fg: byCode.fg, label: monogram(byCode.name, rawCode) },
    };
  }

  // 2) İsim alias'ı
  const canonName = NAME_ALIASES[rawName.toLowerCase()] ?? rawName;

  // İsim üzerinden bilinen bir markaya denk geldiysek onun rengini kullan
  const codeByName = Object.entries(AIRLINE_MAP).find(([, v]) => v.name === canonName)?.[0];
  if (codeByName) {
    const brand = AIRLINE_MAP[codeByName];
    return {
      code: rawCode || codeByName,
      name: brand.name,
      badge: { bg: brand.bg, fg: brand.fg, label: monogram(brand.name, rawCode || codeByName) },
    };
  }

  // 3) Fallback: deterministik renk + monogram
  const key = canonName || rawCode || 'flight';
  const pal = FALLBACK_PALETTE[hashString(key) % FALLBACK_PALETTE.length];
  const displayName = canonName || rawCode || 'Havayolu';
  return {
    code: rawCode,
    name: displayName,
    badge: { bg: pal.bg, fg: pal.fg, label: monogram(displayName, rawCode) },
  };
}

/** Sadece normalize edilmiş görünen adı döner (JSON-LD, FAQ, meta için). */
export function airlineName(
  code: string | null | undefined,
  name: string | null | undefined,
): string {
  return resolveAirline(code, name).name;
}
