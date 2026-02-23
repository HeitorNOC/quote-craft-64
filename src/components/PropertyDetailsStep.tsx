import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PropertyDetailsStepProps {
  initialAddress?: string;
  initialZipCode?: string;
  initialSqFt?: number;
  onContinue: (address: string, zipCode: string, sqFt: number) => void;
}

const PropertyDetailsStep = ({ 
  initialAddress = '',
  initialZipCode = '',
  initialSqFt = 0, 
  onContinue 
}: PropertyDetailsStepProps) => {
  const [address, setAddress] = useState(initialAddress);
  const [zipCode, setZipCode] = useState(initialZipCode);
  const [sqFt, setSqFt] = useState(String(initialSqFt > 0 ? initialSqFt : ''));
  const { toast } = useToast();

  const handleContinue = useCallback(() => {
    if (!address.trim()) {
      toast({ title: 'Please enter your address', variant: 'destructive' });
      return;
    }

    if (!zipCode.trim()) {
      toast({ title: 'Please enter a zip code', variant: 'destructive' });
      return;
    }

    if (!/^\d{5}(-\d{4})?$/.test(zipCode.trim())) {
      toast({ title: 'Please enter a valid zip code (e.g., 12345 or 12345-6789)', variant: 'destructive' });
      return;
    }

    const sqFtNum = parseInt(sqFt, 10);
    
    if (!sqFt.trim() || isNaN(sqFtNum) || sqFtNum <= 0) {
      toast({ title: 'Please enter a valid square footage', variant: 'destructive' });
      return;
    }

    onContinue(address.trim(), zipCode.trim(), sqFtNum);
  }, [address, zipCode, sqFt, onContinue, toast]);

  const isPreFilled = initialSqFt > 0 && initialZipCode;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-lg sm:text-xl md:text-2xl font-display font-bold">Property Details</h2>
        <p className="text-xs sm:text-sm text-muted-foreground px-2">
          {isPreFilled 
            ? 'We found your property info. Please verify the details below.' 
            : 'Please enter your property details.'}
        </p>
      </div>

      <Card className="p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4 bg-card/50">
        <div>
          <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">Address</label>
          <Input
            type="text"
            placeholder="e.g., 123 Main St, Austin, TX 78701"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="text-xs sm:text-sm"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Your property address
          </p>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">Zip Code</label>
          <Input
            type="text"
            placeholder="e.g., 78701 or 78701-1234"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            maxLength={10}
            className="text-xs sm:text-sm"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Used to find your nearest Home Depot location
          </p>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">Total Square Footage</label>
          <Input
            type="number"
            placeholder="e.g., 2500"
            value={sqFt}
            onChange={(e) => setSqFt(e.target.value)}
            min="100"
            className="text-xs sm:text-sm"
            step="1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Used to calculate material quantity for your flooring project
          </p>
        </div>
      </Card>

      <Button 
        onClick={handleContinue} 
        className="w-full gap-2"
        disabled={!address.trim() || !zipCode.trim() || !sqFt.trim()}
      >
        Continue <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default PropertyDetailsStep;
