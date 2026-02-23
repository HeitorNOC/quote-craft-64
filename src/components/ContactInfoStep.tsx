import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Mail, Phone, User, FileText } from 'lucide-react';

interface ContactInfoStepProps {
  initialValues?: { name: string; email: string; phone: string; observations?: string };
  onSubmit: (data: { name: string; email: string; phone: string; observations?: string }) => void;
}

interface FormValues {
  name: string;
  email: string;
  phone: string;
  observations?: string;
}

const ContactInfoStep = ({ initialValues, onSubmit }: ContactInfoStepProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: initialValues ?? { name: '', email: '', phone: '' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
      <div className="text-center space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl md:text-2xl font-display font-bold">Let's get started</h2>
        <p className="text-xs sm:text-sm text-muted-foreground px-2">
          Tell us a bit about yourself so we can prepare your estimate.
        </p>
      </div>

      <div className="space-y-0.5 sm:space-y-1">
        <label className="text-xs sm:text-sm font-medium flex items-center gap-2">
          <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" /> Full Name
        </label>
        <Input
          placeholder="John Doe"
          className="text-xs sm:text-sm"
          {...register('name', {
            required: 'Name is required',
            minLength: { value: 2, message: 'At least 2 characters' },
            maxLength: { value: 100, message: 'Max 100 characters' },
          })}
        />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-0.5 sm:space-y-1">
        <label className="text-xs sm:text-sm font-medium flex items-center gap-2">
          <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" /> Email
        </label>
        <Input
          type="email"
          placeholder="you@example.com"
          className="text-xs sm:text-sm"
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
          })}
        />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-0.5 sm:space-y-1">
        <label className="text-xs sm:text-sm font-medium flex items-center gap-2">
          <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" /> Phone
        </label>
        <Input
          type="tel"
          placeholder="(555) 123-4567"
          className="text-xs sm:text-sm"
          {...register('phone', {
            required: 'Phone is required',
            pattern: { value: /^[\d\s()+-]{7,20}$/, message: 'Invalid phone number' },
          })}
        />
        {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
      </div>

      <div className="space-y-0.5 sm:space-y-1">
        <label className="text-xs sm:text-sm font-medium flex items-center gap-2">
          <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" /> Additional Notes (Optional)
        </label>
        <Textarea
          placeholder="Any special requests, concerns, or details we should know about your project? (e.g., budget constraints, color preferences, timeline)"
          className="text-xs sm:text-sm min-h-20 sm:min-h-24"
          {...register('observations')}
        />
        <p className="text-xs text-muted-foreground">
          This helps us provide a more personalized estimate and service
        </p>
      </div>

      <Button type="submit" className="w-full" size="lg">
        Continue
      </Button>
    </form>
  );
};

export default ContactInfoStep;
