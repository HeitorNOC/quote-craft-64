import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface WizardLayoutProps {
  step: number;
  totalSteps?: number;
  title: string;
  subtitle?: string;
  stepLabels?: string[];
  onBack?: () => void;
  children: React.ReactNode;
}

const defaultLabels = ['Contact', 'Data Source', 'Coverage', 'Details', 'Options', 'Estimate'];

const WizardLayout = ({ step, totalSteps = 6, title, subtitle, stepLabels, onBack, children }: WizardLayoutProps) => {
  const progress = (step / totalSteps) * 100;
  const labels = stepLabels ?? defaultLabels;
  const currentLabel = labels[step - 1] ?? '';

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="mx-auto max-w-2xl animate-fade-in">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            {onBack && (
              <Button variant="ghost" size="icon" onClick={onBack} aria-label="Go back">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Step {step} of {totalSteps} — {currentLabel}
              </p>
              <h1 className="text-2xl font-display font-bold text-foreground">{title}</h1>
              {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="p-6 shadow-lg border-border/50 animate-slide-in">
          {children}
        </Card>
      </div>
    </div>
  );
};

export default WizardLayout;
