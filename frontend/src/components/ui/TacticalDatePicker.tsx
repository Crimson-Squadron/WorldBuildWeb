'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, ChevronDown, ChevronLeft, ChevronRight, Crosshair, Check } from 'lucide-react';
import { formatEventDate } from '@/lib/dateUtils';

interface TacticalDatePickerProps {
  value: string; // ISO date string (YYYY-MM-DD)
  onChange: (date: string) => void;
  label?: string;
  required?: boolean;
  className?: string;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTH_SHORT = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
];

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function getDaysInMonth(year: number, monthZeroIndexed: number): number {
  if (monthZeroIndexed === 1) { // February
    return isLeapYear(year) ? 29 : 28;
  }
  if ([3, 5, 8, 10].includes(monthZeroIndexed)) { // April, June, Sept, Nov
    return 30;
  }
  return 31;
}

export default function TacticalDatePicker({
  value,
  onChange,
  label = 'CHRONOLOGICAL DATE (GREGORIAN)',
  required = false,
  className = '',
}: TacticalDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse initial state or fallback to default
  const parseDate = (val: string) => {
    if (!val) {
      const now = new Date();
      return {
        year: now.getFullYear(),
        month: now.getMonth(),
        day: now.getDate()
      };
    }
    const parts = val.trim().split('-');
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const d = parseInt(parts[2], 10);
      if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        return { year: y, month: Math.max(0, Math.min(11, m)), day: Math.max(1, Math.min(31, d)) };
      }
    }
    return { year: 2024, month: 0, day: 1 };
  };

  const initial = parseDate(value);
  const [year, setYear] = useState<number>(initial.year);
  const [month, setMonth] = useState<number>(initial.month);
  const [day, setDay] = useState<number>(initial.day);
  const [yearInput, setYearInput] = useState<string>(initial.year.toString());

  // Synchronize internal state when value prop changes externally
  useEffect(() => {
    if (value) {
      const parsed = parseDate(value);
      setYear(parsed.year);
      setMonth(parsed.month);
      setDay(parsed.day);
      setYearInput(parsed.year.toString());
    }
  }, [value]);

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const commitDate = (newYear: number, newMonth: number, newDay: number) => {
    const maxDays = getDaysInMonth(newYear, newMonth);
    const validDay = Math.min(newDay, maxDays);
    setYear(newYear);
    setMonth(newMonth);
    setDay(validDay);
    setYearInput(newYear.toString());

    const paddedYear = newYear < 0 
      ? `-${String(Math.abs(newYear)).padStart(4, '0')}` 
      : String(newYear).padStart(4, '0');
    const paddedMonth = String(newMonth + 1).padStart(2, '0');
    const paddedDay = String(validDay).padStart(2, '0');

    onChange(`${paddedYear}-${paddedMonth}-${paddedDay}`);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setYearInput(raw);
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed)) {
      commitDate(parsed, month, day);
    }
  };

  const handleYearStep = (delta: number) => {
    const nextYear = year + delta;
    commitDate(nextYear, month, day);
  };

  const daysInCurrentMonth = getDaysInMonth(year, month);
  const daysArray = Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-300 mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span>{label}</span>
            {required && <span className="text-red-500">*</span>}
          </span>
          <span className="text-[10px] text-zinc-500 font-mono tracking-widest">[GREGORIAN_SYS]</span>
        </label>
      )}

      {/* Main Trigger Bar */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        className={`w-full bg-[#0a0d14] border ${
          isOpen ? 'border-red-500 ring-1 ring-red-500/40' : 'border-zinc-800 hover:border-zinc-600'
        } rounded-lg px-4 py-3 flex items-center justify-between cursor-pointer transition-all duration-150 select-none group shadow-lg`}
      >
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 rounded bg-[#121622] border border-zinc-700/80 flex items-center justify-center text-red-400 group-hover:border-red-500/60 transition-colors">
            <CalendarIcon className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-sm font-mono font-bold text-white tracking-wide">
              {value ? formatEventDate(value) : <span className="text-zinc-500">SELECT DATE</span>}
            </div>
            <div className="text-[10px] font-mono text-zinc-500">
              ISO: {value || 'YYYY-MM-DD'}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <span className="text-[11px] font-mono font-semibold text-zinc-300 border border-zinc-700 px-2 py-0.5 rounded bg-[#121622]">
            {year}
          </span>
          <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-red-500' : ''}`} />
        </div>
      </div>

      {/* Tactical Dropdown Popover (100% Solid, Fully Opaque Background) */}
      {isOpen && (
        <div 
          className="absolute z-50 mt-2 left-0 w-full sm:w-[400px] bg-[#090b10] border border-zinc-700/90 shadow-[0_25px_60px_rgba(0,0,0,0.95)] ring-1 ring-zinc-700/60 rounded-xl p-4 text-zinc-200 font-mono select-none"
          style={{ backgroundColor: '#090b10', opacity: 1 }}
        >
          {/* Header Status Bar */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5 mb-3">
            <div className="flex items-center space-x-1.5 text-xs text-red-400 font-bold tracking-wider">
              <Crosshair className="w-3.5 h-3.5 animate-pulse text-red-500" />
              <span>TEMPORAL COORDINATE SELECTOR</span>
            </div>
            <div className="text-[10px] text-zinc-500">MIL-STD // 8601</div>
          </div>

          {/* Year Controls */}
          <div className="mb-3.5 bg-[#0e121b] border border-zinc-800 p-2.5 rounded-lg">
            <div className="text-[10px] text-zinc-400 uppercase tracking-wider mb-2 flex justify-between font-semibold">
              <span>YEAR CALIBRATION</span>
              <span className="text-zinc-500 font-normal">ANY ERA</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <button
                type="button"
                onClick={() => handleYearStep(-10)}
                className="px-2.5 py-1 text-xs bg-[#161c28] hover:bg-zinc-800 border border-zinc-700/90 rounded text-zinc-300 hover:text-white transition-colors"
                title="Subtract 10 Years"
              >
                -10
              </button>
              <button
                type="button"
                onClick={() => handleYearStep(-1)}
                className="p-1.5 bg-[#161c28] hover:bg-zinc-800 border border-zinc-700/90 rounded text-zinc-300 hover:text-white transition-colors"
                title="Previous Year"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              
              <input
                type="number"
                value={yearInput}
                onChange={handleYearChange}
                style={{ backgroundColor: '#131722', color: '#ffffff' }}
                className="flex-1 bg-[#131722] border border-zinc-700 focus:border-red-500 rounded px-2.5 py-1 text-center font-mono text-sm text-white font-bold tracking-wider outline-none"
                placeholder="YYYY"
              />

              <button
                type="button"
                onClick={() => handleYearStep(1)}
                className="p-1.5 bg-[#161c28] hover:bg-zinc-800 border border-zinc-700/90 rounded text-zinc-300 hover:text-white transition-colors"
                title="Next Year"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleYearStep(10)}
                className="px-2.5 py-1 text-xs bg-[#161c28] hover:bg-zinc-800 border border-zinc-700/90 rounded text-zinc-300 hover:text-white transition-colors"
                title="Add 10 Years"
              >
                +10
              </button>
            </div>
          </div>

          {/* Month Grid */}
          <div className="mb-3.5">
            <div className="text-[10px] text-zinc-400 uppercase tracking-wider mb-2 flex justify-between font-semibold">
              <span>MONTH SPECIFIER</span>
              <span className="text-zinc-200 font-bold">{MONTH_NAMES[month]}</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {MONTH_SHORT.map((mStr, idx) => {
                const isSelected = idx === month;
                return (
                  <button
                    key={mStr}
                    type="button"
                    onClick={() => commitDate(year, idx, day)}
                    style={isSelected ? { backgroundColor: '#ef4444' } : { backgroundColor: '#121622' }}
                    className={`py-1.5 text-[11px] font-mono tracking-wider rounded border transition-all ${
                      isSelected
                        ? 'bg-red-500 text-white border-red-400 font-bold shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                        : 'bg-[#121622] text-zinc-300 border-zinc-800 hover:border-zinc-600 hover:text-white hover:bg-[#1a2130]'
                    }`}
                  >
                    {mStr}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Day Grid */}
          <div className="mb-3.5">
            <div className="text-[10px] text-zinc-400 uppercase tracking-wider mb-2 flex justify-between font-semibold">
              <span>DAY COORDINATE (1 - {daysInCurrentMonth})</span>
              <span className="text-zinc-200 font-bold">{String(day).padStart(2, '0')}</span>
            </div>
            <div className="bg-[#0b0e16] border border-zinc-800/90 p-2 rounded-lg">
              <div className="grid grid-cols-7 gap-1.5 max-h-[145px] overflow-y-auto pr-1">
                {daysArray.map((dNum) => {
                  const isSelected = dNum === day;
                  return (
                    <button
                      key={dNum}
                      type="button"
                      onClick={() => commitDate(year, month, dNum)}
                      style={isSelected ? { backgroundColor: '#ef4444' } : { backgroundColor: '#131824' }}
                      className={`py-1.5 text-xs font-mono rounded border transition-all ${
                        isSelected
                          ? 'bg-red-500 text-white border-red-400 font-bold shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                          : 'bg-[#131824] text-zinc-300 border-zinc-800/80 hover:border-zinc-600 hover:text-white hover:bg-[#1b2234]'
                      }`}
                    >
                      {String(dNum).padStart(2, '0')}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-2.5 border-t border-zinc-800 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                commitDate(today.getFullYear(), today.getMonth(), today.getDate());
              }}
              className="text-[11px] text-zinc-400 hover:text-red-400 underline uppercase tracking-wider transition-colors"
            >
              SET TODAY
            </button>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold rounded-lg border border-red-400 flex items-center space-x-1.5 shadow-md shadow-red-950/50 transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                <span>CONFIRM</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
