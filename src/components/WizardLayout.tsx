import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface WizardLayoutProps {
  step: number;
  totalSteps?: number;
  title: string;
  subtitle?: string;
  onBack?: () => void;
  children: React.ReactNode;
}

const stepLabels = [
  'Contact',
  'Data Source',
  'Property Details',
  'Select Areas',
  'Service Options',
  'Estimate',
];

const WizardLayout = ({ step, totalSteps = 6, title, subtitle, onBack, children }: WizardLayoutProps) => {
  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="mx-auto max-w-2xl animate-fade-in">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            {onBack && (
              <Button variant="ghost" size="icon" onClick={onBack} aria-label="Go back">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Step {step} of {totalSteps} — {stepLabels[step - 1]}
              </p>
              <h1 className="text-2xl font-display font-bold text-foreground">{title}</h1>
              {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Content */}
        <Card className="p-6 shadow-lg border-border/50 animate-slide-in">
          {children}
        </Card>
      </div>
    </div>
  );
};

export default WizardLayout;
