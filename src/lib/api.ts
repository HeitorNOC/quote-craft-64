import type { ZillowResponse, MaterialOption, CleaningTypeOption } from '@/types';

// TODO: Replace with real Zillow API call using ZILLOW_API_KEY
export async function fetchZillowData(address: string): Promise<ZillowResponse> {
  await new Promise(r => setTimeout(r, 800));
  // Simulate random error ~10% of the time
  if (Math.random() < 0.1) throw new Error('Failed to fetch property data');
  return {
    address,
    totalSqFt: 2100,
    rooms: [
      { name: 'Living Room', sqFt: 350 },
      { name: 'Kitchen', sqFt: 240 },
      { name: 'Master Bedroom', sqFt: 300 },
      { name: 'Bedroom 2', sqFt: 250 },
      { name: 'Bedroom 3', sqFt: 220 },
      { name: 'Bathroom 1', sqFt: 120 },
      { name: 'Bathroom 2', sqFt: 80 },
      { name: 'Hallway/Utility', sqFt: 200 },
    ],
  };
}

// TODO: Replace with real Home Depot API
export async function fetchHomeDepotMaterials(): Promise<MaterialOption[]> {
  await new Promise(r => setTimeout(r, 500));
  return [
    { id: 'hd-vinyl-01', name: 'Vinyl Click – 6 mm', source: 'HomeDepot', pricePerSqFt: 2.5, url: 'https://www.homedepot.com' },
    { id: 'hd-laminate-01', name: 'Laminate (8 mm)', source: 'HomeDepot', pricePerSqFt: 2.0, url: 'https://www.homedepot.com' },
    { id: 'hd-hardwood-01', name: 'Engineered Hardwood – Oak', source: 'HomeDepot', pricePerSqFt: 6.5, url: 'https://www.homedepot.com' },
    { id: 'hd-tile-01', name: 'Porcelain Tile (12"x24")', source: 'HomeDepot', pricePerSqFt: 4.0, url: 'https://www.homedepot.com' },
  ];
}

// TODO: Replace with real Lowe's API
export async function fetchLowesMaterials(): Promise<MaterialOption[]> {
  await new Promise(r => setTimeout(r, 500));
  return [
    { id: 'ls-lvt-01', name: 'Luxury Vinyl Tile – 8 mm', source: 'Lowes', pricePerSqFt: 3.0, url: 'https://www.lowes.com' },
    { id: 'ls-tile-01', name: 'Ceramic Tile (12"x12")', source: 'Lowes', pricePerSqFt: 4.2, url: 'https://www.lowes.com' },
    { id: 'ls-carpet-01', name: 'Carpet – Berber', source: 'Lowes', pricePerSqFt: 1.5, url: 'https://www.lowes.com' },
    { id: 'ls-hardwood-01', name: 'Engineered Hardwood – Walnut', source: 'Lowes', pricePerSqFt: 7.0, url: 'https://www.lowes.com' },
  ];
}

export async function fetchCleaningTypes(): Promise<CleaningTypeOption[]> {
  await new Promise(r => setTimeout(r, 400));
  return [
    { id: 'standard', name: 'Standard Clean (weekly)', pricePerSqFt: 0.12 },
    { id: 'deep', name: 'Deep Clean (bi-annual)', pricePerSqFt: 0.20 },
    { id: 'moveout', name: 'Move-out Clean', pricePerSqFt: 0.25 },
    { id: 'airbnb', name: 'Airbnb Turn-over', pricePerSqFt: 0.18 },
  ];
}

// TODO: Replace with real backend POST endpoint
export async function submitEstimate(payload: unknown): Promise<void> {
  console.log('🧾 Estimate submitted →', JSON.stringify(payload, null, 2));
  await new Promise(r => setTimeout(r, 800));
}
