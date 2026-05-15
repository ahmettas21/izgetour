// ─── Ortak tipler ve veriler - tum search component'leri icin ───

export type Tab = 'flights' | 'tours' | 'hotels';

export type RoomConfig = { adults: number; children: { age: number }[] };
export type GuestConfig = { rooms: RoomConfig[] };

export const CHILD_AGES = Array.from({ length: 18 }, (_, i) => ({
  label: String(i), value: i,
}));

export const CITY_OPTIONS = [
  { label: 'İstanbul', value: 'istanbul' },
  { label: 'Antalya', value: 'antalya' },
  { label: 'Kapadokya', value: 'kapadokya' },
  { label: 'İzmir', value: 'izmir' },
  { label: 'Bodrum', value: 'bodrum' },
  { label: 'Marmaris', value: 'marmaris' },
  { label: 'Fethiye', value: 'fethiye' },
  { label: 'Pamukkale', value: 'pamukkale' },
  { label: 'Trabzon', value: 'trabzon' },
  { label: 'Efes', value: 'efes' },
];

export const TOUR_CATEGORIES = [
  { value: '', labelTr: 'Tüm Turlar' },
  { value: 'kultur', labelTr: 'Kültür Turları' },
  { value: 'macera', labelTr: 'Macera Turları' },
  { value: 'deniz', labelTr: 'Deniz & Plaj' },
  { value: 'gastronomi', labelTr: 'Gastronomi' },
  { value: 'dogal', labelTr: 'Doğa & Kamp' },
];

// ─── Helpers ───
export function defaultGuestConfig(): GuestConfig {
  return { rooms: [{ adults: 2, children: [] }] };
}
export function totalGuests(g: GuestConfig) {
  return g.rooms.reduce((s, r) => s + r.adults + r.children.length, 0);
}
export function totalAdults(g: GuestConfig) {
  return g.rooms.reduce((s, r) => s + r.adults, 0);
}
export function totalChildren(g: GuestConfig) {
  return g.rooms.reduce((s, r) => s + r.children.length, 0);
}
export function guestSummary(g: GuestConfig): string {
  const rooms = g.rooms.length;
  const adults = totalAdults(g);
  const children = totalChildren(g);
  let s = `${rooms} oda, ${adults} yetişkin`;
  if (children > 0) s += `, ${children} çocuk`;
  return s;
}
export function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}
export function nextDayStr(date: string): string {
  const d = new Date(date);
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}
