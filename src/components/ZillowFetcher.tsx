import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import { fetchZillowData } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface ZillowFetcherProps {
  onDataFetched: (totalSqFt: number, zipCode: string, address: string) => void;
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
      const zipCode = data.zipCode || '';
      onDataFetched(data.totalSqFt, zipCode, data.address);
      
      // Only show success toast if data was actually found from Zillow
      if (data.found) {
        if (data.bedrooms || data.bathrooms) {
          toast({
            title: 'Property found!',
            description: `${data.bedrooms ?? '?'} bed, ${data.bathrooms ?? '?'} bath - ${data.totalSqFt} sq ft`,
          });
        } else {
          toast({
            title: 'Property found!',
            description: `${data.totalSqFt} sq ft in ${zipCode}`,
          });
        }
      } else {
        // Data not found, show error and let user enter manually
        toast({ 
          title: 'Could not find property', 
          description: 'Please verify the address or enter data manually.', 
          variant: 'destructive' 
        });
      }
    } catch (error) {
      toast({ 
        title: 'Could not find property', 
        description: 'Please verify the address and try again, or enter data manually.', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  }, [address, onDataFetched, toast]);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <MapPin className="h-10 w-10 mx-auto text-secondary" />
        <h2 className="text-lg font-semibold">Find Your Property</h2>
        <p className="text-sm text-muted-foreground">
          Enter your address to look up property details from Zillow
        </p>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">Property Address</label>
        <div className="flex gap-2">
          <Input
            placeholder="e.g. 123 Main St, Austin, TX 78701"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !loading && handleFetch()}
            disabled={loading}
          />
          <Button onClick={handleFetch} disabled={loading || !address.trim()}>
            {loading ? <LoadingSpinner text="" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-4">
          <LoadingSpinner text="Searching Zillow..." />
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
