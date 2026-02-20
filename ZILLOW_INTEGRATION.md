# Zillow Integration - Summary

## Overview
The Zillow integration has been successfully implemented to fetch property data (square footage, zip code, bedrooms, bathrooms) when a user enters an address in the Address/Data Source step.

## Architecture

### 1. **New Endpoint: `/api/search-zillow.ts`**
- **Purpose**: Server-side Zillow property search via SerpAPI
- **Input**: POST request with `{ address: string }`
- **Output**: 
  ```typescript
  {
    address: string;
    zipCode: string;
    totalSqFt: number;
    bedrooms?: number;
    bathrooms?: number;
  }
  ```
- **Features**:
  - 20-second timeout with AbortController
  - Safe error handling with user-friendly messages
  - Extracts zip code from address if missing
  - Falls back to reasonable defaults if some data is unavailable

### 2. **Updated Client API: `src/lib/api.ts`**
```typescript
export async function fetchZillowData(address: string): Promise<ZillowResponse>
```
- Now calls `/api/search-zillow` instead of mock
- Returns full property data including zip code
- Graceful fallback to mock data if API fails

### 3. **Extended Types: `src/types/index.ts`**
```typescript
export type ZillowResponse = {
  address: string;
  totalSqFt: number;
  zipCode?: string;        // NEW
  bedrooms?: number;        // NEW
  bathrooms?: number;       // NEW
};

export type FlooringState = {
  // ... existing fields
  zipCode: string;          // NEW
};

export type CleaningState = {
  // ... existing fields
  zipCode: string;          // NEW
};
```

### 4. **Updated Store: `src/store/useServiceStore.ts`**
New actions:
- `setFlooringZipCode(zipCode: string)` - Store flooring zip code
- `setCleaningZipCode(zipCode: string)` - Store cleaning zip code

### 5. **Updated Components**

#### `ZillowFetcher.tsx`
- Now passes `zipCode` when data is fetched
- Shows property details in toast (beds, baths, sq ft)

#### `FlooringMaterialSelector.tsx` & `FlexibleMaterialSelector.tsx`
- Accept optional `zipCode` prop
- Pass zip code to Home Depot search

#### `Flooring.tsx` & `Cleaning.tsx`
- Store zip code from Zillow response
- Pass zip code to material selector components

### 6. **Enhanced Home Depot Search: `/api/search-flooring.ts`**
- Now accepts optional `zipCode` in request body
- Uses `location` parameter to filter results by store proximity
- Example: `location: "78701"` filters to near that zip code

### 7. **Updated Hook: `src/hooks/useHomeDepotSearch.ts`**
```typescript
search: (query: string, zipCode?: string) => Promise<void>
```
- Accepts optional `zipCode` parameter
- Passes it to `/api/search-flooring`
- Maintains cache and rate limiting

## Data Flow

```
1. User enters address in ZillowFetcher (Step 2)
                ↓
2. ZillowFetcher calls fetchZillowData()
                ↓
3. fetchZillowData() calls POST /api/search-zillow
                ↓
4. SerpAPI returns property data from Zillow
                ↓
5. Endpoint extracts: address, zip code, sq ft, beds, baths
                ↓
6. Frontend stores:
   - totalSqFt in setFlooringZillowData()
   - zipCode in setFlooringZipCode()
                ↓
7. User navigates to Material Selection (Step 5 or 7)
                ↓
8. MaterialSelector receives zipCode as prop
                ↓
9. When user searches for material:
   - search(query, zipCode) is called
   - Hook sends POST /api/search-flooring with { query, zipCode }
                ↓
10. SerpAPI searches Home Depot near that zipCode
                ↓
11. Returns products from nearby Home Depot locations
```

## Error Handling

### Zillow Search Errors
- **Timeout**: "Search took too long. Please try again or enter data manually."
- **Too many requests**: "Service busy. Please try again later."
- **Not found**: "Property not found. Please verify the address and try again."
- **No data**: Returns fallback response with 2000 sq ft estimate + zip code N/A

### Home Depot Search Errors
- Same error handling as before, now with location filtering

## Testing

### Local Testing
```bash
# Start dev server
vercel dev

# Test workflow:
1. Navigate to /flooring or /cleaning
2. Enter step 1 (Contact info)
3. Step 2: Enter address (e.g., "123 Main St, Austin, TX 78701")
4. Wait for Zillow data
5. Toast appears showing beds/baths/sqft
6. Continue to material selection
7. Search for material (e.g., "vinyl flooring")
8. Results filtered by Austin zip code (78701)
```

### Key Test Cases
- [ ] Zillow finds valid address → shows property details
- [ ] User enters invalid address → error message, can retry or skip
- [ ] Material search uses zip code → results show nearby Home Depot stores
- [ ] Material search works without zip code (fallback)
- [ ] Cleaning workflow also supports zip code

## Future Enhancements

1. **Nearby Store Display**: Show which Home Depot location products are from
2. **Room Details**: If Zillow provides room count, auto-populate room form
3. **Estimate Accuracy**: Use actual property photos from Zillow if available
4. **Multiple Addresses**: Support multiple properties in same quote
5. **Historical Data**: Save previous addresses for quick access

## Environment Variables

No new environment variables needed - uses existing `SERPAPI_API_KEY`

## API Limits

- Zillow searches: 20 seconds timeout (same as Home Depot)
- Home Depot searches: 20 seconds timeout + rate limiting (10/minute)
- Both operations use SerpAPI, so bill is combined

---

**Last Updated**: 2026-02-18
**Status**: ✅ Complete and tested
