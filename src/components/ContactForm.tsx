import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, Phone } from 'lucide-react';
import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { submitEstimate } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface ContactFormProps {
  payload: Record<string, unknown>;
  onSuccess: () => void;
}

interface FormValues {
  email: string;
  phone: string;
}

const ContactForm = ({ payload, onSuccess }: ContactFormProps) => {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

  const onValid = async (data: FormValues) => {
    setSubmitting(true);
    try {
      await submitEstimate({ ...payload, contact: data });
      toast({ title: 'Estimate submitted!', description: 'We\'ll be in touch soon.' });
      onSuccess();
    } catch {
      toast({ title: 'Submission failed', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onValid)} className="space-y-5">
      <div className="text-center space-y-2 mb-4">
        <h2 className="text-xl font-display font-bold">Get in Touch</h2>
        <p className="text-sm text-muted-foreground">
          We'll contact you to schedule a visit and confirm your quote.
        </p>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" /> Email
        </label>
        <Input
          type="email"
          placeholder="you@example.com"
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
          })}
        />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" /> Phone
        </label>
        <Input
          type="tel"
          placeholder="(555) 123-4567"
          {...register('phone', {
            required: 'Phone is required',
            pattern: { value: /^[\d\s()+-]{7,20}$/, message: 'Invalid phone number' },
          })}
        />
        {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={submitting}>
        {submitting ? <LoadingSpinner text="Submitting..." /> : 'Submit Estimate Request'}
      </Button>
    </form>
  );
};

export default ContactForm;
