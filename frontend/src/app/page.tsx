'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchEvents, fetchFactions, fetchLocations, deleteEvent, EventSearchParams } from '@/lib/api';
import { Faction, HistoricalEvent, Location } from '@/lib/types';
import SearchBar from '@/components/events/SearchBar';
import EventFilters from '@/components/events/EventFilters';
import EventCard from '@/components/events/EventCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Terminal, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function ChroniclePage() {
  const [events, setEvents] = useState<HistoricalEvent[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [factions, setFactions] = useState<Faction[]>([]);

  // Filter & Search states
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState<string>('');
  const [selectedFactionIds, setSelectedFactionIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'eventDate' | 'title' | 'createdAt'>('eventDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 280);
    return () => clearTimeout(timer);
  }, [search]);

  // Initial fetch of static filter options (locations & factions)
  useEffect(() => {
    async function loadMeta() {
      try {
        const [locs, facs] = await Promise.all([fetchLocations(), fetchFactions()]);
        setLocations(locs);
        setFactions(facs);
      } catch (err: any) {
        console.error('Failed to load filter metadata:', err);
      }
    }
    loadMeta();
  }, []);

  // Fetch events whenever search/filter criteria change
  useEffect(() => {
    let isCurrent = true;
    async function loadEvents() {
      setLoading(true);
      setError(null);
      try {
        const params: EventSearchParams = {
          search: debouncedSearch || undefined,
          locationId: selectedLocationId || undefined,
          factionIds: selectedFactionIds.length > 0 ? selectedFactionIds : undefined,
          sortBy,
          sortDirection,
        };
        const data = await fetchEvents(params);
        if (isCurrent) {
          setEvents(data);
        }
      } catch (err: any) {
        if (isCurrent) {
          setError(err.message || 'Could not load historical events from backend.');
        }
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    }
    loadEvents();
    return () => {
      isCurrent = false;
    };
  }, [debouncedSearch, selectedLocationId, selectedFactionIds, sortBy, sortDirection]);

  const handleToggleFaction = (factionId: string) => {
    setSelectedFactionIds((prev) =>
      prev.includes(factionId) ? prev.filter((id) => id !== factionId) : [...prev, factionId]
    );
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedLocationId('');
    setSelectedFactionIds([]);
    setSortBy('eventDate');
    setSortDirection('asc');
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err: any) {
      alert(`Error purging record: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Command Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-500 hud-mono mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>CENTRAL DATABASE // TACTICAL ARCHIVE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Historical Event Chronicle
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 hud-mono">
            Vast historical registry of recorded epochal conflicts, treaties, and turning points.
          </p>
        </div>

        <Link
          href="/events/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs tracking-wider hud-mono transition-all shadow-md hover:shadow-white/10 uppercase"
        >
          <Plus className="w-4 h-4 text-zinc-900" />
          <span>RECORD NEW EVENT</span>
        </Link>
      </div>

      {/* Main Command Center Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Telemetry Column: Search & Filters */}
        <aside className="lg:col-span-1 space-y-4">
          <SearchBar value={search} onChange={setSearch} />
          <EventFilters
            locations={locations}
            factions={factions}
            selectedLocationId={selectedLocationId}
            onLocationChange={setSelectedLocationId}
            selectedFactionIds={selectedFactionIds}
            onToggleFaction={handleToggleFaction}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            sortDirection={sortDirection}
            onSortDirectionChange={setSortDirection}
            onReset={handleResetFilters}
          />
        </aside>

        {/* Right Column: Events Feed */}
        <div className="lg:col-span-3 space-y-4">
          {error && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-200 text-xs sm:text-sm flex items-start gap-3 hud-mono">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">SYSTEM ERROR // DATABASE DISCONNECTED</p>
                <p className="text-xs text-red-300 mt-0.5">{error}</p>
                <p className="text-xs text-zinc-400 mt-2">
                  Verify Spring Boot backend is active on port 8080.
                </p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="animate-pulse bg-zinc-950/80 border border-zinc-800 rounded-xl p-6 h-48"
                />
              ))}
            </div>
          ) : events.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 px-4 rounded-xl border border-dashed border-zinc-800 bg-zinc-950/40 hud-mono"
            >
              <Terminal className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">NO MATCHING DOSSIERS FOUND</h3>
              <p className="text-xs text-zinc-500 max-w-md mx-auto mt-1 mb-6">
                Query returned zero events for the active filter parameters.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 transition-colors uppercase tracking-wider"
                >
                  RESET PARAMETERS
                </button>
                <Link
                  href="/events/new"
                  className="px-4 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold transition-colors uppercase tracking-wider"
                >
                  FILE NEW EVENT
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {/* Telemetry Count & Ordering Header */}
              <div className="flex items-center justify-between text-xs hud-mono text-zinc-400 px-1 border-b border-zinc-800/60 pb-2">
                <span>
                  QUERY RESULTS: <strong className="text-zinc-100 font-bold">{events.length}</strong> RECORDS LOCATED
                </span>
                <span>
                  SORTED BY:{' '}
                  <strong className="text-red-400 uppercase font-semibold">
                    {sortBy === 'eventDate' ? 'Date' : sortBy} [{sortDirection.toUpperCase()}]
                  </strong>
                </span>
              </div>

              {/* Animated Event List */}
              <motion.div layout className="space-y-5">
                <AnimatePresence mode="popLayout">
                  {events.map((event) => (
                    <motion.div
                      key={event.id}
                      layout
                      initial={{ opacity: 0, y: 14, scale: 0.99 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.18 } }}
                      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                    >
                      <EventCard event={event} onDelete={handleDelete} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
