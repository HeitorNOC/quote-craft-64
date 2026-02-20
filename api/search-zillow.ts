import type { VercelRequest, VercelResponse } from '@vercel/node';

interface PropertyData {
  address: string;
  zipCode: string;
  totalSqFt: number;
  bedrooms?: number;
  bathrooms?: number;
  found: boolean;
}

/**
 * Vercel Serverless Function
 * Address validation for manual property data entry
 * 
 * Usage: POST /api/search-zillow
 * Body: { address: "123 Main St, Austin, TX 78701" }
 * Response: PropertyData with address parsed (user must fill other fields manually)
 *
 * Note: This is a manual entry endpoint - user fills address, zip, and sqft
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

  const { address } = req.body;

  // Input validation
  if (!address || typeof address !== 'string') {
    res.status(400).json({ error: 'Invalid address' });
    return;
  }

  const cleanAddress = address.trim();

  if (cleanAddress.length > 200) {
    res.status(400).json({ error: 'Address too long' });
    return;
  }

  try {
    // Extract zip code from address if present (5 digit or 5+4 format)
    // US zip codes appear at the end of the address, after the state code
    const zipMatch = cleanAddress.match(/\s(\d{5}(?:-\d{4})?)$/);
    const extractedZip = zipMatch ? zipMatch[1] : '';

    // Return parsed address for user to complete manually
    res.status(200).json({
      address: cleanAddress,
      zipCode: extractedZip,
      totalSqFt: 0,
      found: false,
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Unable to process address. Please enter data manually.' 
    });
  }
}
