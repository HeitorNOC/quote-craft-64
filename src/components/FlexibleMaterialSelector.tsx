import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useHomeDepotSearch } from '@/hooks/useHomeDepotSearch';
import { fetchHomeDepotMaterials } from '@/lib/api';
import type { MaterialOption, MaterialSource } from '@/types';

interface FlexibleMaterialSelectorProps {
  onSelect: (material: MaterialOption | null, manual: { name: string; pricePerSqFt: number } | null, source: MaterialSource | 'Manual') => void;
  flooringType?: string;
  zipCode?: string;
}

/**
 * Flexible Material Selector with 3 options:
 * 1. Home Depot Search (via SerpAPI)
 * 2. Manual Input
 * 3. Suggested Materials
 */
export default function FlexibleMaterialSelector({ onSelect, flooringType, zipCode }: FlexibleMaterialSelectorProps) {
  const [tab, setTab] = useState<'search' | 'manual' | 'suggestions'>('search');
  const [searchQuery, setSearchQuery] = useState(flooringType || '');
  const [manualName, setManualName] = useState('');
  const [manualPrice, setManualPrice] = useState('');
  const [suggestions, setSuggestions] = useState<MaterialOption[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const { toast } = useToast();

  const { results: searchResults, loading: searchLoading, error: searchError, search } = useHomeDepotSearch();

  // Load suggestions on mount
  useEffect(() => {
    const loadSuggestions = async () => {
      setSuggestionsLoading(true);
      try {
        const data = await fetchHomeDepotMaterials();
        setSuggestions(data);
      } finally {
        setSuggestionsLoading(false);
      }
    };
    loadSuggestions();
  }, []);

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

  const handleSuggestionSelect = (material: MaterialOption) => {
    onSelect(material, null, material.source);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Choose Your Material</h2>
        <p className="text-gray-600 mt-2">Search Home Depot, enter manually, or use our suggestions</p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="search">🔍 Search Home Depot</TabsTrigger>
          <TabsTrigger value="manual">✏️ Manual Entry</TabsTrigger>
          <TabsTrigger value="suggestions">💡 Suggestions</TabsTrigger>
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
              ⚠️ {searchError}. Using suggested materials.
            </div>
          )}

          {searchLoading && <LoadingSpinner text="Searching Home Depot products..." />}

          {searchResults.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                {searchResults.length} results found:
              </p>
              <div className="scrollable-material-list border-2 border-blue-300">
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
              Confirm Manual Material
            </Button>
          </form>

          <Card className="p-4 bg-blue-50 border border-blue-200">
            <p className="text-sm text-blue-900">
              💡 Use this option if you already know the material and exact price.
            </p>
          </Card>
        </TabsContent>

        {/* Tab 3: Suggestions */}
        <TabsContent value="suggestions" className="space-y-4">
          {suggestionsLoading && <LoadingSpinner text="Loading suggestions..." />}

          {suggestions.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Suggested Materials:</p>
              <div className="scrollable-material-list border-2 border-green-300">
                {suggestions.map((material) => (
                  <Card
                    key={material.id}
                    className="p-4 cursor-pointer hover:shadow-md hover:bg-green-50 transition-all"
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
                          <p className="text-xs text-gray-500 mt-1">{material.source}</p>
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
                                🔗 View
                              </Button>
                            )}

                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-xs"
                              onClick={() => handleSuggestionSelect(material)}
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
      </Tabs>

      <div className="text-center text-xs text-gray-500 border-t pt-4">
        <p>
          ✓ Precise search: Home Depot | ✏️ Customize: Manual | 💡 Quick: Suggestions
        </p>
      </div>
    </div>
  );
}
