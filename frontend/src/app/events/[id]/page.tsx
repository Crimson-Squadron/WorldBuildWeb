'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchEventById, deleteEvent } from '@/lib/api';
import { HistoricalEvent } from '@/lib/types';
import { formatEventDate } from '@/lib/dateUtils';
import MarkdownView from '@/components/ui/MarkdownView';
import { ArrowLeft, Calendar, MapPin, Trash2, Edit, FileText, ShieldAlert } from 'lucide-react';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [event, setEvent] = useState<HistoricalEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    async function load() {
      try {
        const data = await fetchEventById(id);
        setEvent(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load event details.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleDelete = async () => {
    if (!event) return;
    if (confirm(`Confirm purge of record: "${event.title}"?`)) {
      try {
        await deleteEvent(event.id);
        router.push('/');
      } catch (err: any) {
        alert(`Failed to delete event: ${err.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse py-8">
        <div className="h-5 w-36 bg-zinc-800 rounded"></div>
        <div className="h-10 w-2/3 bg-zinc-800 rounded"></div>
        <div className="h-64 bg-zinc-950 border border-zinc-800 rounded-xl"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 space-y-4 hud-mono">
        <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-base font-bold text-red-400 uppercase tracking-wider">RECORD NOT LOCATED</h2>
        <p className="text-xs text-zinc-400">{error || 'Requested dossier does not exist in system memory.'}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-200 hover:bg-zinc-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO CHRONICLE</span>
        </Link>
      </div>
    );
  }

  const chapters = event.chapters || [];
  const formattedDate = formatEventDate(event.eventDate);

  return (
    <article className="max-w-4xl mx-auto space-y-8">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex items-center justify-between text-xs hud-mono">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-bold text-zinc-400 hover:text-zinc-100 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO CHRONICLE FEED</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href={`/events/${event.id}/edit`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 font-bold transition-colors uppercase tracking-wider"
          >
            <Edit className="w-3 h-3 text-zinc-400" />
            <span>MODIFY RECORD</span>
          </Link>
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-900/60 bg-red-950/20 text-red-400 hover:bg-red-950/50 font-bold transition-colors uppercase tracking-wider"
          >
            <Trash2 className="w-3 h-3" />
            <span>PURGE</span>
          </button>
        </div>
      </div>

      {/* Dossier Header & Visual Intel */}
      <header className="bg-zinc-950/90 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
        {event.imageUrl && (
          <div className="relative w-full h-64 sm:h-80 overflow-hidden bg-black border-b border-zinc-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
            <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/80 border border-zinc-700 rounded text-[10px] hud-mono text-zinc-300">
              PRIMARY VISUAL INTEL
            </div>
          </div>
        )}

        <div className="p-6 sm:p-8 space-y-4">
          {/* Telemetry row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700 text-zinc-100 text-xs font-semibold hud-mono">
              <Calendar className="w-3.5 h-3.5 text-red-400" />
              <span>{formattedDate}</span>
            </span>
            {event.location && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs hud-mono">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span className="text-zinc-500">SECTOR //</span>
                <span className="font-medium text-zinc-200">{event.location.name}</span>
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {event.title}
          </h1>

          {/* Synopsis */}
          {event.synopsis && (
            <div className="border border-zinc-800 bg-zinc-900/40 p-4 rounded-lg space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 hud-mono">
                PRIMARY BRIEFING // SYNOPSIS
              </div>
              <p className="text-sm sm:text-base text-zinc-200 leading-relaxed font-sans">
                {event.synopsis}
              </p>
            </div>
          )}

          {event.factions && event.factions.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-800/80">
              <span className="text-[11px] hud-mono uppercase tracking-wider text-zinc-500">FACTIONS INVOLVED //</span>
              {event.factions.map((f) => (
                <span
                  key={f.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono bg-zinc-900 border border-zinc-800 text-zinc-300"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: f.bannerColor || '#ef4444' }}
                  />
                  <span>{f.name}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Chapters Quick Nav Table of Contents */}
      {chapters.length > 1 && (
        <nav className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2">
          <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider hud-mono flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-red-400" />
            <span>NARRATIVE LOG INDEX</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {chapters.map((ch, idx) => (
              <a
                key={ch.id || idx}
                href={`#chapter-${ch.orderIndex || idx + 1}`}
                className="flex items-center gap-2 text-xs hud-mono text-zinc-300 hover:text-white transition-colors py-1.5 px-2.5 rounded bg-zinc-900/60 border border-zinc-800/60 hover:border-zinc-700"
              >
                <span className="w-5 h-5 rounded bg-zinc-800 text-zinc-300 flex items-center justify-center font-bold text-[10px]">
                  {ch.orderIndex || idx + 1}
                </span>
                <span className="truncate">{ch.chapterTitle}</span>
              </a>
            ))}
          </div>
        </nav>
      )}

      {/* Chapters Reader with Context Visuals and Markdown */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400 hud-mono px-1">
          <FileText className="w-3.5 h-3.5 text-red-500" />
          <span>DECLASSIFIED CHAPTER LOGS [{chapters.length}]</span>
        </div>

        {chapters.map((ch, idx) => (
          <section
            key={ch.id || idx}
            id={`chapter-${ch.orderIndex || idx + 1}`}
            className="scroll-mt-24 bg-zinc-950/90 border border-zinc-800 rounded-xl overflow-hidden shadow-lg"
          >
            {/* Chapter Context Image */}
            {ch.imageUrl && (
              <div className="relative w-full max-h-72 overflow-hidden bg-black border-b border-zinc-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ch.imageUrl}
                  alt={ch.chapterTitle}
                  className="w-full h-auto max-h-72 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                <div className="absolute top-2.5 left-3 px-2 py-0.5 bg-black/80 border border-zinc-700 rounded text-[10px] hud-mono text-zinc-300">
                  CONTEXT LOG VISUAL // CH-{idx + 1}
                </div>
              </div>
            )}

            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded bg-zinc-900 border border-zinc-700 text-red-400 text-xs font-bold hud-mono flex items-center justify-center shrink-0">
                  {ch.orderIndex || idx + 1}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {ch.chapterTitle}
                </h2>
              </div>
              <div className="border-t border-zinc-800/80 pt-4">
                <MarkdownView content={ch.content} />
              </div>
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
