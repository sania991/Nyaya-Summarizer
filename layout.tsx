import './globals.css';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: { default: 'Nyaya Summarizer', template: '%s | Nyaya Summarizer' },
  description: 'Summaries, key legal points, citations, similar judgments and hearing dates for district court judgments.',
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
