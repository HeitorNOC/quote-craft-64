import type { VercelRequest, VercelResponse } from '@vercel/node';

interface SerpAPIProduct {
  title: string;
  price?: string | number;
  product_link?: string;
  link?: string;
}

interface SerpAPIResponse {
  products?: SerpAPIProduct[];
  error?: string;
  search_metadata?: {
    status?: string;
  };
}

interface MaterialOption {
  id: string;
  name: string;
  source: 'HomeDepot' | 'Lowes' | 'Manual';
  pricePerSqFt: number;
  url?: string;
}

/**
 * Vercel Serverless Function
 * Frontend-safe search for Home Depot products via SerpAPI
 * 
 * Usage: POST /api/search-flooring
 * Body: { query: "vinyl flooring" }
 * Response: MaterialOption[]
 *
 * Environment: SERPAPI_API_KEY (server-side only, never exposed to client)
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  // Only allow POST
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { query } = req.body;

  // Input validation
  if (!query || typeof query !== 'string') {
    res.status(400).json({ error: 'Invalid search query' });
    return;
  }

  const cleanQuery = query.trim();

  if (cleanQuery.length > 100) {
    res.status(400).json({ error: 'Search query too long' });
    return;
  }

  if (/[<>"`{}|\\]/g.test(cleanQuery)) {
    res.status(400).json({ error: 'Invalid characters in search' });
    return;
  }

  const apiKey = process.env.SERPAPI_API_KEY;

  if (!apiKey) {
    console.error('SERPAPI_API_KEY not configured');
    res.status(500).json({ error: 'Search service not available' });
    return;
  }

  try {
    const url = new URL('https://serpapi.com/search');
    url.searchParams.append('api_key', apiKey);
    url.searchParams.append('engine', 'home_depot');
    url.searchParams.append('q', cleanQuery);
    url.searchParams.append('num', '3');
    url.searchParams.append('device', 'mobile');
    url.searchParams.append('no_cache', 'false');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    const response = await fetch(url.toString(), {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error (${response.status}):`, errorText);
      
      if (response.status === 401) {
        throw new Error('Authentication failed');
      } else if (response.status === 429) {
        throw new Error('Too many requests');
      } else {
        throw new Error(`API error ${response.status}`);
      }
    }

    const data: SerpAPIResponse = await response.json();

    if (data.search_metadata?.status === 'Error' || data.error) {
      throw new Error(data.error || 'Search failed');
    }

    if (!data.products || data.products.length === 0) {
      res.status(404).json({ 
        error: 'No products found. Try a different search or add manually.' 
      });
      return;
    }

    // Convert SerpAPI products to MaterialOption
    const materials: MaterialOption[] = data.products.map((product, idx) => {
      // Handle price as string or number
      let priceNum = 0;
      if (product.price) {
        const priceStr = String(product.price).replace(/[^0-9.]/g, '');
        priceNum = parseFloat(priceStr) || 0;
      }
      
      const estimatedPricePerSqFt = priceNum > 0 ? Math.max(1, priceNum / 50) : 3.0;

      return {
        id: `hd-${cleanQuery.replace(/\s+/g, '-')}-${idx}`,
        name: product.title,
        source: 'HomeDepot',
        pricePerSqFt: Number(estimatedPricePerSqFt.toFixed(2)),
        url: product.link || product.product_link || '',
      };
    });

    res.status(200).json(materials);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const isAborted = errorMessage.includes('aborted') || errorMessage.includes('Abort') || errorMessage.includes('signal');
    
    console.error('Search error:', errorMessage);
    
    let userMessage = 'Unable to fetch materials. Please try again or add manually.';
    if (isAborted) {
      userMessage = 'Search took too long. Please try again or add manually.';
    } else if (errorMessage.includes('Too many requests')) {
      userMessage = 'Service busy. Please try again later.';
    }
    
    res.status(500).json({ error: userMessage });
  }
}
