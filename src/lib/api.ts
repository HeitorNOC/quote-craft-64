import type { ZillowResponse, MaterialOption, CleaningTypeOption } from '@/types';

// ---------------------------------------------------------------------------
// 1️⃣ Zillow – mock
// TODO: Replace with a real property data API. Options:
//   - ZenRows Zillow API: https://realestate.api.zenrows.com/v1/targets/zillow/properties/{zpid}
//     Requires: ZENROWS_API_KEY (paid). Returns living area, lot size, bedrooms, etc.
//   - Apify Zillow Scraper: https://apify.com/zillowscraper/zillow-property-details
//     Requires: APIFY_API_TOKEN (paid). Accepts ZUID or URL.
//   - Zillow does NOT have a free public API. All options require third-party services.
//   - Note: Zillow provides total sq ft only, NOT individual room breakdowns.
// ---------------------------------------------------------------------------
export async function fetchZillowData(address: string): Promise<ZillowResponse> {
  await new Promise(r => setTimeout(r, 800));
  if (Math.random() < 0.1) throw new Error('Failed to fetch property data');
  return {
    address,
    totalSqFt: 2100,
  };
}

// ---------------------------------------------------------------------------
// 2️⃣ Home Depot materials – mock
// TODO: Replace with a real Home Depot product API. Options:
//   - BigBox API (by Traject Data): https://docs.trajectdata.com/bigboxapi/homedepot-product-data-api
//     Endpoint: GET https://api.bigboxapi.com/request?api_key=XXX&type=search&search_term=vinyl+flooring
//     Requires: BIGBOX_API_KEY (paid, from trajectdata.com)
//     Returns: product name, price, item_id, url, images, ratings, etc.
//   - Apify Home Depot Scraper: https://apify.com/maplerope44/home-depot-product-lookup
//     Requires: APIFY_API_TOKEN (paid). Accepts product ID + zip code.
//   - Home Depot does NOT have a free public developer API.
//   - To get price per sq ft, divide product price by coverage area (listed in specs).
// ---------------------------------------------------------------------------
export async function fetchHomeDepotMaterials(): Promise<MaterialOption[]> {
  await new Promise(r => setTimeout(r, 500));
  return [
    { id: 'hd-vinyl-01', name: 'Vinyl Click – 6 mm', source: 'HomeDepot', pricePerSqFt: 2.5, url: 'https://www.homedepot.com' },
    { id: 'hd-laminate-01', name: 'Laminate (8 mm)', source: 'HomeDepot', pricePerSqFt: 2.0, url: 'https://www.homedepot.com' },
    { id: 'hd-hardwood-01', name: 'Engineered Hardwood – Oak', source: 'HomeDepot', pricePerSqFt: 6.5, url: 'https://www.homedepot.com' },
    { id: 'hd-tile-01', name: 'Porcelain Tile (12"x24")', source: 'HomeDepot', pricePerSqFt: 4.0, url: 'https://www.homedepot.com' },
  ];
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
    { id: 'standard', name: 'Standard Clean (weekly)', pricePerSqFt: 0.12 },
    { id: 'deep', name: 'Deep Clean (bi-annual)', pricePerSqFt: 0.20 },
    { id: 'moveout', name: 'Move-out Clean', pricePerSqFt: 0.25 },
    { id: 'airbnb', name: 'Airbnb Turn-over', pricePerSqFt: 0.18 },
  ];
}

// ---------------------------------------------------------------------------
// 5️⃣ Submit estimate – mock
// TODO: Replace with POST to your backend (e.g., /api/quote or a form service)
// ---------------------------------------------------------------------------
export async function submitEstimate(payload: unknown): Promise<void> {
  console.log('🧾 Estimate submitted →', JSON.stringify(payload, null, 2));
  await new Promise(r => setTimeout(r, 800));
}
