import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { submitEstimate } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from './LoadingSpinner';

interface EstimateCardProps {
  estimate: number;
  flatFee: number;
  totalSqFt: number;
  pricePerSqFt: number;
  serviceType: 'flooring' | 'cleaning';
  contact: { name: string; email: string; phone: string };
  onSchedule: () => void;
}

const EstimateCard = ({ estimate, flatFee, totalSqFt, pricePerSqFt, serviceType, contact, onSchedule }: EstimateCardProps) => {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await submitEstimate({ serviceType, estimate, totalSqFt, pricePerSqFt, flatFee, contact });
      toast({ title: 'Estimate submitted!', description: 'We\'ll be in touch soon.' });
      onSchedule();
    } catch {
      toast({ title: 'Submission failed', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-center">
      <DollarSign className="h-12 w-12 mx-auto text-secondary" />
      <h2 className="text-xl font-display font-bold">Your Estimate</h2>

      <Card className="p-6 bg-muted/30 border-secondary/30">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Total area: {totalSqFt.toLocaleString()} sq ft</p>
          <p className="text-sm text-muted-foreground">Rate: {formatCurrency(pricePerSqFt)}/sq ft</p>
          <p className="text-sm text-muted-foreground">
            {serviceType === 'flooring' ? 'Visit fee' : 'Service fee'}: {formatCurrency(flatFee)}
          </p>
          <div className="border-t border-border my-3" />
          <p className="text-4xl font-display font-bold text-foreground">
            {formatCurrency(estimate)}
          </p>
        </div>
      </Card>

      <div className="flex items-start gap-2 p-3 rounded-lg bg-brand-warm-light text-sm">
        <AlertTriangle className="h-4 w-4 mt-0.5 text-secondary flex-shrink-0" />
        <p className="text-left text-muted-foreground">
          This is a preliminary estimate. Final pricing will be confirmed after an on-site visit. Visit fee may vary.
        </p>
      </div>

      <Button size="lg" className="w-full" onClick={handleSubmit} disabled={submitting}>
        {submitting ? <LoadingSpinner text="Submitting..." /> : 'Submit & Schedule a Visit'}
      </Button>
    </div>
  );
};

export default EstimateCard;
