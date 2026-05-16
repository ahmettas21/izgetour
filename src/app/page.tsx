import { redirect } from 'next/navigation';

// Root page redirects to default locale (TR).
// The [locale]/page.tsx handles actual content.
export default function RootPage() {
  redirect('/tr');
}
