'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createEvent, fetchFactions, fetchLocations, createLocation, createFaction } from '@/lib/api';
import { Chapter, Faction, Location } from '@/lib/types';
import ChapterEditor from '@/components/events/ChapterEditor';
import ImagePicker from '@/components/ui/ImagePicker';
import TacticalDatePicker from '@/components/ui/TacticalDatePicker';
import { ArrowLeft, Calendar, MapPin, Shield, Plus, Check, Terminal } from 'lucide-react';

export default function RecordEventPage() {
  const router = useRouter();

  // Meta
  const [locations, setLocations] = useState<Location[]>([]);
  const [factions, setFactions] = useState<Faction[]>([]);

  // Form Fields
  const [title, setTitle] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [locationId, setLocationId] = useState('');
  const [selectedFactionIds, setSelectedFactionIds] = useState<string[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([
    {
      orderIndex: 1,
      chapterTitle: 'Prelude & Historical Context',
      imageUrl: '',
      content: '',
    },
  ]);

  // Quick modals
  const [showNewLocModal, setShowNewLocModal] = useState(false);
  const [newLocName, setNewLocName] = useState('');
  const [newLocDesc, setNewLocDesc] = useState('');

  const [showNewFacModal, setShowNewFacModal] = useState(false);
  const [newFacName, setNewFacName] = useState('');
  const [newFacColor, setNewFacColor] = useState('#ef4444');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMeta() {
      try {
        const [locs, facs] = await Promise.all([fetchLocations(), fetchFactions()]);
        setLocations(locs);
        setFactions(facs);
      } catch (err: any) {
        console.error('Error fetching locations or factions:', err);
      }
    }
    loadMeta();
  }, []);

  const handleToggleFaction = (id: string) => {
    setSelectedFactionIds((prev) =>
      prev.includes(id) ? prev.filter((fId) => fId !== id) : [...prev, id]
    );
  };

  const handleQuickAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocName.trim()) return;
    try {
      const created = await createLocation({
        name: newLocName.trim(),
        description: newLocDesc.trim() || undefined,
      });
      setLocations((prev) => [...prev, created]);
      setLocationId(created.id);
      setNewLocName('');
      setNewLocDesc('');
      setShowNewLocModal(false);
    } catch (err: any) {
      alert(`Error creating location: ${err.message}`);
    }
  };

  const handleQuickAddFaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFacName.trim()) return;
    try {
      const created = await createFaction({
        name: newFacName.trim(),
        bannerColor: newFacColor,
      });
      setFactions((prev) => [...prev, created]);
      setSelectedFactionIds((prev) => [...prev, created.id]);
      setNewFacName('');
      setShowNewFacModal(false);
    } catch (err: any) {
      alert(`Error creating faction: ${err.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Event title is required.');
      return;
    }
    if (!eventDate) {
      setError('A valid Gregorian date is required.');
      return;
    }
    if (chapters.length === 0 || chapters.some((ch) => !ch.chapterTitle.trim() || !ch.content.trim())) {
      setError('Please provide a title and content for each chapter segment.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await createEvent({
        title: title.trim(),
        synopsis: synopsis.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
        eventDate,
        locationId: locationId || undefined,
        factionIds: selectedFactionIds,
        chapters: chapters.map((ch, idx) => ({
          orderIndex: idx + 1,
          chapterTitle: ch.chapterTitle.trim(),
          imageUrl: ch.imageUrl?.trim() || undefined,
          imageCaption: ch.imageCaption?.trim() || undefined,
          content: ch.content.trim(),
        })),
      });

      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Failed to file historical record.');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold hud-mono text-zinc-400 hover:text-zinc-100 transition-colors uppercase tracking-wider mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO CHRONICLE FEED</span>
        </Link>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-500 hud-mono mb-1">
          <Terminal className="w-3.5 h-3.5" />
          <span>DATA ENTRY TERMINAL // FORM SPEC</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          File Historical Event Dossier
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1 hud-mono">
          Enter comprehensive event record, telemetry, synopsis, and chapter logs into the central database.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-200 text-xs sm:text-sm hud-mono font-medium">
          ERROR // {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-zinc-950/90 border border-zinc-800 rounded-xl p-6 space-y-5 shadow-xl">
          {/* Title Input */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 hud-mono mb-2">
              EVENT DESIGNATION / TITLE *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. The Fall of the Sunken Citadel, Battle of Solaris"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-red-500 hud-mono font-semibold"
            />
          </div>

          {/* Synopsis */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 hud-mono mb-1.5">
              EXECUTIVE BRIEFING / SYNOPSIS
            </label>
            <p className="text-[11px] text-zinc-500 hud-mono mb-2">
              Brief summary displayed on the primary chronicle feed card.
            </p>
            <textarea
              rows={3}
              placeholder="e.g. A catastrophic breach of ancient obsidian bastions beneath the Sunken Citadel..."
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-xs sm:text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-red-500 font-sans leading-relaxed"
            />
          </div>

          {/* Banner / Thumbnail Image */}
          <div className="pt-1 border-t border-zinc-800/80">
            <ImagePicker
              label="PRIMARY VISUAL INTEL / BANNER"
              value={imageUrl}
              onChange={setImageUrl}
              helperText="Upload image file, select from BlueStacks presets, or specify remote image URL."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1 border-t border-zinc-800/80">
            {/* Gregorian Date */}
            <div>
              <TacticalDatePicker
                value={eventDate}
                onChange={setEventDate}
                required
                label="CHRONOLOGICAL DATE (GREGORIAN)"
              />
            </div>

            {/* Location Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-300 hud-mono flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>SECTOR DESIGNATION</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowNewLocModal(true)}
                  className="text-xs hud-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 uppercase tracking-wider font-semibold"
                >
                  <Plus className="w-3 h-3" />
                  <span>NEW SECTOR</span>
                </button>
              </div>
              <select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 text-xs sm:text-sm hud-mono focus:outline-none focus:border-red-500"
              >
                <option value="">[UNKNOWN] (DEFAULT - UNASSIGNED SECTOR)</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Affiliated Factions */}
          <div className="pt-1 border-t border-zinc-800/80">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-300 hud-mono flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-red-400" />
                <span>AFFILIATED FACTIONS INVOLVED</span>
              </label>
              <button
                type="button"
                onClick={() => setShowNewFacModal(true)}
                className="text-xs hud-mono text-red-400 hover:text-red-300 flex items-center gap-1 uppercase tracking-wider font-semibold"
              >
                <Plus className="w-3 h-3" />
                <span>NEW FACTION</span>
              </button>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono mb-2">
              Select participating factions or leave unselected to default to [UNKNOWN].
            </p>

            <div className="flex flex-wrap gap-2">
              {factions.length === 0 ? (
                <p className="text-xs text-zinc-500 italic hud-mono">// NO FACTIONS RECORDED IN SYSTEM</p>
              ) : (
                factions.map((fac) => {
                  const isChecked = selectedFactionIds.includes(fac.id);
                  return (
                    <button
                      type="button"
                      key={fac.id}
                      onClick={() => handleToggleFaction(fac.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono transition-all border ${
                        isChecked
                          ? 'bg-zinc-800 border-zinc-500 text-white shadow-xs font-semibold'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: fac.bannerColor || '#ef4444' }}
                      />
                      <span>{fac.name}</span>
                      {isChecked && <Check className="w-3 h-3 text-red-400 ml-1" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Chapters Section */}
        <div className="bg-zinc-950/90 border border-zinc-800 rounded-xl p-6 shadow-xl">
          <ChapterEditor chapters={chapters} onChange={setChapters} />
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 text-xs hud-mono">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 font-bold uppercase tracking-wider transition-colors"
          >
            ABORT
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-lg bg-zinc-100 hover:bg-white disabled:opacity-50 text-zinc-950 font-bold uppercase tracking-wider transition-all shadow-md shadow-white/10 hover:scale-[1.01]"
          >
            {submitting ? 'COMMITTING TO ARCHIVE...' : 'COMMIT RECORD TO ARCHIVE'}
          </button>
        </div>
      </form>

      {/* Quick Add Location Modal */}
      {showNewLocModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider hud-mono">REGISTER SECTOR</h3>
            <form onSubmit={handleQuickAddLocation} className="space-y-4">
              <div>
                <label className="block text-[11px] text-zinc-400 hud-mono mb-1 uppercase">SECTOR NAME *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solaris Plateau"
                  value={newLocName}
                  onChange={(e) => setNewLocName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 hud-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] text-zinc-400 hud-mono mb-1 uppercase">DESCRIPTION</label>
                <textarea
                  rows={3}
                  placeholder="Terrain and strategic data..."
                  value={newLocDesc}
                  onChange={(e) => setNewLocDesc(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans leading-relaxed"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 text-xs hud-mono">
                <button
                  type="button"
                  onClick={() => setShowNewLocModal(false)}
                  className="px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white uppercase"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-bold uppercase"
                >
                  SAVE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Add Faction Modal */}
      {showNewFacModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider hud-mono">COMMISSION FACTION</h3>
            <form onSubmit={handleQuickAddFaction} className="space-y-4">
              <div>
                <label className="block text-[11px] text-zinc-400 hud-mono mb-1 uppercase">FACTION NAME *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Iron Syndicate"
                  value={newFacName}
                  onChange={(e) => setNewFacName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-red-500 hud-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] text-zinc-400 hud-mono mb-1 uppercase">TACTICAL COLOR</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={newFacColor}
                    onChange={(e) => setNewFacColor(e.target.value)}
                    className="w-9 h-9 rounded border border-zinc-700 cursor-pointer bg-zinc-900"
                  />
                  <span className="text-xs font-mono text-zinc-300 font-bold">{newFacColor}</span>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 text-xs hud-mono">
                <button
                  type="button"
                  onClick={() => setShowNewFacModal(false)}
                  className="px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white uppercase"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-bold uppercase"
                >
                  COMMISSION
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
