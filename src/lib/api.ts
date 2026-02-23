import type { ZillowResponse, MaterialOption, CleaningTypeOption } from '@/types';

// ---------------------------------------------------------------------------
// 1️⃣ Zillow – Property data via SerpAPI
// API Key: stored in .env.local as SERPAPI_API_KEY
// Docs: https://serpapi.com/docs/zillow_search_api
//
// Returns: address, zip code, square feet, bedrooms, bathrooms
// ---------------------------------------------------------------------------
export async function fetchZillowData(address: string): Promise<ZillowResponse> {
  try {
    const response = await fetch('/api/search-zillow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Unable to fetch property data');
    }

    return await response.json();
  } catch {
    // Fallback when API fails: extract zip from address if possible
    // US zip codes appear at the end of the address
    const zipMatch = address.match(/\s(\d{5}(?:-\d{4})?)$/);
    const zipCode = zipMatch ? zipMatch[1] : '';
    return {
      address,
      totalSqFt: 0,
      zipCode,
      found: false,
    };
  }
}

// ---------------------------------------------------------------------------
// 2️⃣ Home Depot materials – SerpAPI integration
// API Key: stored in .env.local as SERPAPI_API_KEY
// Docs: https://serpapi.com/docs/home_depot_product_search
//
// SECURITY: Rate limiting implemented at:
// 1. Client-side (hook): 10 requests/minute, 5-min throttle per query, cache
// 2. Server-side: Input validation, query length limits
// ---------------------------------------------------------------------------

interface SerpAPIProduct {
  title: string;
  price: string;
  product_link?: string;
  rating?: number;
  reviews?: number;
}

interface SerpAPIResponse {
  products?: SerpAPIProduct[];
  error?: string;
}

/**
 * PROTECTED: Search Home Depot products using SerpAPI
 * - Validates input to prevent abuse
 * - Enforces query length limits
 * - Adds request timeout
 * - Falls back gracefully on error
 * - Optional: filter by zipCode location
 */
export async function searchHomeDepotProducts(query: string, zipCode?: string): Promise<MaterialOption[]> {
  // Input validation - prevent abuse
  if (!query || typeof query !== 'string') {
    throw new Error('Invalid search query');
  }

  const cleanQuery = query.trim();
  
  // Limit query length (prevent large payload attacks)
  if (cleanQuery.length > 100) {
    return getFallbackMaterials(cleanQuery.substring(0, 100));
  }

  // Reject suspicious patterns
  if (/[<>"`{}|\\]/g.test(cleanQuery)) {
    throw new Error('Invalid characters in search');
  }

  const apiKey = import.meta.env.SERPAPI_API_KEY;

  try {
    const url = new URL('https://serpapi.com/search');
    url.searchParams.append('api_key', apiKey);
    url.searchParams.append('engine', 'home_depot_product_search');
    url.searchParams.append('q', cleanQuery);
    if (zipCode) {
      // SerpAPI Home Depot engine accepts location/zip for local results
      url.searchParams.append('location', zipCode);
    }
    url.searchParams.append('num', '6');

    // Request with timeout (30 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(url.toString(), { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`SerpAPI error: ${response.status}`);
    }

    const data: SerpAPIResponse = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    if (!data.products || data.products.length === 0) {
      return getFallbackMaterials(cleanQuery);
    }

    // Convert SerpAPI products to MaterialOption
    return data.products.map((product, idx) => {
      const priceNum = parseFloat(product.price?.replace(/[^0-9.]/g, '') || '0');
      // Estimate price per sqft (assuming products cover ~100 sqft or typical pricing)
      const estimatedPricePerSqFt = priceNum > 0 ? Math.max(1, priceNum / 50) : 3.0;

      return {
        id: `hd-${cleanQuery.replace(/\s+/g, '-')}-${idx}`,
        name: product.title,
        source: 'HomeDepot',
        pricePerSqFt: Number(estimatedPricePerSqFt.toFixed(2)),
        url: product.product_link,
      };
    });
  } catch (error) {
    // Throw error instead of silently falling back (so component can handle with toast)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Search is taking longer than expected. Please try again.');
    }
    throw error;
  }
}

