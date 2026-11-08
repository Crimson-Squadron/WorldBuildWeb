'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchFactions, createFaction } from '@/lib/api';
import { Faction } from '@/lib/types';
import { Shield, Plus, ArrowLeft } from 'lucide-react';

export default function FactionsPage() {
  const [factions, setFactions] = useState<Faction[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [bannerColor, setBannerColor] = useState('#ef4444');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadFactions();
  }, []);

  async function loadFactions() {
    try {
      const data = await fetchFactions();
      setFactions(data);
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
      await createFaction({
        name: name.trim(),
        bannerColor,
        description: description.trim() || undefined,
      });
      setName('');
      setDescription('');
      await loadFactions();
    } catch (err: any) {
      alert(`Error creating faction: ${err.message}`);
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
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400 hud-mono mb-1">
          <Shield className="w-3.5 h-3.5" />
          <span>ALLIANCE & ORGANIZATION REGISTRY</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Organizations & Sovereign Orders
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1 hud-mono">
          Strategic directory of sovereign empires, guilds, corporate conglomerates, and combat divisions recorded across world history.
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
              <Plus className="w-4 h-4 text-red-500" />
              <span>REGISTER NEW ORGANIZATION</span>
            </h2>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 hud-mono mb-1">
                FACTION DESIGNATION *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Iron Vanguard, Solar Dynasty"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-red-500 hud-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 hud-mono mb-1">
                TACTICAL COLOR CODING
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={bannerColor}
                  onChange={(e) => setBannerColor(e.target.value)}
                  className="w-9 h-9 rounded border border-zinc-700 cursor-pointer bg-zinc-900"
                />
                <span className="text-xs hud-mono text-zinc-300 font-semibold">{bannerColor}</span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 hud-mono mb-1">
                DOCTRINE / BACKGROUND
              </label>
              <textarea
                rows={3}
                placeholder="Operational creed, historical motivations, alliance network..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-red-500 font-sans leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold uppercase tracking-wider hud-mono transition-all disabled:opacity-50"
            >
              {saving ? 'COMMISSIONING...' : 'REGISTER FACTION'}
            </button>
          </form>
        </div>

        {/* Factions List */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <p className="text-xs text-zinc-500 hud-mono">// RETRIEVING FACTION MATRIX DATA...</p>
          ) : factions.length === 0 ? (
            <div className="p-8 text-center rounded-xl border border-dashed border-zinc-800 text-zinc-500 text-xs hud-mono">
              NO FACTIONS ENTERED IN DATABASE.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {factions.map((fac) => (
                <div
                  key={fac.id}
                  className="bg-zinc-950/80 border border-zinc-800 hover:border-zinc-700 rounded-xl p-5 space-y-2.5 transition-colors shadow-md"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full shadow-xs shrink-0"
                      style={{ backgroundColor: fac.bannerColor || '#ef4444' }}
                    />
                    <h3 className="text-sm font-bold text-white tracking-wide">{fac.name}</h3>
                  </div>
                  {fac.description && (
                    <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed font-sans">
                      {fac.description}
                    </p>
                  )}
                  <div className="text-[10px] text-zinc-600 hud-mono uppercase tracking-wider pt-1 border-t border-zinc-900">
                    CODE // {fac.id}
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
