'use client';

import React, { useState } from 'react';
import { Chapter } from '@/lib/types';
import { ListOrdered, ChevronDown, ChevronUp, Image as ImageIcon, Compass } from 'lucide-react';

interface EventTableOfContentsProps {
  hasSynopsis: boolean;
  chapters: Chapter[];
}

export default function EventTableOfContents({ hasSynopsis, chapters }: EventTableOfContentsProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (chapters.length === 0 && !hasSynopsis) return null;

  const scrollToAnchor = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Update hash in URL
      window.history.pushState(null, '', `#${id}`);
    }
  };

  const figuresCount = chapters.filter((c) => Boolean(c.imageUrl)).length;

  return (
    <div className="bg-tactical-surface/90 border border-tactical-border rounded-lg p-4 max-w-lg shadow-xl font-mono">
      {/* TOC Header */}
      <div className="flex items-center justify-between border-b border-tactical-border/70 pb-2 mb-3">
        <div className="flex items-center space-x-2 text-xs font-bold text-white tracking-wider">
          <ListOrdered className="w-3.5 h-3.5 text-tactical-red" />
          <span>TABLE OF CONTENTS // CHRONICLE LOGS</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[10px] text-zinc-500 uppercase">
            {chapters.length} SECTIONS
          </span>
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-[11px] text-tactical-red hover:text-red-400 font-semibold tracking-wide transition-colors flex items-center space-x-0.5"
            aria-label={isCollapsed ? 'Show Table of Contents' : 'Hide Table of Contents'}
          >
            <span>[{isCollapsed ? 'show' : 'hide'}]</span>
            {isCollapsed ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* TOC Items */}
      {!isCollapsed && (
        <nav aria-label="Table of contents" className="space-y-1.5 text-xs text-zinc-300">
          {hasSynopsis && (
            <div>
              <a
                href="#overview-synopsis"
                onClick={(e) => scrollToAnchor(e, 'overview-synopsis')}
                className="group flex items-center space-x-2 py-1 px-1.5 rounded hover:bg-tactical-dark hover:text-white transition-colors"
              >
                <span className="text-zinc-500 group-hover:text-tactical-red font-bold text-[11px] w-6 shrink-0">
                  0.0
                </span>
                <span className="truncate group-hover:underline">Overview & Strategic Briefing</span>
              </a>
            </div>
          )}

          {chapters.map((ch, idx) => {
            const sectionNumber = `${idx + 1}.0`;
            const anchorId = `chapter-${ch.orderIndex || idx + 1}`;
            const hasVisual = Boolean(ch.imageUrl);

            return (
              <div key={ch.id || idx}>
                <a
                  href={`#${anchorId}`}
                  onClick={(e) => scrollToAnchor(e, anchorId)}
                  className="group flex items-center justify-between py-1 px-1.5 rounded hover:bg-tactical-dark hover:text-white transition-colors"
                >
                  <div className="flex items-center space-x-2 truncate pr-2">
                    <span className="text-zinc-500 group-hover:text-tactical-red font-bold text-[11px] w-6 shrink-0">
                      {sectionNumber}
                    </span>
                    <span className="truncate group-hover:underline">{ch.chapterTitle}</span>
                  </div>

                  {hasVisual && (
                    <span className="shrink-0 text-[10px] text-zinc-500 group-hover:text-emerald-400 flex items-center space-x-1 border border-zinc-800 px-1 py-0.2 rounded bg-zinc-950">
                      <ImageIcon className="w-2.5 h-2.5" />
                      <span>FIG</span>
                    </span>
                  )}
                </a>
              </div>
            );
          })}

          {/* Quick Footer Stats */}
          {figuresCount > 0 && (
            <div className="pt-2 mt-2 border-t border-tactical-border/50 text-[10px] text-zinc-500 flex items-center justify-between">
              <span className="flex items-center space-x-1">
                <Compass className="w-3 h-3 text-tactical-red" />
                <span>INTELLIGENCE ARCHIVE SPEC</span>
              </span>
              <span>{figuresCount} {figuresCount === 1 ? 'FIGURE EMBEDDED' : 'FIGURES EMBEDDED'}</span>
            </div>
          )}
        </nav>
      )}
    </div>
  );
}