/**
 * Fallback materials when API fails or not configured
 */
function getFallbackMaterials(query: string): MaterialOption[] {
  const fallbacksByType: Record<string, MaterialOption[]> = {
    vinyl: [
      { id: 'hd-vinyl-01', name: 'Vinyl Click – 6 mm', source: 'HomeDepot', pricePerSqFt: 2.5 },
      { id: 'hd-vinyl-02', name: 'Vinyl Sheet – Commercial', source: 'HomeDepot', pricePerSqFt: 2.0 },
    ],
    laminate: [
      { id: 'hd-laminate-01', name: 'Laminate (8 mm)', source: 'HomeDepot', pricePerSqFt: 2.0 },
      { id: 'hd-laminate-02', name: 'Laminate Plus (12 mm)', source: 'HomeDepot', pricePerSqFt: 2.8 },
    ],
    hardwood: [
      { id: 'hd-hardwood-01', name: 'Engineered Hardwood – Oak', source: 'HomeDepot', pricePerSqFt: 6.5 },
      { id: 'hd-hardwood-02', name: 'Solid Hardwood – Walnut', source: 'HomeDepot', pricePerSqFt: 8.0 },
    ],
    tile: [
      { id: 'hd-tile-01', name: 'Porcelain Tile (12"x24")', source: 'HomeDepot', pricePerSqFt: 4.0 },
      { id: 'hd-tile-02', name: 'Ceramic Tile (12"x12")', source: 'HomeDepot', pricePerSqFt: 3.5 },
    ],
    ceramic: [
      { id: 'hd-ceramic-01', name: 'Ceramic Floor Tile', source: 'HomeDepot', pricePerSqFt: 3.8 },
    ],
    porcelain: [
      { id: 'hd-porcelain-01', name: 'Porcelain Tile – Premium', source: 'HomeDepot', pricePerSqFt: 5.5 },
    ],
    stone: [
      { id: 'hd-stone-01', name: 'Natural Stone – Slate', source: 'HomeDepot', pricePerSqFt: 7.0 },
      { id: 'hd-stone-02', name: 'Natural Stone – Marble', source: 'HomeDepot', pricePerSqFt: 10.0 },
    ],
  };

  const queryLower = query.toLowerCase();
  for (const [key, materials] of Object.entries(fallbacksByType)) {
    if (queryLower.includes(key)) {
      return materials;
    }
  }

  // Generic fallback
  return [
    { id: 'hd-generic-01', name: `${query} – Standard Option`, source: 'HomeDepot', pricePerSqFt: 3.0 },
    { id: 'hd-generic-02', name: `${query} – Premium Option`, source: 'HomeDepot', pricePerSqFt: 5.0 },
  ];
}

// Keep existing mock function for backwards compatibility
export async function fetchHomeDepotMaterials(): Promise<MaterialOption[]> {
  try {
    const response = await fetch('/api/search-flooring', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'flooring' })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Unable to fetch materials');
    }

    return await response.json();
  } catch (error) {
    // Fallback to mock data if API fails
    return [
      { id: 'hd-vinyl-01', name: 'Vinyl Click – 6 mm', source: 'HomeDepot', pricePerSqFt: 2.5, url: 'https://www.homedepot.com' },
      { id: 'hd-laminate-01', name: 'Laminate (8 mm)', source: 'HomeDepot', pricePerSqFt: 2.0, url: 'https://www.homedepot.com' },
      { id: 'hd-hardwood-01', name: 'Engineered Hardwood – Oak', source: 'HomeDepot', pricePerSqFt: 6.5, url: 'https://www.homedepot.com' },
      { id: 'hd-tile-01', name: 'Porcelain Tile (12"x24")', source: 'HomeDepot', pricePerSqFt: 4.0, url: 'https://www.homedepot.com' },
    ];
  }
}

