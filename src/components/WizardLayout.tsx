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
  bgImage?: string;
  children: React.ReactNode;
}

const defaultLabels = ['Contact', 'Data Source', 'Coverage', 'Details', 'Options', 'Estimate'];

const WizardLayout = ({ step, totalSteps = 6, title, subtitle, stepLabels, onBack, bgImage, children }: WizardLayoutProps) => {
  const progress = (step / totalSteps) * 100;
  const labels = stepLabels ?? defaultLabels;
  const currentLabel = labels[step - 1] ?? '';

  return (
    <div className="relative h-screen bg-background flex flex-col overflow-hidden" style={bgImage ? { backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
      {bgImage && <div className="absolute inset-0 bg-foreground/60" />}
      <div className="relative z-10 mx-auto max-w-2xl w-full animate-fade-in flex flex-col flex-1 overflow-y-auto px-4">
        <div className="py-8 flex flex-col flex-1">
          <img src="/LogoJD.JPG" alt="JD Logo" className="h-32 w-32 drop-shadow mb-0 object-contain mx-auto flex-shrink-0" style={{ borderRadius: 999 }} />
          <div className="flex mt-4 justify-center flex-1 min-h-0">
            <div className="w-full flex flex-col">
              <div className="mb-6 flex-shrink-0">
                <div className="flex items-center gap-3 mb-4">
                  {onBack && (
                    <Button variant="outline" size="lg" onClick={onBack} aria-label="Go back" className="h-12 w-12 flex-shrink-0 flex items-center justify-center border-2">
                      <ArrowLeft className="h-6 w-6" />
                    </Button>
                  )}
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-primary-foreground/80">
                      Step {step} of {totalSteps} — {currentLabel}
                    </p>
                    <h1 className="text-2xl font-display font-bold text-primary-foreground">{title}</h1>
                    {subtitle && <p className="text-sm text-primary-foreground/70 mt-1">{subtitle}</p>}
                  </div>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              <Card className="p-6 shadow-lg border-border/50 animate-slide-in w-full overflow-y-auto">
                {children}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WizardLayout;
