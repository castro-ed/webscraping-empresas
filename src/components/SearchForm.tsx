'use client';

import { FormEvent } from 'react';

interface SearchFormProps {
  query: string;
  location: string;
  loading: boolean;
  onQueryChange: (q: string) => void;
  onLocationChange: (l: string) => void;
  onSearch: () => void;
}

export default function SearchForm({
  query,
  location,
  loading,
  onQueryChange,
  onLocationChange,
  onSearch,
}: SearchFormProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="overflow-hidden rounded-2xl border border-warmGray-200/60 bg-white shadow-xl shadow-brown-900/5 transition-all duration-300 hover:shadow-2xl hover:shadow-brown-900/10">
        {/* Title bar */}
        <div className="border-b border-warmGray-100 bg-gradient-to-r from-warmGray-50 to-white px-6 py-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-brown-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4 text-gold-500"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clipRule="evenodd"
              />
            </svg>
            Buscar Empresas
          </h2>
        </div>

        <div className="space-y-4 p-6">
          {/* Search input */}
          <div className="group">
            <label
              htmlFor="search-query"
              className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-warmGray-500"
            >
              O que você procura?
            </label>
            <div className="relative">
              <input
                id="search-query"
                type="text"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Ex: Materiais de Construção, Lojas de Tintas..."
                disabled={loading}
                className="w-full rounded-xl border border-warmGray-200 bg-warmGray-50/50 px-4 py-3.5 text-sm text-brown-800 placeholder:text-warmGray-400 transition-all duration-200 focus:border-gold-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-gold-400/10 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5 text-warmGray-300 transition-colors group-focus-within:text-gold-400"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Location input */}
          <div className="group">
            <label
              htmlFor="search-location"
              className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-warmGray-500"
            >
              Localidade
            </label>
            <div className="relative">
              <input
                id="search-location"
                type="text"
                value={location}
                onChange={(e) => onLocationChange(e.target.value)}
                placeholder="Ex: Goiânia, Aparecida de Goiânia..."
                disabled={loading}
                className="w-full rounded-xl border border-warmGray-200 bg-warmGray-50/50 px-4 py-3.5 text-sm text-brown-800 placeholder:text-warmGray-400 transition-all duration-200 focus:border-gold-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-gold-400/10 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5 text-warmGray-300 transition-colors group-focus-within:text-gold-400"
                >
                  <path
                    fillRule="evenodd"
                    d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-6 py-3.5 text-sm font-semibold text-brown-900 shadow-lg shadow-gold-500/25 transition-all duration-300 hover:from-gold-400 hover:to-gold-500 hover:shadow-xl hover:shadow-gold-500/30 focus:outline-none focus:ring-4 focus:ring-gold-400/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-lg"
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

            <span className="relative flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Buscando empresas...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Buscar Empresas
                </>
              )}
            </span>
          </button>
        </div>
      </div>
    </form>
  );
}
