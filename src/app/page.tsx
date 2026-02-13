'use client';

import Header from '@/components/Header';
import SearchForm from '@/components/SearchForm';
import ResultsTable from '@/components/ResultsTable';
import ExportButtons from '@/components/ExportButtons';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import { useSearch } from '@/hooks/useSearch';
import { useExport } from '@/hooks/useExport';

export default function Home() {
  const {
    query,
    location,
    results,
    total,
    loading,
    error,
    hasSearched,
    setQuery,
    setLocation,
    search,
  } = useSearch();

  const { handleExport } = useExport(results);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Hero area */}
          <div className="mb-8 text-center animate-fade-in-up">
            <h2 className="text-2xl font-bold tracking-tight text-brown-800 sm:text-3xl">
              Encontre empresas para{' '}
              <span className="bg-gradient-to-r from-gold-500 to-gold-700 bg-clip-text text-transparent">
                prospectar
              </span>
            </h2>
            <p className="mt-2 text-sm text-warmGray-400 sm:text-base">
              Busque por segmento e localidade para extrair dados de empresas do
              Google Maps
            </p>
          </div>

          {/* Search */}
          <div className="mx-auto mb-8 max-w-2xl animate-fade-in-up stagger-1">
            <SearchForm
              query={query}
              location={location}
              loading={loading}
              onQueryChange={setQuery}
              onLocationChange={setLocation}
              onSearch={search}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="mx-auto mb-6 max-w-2xl animate-fade-in-up">
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-5 w-5 flex-shrink-0 text-red-500"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && <LoadingSpinner />}

          {/* Results */}
          {!loading && results.length > 0 && (
            <div className="space-y-4 animate-fade-in-up stagger-2">
              {/* Export bar */}
              <div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-warmGray-200/60 bg-white px-6 py-3 shadow-sm sm:flex-row">
                <ExportButtons
                  onExport={handleExport}
                  disabled={results.length === 0}
                  resultCount={results.length}
                />
              </div>

              {/* Table */}
              <ResultsTable
                results={results}
                total={total}
                query={query}
                location={location}
              />
            </div>
          )}

          {/* Empty state */}
          {!loading && results.length === 0 && (
            <div className="animate-fade-in-up stagger-2">
              <EmptyState hasSearched={hasSearched} />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-warmGray-200/60 bg-white/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-warmGray-400">
            © {new Date().getFullYear()}{' '}
            <span className="font-semibold text-brown-600">Suporgi</span>. 
            Prospecção inteligente de empresas.
          </p>
        </div>
      </footer>
    </div>
  );
}
