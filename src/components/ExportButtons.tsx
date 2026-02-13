'use client';

import type { ExportFormat } from '@/types';

interface ExportButtonsProps {
  onExport: (format: ExportFormat) => void;
  disabled: boolean;
  resultCount: number;
}

export default function ExportButtons({
  onExport,
  disabled,
  resultCount,
}: ExportButtonsProps) {
  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row">
      <p className="text-xs text-warmGray-400">
        Exportar <span className="font-semibold text-brown-600">{resultCount}</span>{' '}
        {resultCount === 1 ? 'empresa' : 'empresas'}:
      </p>

      <div className="flex gap-2">
        {/* CSV Button */}
        <button
          onClick={() => onExport('csv')}
          disabled={disabled}
          className="group relative flex items-center gap-2 overflow-hidden rounded-xl border border-warmGray-200 bg-white px-5 py-2.5 text-xs font-semibold text-brown-700 shadow-sm transition-all duration-300 hover:border-gold-300 hover:bg-gold-50 hover:shadow-md active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gold-100/50 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="relative h-4 w-4 text-emerald-500"
          >
            <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
            <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
          </svg>
          <span className="relative">CSV</span>
        </button>

        {/* XLSX Button */}
        <button
          onClick={() => onExport('xlsx')}
          disabled={disabled}
          className="group relative flex items-center gap-2 overflow-hidden rounded-xl border border-gold-300 bg-gradient-to-r from-gold-50 to-gold-100/50 px-5 py-2.5 text-xs font-semibold text-brown-700 shadow-sm transition-all duration-300 hover:from-gold-100 hover:to-gold-200/50 hover:shadow-md active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="relative h-4 w-4 text-gold-600"
          >
            <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
            <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
          </svg>
          <span className="relative">XLSX</span>
        </button>
      </div>
    </div>
  );
}