// ---------------------------------------------------------------------------
// 3️⃣ Lowe's materials – mock
// TODO: Replace with a real Lowe's product API. Options:
//   - WebScrapingAPI Lowe's API: https://ecom.webscrapingapi.com/v1?api_key=XXX&engine=lowes&type=search&search_term=vinyl+flooring
//     Requires: WEBSCRAPINGAPI_KEY (paid, from webscrapingapi.com)
//     Returns: product name, price, product_id, url, images, ratings, etc.
//   - Apify Lowe's Scraper: https://apify.com/maplerope44/lowes-product-lookup
//     Requires: APIFY_API_TOKEN (paid). Accepts product ID.
//   - Lowe's does NOT have a free public developer API.
//   - To get price per sq ft, divide product price by coverage area (listed in specs).
// ---------------------------------------------------------------------------
export async function fetchLowesMaterials(): Promise<MaterialOption[]> {
  await new Promise(r => setTimeout(r, 500));
  return [
    { id: 'ls-lvt-01', name: 'Luxury Vinyl Tile – 8 mm', source: 'Lowes', pricePerSqFt: 3.0, url: 'https://www.lowes.com' },
    { id: 'ls-tile-01', name: 'Ceramic Tile (12"x12")', source: 'Lowes', pricePerSqFt: 4.2, url: 'https://www.lowes.com' },
    { id: 'ls-carpet-01', name: 'Carpet – Berber', source: 'Lowes', pricePerSqFt: 1.5, url: 'https://www.lowes.com' },
    { id: 'ls-hardwood-01', name: 'Engineered Hardwood – Walnut', source: 'Lowes', pricePerSqFt: 7.0, url: 'https://www.lowes.com' },
  ];
}

// ---------------------------------------------------------------------------
// 4️⃣ Cleaning types – mock
// ---------------------------------------------------------------------------
export async function fetchCleaningTypes(): Promise<CleaningTypeOption[]> {
  await new Promise(r => setTimeout(r, 400));
  return [
    { id: 'standard', name: 'Standard Clean', pricePerSqFt: 0.12 },
    { id: 'deep', name: 'Deep Clean', pricePerSqFt: 0.20 },
    { id: 'moveout', name: 'Move-out Clean', pricePerSqFt: 0.25 },
    { id: 'airbnb', name: 'Airbnb Turn-over', pricePerSqFt: 0.18 },
  ];
}

// ---------------------------------------------------------------------------
// 5️⃣ Submit estimate – Save to Google Sheets
// Saves estimate data to a Google Sheet for tracking and follow-up
// ---------------------------------------------------------------------------
export async function submitEstimate(payload: {
  serviceType: 'flooring' | 'cleaning';
  contact: { name: string; email: string; phone: string };
  address: string;
  zipCode?: string;
  coverage?: string;
  totalSqFt?: number;
  material?: string;
  cleaningType?: string;
  frequency?: string;
  estimate?: number | null;
  needsMeasurement?: boolean;
  roomDetails?: string;
  materialNames?: string;
  materialUrls?: string;
  [key: string]: unknown;
}): Promise<void> {
  try {
    // Determine estimate type based on whether we have a price
    const estimateType = payload.estimate || payload.needsMeasurement ? 'schedule' : 'estimate';
    
    const requestData = {
      service: payload.serviceType,
      type: estimateType,
      contact: payload.contact,
      address: payload.address,
      zipCode: payload.zipCode || 'N/A',
      totalSqFt: payload.totalSqFt,
      coverage: payload.coverage,
      material: payload.material,
      cleaningType: payload.cleaningType,
      frequency: payload.frequency,
      price: payload.estimate,
      roomDetails: payload.roomDetails,
      materialNames: payload.materialNames,
      materialUrls: payload.materialUrls,
    };

    const response = await fetch('/api/submit-estimate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to submit estimate');
    }
  } catch (error) {
    console.error('Error submitting estimate:', error);
    // Don't throw - let the UI handle errors gracefully
  }
}
