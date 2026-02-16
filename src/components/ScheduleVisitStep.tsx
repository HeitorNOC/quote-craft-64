import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CalendarCheck, AlertTriangle } from 'lucide-react';
import { submitEstimate } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from './LoadingSpinner';

interface ScheduleVisitStepProps {
  serviceType: 'flooring' | 'cleaning';
  contact: { name: string; email: string; phone: string };
  address?: string;
  coverageType: string;
  onDone: () => void;
}

const ScheduleVisitStep = ({ serviceType, contact, address, coverageType, onDone }: ScheduleVisitStepProps) => {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await submitEstimate({
        serviceType,
        contact,
        address: address || 'Not provided',
        coverageType,
        needsMeasurement: true,
        estimate: null,
      });
      toast({ title: 'Request submitted!', description: 'We\'ll contact you to schedule a measurement visit.' });
      onDone();
    } catch {
      toast({ title: 'Submission failed', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-center">
      <CalendarCheck className="h-12 w-12 mx-auto text-primary" />
      <h2 className="text-xl font-display font-bold">Schedule a Measurement Visit</h2>

      <Card className="p-6 bg-muted/30 text-left space-y-3">
        <p className="text-sm text-muted-foreground">
          Since we don't have the room measurements, we'll need to schedule an on-site visit to measure your space and provide an accurate estimate.
        </p>
        <div className="border-t border-border pt-3 space-y-1">
          <p className="text-sm"><strong>Name:</strong> {contact.name}</p>
          <p className="text-sm"><strong>Email:</strong> {contact.email}</p>
          <p className="text-sm"><strong>Phone:</strong> {contact.phone}</p>
          {address && <p className="text-sm"><strong>Address:</strong> {address}</p>}
          <p className="text-sm"><strong>Service:</strong> {serviceType === 'flooring' ? 'Flooring' : 'Cleaning'}</p>
          <p className="text-sm"><strong>Coverage:</strong> Specific rooms (measurements needed)</p>
        </div>
      </Card>

      <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 text-sm">
        <AlertTriangle className="h-4 w-4 mt-0.5 text-secondary flex-shrink-0" />
        <p className="text-left text-muted-foreground">
          There's no charge for the measurement visit. We'll provide your estimate after taking measurements on-site.
        </p>
      </div>

      <Button size="lg" className="w-full" onClick={handleSubmit} disabled={submitting}>
        {submitting ? <LoadingSpinner text="Submitting..." /> : 'Request Measurement Visit'}
      </Button>
    </div>
  );
};

export default ScheduleVisitStep;
