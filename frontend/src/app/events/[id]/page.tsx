'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchEventById, deleteEvent } from '@/lib/api';
import { HistoricalEvent } from '@/lib/types';
import { formatEventDate } from '@/lib/dateUtils';
import MarkdownView from '@/components/ui/MarkdownView';
import EventTableOfContents from '@/components/events/EventTableOfContents';
import ImageLightboxModal from '@/components/ui/ImageLightboxModal';
import { ArrowLeft, Calendar, MapPin, Trash2, Edit, FileText, ShieldAlert, ZoomIn } from 'lucide-react';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [event, setEvent] = useState<HistoricalEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxData, setLightboxData] = useState<{
    src: string;
    alt: string;
    caption?: string;
    figureLabel?: string;
  } | null>(null);

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
          <div
            onClick={() =>
              setLightboxData({
                src: event.imageUrl!,
                alt: event.title,
                caption: event.synopsis || event.title,
                figureLabel: 'PRIMARY VISUAL INTEL',
              })
            }
            className="relative w-full h-64 sm:h-80 overflow-hidden bg-black border-b border-zinc-800 cursor-pointer group"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
            <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/80 border border-zinc-700 rounded text-[10px] hud-mono text-zinc-300">
              PRIMARY VISUAL INTEL
            </div>
            <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/80 border border-zinc-700 text-zinc-300 text-[10px] hud-mono flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="w-3 h-3 text-red-400" />
              <span>CLICK TO ENLARGE</span>
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
            {event.location ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs hud-mono">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span className="text-zinc-500">SECTOR //</span>
                <span className="font-medium text-zinc-200">{event.location.name}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900/60 border border-zinc-800 text-zinc-400 text-xs hud-mono">
                <MapPin className="w-3 h-3 text-zinc-600" />
                <span className="text-zinc-600">SECTOR //</span>
                <span className="font-mono text-zinc-400">[UNKNOWN]</span>
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {event.title}
          </h1>

          {/* Synopsis */}
          {event.synopsis && (
            <div id="overview-synopsis" className="scroll-mt-24 border border-zinc-800 bg-zinc-900/40 p-4 rounded-lg space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 hud-mono">
                PRIMARY BRIEFING // SYNOPSIS
              </div>
              <p className="text-sm sm:text-base text-zinc-200 leading-relaxed font-sans">
                {event.synopsis}
              </p>
            </div>
          )}

          {/* Factions or [UNKNOWN] */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-800/80">
            <span className="text-[11px] hud-mono uppercase tracking-wider text-zinc-500">FACTIONS INVOLVED //</span>
            {event.factions && event.factions.length > 0 ? (
              event.factions.map((f) => (
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
              ))
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono bg-zinc-900 border border-zinc-800/80 text-zinc-500">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                <span>[UNKNOWN]</span>
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Wikipedia-Style Table of Contents */}
      <EventTableOfContents
        hasSynopsis={Boolean(event.synopsis)}
        chapters={chapters}
      />

      {/* Chapters Reader with Wikipedia-Style Side Visuals and Markdown */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400 hud-mono px-1">
          <FileText className="w-3.5 h-3.5 text-red-500" />
          <span>DECLASSIFIED CHAPTER LOGS [{chapters.length}]</span>
        </div>

        {chapters.map((ch, idx) => (
          <section
            key={ch.id || idx}
            id={`chapter-${ch.orderIndex || idx + 1}`}
            className="scroll-mt-24 bg-zinc-950/90 border border-zinc-800 rounded-xl overflow-hidden shadow-lg p-6 sm:p-8 space-y-4"
          >
            {/* Chapter Header */}
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded bg-zinc-900 border border-zinc-700 text-red-400 text-xs font-bold hud-mono flex items-center justify-center shrink-0">
                {ch.orderIndex || idx + 1}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {ch.chapterTitle}
              </h2>
            </div>

            {/* Chapter Body with Wikipedia-Style Side Figure */}
            <div className="border-t border-zinc-800/80 pt-4 relative">
              {ch.imageUrl && (
                <figure className="w-full sm:w-80 sm:float-right sm:ml-6 sm:mb-4 mb-4 bg-zinc-900/95 border border-zinc-800 rounded-lg p-2.5 shadow-xl select-none clear-both">
                  {/* Thumbnail Image with Click-to-Enlarge Lightbox */}
                  <div
                    onClick={() =>
                      setLightboxData({
                        src: ch.imageUrl!,
                        alt: ch.chapterTitle,
                        caption: ch.imageCaption || ch.chapterTitle,
                        figureLabel: `FIG // ${idx + 1 < 10 ? `0${idx + 1}` : idx + 1}`,
                      })
                    }
                    className="rounded overflow-hidden border border-zinc-800 bg-black relative cursor-pointer group"
                    title="Click to Enlarge Visual"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={ch.imageUrl}
                      alt={ch.chapterTitle}
                      className="w-full h-auto object-cover max-h-60 group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/80 border border-zinc-700 rounded text-[9px] hud-mono text-zinc-300">
                      FIG // {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                    </div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-2 py-1 rounded bg-black/90 border border-zinc-600 text-white text-[10px] hud-mono flex items-center gap-1 shadow-lg">
                        <ZoomIn className="w-3 h-3 text-red-400" />
                        <span>ENLARGE</span>
                      </span>
                    </div>
                  </div>

                  {/* Dedicated Caption Below (Wikipedia style) */}
                  <figcaption className="mt-2 text-xs font-mono text-zinc-300 leading-snug">
                    <span className="text-red-400 font-bold mr-1.5">
                      [FIG. {idx + 1}]:
                    </span>
                    {ch.imageCaption || ch.chapterTitle}
                    <div className="text-[10px] text-zinc-500 font-mono mt-1 pt-1 border-t border-zinc-800/60 flex items-center justify-between">
                      <span>INTELLIGENCE LOG VISUAL</span>
                      <span>SEC // {idx + 1}.0</span>
                    </div>
                  </figcaption>
                </figure>
              )}

              {/* Markdown Content wrapping around the figure */}
              <div className="prose-container">
                <MarkdownView content={ch.content} />
              </div>

              {/* Clear float boundary */}
              <div className="clear-both" />
            </div>
          </section>
        ))}
      </div>
      {/* High-Resolution Tactical Image Lightbox Modal */}
      {lightboxData && (
        <ImageLightboxModal
          src={lightboxData.src}
          alt={lightboxData.alt}
          caption={lightboxData.caption}
          figureLabel={lightboxData.figureLabel}
          onClose={() => setLightboxData(null)}
        />
      )}
    </article>
  );
}
