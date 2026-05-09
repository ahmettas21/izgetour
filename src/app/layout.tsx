import './globals.css';

// Root layout intentionally renders no html/body wrappers.
// The [locale]/layout.tsx nested layout handles those tags
// to set the correct lang attribute per locale.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children as React.ReactElement;
}
