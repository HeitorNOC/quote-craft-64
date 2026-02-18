import { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import { fetchHomeDepotMaterials, fetchLowesMaterials } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import type { MaterialOption, ManualMaterial, MaterialSource } from '@/types';

interface MaterialSelectorProps {
  onSelect: (material: MaterialOption | null, manualMaterial: ManualMaterial | null, source: MaterialSource) => void;
}

const MaterialSelector = ({ onSelect }: MaterialSelectorProps) => {
  const [hdMaterials, setHdMaterials] = useState<MaterialOption[]>([]);
  const [lsMaterials, setLsMaterials] = useState<MaterialOption[]>([]);
  const [loadingHd, setLoadingHd] = useState(true);
  const [loadingLs, setLoadingLs] = useState(true);
  const [selectedHd, setSelectedHd] = useState('');
  const [selectedLs, setSelectedLs] = useState('');
  const [manualName, setManualName] = useState('');
  const [manualPrice, setManualPrice] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchHomeDepotMaterials()
      .then(setHdMaterials)
      .catch(() => {
        toast({ 
          title: 'Failed to load Home Depot materials', 
          description: 'Please try again or choose another provider',
          variant: 'destructive' 
        });
      })
      .finally(() => setLoadingHd(false));

    fetchLowesMaterials()
      .then(setLsMaterials)
      .catch(() => {
        toast({ 
          title: 'Failed to load Lowe\'s materials', 
          description: 'Please try again or choose another provider',
          variant: 'destructive' 
        });
      })
      .finally(() => setLoadingLs(false));
  }, [toast]);

  const handleSelectHd = useCallback((id: string) => {
    setSelectedHd(id);
    const mat = hdMaterials.find(m => m.id === id) || null;
    if (mat) onSelect(mat, null, 'HomeDepot');
  }, [hdMaterials, onSelect]);

  const handleSelectLs = useCallback((id: string) => {
    setSelectedLs(id);
    const mat = lsMaterials.find(m => m.id === id) || null;
    if (mat) onSelect(mat, null, 'Lowes');
  }, [lsMaterials, onSelect]);

  const handleManual = useCallback(() => {
    const price = parseFloat(manualPrice);
    if (!manualName.trim() || isNaN(price) || price <= 0) {
      toast({ title: 'Enter a valid name and price', variant: 'destructive' });
      return;
    }
    onSelect(null, { name: manualName.trim(), pricePerSqFt: price }, 'Manual');
  }, [manualName, manualPrice, onSelect, toast]);

  const renderMaterialList = (materials: MaterialOption[], selected: string, onSelectFn: (id: string) => void, loading: boolean) => {
    if (loading) return <LoadingSpinner text="Loading materials..." />;
    return (
      <div className="space-y-3">
        <Select value={selected} onValueChange={onSelectFn}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a material" />
          </SelectTrigger>
          <SelectContent className="max-h-[250px]">
            {materials.map(m => (
              <SelectItem key={m.id} value={m.id}>
                {m.name} — ${m.pricePerSqFt.toFixed(2)}/sq ft
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selected && (() => {
          const mat = materials.find(m => m.id === selected);
          return mat?.url ? (
            <a href={mat.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-brand-navy hover:underline">
              View product <ExternalLink className="h-3 w-3" />
            </a>
          ) : null;
        })()}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Choose your flooring material</h3>
      <Tabs defaultValue="homedepot" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="homedepot">Home Depot</TabsTrigger>
          <TabsTrigger value="lowes">Lowe's</TabsTrigger>
          <TabsTrigger value="manual">Manual</TabsTrigger>
        </TabsList>
        <TabsContent value="homedepot" className="mt-4">
          {renderMaterialList(hdMaterials, selectedHd, handleSelectHd, loadingHd)}
        </TabsContent>
        <TabsContent value="lowes" className="mt-4">
          {renderMaterialList(lsMaterials, selectedLs, handleSelectLs, loadingLs)}
        </TabsContent>
        <TabsContent value="manual" className="mt-4 space-y-3">
          <Input placeholder="Material name" value={manualName} onChange={e => setManualName(e.target.value)} />
          <Input type="number" placeholder="Price per sq ft (USD)" min={0.01} step={0.01} value={manualPrice} onChange={e => setManualPrice(e.target.value)} />
          <Button onClick={handleManual} className="w-full" disabled={!manualName.trim() || !manualPrice}>
            Use This Material
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MaterialSelector;
