import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import { fetchZillowData } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface ZillowFetcherProps {
  onDataFetched: (totalSqFt: number, address: string) => void;
  onSkip: () => void;
}

const ZillowFetcher = ({ onDataFetched, onSkip }: ZillowFetcherProps) => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFetch = useCallback(async () => {
    if (!address.trim()) {
      toast({ title: 'Please enter an address', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const data = await fetchZillowData(address.trim());
      onDataFetched(data.totalSqFt, data.address);
    } catch {
      toast({ title: 'Error fetching property data', description: 'Please try again or enter data manually.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [address, onDataFetched, toast]);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <MapPin className="h-10 w-10 mx-auto text-secondary" />
        <h2 className="text-lg font-semibold">How would you like to provide property details?</h2>
        <p className="text-sm text-muted-foreground">
          Look up your property's total square footage via Zillow, or enter details manually.
        </p>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">Property Address</label>
        <div className="flex gap-2">
          <Input
            placeholder="e.g. 123 Main St, Austin, TX 78701"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
            disabled={loading}
          />
          <Button onClick={handleFetch} disabled={loading || !address.trim()}>
            {loading ? <LoadingSpinner text="" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-4">
          <LoadingSpinner text="Fetching square footage from Zillow..." />
        </div>
      )}

      <div className="relative">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">or</span>
        </div>
      </div>

      <Button variant="outline" className="w-full" onClick={onSkip} disabled={loading}>
        Enter details manually
      </Button>
    </div>
  );
};

export default ZillowFetcher;
