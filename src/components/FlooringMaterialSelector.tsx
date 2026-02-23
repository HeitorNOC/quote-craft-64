import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useHomeDepotSearch } from '@/hooks/useHomeDepotSearch';
import type { MaterialOption, MaterialSource } from '@/types';

interface FlooringMaterialSelectorProps {
  onSelect: (material: MaterialOption | null, manual: { name: string; pricePerSqFt: number } | null, source: MaterialSource) => void;
  flooringType?: string;
  zipCode?: string;
}

/**
 * Simplified Material Selector for Flooring Wizard
 * 2 Tabs only:
 * 1. Home Depot Search (via SerpAPI)
 * 2. Manual Input
 */
export default function FlooringMaterialSelector({ onSelect, flooringType, zipCode }: FlooringMaterialSelectorProps) {
  const [tab, setTab] = useState<'search' | 'manual'>('search');
  const [searchQuery, setSearchQuery] = useState(flooringType || '');
  const [manualName, setManualName] = useState('');
  const [manualPrice, setManualPrice] = useState('');
  const { toast } = useToast();

  const { results: searchResults, loading: searchLoading, error: searchError, search } = useHomeDepotSearch();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      search(searchQuery, zipCode);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(manualPrice);

    if (!manualName.trim() || isNaN(price) || price <= 0) {
      toast({
        title: 'Invalid input',
        description: 'Please enter a valid material name and price',
        variant: 'destructive',
      });
      return;
    }

    onSelect(null, { name: manualName, pricePerSqFt: price }, 'Manual');
  };

  const handleSearchSelect = (material: MaterialOption) => {
    onSelect(material, null, 'HomeDepot');
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-3">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Choose Your Material</h2>
        <p className="text-sm text-gray-600 mt-1">Search Home Depot or enter manually</p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search">🔍 Home Depot</TabsTrigger>
          <TabsTrigger value="manual">✏️ Manual</TabsTrigger>
        </TabsList>

        {/* Tab 1: Search Home Depot */}
        <TabsContent value="search" className="space-y-3">
          <form onSubmit={handleSearch} className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
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
                  disabled={searchLoading || !searchQuery.trim()}
                >
                  {searchLoading ? 'Searching...' : 'Search'}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                💡 Enter the flooring type you're looking for
              </p>
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
              <p className="text-xs font-medium text-gray-700">
                {searchResults.length} results found:
              </p>
              <div className="scrollable-material-list border border-blue-200">
                {searchResults.map((material) => (
                  <Card
                    key={material.id}
                    className="p-4 cursor-pointer hover:shadow-md hover:bg-blue-50 transition-all"
                  >
                    <div className="flex gap-4">
                      {/* Product Image */}
                      {material.image && (
                        <div className="flex-shrink-0">
                          <img
                            src={material.image}
                            alt={material.name}
                            className="w-24 h-24 object-cover rounded-md"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}

                      {/* Product Info */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <p className="font-semibold text-gray-900 line-clamp-2">{material.name}</p>
                          <p className="text-xs text-gray-500 mt-1">Home Depot</p>
                        </div>

                        {/* Price and Buttons */}
                        <div className="flex items-center justify-between mt-3">
                          <p className="font-bold text-blue-600">
                            ${material.pricePerSqFt.toFixed(2)}/sq ft
                          </p>

                          <div className="flex gap-2">
                            {material.url && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(material.url, '_blank')}
                                className="text-xs"
                              >
                                🔗 View at HD
                              </Button>
                            )}

                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-xs"
                              onClick={() => handleSearchSelect(material)}
                            >
                              Select
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}


        </TabsContent>

        {/* Tab 2: Manual Input */}
        <TabsContent value="manual" className="space-y-3">
          <form onSubmit={handleManualSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
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
