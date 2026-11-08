import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import { ShieldCheck, Lock, Globe, Terminal, Building2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'OVERSEER // Advanced Strategic Analysis System',
  description: 'Futuristic military-grade classified world telemetry, historical chronicle, and strategic analysis system developed by Fenix Technology Research LLC.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentYear = new Date().getFullYear();

  return (
    <html lang="en" className="dark">
      <body className="bg-tactical-void text-zinc-100 min-h-screen flex flex-col antialiased selection:bg-red-500/30 selection:text-white">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Tactical Defense Contractor Footer */}
        <footer className="border-t border-zinc-800/90 bg-[#06080d] text-zinc-400 font-mono text-xs select-none">
          {/* Upper Telemetry Bar */}
          <div className="border-b border-zinc-850 px-4 sm:px-8 py-3">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-zinc-300 font-bold tracking-wider">
                  OVERSEER // DEFENSE ANALYSIS SUITE
                </span>
                <span className="text-zinc-600">//</span>
                <span className="text-zinc-400">SPEC: MIL-C2-V4.8.2</span>
              </div>
              <div className="flex items-center gap-4 text-[10px] tracking-widest text-zinc-400">
                <span className="flex items-center gap-1.5 text-red-400 font-semibold">
                  <Lock className="w-3 h-3 text-red-500" />
                  CONFIDENTIAL // TOP SECRET ALPHA
                </span>
                <span className="hidden md:inline text-zinc-600">|</span>
                <span className="hidden md:inline">SYSTEM DIRECTIVE 884-D</span>
              </div>
            </div>
          </div>

          {/* Main Legal & Corporate Information */}
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start border-b border-zinc-850 pb-6">
              {/* Brand & Developer Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white font-bold tracking-wider text-sm">
                  <Building2 className="w-4 h-4 text-red-500" />
                  <span>Fenix Technology Research LLC</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                  Defense Systems & Strategic Analysis Division. Designing resilient, intelligence-driven command solutions for complex geopolitical and historical analysis.
                </p>
                <div className="text-[10px] text-zinc-500 pt-1">
                  SYSTEM DESIGNATION: OVERSEER-C2 // BUILD 2026.11-PROD
                </div>
              </div>

              {/* Legal & Compliance Notice */}
              <div className="md:col-span-2 space-y-2">
                <div className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase flex items-center gap-1.5">
                  <Terminal className="w-3 h-3 text-red-400" />
                  <span>PROPRIETARY DEFENSE SPECIFICATION & COMPLIANCE MANDATE</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                  All software architecture, algorithmic analysis engines, sector telemetry schemas, and classified event dossiers contained in this repository are the exclusive proprietary intellectual property of <strong className="text-zinc-200">Fenix Technology Research LLC</strong>. Unauthorized interception, extraction, redistribution, reverse engineering, or reproduction of world intelligence records is strictly prohibited under international defense technology covenants, trade secret statutes, and Title 18 strategic information mandates.
                </p>
              </div>
            </div>

            {/* Bottom Copyright & Protocol Links */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-500">
              <div>
                © {currentYear} <span className="text-zinc-300 font-semibold">Fenix Technology Research LLC</span>. All rights reserved.
              </div>
              <div className="flex flex-wrap items-center gap-4 text-[10px] text-zinc-400">
                <span className="hover:text-red-400 cursor-pointer transition-colors">[DEFENSE COMPLIANCE]</span>
                <span>•</span>
                <span className="hover:text-red-400 cursor-pointer transition-colors">[PRIVACY DIRECTIVE]</span>
                <span>•</span>
                <span className="hover:text-red-400 cursor-pointer transition-colors">[TERMS OF OPERATIONAL USE]</span>
                <span>•</span>
                <span className="text-zinc-500">NODE ID: 77-ALPHA</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
