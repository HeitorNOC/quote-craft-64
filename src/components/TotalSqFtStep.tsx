import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface TotalSqFtStepProps {
  initialValue?: number;
  onSubmit: (sqFt: number) => void;
}

const TotalSqFtStep = ({ initialValue, onSubmit }: TotalSqFtStepProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<{ sqFt: number }>({
    defaultValues: { sqFt: initialValue || 0 },
  });

  return (
    <form onSubmit={handleSubmit((d) => onSubmit(d.sqFt))} className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-display font-bold">Total Square Footage</h2>
        <p className="text-sm text-muted-foreground">
          Enter or confirm the total square footage of your home.
        </p>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Square Footage</label>
        <Input
          type="number"
          placeholder="e.g. 2100"
          min={1}
          {...register('sqFt', { required: 'Required', min: { value: 1, message: 'Must be greater than 0' }, valueAsNumber: true })}
        />
        {errors.sqFt && <p className="text-xs text-destructive">{errors.sqFt.message}</p>}
      </div>

      <Button type="submit" className="w-full" size="lg">Continue</Button>
    </form>
  );
};

export default TotalSqFtStep;
