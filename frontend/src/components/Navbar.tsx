'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Globe,
  Folder,
  FolderOpen,
  ChevronDown,
  Terminal,
  Compass,
  Shield,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [vaultOpen, setVaultOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const vaultItems = [
    {
      href: '/',
      label: 'Chronicle Feed',
      code: 'FEED // 01',
      desc: 'Master operational chronology & dossiers',
      icon: Terminal,
      match: (path: string) => path === '/' || path.startsWith('/events'),
    },
    {
      href: '/locations',
      label: 'Sector Registry',
      code: 'SECTOR // 02',
      desc: 'Strategic coordinates & territory sectors',
      icon: Compass,
      match: (path: string) => path === '/locations',
    },
    {
      href: '/factions',
      label: 'Organization Registry',
      code: 'ORG // 03',
      desc: 'Sovereign factions, empires & syndicates',
      icon: Shield,
      match: (path: string) => path === '/factions',
    },
  ];

  const isVaultActive = vaultItems.some((item) => item.match(pathname));

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setVaultOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setVaultOpen(false);
      }
    }
    if (vaultOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [vaultOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/90 bg-[#040507]/95 backdrop-blur-md select-none">
      {/* Top Telemetry Ticker Line */}
      <div className="border-b border-zinc-850 px-4 sm:px-8 py-1 flex items-center justify-between text-[11px] hud-mono text-zinc-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            SYS_ONLINE
          </span>
          <span className="hidden sm:inline text-zinc-700">//</span>
          <span className="hidden sm:inline tracking-wider">DATABASE: LIVE</span>
          <span className="hidden sm:inline text-zinc-700">//</span>
          <span className="hidden sm:inline tracking-wider">SECURITY: ALPHA-RESTRICTED</span>
          <span className="hidden md:inline text-zinc-700">//</span>
          <span className="hidden md:inline tracking-wider text-zinc-600">FENIX TECH R&D MIL-SPEC</span>
        </div>
        <div className="flex items-center gap-3 tracking-wider text-zinc-400">
          <span>STATION // OVERSEER-01</span>
        </div>
      </div>

      {/* Main Command Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 border border-zinc-700/90 bg-zinc-950 flex items-center justify-center text-red-500 group-hover:border-red-500/80 transition-all rounded shadow-md group-hover:shadow-[0_0_12px_rgba(239,68,68,0.3)]">
            <Globe className="w-5 h-5 text-red-500 group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg text-white tracking-wider hud-mono">
                OVERSEER
              </span>
              <span className="text-[10px] px-1.5 py-0.5 bg-red-500/10 text-red-400 border border-red-500/40 rounded hud-mono font-bold tracking-widest">
                MIL-SPEC
              </span>
            </div>
            <span className="text-[11px] text-zinc-400 block -mt-0.5 tracking-tight font-mono">
              Advanced Strategic Analysis System
            </span>
          </div>
        </Link>

        {/* Global Navigation Container */}
        <nav className="flex items-center gap-1 bg-zinc-950/80 border border-zinc-800/80 p-1 rounded-lg">
          {/* Data Vault Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setVaultOpen(!vaultOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold tracking-wider hud-mono transition-all ${
                vaultOpen || isVaultActive
                  ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 border border-transparent'
              }`}
              aria-expanded={vaultOpen}
              aria-haspopup="true"
            >
              {vaultOpen ? (
                <FolderOpen className="w-3.5 h-3.5 text-red-400" />
              ) : (
                <Folder className="w-3.5 h-3.5 text-red-400" />
              )}
              <span>DATA VAULT</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${
                  vaultOpen ? 'rotate-180 text-red-400' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu Panel (100% Solid Opaque Background) */}
            {vaultOpen && (
              <div 
                className="absolute right-0 mt-2.5 w-72 sm:w-80 bg-[#090b10] border border-zinc-700/90 shadow-[0_20px_50px_rgba(0,0,0,0.95)] ring-1 ring-zinc-700/60 rounded-xl p-2 z-50 font-mono animate-in fade-in zoom-in-95 duration-150"
                style={{ backgroundColor: '#090b10', opacity: 1 }}
              >
                {/* Dropdown Header */}
                <div className="px-3 py-2 border-b border-zinc-800/80 mb-1 flex items-center justify-between text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
                  <span>DIRECTORY // SECURE REPOSITORIES</span>
                  <span>MIL-SPEC 884</span>
                </div>

                <div className="space-y-1">
                  {vaultItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setVaultOpen(false)}
                        className={`flex items-start gap-3 p-2.5 rounded-lg transition-all border ${
                          isActive
                            ? 'bg-[#121622] border-red-500/50 text-white shadow-xs'
                            : 'border-transparent text-zinc-300 hover:bg-[#121622] hover:text-white hover:border-zinc-800'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                            isActive
                              ? 'bg-zinc-900 border-red-500/60 text-red-400'
                              : 'bg-zinc-950 border-zinc-800 text-zinc-400 group-hover:text-zinc-200'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold tracking-wide text-zinc-100">
                              {item.label}
                            </span>
                            <span className="text-[9px] text-zinc-500 tracking-widest font-mono">
                              {item.code}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 font-sans truncate mt-0.5 leading-snug">
                            {item.desc}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Sub-Footer in Dropdown */}
                <div className="mt-2 pt-2 border-t border-zinc-800/80 px-2.5 pb-1 flex items-center justify-between text-[10px] text-zinc-500">
                  <span>CLASSIFIED ACCESS</span>
                  <span>NODE 01-ONLINE</span>
                </div>
              </div>
            )}
          </div>

          {/* Future navigation buttons and dropdowns can be appended here */}
        </nav>
      </div>
    </header>
  );
}
