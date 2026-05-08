import FlightSearch from '@/components/FlightSearch';
import type { Metadata } from 'next';

export const metadata = (): Metadata => ({ title: 'Uçuşlar' });

export default function FlightsPage() {
  return <FlightSearch />;
}
