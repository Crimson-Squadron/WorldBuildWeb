import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'ARCHIVE // C2 — World Event Chronicle Database',
  description: 'Futuristic military-spec classified historical events and intelligence database.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-tactical-void text-zinc-100 min-h-screen flex flex-col antialiased selection:bg-red-500/30 selection:text-white">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t border-zinc-900 bg-black/90 py-6 text-center text-xs hud-mono text-zinc-600">
          <div className="flex items-center justify-center gap-3">
            <span>TERMINAL ID: 77-ALPHA</span>
            <span>//</span>
            <span>SPEC: MIL-C2-V4.2</span>
            <span>//</span>
            <span>CLASSIFIED HISTORICAL ARCHIVES</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
