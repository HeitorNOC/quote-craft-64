import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, DollarSign, ExternalLink } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { submitEstimate } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from './LoadingSpinner';
import type { RoomMaterial } from '@/types';

interface EstimateCardProps {
  estimate: number;
  flatFee: number;
  totalSqFt: number;
  pricePerSqFt: number;
  serviceType: 'flooring' | 'cleaning';
  contact: { name: string; email: string; phone: string };
  address: string;
  zipCode: string;
  coverage?: string;
  material?: string;
  cleaningType?: string;
  frequency?: string;
  roomMaterials?: RoomMaterial[];
  onSchedule: () => void;
}

const EstimateCard = ({ estimate, flatFee, totalSqFt, pricePerSqFt, serviceType, contact, address, zipCode, coverage, material, cleaningType, frequency, roomMaterials, onSchedule }: EstimateCardProps) => {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  // Format room materials for submission
  const formatRoomDetails = (): string => {
    if (!roomMaterials || roomMaterials.length === 0) return '';
    return roomMaterials
      .map((rm) => {
        const matName = rm.material?.name || rm.manualName || 'Unknown';
        const price = rm.material?.pricePerSqFt || rm.manualPrice || 0;
        const roomCost = rm.sqFt * price;
        const urlPart = rm.url ? ` [${rm.url}]` : '';
        return `${rm.room} (${rm.sqFt} sqft) → ${matName} @ $${price.toFixed(2)}/sqft = $${roomCost.toFixed(2)}${urlPart}`;
      })
      .join(' | ');
  };

  const formatMaterialNames = (): string => {
    if (!roomMaterials || roomMaterials.length === 0) return '';
    return roomMaterials
      .map((rm) => {
        const matName = rm.material?.name || rm.manualName || 'Unknown';
        return `${rm.room}: ${matName}`;
      })
      .join(' | ');
  };

  const formatMaterialUrls = (): string => {
    if (!roomMaterials || roomMaterials.length === 0) return '';
    return roomMaterials
      .filter((rm) => rm.url)
      .map((rm) => {
        const matName = rm.material?.name || rm.manualName || 'N/A';
        return `${rm.room} (${matName}): ${rm.url}`;
      })
      .join(' | ');
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await submitEstimate({
        serviceType,
        estimate,
        totalSqFt,
        pricePerSqFt,
        flatFee,
        contact,
        address,
        zipCode,
        coverage,
        material,
        cleaningType,
        frequency,
        roomDetails: formatRoomDetails(),
        materialNames: formatMaterialNames(),
        materialUrls: formatMaterialUrls(),
      });
      toast({ title: 'Estimate submitted!', description: 'We\'ll be in touch soon.' });
      onSchedule();
    } catch {
      toast({ title: 'Submission failed', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 text-center">
      <DollarSign className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-secondary flex-shrink-0" />
      <h2 className="text-lg sm:text-xl md:text-2xl font-display font-bold">Your Estimate</h2>

      <Card className="p-4 sm:p-5 md:p-6 bg-muted/30 border-secondary/30">
        <div className="space-y-1.5 sm:space-y-2">
          {roomMaterials && roomMaterials.length > 0 ? (
            <>
              {roomMaterials.map((rm) => {
                const price = rm.material?.pricePerSqFt || rm.manualPrice || 0;
                const roomCost = rm.sqFt * price;
                const matName = rm.material?.name || rm.manualName || 'Unknown';
                return (
                  <div key={rm.room} className="space-y-1 sm:space-y-2 py-2 sm:py-3 border-b border-border/30 last:border-b-0">
                    <div className="flex justify-between items-start gap-2">
                      <div className="text-left">
                        <div className="font-medium text-foreground text-xs sm:text-sm">{rm.room}</div>
                        <div className="text-xs text-muted-foreground">{rm.sqFt} sq.ft</div>
                      </div>
                      <span className="font-semibold text-foreground text-xs sm:text-sm flex-shrink-0">{formatCurrency(roomCost)}</span>
                    </div>
                    <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-1.5 sm:p-2 rounded text-xs">
                      <div className="min-w-0">
                        <div className="font-medium text-gray-900 dark:text-gray-100 truncate">{matName}</div>
                        <div className="text-gray-600 dark:text-gray-400 text-xs">@${price.toFixed(2)}/sqft</div>
                      </div>
                      {rm.url && (
                        <a 
                          href={rm.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 flex-shrink-0"
                          title="View product"
                        >
                          <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
              <div className="border-t border-border my-2 sm:my-3" />
              <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
                <span>Subtotal:</span>
                <span>{formatCurrency(estimate)}</span>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs sm:text-sm text-muted-foreground">Total area: {totalSqFt.toLocaleString()} sq ft</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Rate: {formatCurrency(pricePerSqFt)}/sq ft</p>
              <div className="border-t border-border my-2 sm:my-3" />
            </>
          )}
          <p className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground">
            {formatCurrency(estimate)}
          </p>
        </div>
      </Card>

      <div className="flex items-start gap-2 p-2.5 sm:p-3 rounded-lg bg-brand-warm-light text-xs sm:text-sm">
        <AlertTriangle className="h-4 w-4 mt-0.5 text-secondary flex-shrink-0" />
        <p className="text-left text-muted-foreground">
          This is a preliminary estimate. Final pricing will be confirmed after an on-site visit.
        </p>
      </div>

      <Button size="lg" className="w-full text-xs sm:text-sm" onClick={handleSubmit} disabled={submitting}>
        {submitting ? <LoadingSpinner text="Submitting..." /> : 'Submit & Schedule a Visit'}
      </Button>
    </div>
  );
};

export default EstimateCard;
