'use client';

import { useState, useRef } from 'react';
import { Chapter } from '@/lib/types';
import MarkdownView from '@/components/ui/MarkdownView';
import ImagePicker from '@/components/ui/ImagePicker';
import ImageLightboxModal from '@/components/ui/ImageLightboxModal';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  FileText,
  Bold,
  Italic,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Minus,
  Code,
  Eye,
  Edit3,
  Image as ImageIcon,
  ZoomIn,
} from 'lucide-react';

interface ChapterEditorProps {
  chapters: Chapter[];
  onChange: (updated: Chapter[]) => void;
}

export default function ChapterEditor({ chapters, onChange }: ChapterEditorProps) {
  // Track preview mode per chapter index
  const [previewModes, setPreviewModes] = useState<Record<number, boolean>>({});
  // Track image picker toggle per chapter index
  const [showImagePickers, setShowImagePickers] = useState<Record<number, boolean>>({});
  const [lightboxData, setLightboxData] = useState<{
    src: string;
    alt: string;
    caption?: string;
    figureLabel?: string;
  } | null>(null);
  const textareaRefs = useRef<Record<number, HTMLTextAreaElement | null>>({});

  const togglePreview = (idx: number) => {
    setPreviewModes((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleImagePicker = (idx: number) => {
    setShowImagePickers((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const addChapter = () => {
    const nextIndex = chapters.length + 1;
    onChange([
      ...chapters,
      {
        orderIndex: nextIndex,
        chapterTitle: `Chapter ${nextIndex}`,
        imageUrl: '',
        imageCaption: '',
        content: '',
      },
    ]);
  };

  const removeChapter = (indexToRemove: number) => {
    if (chapters.length <= 1) {
      alert('A historical record must have at least one chapter segment.');
      return;
    }
    const updated = chapters
      .filter((_, idx) => idx !== indexToRemove)
      .map((ch, idx) => ({ ...ch, orderIndex: idx + 1 }));
    onChange(updated);
  };

  const updateChapterField = (index: number, field: keyof Chapter, value: any) => {
    const updated = [...chapters];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const moveChapter = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= chapters.length) return;

    const copy = [...chapters];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    const reindexed = copy.map((ch, idx) => ({ ...ch, orderIndex: idx + 1 }));
    onChange(reindexed);
  };

  const applyMarkdownShortcut = (
    idx: number,
    prefix: string,
    suffix: string = '',
    defaultText: string = ''
  ) => {
    const textarea = textareaRefs.current[idx];
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = chapters[idx].content || '';
    const selectedText = currentVal.substring(start, end) || defaultText;

    const replacement = `${prefix}${selectedText}${suffix}`;
    const newVal = currentVal.substring(0, start) + replacement + currentVal.substring(end);

    updateChapterField(idx, 'content', newVal);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 10);
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200 hud-mono flex items-center gap-2">
            <FileText className="w-4 h-4 text-red-500" />
            <span>NARRATIVE LOGS // CHAPTER SEGMENT MODULE</span>
          </h3>
          <p className="text-[11px] text-zinc-500 hud-mono mt-0.5">
            Divide the event description into operational chapter segments with optional context imagery.
          </p>
        </div>
        <button
          type="button"
          onClick={addChapter}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold hud-mono uppercase tracking-wider transition-all shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>APPEND CHAPTER LOG</span>
        </button>
      </div>

      {/* Animated Chapter List */}
      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {chapters.map((chapter, idx) => {
            const isPreview = Boolean(previewModes[idx]);
            const isImagePickerOpen = Boolean(showImagePickers[idx]);

            return (
              <motion.div
                key={chapter.orderIndex || idx}
                layout
                initial={{ opacity: 0, y: 12, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                className="p-4 sm:p-5 rounded-xl border border-zinc-800 bg-zinc-950/90 space-y-3.5 shadow-lg hover:border-zinc-700 transition-colors"
              >
                {/* Header Row: Title & Move Handles */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 flex-1">
                    <span className="w-6 h-6 rounded bg-zinc-900 border border-zinc-700 text-red-400 text-xs font-bold hud-mono flex items-center justify-center shrink-0">
                      {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                    </span>
                    <input
                      type="text"
                      placeholder="Segment Title (e.g. Prelude, The Siege, Treaty, Aftermath)"
                      value={chapter.chapterTitle}
                      onChange={(e) => updateChapterField(idx, 'chapterTitle', e.target.value)}
                      className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-red-500 hud-mono"
                      required
                    />
                  </div>

                  {/* Move Up / Down Handles */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveChapter(idx, 'up')}
                      className="p-1.5 text-zinc-400 hover:text-white disabled:opacity-20 disabled:hover:text-zinc-400 rounded hover:bg-zinc-800 transition-colors"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === chapters.length - 1}
                      onClick={() => moveChapter(idx, 'down')}
                      className="p-1.5 text-zinc-400 hover:text-white disabled:opacity-20 disabled:hover:text-zinc-400 rounded hover:bg-zinc-800 transition-colors"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    {chapters.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeChapter(idx)}
                        className="p-1.5 text-zinc-400 hover:text-red-400 rounded hover:bg-red-950/40 transition-colors ml-1"
                        title="Remove Segment"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Chapter Context Visual Drawer Toggle */}
                <div className="flex items-center justify-between text-xs pt-0.5 hud-mono">
                  <button
                    type="button"
                    onClick={() => toggleImagePicker(idx)}
                    className="flex items-center gap-1.5 text-red-400 hover:text-red-300 font-semibold transition-colors uppercase tracking-wider text-[11px]"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>
                      {chapter.imageUrl
                        ? 'CHANGE CONTEXT INTEL VISUAL'
                        : '+ ATTACH CHAPTER CONTEXT VISUAL (OPTIONAL)'}
                    </span>
                  </button>
                  {chapter.imageUrl && (
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                      ● VISUAL ATTACHED
                    </span>
                  )}
                </div>

                {/* Chapter Image Picker Drawer */}
                {isImagePickerOpen && (
                  <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg space-y-3">
                    <ImagePicker
                      label="Chapter Context Image"
                      value={chapter.imageUrl}
                      onChange={(url) => updateChapterField(idx, 'imageUrl', url)}
                      helperText="Attach an operational illustration, tactical map, or artifact visual for this chapter."
                    />
                    {chapter.imageUrl && (
                      <div className="pt-2 border-t border-zinc-800">
                        <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                          <span>FIGURE CAPTION // WIKIPEDIA-STYLE DESCRIPTION</span>
                          <span className="text-[10px] text-zinc-500 font-mono">[OPTIONAL CAPTION]</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Subterranean bastion seawall prior to rupture during the midsummer eclipse."
                          value={chapter.imageCaption || ''}
                          onChange={(e) => updateChapterField(idx, 'imageCaption', e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-red-500 font-mono"
                        />
                        <p className="text-[10px] text-zinc-500 font-mono mt-1">
                          Appears in a dedicated side container beneath the image with figure designation, matching Wikipedia document standards.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Formatting Toolbar & Mode Toggle */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-800/80">
                  <div className="flex flex-wrap items-center gap-0.5 bg-zinc-900 border border-zinc-800 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => applyMarkdownShortcut(idx, '**', '**', 'bold text')}
                      className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded"
                      title="Bold"
                    >
                      <Bold className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyMarkdownShortcut(idx, '*', '*', 'italic text')}
                      className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded"
                      title="Italic"
                    >
                      <Italic className="w-3 h-3" />
                    </button>
                    <span className="w-px h-3.5 bg-zinc-800 mx-0.5" />
                    <button
                      type="button"
                      onClick={() => applyMarkdownShortcut(idx, '## ', '', 'Section Heading')}
                      className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded"
                      title="Heading 2"
                    >
                      <Heading2 className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyMarkdownShortcut(idx, '### ', '', 'Sub-heading')}
                      className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded"
                      title="Heading 3"
                    >
                      <Heading3 className="w-3 h-3" />
                    </button>
                    <span className="w-px h-3.5 bg-zinc-800 mx-0.5" />
                    <button
                      type="button"
                      onClick={() =>
                        applyMarkdownShortcut(
                          idx,
                          '> "',
                          '" — Transmission transcript excerpt',
                          'Transcript quote'
                        )
                      }
                      className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded"
                      title="Blockquote / Lore Quote"
                    >
                      <Quote className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyMarkdownShortcut(idx, '- ', '', 'Bullet item')}
                      className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded"
                      title="Bullet List"
                    >
                      <List className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyMarkdownShortcut(idx, '1. ', '', 'Numbered item')}
                      className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded"
                      title="Numbered List"
                    >
                      <ListOrdered className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyMarkdownShortcut(idx, '`', '`', 'designation')}
                      className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded"
                      title="Code / Monospace"
                    >
                      <Code className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyMarkdownShortcut(idx, '\n---\n', '', '')}
                      className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded"
                      title="Horizontal Divider"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Mode Toggle: Write / Preview */}
                  <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-xs hud-mono">
                    <button
                      type="button"
                      onClick={() => setPreviewModes((prev) => ({ ...prev, [idx]: false }))}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors uppercase font-bold text-[10px] ${
                        !isPreview
                          ? 'bg-zinc-100 text-zinc-950 shadow-xs'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>WRITE</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewModes((prev) => ({ ...prev, [idx]: true }))}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors uppercase font-bold text-[10px] ${
                        isPreview
                          ? 'bg-zinc-100 text-zinc-950 shadow-xs'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Eye className="w-3 h-3" />
                      <span>PREVIEW</span>
                    </button>
                  </div>
                </div>

                {/* Editor or Live Preview Body */}
                {isPreview ? (
                  <div className="min-h-[140px] p-4 rounded-lg bg-zinc-900 border border-zinc-800 overflow-y-auto space-y-3">
                    {chapter.imageUrl && (
                      <div className="sm:float-right sm:w-72 sm:ml-4 sm:mb-2 bg-zinc-950 border border-zinc-800 rounded p-2 text-left clear-both shadow-md">
                        <div
                          onClick={() =>
                            setLightboxData({
                              src: chapter.imageUrl!,
                              alt: chapter.chapterTitle,
                              caption: chapter.imageCaption || chapter.chapterTitle,
                              figureLabel: `FIG // ${idx + 1 < 10 ? `0${idx + 1}` : idx + 1}`,
                            })
                          }
                          className="rounded overflow-hidden border border-zinc-800/80 bg-zinc-950 relative cursor-pointer group/prev"
                          title="Click to Enlarge Visual"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={chapter.imageUrl}
                            alt={chapter.chapterTitle}
                            className="w-full h-auto object-cover max-h-48 group-hover/prev:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/prev:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="px-2 py-0.5 rounded bg-black/90 border border-zinc-600 text-white text-[9px] hud-mono flex items-center gap-1 shadow-md">
                              <ZoomIn className="w-2.5 h-2.5 text-red-400" />
                              <span>ENLARGE</span>
                            </span>
                          </div>
                        </div>
                        <div className="mt-1.5 text-[11px] font-mono text-zinc-400 leading-snug">
                          <span className="text-red-500 font-bold mr-1">FIG // {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}:</span>
                          {chapter.imageCaption || chapter.chapterTitle}
                        </div>
                      </div>
                    )}
                    {chapter.content ? (
                      <MarkdownView content={chapter.content} />
                    ) : (
                      <p className="text-xs text-zinc-500 italic hud-mono">
                        // NO CONTENT TO PREVIEW
                      </p>
                    )}
                    <div className="clear-both" />
                  </div>
                ) : (
                  <textarea
                    ref={(el) => {
                      textareaRefs.current[idx] = el;
                    }}
                    placeholder="Enter operational narrative log for this chapter..."
                    rows={5}
                    value={chapter.content}
                    onChange={(e) => updateChapterField(idx, 'content', e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-red-500 font-sans leading-relaxed"
                    required
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Chapter Image Lightbox Modal */}
      {lightboxData && (
        <ImageLightboxModal
          src={lightboxData.src}
          alt={lightboxData.alt}
          caption={lightboxData.caption}
          figureLabel={lightboxData.figureLabel}
          onClose={() => setLightboxData(null)}
        />
      )}
    </div>
  );
}
