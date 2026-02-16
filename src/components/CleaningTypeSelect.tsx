import { useState, useEffect, useCallback } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import LoadingSpinner from './LoadingSpinner';
import { fetchCleaningTypes } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import type { CleaningTypeOption } from '@/types';

interface CleaningTypeSelectProps {
  onSelect: (type: CleaningTypeOption) => void;
}

const CleaningTypeSelect = ({ onSelect }: CleaningTypeSelectProps) => {
  const [types, setTypes] = useState<CleaningTypeOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchCleaningTypes()
      .then(setTypes)
      .catch(() => toast({ title: 'Error loading cleaning types', variant: 'destructive' }))
      .finally(() => setLoading(false));
  }, [toast]);

  const handleSelect = useCallback((id: string) => {
    setSelected(id);
    const t = types.find(t => t.id === id);
    if (t) onSelect(t);
  }, [types, onSelect]);

  if (loading) return <LoadingSpinner text="Loading cleaning options..." />;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Select cleaning type</h3>
      <Select value={selected} onValueChange={handleSelect}>
        <SelectTrigger>
          <SelectValue placeholder="Choose a cleaning type" />
        </SelectTrigger>
        <SelectContent>
          {types.map(t => (
            <SelectItem key={t.id} value={t.id}>
              {t.name} — ${t.pricePerSqFt.toFixed(2)}/sq ft
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selected && (
        <Button className="w-full" onClick={() => {
          const t = types.find(t => t.id === selected);
          if (t) onSelect(t);
        }}>
          Continue
        </Button>
      )}
    </div>
  );
};

export default CleaningTypeSelect;
