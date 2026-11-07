'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Terminal, Plus, Compass, Shield, Activity } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'CHRONICLE FEED', short: 'FEED', icon: Terminal },
    { href: '/events/new', label: 'RECORD EVENT', short: 'RECORD', icon: Plus },
    { href: '/locations', label: 'SECTOR REGISTRY', short: 'SECTORS', icon: Compass },
    { href: '/factions', label: 'FACTION MATRIX', short: 'FACTIONS', icon: Shield },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-tactical-border/90 bg-tactical-void/90 backdrop-blur-md">
      {/* Top Telemetry Ticker Line */}
      <div className="border-b border-tactical-border/40 px-4 sm:px-8 py-1 flex items-center justify-between text-[11px] hud-mono text-zinc-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            SYS_ONLINE
          </span>
          <span className="hidden sm:inline text-zinc-600">//</span>
          <span className="hidden sm:inline tracking-wider">DATABASE: LIVE</span>
          <span className="hidden sm:inline text-zinc-600">//</span>
          <span className="hidden sm:inline tracking-wider">SECURITY: ALPHA-RESTRICTED</span>
        </div>
        <div className="flex items-center gap-3 tracking-wider text-zinc-400">
          <span>ARCHIVE NODE // 01</span>
        </div>
      </div>

      {/* Main Command Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 border border-zinc-700 bg-zinc-950 flex items-center justify-center text-red-500 group-hover:border-red-500/80 transition-colors shadow-xs">
            <Activity className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base text-zinc-100 tracking-wider hud-mono">
                ARCHIVE // C2
              </span>
              <span className="text-[10px] px-1.5 py-0.2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-xs hud-mono font-semibold">
                MIL-SPEC
              </span>
            </div>
            <span className="text-[11px] text-zinc-500 block -mt-0.5 tracking-tight font-mono">
              World Event Chronicle System
            </span>
          </div>
        </Link>

        {/* Utilitarian Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-zinc-950/80 border border-zinc-800/80 p-1 rounded-lg">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold tracking-wider hud-mono transition-all ${
                  isActive
                    ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-red-400' : 'text-zinc-500'}`} />
                <span className="hidden md:inline">{link.label}</span>
                <span className="md:hidden">{link.short}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
