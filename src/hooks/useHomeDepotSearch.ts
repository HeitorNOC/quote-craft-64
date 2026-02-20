import { useState, useCallback, useRef, useEffect } from 'react';
import type { MaterialOption } from '@/types';

interface UseHomeDepotSearchResult {
  results: MaterialOption[];
  loading: boolean;
  error: string | null;
  search: (query: string, zipCode?: string) => Promise<void>;
  clear: () => void;
  requestsRemaining: number;
  nextRequestAvailable: Date | null;
}

/**
 * Hook com proteção contra abuso:
 * - Cache local por 30 minutos
 * - Max 10 requests por minuto (rate limit)
 * - Debounce de 300ms
 * - Throttle de 5 minutos mesmo termo
 * - Timeout de 10 segundos
 */
export function useHomeDepotSearch(): UseHomeDepotSearchResult {
  const [results, setResults] = useState<MaterialOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestsRemaining, setRequestsRemaining] = useState(10);
  const [nextRequestAvailable, setNextRequestAvailable] = useState<Date | null>(null);

  // Cache: { query -> { results, timestamp } }
  const cacheRef = useRef<Map<string, { results: MaterialOption[]; timestamp: number }>>(new Map());
  
  // Rate limiter: track requests in the last minute
  const requestTimestampsRef = useRef<number[]>([]);
  
  // Debounce timer
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Throttle: {query -> timestamp of last search}
  const lastSearchRef = useRef<Map<string, number>>(new Map());

  // Cleanup function
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const getFromCache = (query: string): MaterialOption[] | null => {
    const cached = cacheRef.current.get(query);
    if (!cached) return null;
    
    // Cache expires in 30 minutes
    const CACHE_TTL = 30 * 60 * 1000;
    if (Date.now() - cached.timestamp > CACHE_TTL) {
      cacheRef.current.delete(query);
      return null;
    }
    
    return cached.results;
  };

  const saveToCache = (query: string, results: MaterialOption[]) => {
    cacheRef.current.set(query, {
      results,
      timestamp: Date.now(),
    });
  };

  const checkRateLimit = (): { allowed: boolean; remaining: number; nextAvailable: Date | null } => {
    const now = Date.now();
    const ONE_MINUTE = 60 * 1000;
    const MAX_REQUESTS_PER_MINUTE = 10;

    // Remove timestamps older than 1 minute
    requestTimestampsRef.current = requestTimestampsRef.current.filter(
      (ts) => now - ts < ONE_MINUTE
    );

    const remaining = MAX_REQUESTS_PER_MINUTE - requestTimestampsRef.current.length;
    
    if (remaining > 0) {
      return { allowed: true, remaining, nextAvailable: null };
    }

    // If limit reached, calculate when next request will be available
    const oldestRequest = Math.min(...requestTimestampsRef.current);
    const nextAvailable = new Date(oldestRequest + ONE_MINUTE);
    
    return { allowed: false, remaining: 0, nextAvailable };
  };

  const checkThrottle = (query: string): boolean => {
    const lastSearch = lastSearchRef.current.get(query);
    if (!lastSearch) return true;

    const THROTTLE_INTERVAL = 5 * 60 * 1000; // 5 minutes
    return Date.now() - lastSearch > THROTTLE_INTERVAL;
  };

  const search = useCallback(async (query: string, zipCode?: string) => {
    if (!query.trim()) {
      setResults([]);
      setError(null);
      return;
    }

    const normalizedQuery = query.toLowerCase().trim();

    // Clear previous debounce
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce: wait 300ms before searching
    debounceTimerRef.current = setTimeout(async () => {
      try {
        // Check cache first
        const cached = getFromCache(normalizedQuery);
        if (cached) {

          setResults(cached);
          setError(null);
          setLoading(false);
          return;
        }

        // Check throttle: same query within 5 minutes
        if (!checkThrottle(normalizedQuery)) {
          const message = `Search recently performed. Please try again in 5 minutes.`;
          setError(message);
          setLoading(false);
          return;
        }

        // Check rate limit
        const { allowed, remaining, nextAvailable } = checkRateLimit();
        setRequestsRemaining(remaining);
        setNextRequestAvailable(nextAvailable);

        if (!allowed) {
          const message = `Request limit reached. Please try again later.`;
          setError(message);
          setLoading(false);
          return;
        }

        setLoading(true);
        setError(null);

        // Make request to Vercel serverless function with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        try {
          const apiResponse = await fetch('/api/search-flooring', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: normalizedQuery, zipCode }),
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (!apiResponse.ok) {
            throw new Error(`API error: ${apiResponse.status}`);
          }

          const data: MaterialOption[] = await apiResponse.json();
          
          // Record this request
          requestTimestampsRef.current.push(Date.now());
          lastSearchRef.current.set(normalizedQuery, Date.now());
          
          // Save to cache
          saveToCache(normalizedQuery, data);
          
          setResults(data);
          setError(null);
        } catch (err) {
          clearTimeout(timeoutId);
          throw err;
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch materials';
        setError(message);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, []);

  const clear = useCallback(() => {
    setResults([]);
    setError(null);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
  }, []);

  return { results, loading, error, search, clear, requestsRemaining, nextRequestAvailable };
}
