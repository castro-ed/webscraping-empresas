'use client';

import { useState, useMemo } from 'react';
import type { Company, SortConfig } from '@/types';

interface ResultsTableProps {
  results: Company[];
  total: number;
  query: string;
  location: string;
}

const ITEMS_PER_PAGE = 15;

export default function ResultsTable({
  results,
  total,
  query,
  location,
}: ResultsTableProps) {
  const [filter, setFilter] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'name',
    direction: 'asc',
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Filter results
  const filteredResults = useMemo(() => {
    if (!filter.trim()) return results;
    const term = filter.toLowerCase();
    return results.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.address.toLowerCase().includes(term) ||
        c.phone.toLowerCase().includes(term)
    );
  }, [results, filter]);

  // Sort results
  const sortedResults = useMemo(() => {
    const sorted = [...filteredResults].sort((a, b) => {
      const aVal = a[sortConfig.key].toLowerCase();
      const bVal = b[sortConfig.key].toLowerCase();
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredResults, sortConfig]);

  // Paginate
  const totalPages = Math.ceil(sortedResults.length / ITEMS_PER_PAGE);
  const paginatedResults = sortedResults.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSort = (key: keyof Company) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
    setCurrentPage(1);
  };

  const SortIcon = ({ columnKey }: { columnKey: keyof Company }) => {
    if (sortConfig.key !== columnKey) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-warmGray-300">
          <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clipRule="evenodd" />
        </svg>
      );
    }

    return sortConfig.direction === 'asc' ? (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-gold-500">
        <path fillRule="evenodd" d="M10 15a.75.75 0 01-.75-.75V7.612L7.29 9.77a.75.75 0 01-1.08-1.04l3.25-3.5a.75.75 0 011.08 0l3.25 3.5a.75.75 0 01-1.08 1.04l-1.96-2.158v6.638A.75.75 0 0110 15z" clipRule="evenodd" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-gold-500">
        <path fillRule="evenodd" d="M10 5a.75.75 0 01.75.75v6.638l1.96-2.158a.75.75 0 111.08 1.04l-3.25 3.5a.75.75 0 01-1.08 0l-3.25-3.5a.75.75 0 111.08-1.04l1.96 2.158V5.75A.75.75 0 0110 5z" clipRule="evenodd" />
      </svg>
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-warmGray-200/60 bg-white shadow-xl shadow-brown-900/5">
      {/* Table header with stats & filter */}
      <div className="border-b border-warmGray-100 bg-gradient-to-r from-warmGray-50 to-white px-6 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-brown-700">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-gold-500">
                <path fillRule="evenodd" d="M.99 5.24A2.25 2.25 0 013.25 3h13.5A2.25 2.25 0 0119 5.25l.01 9.5A2.25 2.25 0 0116.76 17H3.26A2.25 2.25 0 011 14.75l-.01-9.51zm8.26 9.52v-.625a.75.75 0 00-.75-.75H3.25a.75.75 0 00-.75.75v.615c0 .414.336.75.75.75h5.373a.75.75 0 00.627-.34zM17.5 14.75v-.625a.75.75 0 00-.75-.75H11.5a.75.75 0 00-.75.75v.615c0 .414.336.75.75.75h5.373a.75.75 0 00.627-.34z" clipRule="evenodd" />
              </svg>
              Resultados
            </h2>
            <p className="mt-0.5 text-xs text-warmGray-400">
              <span className="font-semibold text-gold-600">{total}</span>{' '}
              empresas encontradas para &ldquo;{query}&rdquo; em{' '}
              <span className="font-medium">{location}</span>
              {filteredResults.length !== results.length && (
                <span className="ml-1 text-brown-400">
                  ({filteredResults.length} filtradas)
                </span>
              )}
            </p>
          </div>

          <div className="relative">
            <input
              type="text"
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Filtrar resultados..."
              className="w-full rounded-lg border border-warmGray-200 bg-white px-3 py-2 pl-9 text-xs text-brown-800 placeholder:text-warmGray-400 transition-all focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/10 sm:w-64"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-warmGray-300"
            >
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-warmGray-100 bg-warmGray-50/50">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-warmGray-500">
                #
              </th>
              {(['name', 'address', 'phone'] as const).map((key) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-warmGray-500 transition-colors hover:text-brown-700"
                >
                  <span className="flex items-center gap-1">
                    {key === 'name' && 'Empresa'}
                    {key === 'address' && 'Endereço'}
                    {key === 'phone' && 'Telefone'}
                    <SortIcon columnKey={key} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-warmGray-50">
            {paginatedResults.map((company, index) => (
              <tr
                key={`${company.name}-${index}`}
                className="group transition-colors duration-150 hover:bg-gold-50/30"
              >
                <td className="whitespace-nowrap px-6 py-4 text-xs font-medium text-warmGray-400">
                  {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-brown-800 group-hover:text-brown-900">
                    {company.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-warmGray-600">
                    {company.address}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-warmGray-100/70 px-3 py-1 text-xs font-medium text-brown-700 transition-colors group-hover:bg-gold-100 group-hover:text-brown-800">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3 text-gold-500">
                      <path fillRule="evenodd" d="m3.855 7.286 1.067-.534a1 1 0 00.542-1.046l-.44-2.858A1 1 0 016.016 1.88l1.756.429a1 1 0 001.15-.49l1.358-2.55a1 1 0 011.763.009l1.34 2.562a1 1 0 001.16.48l1.747-.456a1 1 0 011.005.98l-.457 2.86a1 1 0 00.535 1.05l1.058.547a1 1 0 01.006 1.764l-1.074.55a1 1 0 00-.532 1.04l.457 2.857a1 1 0 01-1.008.98l-1.75-.456a1 1 0 00-1.15.49L12.87 16.12a1 1 0 01-1.766-.007l-1.34-2.562a1 1 0 00-1.16-.48l-1.747.456a1 1 0 01-1.005-.98l.457-2.86a1 1 0 00-.535-1.05l-1.058-.547a1 1 0 01-.006-1.764l.155-.08z" clipRule="evenodd" />
                    </svg>
                    {company.phone}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-warmGray-100 bg-warmGray-50/30 px-6 py-3">
          <p className="text-xs text-warmGray-400">
            Página <span className="font-semibold text-brown-700">{currentPage}</span> de{' '}
            <span className="font-semibold text-brown-700">{totalPages}</span>
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-warmGray-200 bg-white px-3 py-1.5 text-xs font-medium text-brown-700 transition-all hover:border-gold-300 hover:bg-gold-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Anterior
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-warmGray-200 bg-white px-3 py-1.5 text-xs font-medium text-brown-700 transition-all hover:border-gold-300 hover:bg-gold-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
