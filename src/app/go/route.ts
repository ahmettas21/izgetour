/**
 * İzgeTour — Affiliate redirect endpoint.
 *
 * GET /go?source=FAST&origin=IST&dest=AYT&date=2026-07-21&price=65
 *
 * Akış:
 *  1. Query param'ları doğrula (origin & dest zorunlu).
 *  2. buildAffiliateUrl ile gerçek affiliate URL'yi çöz (aktif affiliate varsa template,
 *     yoksa/pasifse fallback).
 *  3. Basit tıklama logla (console.log — ileride click_log tablosu).
 *  4. 302 redirect.
 *
 * NOT: node runtime gerekir (buildAffiliateUrl içinde Supabase service_role ile DB okur).
 */
import { NextResponse, type NextRequest } from 'next/server';
import { buildAffiliateUrl } from '@/lib/affiliate';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// IATA: 3 harf. Basit sanitizasyon (open-redirect / injection önleme).
const IATA_RE = /^[A-Za-z]{3}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const source = searchParams.get('source') ?? undefined;
  const origin = (searchParams.get('origin') ?? '').toUpperCase();
  const dest = (searchParams.get('dest') ?? '').toUpperCase();
  const dateRaw = searchParams.get('date') ?? undefined;
  const priceRaw = searchParams.get('price');

  // ── Validation ──
  if (!IATA_RE.test(origin) || !IATA_RE.test(dest)) {
    return NextResponse.json(
      { error: 'Geçersiz origin/dest. 3 harfli IATA kodu bekleniyor.' },
      { status: 400 },
    );
  }
  const date = dateRaw && DATE_RE.test(dateRaw) ? dateRaw : undefined;
  const priceNum = priceRaw != null ? Number(priceRaw) : undefined;
  const price = Number.isFinite(priceNum) && (priceNum as number) >= 0 ? priceNum : undefined;

  // ── Çöz ──
  const resolved = await buildAffiliateUrl(source, {
    origin,
    destination: dest,
    date,
    price,
  });

  // ── Basit tıklama log (ileride click_log tablosu) ──
  console.log(
    `[go] click source=${source ?? '-'} ${origin}->${dest} date=${date ?? '-'} ` +
      `price=${price ?? '-'} fallback=${resolved.fallback} -> ${resolved.url}`,
  );

  // ── Redirect ──
  return NextResponse.redirect(resolved.url, 302);
}
