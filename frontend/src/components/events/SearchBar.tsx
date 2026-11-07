'use client';

import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = 'QUERY // SEARCH EVENT RECORDS BY TITLE...',
}: SearchBarProps) {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
        <Search className="w-4 h-4 text-zinc-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-20 py-2.5 bg-zinc-950/90 border border-zinc-800 text-zinc-100 placeholder-zinc-600 text-xs sm:text-sm hud-mono tracking-wide focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 rounded-lg transition-all"
      />
      <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center gap-1.5">
        {value && (
          <button
            onClick={() => onChange('')}
            className="text-zinc-500 hover:text-zinc-300 p-1 rounded transition-colors"
            title="Clear Query"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        <span className="hidden sm:inline text-[10px] text-zinc-500 border border-zinc-800 px-1.5 py-0.5 rounded bg-zinc-900 hud-mono font-medium">
          QUERY
        </span>
      </div>
    </div>
  );
}
