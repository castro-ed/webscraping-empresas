import { NextRequest, NextResponse } from 'next/server';
import { scrapeGoogleMaps } from '@/services/scraper';
import type { SearchResponse, Company } from '@/types';

export const maxDuration = 60; // Vercel timeout

// Interface para o item do cache
interface CacheItem {
  data: Company[];
  timestamp: number;
}

// Cache em memória (global fora da função handler)
// Nota: Em serverless (Vercel), isso persiste apenas enquanto o container estiver "quente".
const cache = new Map<string, CacheItem>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos em milissegundos

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const location = searchParams.get('location') || 'Goiânia';
  const limit = parseInt(searchParams.get('limit') || '60', 10);

  console.log(`[API] Recebida nova requisição: q="${query}", location="${location}", limit=${limit}`);

  if (!query || query.trim().length === 0) {
    console.warn('[API] Requisição rejeitada: parâmetro "q" ausente.');
    return NextResponse.json(
      { error: 'Parâmetro de busca "q" é obrigatório.' },
      { status: 400 }
    );
  }

  const cleanQuery = query.trim();
  const cleanLocation = location.trim();
  
  // Gera chave única para o cache
  const cacheKey = `${cleanQuery.toLowerCase()}|${cleanLocation.toLowerCase()}|${limit}`;
  const now = Date.now();

  // Verifica cache
  if (cache.has(cacheKey)) {
    const item = cache.get(cacheKey)!;
    if (now - item.timestamp < CACHE_TTL) {
      console.log(`[API] Cache HIT para chave: "${cacheKey}". Retornando dados em cache.`);
      const response: SearchResponse = {
        results: item.data,
        total: item.data.length,
        query: cleanQuery,
        location: cleanLocation,
      };
      return NextResponse.json(response);
    } else {
      console.log(`[API] Cache EXPIRED para chave: "${cacheKey}". Removendo do cache.`);
      cache.delete(cacheKey);
    }
  } else {
    console.log(`[API] Cache MISS para chave: "${cacheKey}". Iniciando scraping...`);
  }

  try {
    const results = await scrapeGoogleMaps(cleanQuery, cleanLocation, limit);

    // Salva no cache
    console.log(`[API] Salvando resultado no cache para chave: "${cacheKey}"`);
    cache.set(cacheKey, {
      data: results,
      timestamp: Date.now(),
    });

    const response: SearchResponse = {
      results,
      total: results.length,
      query: cleanQuery,
      location: cleanLocation,
    };

    console.log('[API] Retornando resposta de sucesso.');
    return NextResponse.json(response);
  } catch (error) {
    console.error('[API /search] Erro no scraping:', error);

    return NextResponse.json(
      {
        error: 'Erro ao buscar empresas. Tente novamente em alguns instantes.',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}
