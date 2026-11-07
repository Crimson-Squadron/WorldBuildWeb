'use client';

import { Faction, Location } from '@/lib/types';
import { SlidersHorizontal, RotateCcw, ArrowUpDown, Compass, Shield } from 'lucide-react';

interface EventFiltersProps {
  locations: Location[];
  factions: Faction[];
  selectedLocationId?: string;
  onLocationChange: (locId: string) => void;
  selectedFactionIds: string[];
  onToggleFaction: (factionId: string) => void;
  sortBy: 'eventDate' | 'title' | 'createdAt';
  onSortByChange: (sort: 'eventDate' | 'title' | 'createdAt') => void;
  sortDirection: 'asc' | 'desc';
  onSortDirectionChange: (dir: 'asc' | 'desc') => void;
  onReset: () => void;
}

export default function EventFilters({
  locations,
  factions,
  selectedLocationId,
  onLocationChange,
  selectedFactionIds,
  onToggleFaction,
  sortBy,
  onSortByChange,
  sortDirection,
  onSortDirectionChange,
  onReset,
}: EventFiltersProps) {
  const hasActiveFilters =
    Boolean(selectedLocationId) ||
    selectedFactionIds.length > 0 ||
    sortBy !== 'eventDate' ||
    sortDirection !== 'asc';

  return (
    <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-4 sm:p-5 space-y-4 shadow-xl">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2 text-zinc-200 font-bold text-xs uppercase tracking-wider hud-mono">
          <SlidersHorizontal className="w-3.5 h-3.5 text-red-500" />
          <span>FILTER & TELEMETRY</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-[11px] hud-mono text-red-400 hover:text-red-300 transition-colors uppercase tracking-wider"
          >
            <RotateCcw className="w-3 h-3" />
            <span>RESET</span>
          </button>
        )}
      </div>

      {/* Sorting Parameters */}
      <div>
        <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider hud-mono mb-1.5 flex items-center gap-1.5">
          <ArrowUpDown className="w-3 h-3 text-zinc-500" />
          <span>ORDER PARAMETER</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as any)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 hud-mono focus:outline-none focus:border-red-500"
          >
            <option value="eventDate">Date (Chronological)</option>
            <option value="title">Title (Alphabetical)</option>
            <option value="createdAt">Timestamp Created</option>
          </select>
          <select
            value={sortDirection}
            onChange={(e) => onSortDirectionChange(e.target.value as any)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 hud-mono focus:outline-none focus:border-red-500"
          >
            {sortBy === 'eventDate' ? (
              <>
                <option value="asc">Ascending [Oldest]</option>
                <option value="desc">Descending [Newest]</option>
              </>
            ) : sortBy === 'title' ? (
              <>
                <option value="asc">A → Z</option>
                <option value="desc">Z → A</option>
              </>
            ) : (
              <>
                <option value="desc">Most Recent</option>
                <option value="asc">Earliest</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* Sector (Location) Filter */}
      <div>
        <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider hud-mono mb-1.5 flex items-center gap-1.5">
          <Compass className="w-3 h-3 text-emerald-400" />
          <span>SECTOR / LOCATION</span>
        </label>
        <select
          value={selectedLocationId || ''}
          onChange={(e) => onLocationChange(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 hud-mono focus:outline-none focus:border-red-500"
        >
          <option value="">ALL DESIGNATED SECTORS</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.name}
            </option>
          ))}
        </select>
      </div>

      {/* Factions Filter */}
      <div>
        <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider hud-mono mb-2 flex items-center gap-1.5">
          <Shield className="w-3 h-3 text-red-400" />
          <span>AFFILIATED FACTIONS ({selectedFactionIds.length > 0 ? selectedFactionIds.length : 'ALL'})</span>
        </label>
        <div className="flex flex-wrap gap-1.5">
          {factions.map((fac) => {
            const isSelected = selectedFactionIds.includes(fac.id);
            return (
              <button
                key={fac.id}
                type="button"
                onClick={() => onToggleFaction(fac.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono transition-all border ${
                  isSelected
                    ? 'bg-zinc-800 border-zinc-500 text-zinc-100 font-semibold shadow-xs'
                    : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300'
                }`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: fac.bannerColor || '#ef4444' }}
                />
                <span>{fac.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
