'use client';

import { useState } from 'react';
import { PLACEHOLDER_IMAGES, uploadImage } from '@/lib/api';
import { Image as ImageIcon, Upload, X, Check } from 'lucide-react';

interface ImagePickerProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  helperText?: string;
}

export default function ImagePicker({
  label,
  value,
  onChange,
  helperText = 'Upload visual file, select from BlueStacks archive presets, or enter URL.',
}: ImagePickerProps) {
  const [showPresets, setShowPresets] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (err: any) {
      alert(`Error uploading image: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 hud-mono flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-red-500" />
          <span>{label}</span>
        </label>
        <button
          type="button"
          onClick={() => setShowPresets(!showPresets)}
          className="text-xs hud-mono text-red-400 hover:text-red-300 font-semibold transition-colors uppercase tracking-wider"
        >
          {showPresets ? '[ HIDE PRESETS ]' : '[ SELECT ARCHIVE PRESET ]'}
        </button>
      </div>

      {helperText && <p className="text-[11px] text-zinc-500 hud-mono">{helperText}</p>}

      {/* Preset Placeholder Selection Grid */}
      {showPresets && (
        <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg space-y-2">
          <span className="text-[11px] text-zinc-400 block font-semibold hud-mono uppercase tracking-wider">
            BLUESTACKS INTEL PRESETS:
          </span>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {PLACEHOLDER_IMAGES.map((imgUrl, i) => (
              <button
                type="button"
                key={i}
                onClick={() => {
                  onChange(imgUrl);
                  setShowPresets(false);
                }}
                className={`relative group rounded-md overflow-hidden border aspect-video transition-all ${
                  value === imgUrl
                    ? 'border-red-500 ring-2 ring-red-500/40'
                    : 'border-zinc-800 hover:border-zinc-600'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgUrl}
                  alt={`Placeholder ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                {value === imgUrl && (
                  <div className="absolute inset-0 bg-red-600/40 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input controls: Text input + File Upload + Preview */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Path or URL (e.g. /placeholders/3347400_64.jpg)"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs hud-mono text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-red-500"
        />

        {/* Upload Button */}
        <label
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-xs font-bold hud-mono text-zinc-200 cursor-pointer transition-colors uppercase tracking-wider ${
            uploading ? 'opacity-50 cursor-wait' : ''
          }`}
        >
          <Upload className="w-3.5 h-3.5 text-zinc-400" />
          <span>{uploading ? 'UPLOADING...' : 'UPLOAD'}</span>
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors border border-transparent hover:border-red-900/40"
            title="Clear visual"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Visual Image Preview */}
      {value && (
        <div className="relative rounded-lg overflow-hidden border border-zinc-800 max-h-48 bg-black flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Intel Preview"
            className="w-full max-h-48 object-cover rounded-lg"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  );
}
