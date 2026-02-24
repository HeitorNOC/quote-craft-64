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
    <div className="relative h-screen bg-background flex flex-col overflow-hidden" style={bgImage ? { backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' } : {}}>
      {bgImage && <div className="absolute inset-0 bg-foreground/60 pointer-events-none" />}
      <div className="relative z-10 flex flex-col h-full overflow-hidden mx-auto max-w-2xl w-full px-3 sm:px-4 md:px-6">
        {/* Header section - fixed height */}
        <div className="flex-shrink-0 py-2 sm:py-3 md:py-4 flex flex-col items-center">
          <img src="/LogoJD.JPG" alt="JD Logo" className="h-12 sm:h-16 md:h-20 w-12 sm:w-16 md:w-20 drop-shadow object-contain flex-shrink-0" style={{ borderRadius: 999 }} />
          
          {/* Step indicator and title - fixed */}
          <div className="mt-1.5 sm:mt-2 md:mt-3 w-full flex flex-col">
            <div className="flex items-start gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              {onBack && (
                <Button variant="outline" size="icon" onClick={onBack} aria-label="Go back" className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 flex-shrink-0 flex items-center justify-center border-2">
                  <ArrowLeft className="h-4 w-4 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                </Button>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-wider text-primary-foreground/80 line-clamp-1">
                  Step {step} of {totalSteps} — {currentLabel}
                </p>
                <h1 className="text-base sm:text-lg md:text-xl font-display font-bold text-primary-foreground break-words leading-tight">{title}</h1>
                {subtitle && <p className="text-xs text-primary-foreground/70 mt-0.5">{subtitle}</p>}
              </div>
            </div>
            <Progress value={progress} className="h-1 sm:h-1.5" />
          </div>
        </div>

        {/* Main content - flex-1 to fill remaining space */}
        <div className="flex-1 flex items-center justify-center min-h-0 py-2 sm:py-3">
          <Card className="p-3 sm:p-4 md:p-5 shadow-lg border-border/50 w-full h-full sm:h-auto overflow-y-auto">
            {children}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WizardLayout;
