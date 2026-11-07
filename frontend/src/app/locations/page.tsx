'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchLocations, createLocation } from '@/lib/api';
import { Location } from '@/lib/types';
import { MapPin, Plus, Compass, ArrowLeft } from 'lucide-react';

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  // New location form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [mapX, setMapX] = useState<string>('');
  const [mapY, setMapY] = useState<string>('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadLocations();
  }, []);

  async function loadLocations() {
    try {
      const data = await fetchLocations();
      setLocations(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await createLocation({
        name: name.trim(),
        description: description.trim() || undefined,
        mapX: mapX ? parseFloat(mapX) : undefined,
        mapY: mapY ? parseFloat(mapY) : undefined,
      });
      setName('');
      setDescription('');
      setMapX('');
      setMapY('');
      await loadLocations();
    } catch (err: any) {
      alert(`Error creating location: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold hud-mono text-zinc-400 hover:text-zinc-100 transition-colors uppercase tracking-wider mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO CHRONICLE FEED</span>
        </Link>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 hud-mono mb-1">
          <Compass className="w-3.5 h-3.5" />
          <span>GEOSPATIAL DIRECTORY // SECTOR TELEMETRY</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Sector & Landmark Registry
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1 hud-mono">
          Geographical designated sectors, fortresses, and operational coordinates for future tactical map plotting.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Form */}
        <div className="lg:col-span-1">
          <form
            onSubmit={handleCreate}
            className="bg-zinc-950/90 border border-zinc-800 rounded-xl p-5 space-y-4 sticky top-24 shadow-xl"
          >
            <h2 className="text-xs font-bold uppercase tracking-wider hud-mono text-zinc-200 flex items-center gap-2 border-b border-zinc-800 pb-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>REGISTER NEW SECTOR</span>
            </h2>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 hud-mono mb-1">
                SECTOR NAME *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Citadel of Dusk, Sector 09"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 hud-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 hud-mono mb-1">
                GEOGRAPHICAL INTEL / LORE
              </label>
              <textarea
                rows={3}
                placeholder="Tactical terrain data, historical overview..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 font-sans leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 hud-mono mb-1">
                  COORD X
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 45.2"
                  value={mapX}
                  onChange={(e) => setMapX(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-100 hud-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 hud-mono mb-1">
                  COORD Y
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 78.5"
                  value={mapY}
                  onChange={(e) => setMapY(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-100 hud-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold uppercase tracking-wider hud-mono transition-all disabled:opacity-50"
            >
              {saving ? 'REGISTERING...' : 'REGISTER SECTOR'}
            </button>
          </form>
        </div>

        {/* Locations List */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <p className="text-xs text-zinc-500 hud-mono">// RETRIEVING SECTOR TELEMETRY...</p>
          ) : locations.length === 0 ? (
            <div className="p-8 text-center rounded-xl border border-dashed border-zinc-800 text-zinc-500 text-xs hud-mono">
              NO SECTORS CATALOGED IN SYSTEM. USE FORM TO ESTABLISH FIRST NODE.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {locations.map((loc) => (
                <div
                  key={loc.id}
                  className="bg-zinc-950/80 border border-zinc-800 hover:border-zinc-700 rounded-xl p-5 space-y-2.5 transition-colors shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                      <h3 className="text-sm font-bold text-white tracking-wide">{loc.name}</h3>
                    </div>
                    {(loc.mapX !== undefined && loc.mapX !== null) && (
                      <span className="text-[10px] text-zinc-400 hud-mono px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                        [{loc.mapX}, {loc.mapY}]
                      </span>
                    )}
                  </div>
                  {loc.description && (
                    <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed font-sans">
                      {loc.description}
                    </p>
                  )}
                  <div className="text-[10px] text-zinc-600 hud-mono uppercase tracking-wider pt-1 border-t border-zinc-900">
                    ID // {loc.id}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
