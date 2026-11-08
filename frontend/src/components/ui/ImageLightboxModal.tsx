'use client';

import React, { useEffect } from 'react';
import { X, ZoomIn, Shield, Crosshair } from 'lucide-react';

interface ImageLightboxModalProps {
  src: string;
  alt: string;
  caption?: string;
  figureLabel?: string;
  onClose: () => void;
}

export default function ImageLightboxModal({
  src,
  alt,
  caption,
  figureLabel,
  onClose,
}: ImageLightboxModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    // Prevent background scrolling while open
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150 select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-5xl w-full max-h-[92vh] bg-[#090b10] border border-zinc-750 rounded-xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95)] flex flex-col font-mono"
      >
        {/* Header Telemetry Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#0e121b] border-b border-zinc-800">
          <div className="flex items-center space-x-2 text-xs text-white">
            <Crosshair className="w-4 h-4 text-red-500 animate-pulse" />
            <span className="font-bold tracking-wider text-red-400">
              {figureLabel || 'ENLARGED ARCHIVAL VISUAL INTEL'}
            </span>
            <span className="text-[10px] text-zinc-500 border-l border-zinc-700 pl-2">
              MAX-RESOLUTION VIEW
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[10px] text-zinc-500 hidden sm:inline">[PRESS ESC TO EXIT]</span>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#161c28] hover:bg-red-950/60 border border-zinc-700 hover:border-red-500 text-zinc-300 hover:text-red-400 transition-colors"
              title="Close Image View (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center High-Res Image Viewport */}
        <div className="relative flex-1 bg-black/90 p-2 sm:p-4 flex items-center justify-center overflow-hidden min-h-[300px] max-h-[72vh]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="w-auto h-auto max-h-[70vh] max-w-full object-contain rounded border border-zinc-800/80 shadow-2xl"
          />
        </div>

        {/* Footer Caption & Metadata Bar */}
        <div className="px-4 py-3 bg-[#0c1017] border-t border-zinc-800 text-xs text-zinc-300 space-y-1">
          <div className="flex items-start justify-between gap-3">
            <div className="leading-snug text-xs sm:text-sm font-sans text-zinc-200">
              {figureLabel && (
                <span className="font-mono text-red-400 font-bold mr-2">
                  {figureLabel}:
                </span>
              )}
              <span>{caption || alt}</span>
            </div>
            <span className="shrink-0 text-[10px] font-mono text-zinc-500 uppercase tracking-widest border border-zinc-800 px-2 py-0.5 rounded bg-[#090b10]">
              VERIFIED RECORD
            </span>
          </div>

          <div className="pt-1.5 flex items-center justify-between text-[10px] font-mono text-zinc-500 border-t border-zinc-900">
            <span>ARCHIVE ID // ASSET-ZOOM-LAYER</span>
            <span>TACTICAL SURVEILLANCE & CHRONICLE SYSTEM</span>
          </div>
        </div>
      </div>
    </div>
  );
}
