'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HistoricalEvent } from '@/lib/types';
import { formatEventDate } from '@/lib/dateUtils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  MapPin,
  ChevronDown,
  ChevronUp,
  FileText,
  Trash2,
  Edit,
  ArrowRight,
} from 'lucide-react';

interface EventCardProps {
  event: HistoricalEvent;
  onDelete?: (id: string) => void;
}

export default function EventCard({ event, onDelete }: EventCardProps) {
  const [showChaptersDropdown, setShowChaptersDropdown] = useState(false);

  const chapters = event.chapters || [];
  const formattedDate = formatEventDate(event.eventDate);

  return (
    <article className="group bg-zinc-950/90 border border-zinc-800 hover:border-zinc-700 rounded-xl overflow-hidden transition-all shadow-xl hover:shadow-red-500/5">
      {/* Top Banner / Image (if present) */}
      {event.imageUrl && (
        <div className="relative w-full h-44 sm:h-52 overflow-hidden bg-black border-b border-zinc-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 ease-out opacity-90 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
          <div className="absolute top-2.5 left-3 px-2 py-0.5 bg-black/80 border border-zinc-700/80 rounded text-[10px] hud-mono text-zinc-300">
            VISUAL INTEL // LOG
          </div>
        </div>
      )}

      <div className="p-5 sm:p-6 space-y-4">
        {/* Telemetry Header: Date, Sector, Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Formatted Date: dd MMMM yyyy */}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700 text-zinc-100 text-xs font-semibold hud-mono">
              <Calendar className="w-3.5 h-3.5 text-red-400" />
              <span>{formattedDate}</span>
            </span>

            {/* Location / Sector */}
            {event.location && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs hud-mono">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span className="text-zinc-500">SECTOR //</span>
                <span className="font-medium text-zinc-200">{event.location.name}</span>
              </span>
            )}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1">
            <Link
              href={`/events/${event.id}/edit`}
              className="text-zinc-400 hover:text-zinc-100 p-1.5 rounded hover:bg-zinc-800 border border-transparent hover:border-zinc-700 transition-colors"
              title="Modify Event"
            >
              <Edit className="w-3.5 h-3.5" />
            </Link>

            {onDelete && (
              <button
                onClick={() => {
                  if (confirm(`Confirm purge of record: "${event.title}"?`)) {
                    onDelete(event.id);
                  }
                }}
                className="text-zinc-500 hover:text-red-400 p-1.5 rounded hover:bg-red-950/40 border border-transparent hover:border-red-900/50 transition-colors"
                title="Purge Record"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Event Title */}
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight hover:text-red-400 transition-colors">
          <Link href={`/events/${event.id}`}>{event.title}</Link>
        </h2>

        {/* Affiliated Factions */}
        {event.factions && event.factions.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] hud-mono uppercase tracking-wider text-zinc-500">FACTIONS //</span>
            {event.factions.map((faction) => (
              <span
                key={faction.id}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono bg-zinc-900 border border-zinc-800 text-zinc-300"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: faction.bannerColor || '#ef4444' }}
                />
                <span>{faction.name}</span>
              </span>
            ))}
          </div>
        )}

        {/* Synopsis Briefing Box */}
        {event.synopsis ? (
          <div className="border border-zinc-800/90 bg-zinc-900/40 rounded-lg p-3.5 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 hud-mono">
              EVENT BRIEF // SYNOPSIS
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
              {event.synopsis}
            </p>
          </div>
        ) : (
          <p className="text-xs text-zinc-500 italic font-mono">// NO SYNOPSIS RECORDED</p>
        )}

        {/* Chapters Dropdown: Minimalist Utilitarian Index */}
        <div className="border-t border-zinc-800/80 pt-3">
          <button
            type="button"
            onClick={() => setShowChaptersDropdown(!showChaptersDropdown)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-900/90 hover:bg-zinc-850 border border-zinc-800 text-xs font-semibold hud-mono text-zinc-200 transition-colors"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-red-400" />
              <span>
                LOG ENTRIES // CHAPTERS [{chapters.length}]
              </span>
            </div>
            {showChaptersDropdown ? (
              <ChevronUp className="w-4 h-4 text-zinc-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-zinc-400" />
            )}
          </button>

          <AnimatePresence>
            {showChaptersDropdown && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.18 }}
                className="mt-2 space-y-1.5 overflow-hidden"
              >
                {chapters.length === 0 ? (
                  <p className="text-xs text-zinc-500 italic p-2 font-mono">// NO CHAPTER LOGS FILED</p>
                ) : (
                  chapters.map((ch, idx) => (
                    <Link
                      key={ch.id || idx}
                      href={`/events/${event.id}#chapter-${idx + 1}`}
                      className="group/ch flex items-center justify-between p-2 rounded-md bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {ch.imageUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={ch.imageUrl}
                            alt={ch.chapterTitle}
                            className="w-7 h-7 rounded object-cover border border-zinc-700 shrink-0"
                          />
                        ) : (
                          <span className="w-5 h-5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 text-[10px] font-bold hud-mono flex items-center justify-center shrink-0">
                            {ch.orderIndex || idx + 1}
                          </span>
                        )}
                        <span className="text-xs font-medium text-zinc-300 group-hover/ch:text-white truncate">
                          {ch.chapterTitle}
                        </span>
                      </div>
                      <span className="text-[10px] hud-mono uppercase tracking-wider text-zinc-500 group-hover/ch:text-red-400 flex items-center gap-1 shrink-0">
                        <span>OPEN</span>
                        <ArrowRight className="w-3 h-3 group-hover/ch:translate-x-0.5 transition-transform" />
                      </span>
                    </Link>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Card Footer Actions */}
        <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-xs hud-mono">
          <Link
            href={`/events/${event.id}/edit`}
            className="text-zinc-400 hover:text-zinc-200 flex items-center gap-1.5 transition-colors uppercase tracking-wider"
          >
            <Edit className="w-3 h-3" />
            <span>MODIFY RECORD</span>
          </Link>

          <Link
            href={`/events/${event.id}`}
            className="font-bold text-red-400 hover:text-red-300 flex items-center gap-1.5 transition-colors uppercase tracking-wider group"
          >
            <span>ACCESS COMPLETE DOSSIER</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
