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
    <div className="relative min-h-screen bg-background py-8 px-4 flex flex-col" style={bgImage ? { backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
      {bgImage && <div className="absolute inset-0 bg-foreground/60" />}
      <div className="relative z-10 mx-auto max-w-2xl w-full animate-fade-in flex flex-col flex-1">
        <img src="/LogoJD.JPG" alt="JD Logo" className="h-48 w-48 drop-shadow mb-2 object-contain" style={{ borderRadius: 999 }} />
        <div className="flex items-center justify-center flex-1">
          <div className="w-full flex flex-col">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                {onBack && (
                  <Button variant="ghost" size="icon" onClick={onBack} aria-label="Go back" className="text-primary-foreground hover:bg-primary-foreground/20">
                    <ArrowLeft className="h-5 w-5" />
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
            <Card className="p-6 shadow-lg border-border/50 animate-slide-in w-full">
              {children}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WizardLayout;
