'use client';

import { useState, useCallback } from 'react';
import type { Company, SearchResponse } from '@/types';

interface UseSearchReturn {
  query: string;
  location: string;
  results: Company[];
  total: number;
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
  setQuery: (q: string) => void;
  setLocation: (l: string) => void;
  limit: number;
  setLimit: (l: number) => void;
  isPartial: boolean;
  search: () => Promise<void>;
  clearResults: () => void;
}

export function useSearch(): UseSearchReturn {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('Goiânia');
  const [limit, setLimit] = useState(60);
  const [results, setResults] = useState<Company[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isPartial, setIsPartial] = useState(false);

  const search = useCallback(async () => {
    if (!query.trim()) {
      setError('Digite um termo de busca.');
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const params = new URLSearchParams({
        q: query.trim(),
        location: location.trim(),
        limit: limit.toString(),
      });

      const response = await fetch(`/api/search?${params.toString()}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro na busca.');
      }

      const data: SearchResponse = await response.json();
      setResults(data.results);
      setTotal(data.total);
      setIsPartial(!!data.isPartial);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro inesperado. Tente novamente.';
      setError(message);
      setResults([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [query, location, limit]);

  const clearResults = useCallback(() => {
    setResults([]);
    setTotal(0);
    setError(null);
    setHasSearched(false);
  }, []);

  return {
    query,
    location,
    results,
    total,
    loading,
    error,
    hasSearched,
    setQuery,
    setLocation,
    limit,
    setLimit,
    isPartial,
    search,
    clearResults,
  };
}
