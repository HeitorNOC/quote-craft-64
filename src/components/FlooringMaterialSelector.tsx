import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useHomeDepotSearch } from '@/hooks/useHomeDepotSearch';
import type { MaterialOption, MaterialSource } from '@/types';

interface FlooringMaterialSelectorProps {
  onSelect: (material: MaterialOption | null, manual: { name: string; pricePerSqFt: number } | null, source: MaterialSource) => void;
  flooringType?: string;
}

/**
 * Simplified Material Selector for Flooring Wizard
 * 2 Tabs only:
 * 1. Home Depot Search (via SerpAPI)
 * 2. Manual Input
 */
export default function FlooringMaterialSelector({ onSelect, flooringType }: FlooringMaterialSelectorProps) {
  const [tab, setTab] = useState<'search' | 'manual'>('search');
  const [searchQuery, setSearchQuery] = useState(flooringType || '');
  const [manualName, setManualName] = useState('');
  const [manualPrice, setManualPrice] = useState('');

  const { results: searchResults, loading: searchLoading, error: searchError, search, requestsRemaining, nextRequestAvailable } = useHomeDepotSearch();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      search(searchQuery);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(manualPrice);

    if (!manualName.trim() || isNaN(price) || price <= 0) {
      alert('Please enter a valid name and price');
      return;
    }

    onSelect(null, { name: manualName, pricePerSqFt: price }, 'Manual');
  };

  const handleSearchSelect = (material: MaterialOption) => {
    onSelect(material, null, 'HomeDepot');
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Choose Your Material</h2>
        <p className="text-gray-600 mt-2">Search Home Depot or enter manually</p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search">🔍 Home Depot</TabsTrigger>
          <TabsTrigger value="manual">✏️ Manual</TabsTrigger>
        </TabsList>

        {/* Tab 1: Search Home Depot */}
        <TabsContent value="search" className="space-y-4">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Search Home Depot
              </label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Ex: vinyl flooring, ceramic tile..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={searchLoading}
                />
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={searchLoading || !searchQuery.trim() || requestsRemaining <= 0}
                >
                  {searchLoading ? 'Searching...' : 'Search'}
                </Button>
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">
                  💡 Enter the flooring type you're looking for
                </p>
                <p className={`text-xs font-medium ${requestsRemaining > 3 ? 'text-green-600' : requestsRemaining > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {requestsRemaining > 0 
                    ? `🔄 ${requestsRemaining} searches remaining` 
                    : nextRequestAvailable
                    ? `⏸️ Next available in ${nextRequestAvailable.toLocaleTimeString()}`
                    : '⏸️ Limit reached'
                  }
                </p>
              </div>
            </div>
          </form>

          {searchError && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
              ⚠️ {searchError}
            </div>
          )}

          {searchLoading && <LoadingSpinner text="Searching Home Depot products..." />}

          {searchResults.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                {searchResults.length} results found:
              </p>
              <div className="grid gap-3">
                {searchResults.map((material) => (
                  <Card
                    key={material.id}
                    className="p-4 cursor-pointer hover:shadow-md hover:bg-blue-50 transition-all"
                    onClick={() => handleSearchSelect(material)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900">{material.name}</p>
                        <p className="text-xs text-gray-500">Home Depot</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">
                          R$ {material.pricePerSqFt.toFixed(2)}/m²
                        </p>
                        <Button size="sm" variant="outline">
                          Select
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {!searchLoading && searchResults.length === 0 && searchQuery && !searchError && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
              No results found. Try another search term or use the "Manual" tab.
            </div>
          )}
        </TabsContent>

        {/* Tab 2: Manual Input */}
        <TabsContent value="manual" className="space-y-4">
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Material Name
              </label>
              <Input
                type="text"
                placeholder="Ex: Vinyl flooring, ceramic tile..."
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Price per sq ft (USD)
              </label>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="Ex: 25.50"
                value={manualPrice}
                onChange={(e) => setManualPrice(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={!manualName.trim() || !manualPrice}
            >
              Confirm Material
            </Button>
          </form>

          <Card className="p-4 bg-blue-50 border border-blue-200">
            <p className="text-sm text-blue-900">
              💡 Use this option if you already know the material and price.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
