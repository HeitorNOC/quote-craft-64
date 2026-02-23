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
      <div className="relative z-10 mx-auto max-w-2xl w-full animate-fade-in flex flex-col flex-1 overflow-y-auto px-3 sm:px-4 md:px-6">
        <div className="py-4 sm:py-6 md:py-8 flex flex-col flex-1">
          <img src="/LogoJD.JPG" alt="JD Logo" className="h-20 sm:h-24 md:h-32 w-20 sm:w-24 md:w-32 drop-shadow mb-0 object-contain mx-auto flex-shrink-0" style={{ borderRadius: 999 }} />
          <div className="flex mt-2 sm:mt-3 md:mt-4 justify-center flex-1 min-h-0">
            <div className="w-full flex flex-col">
              <div className="mb-4 sm:mb-5 md:mb-6 flex-shrink-0">
                <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                  {onBack && (
                    <Button variant="outline" size="icon" onClick={onBack} aria-label="Go back" className="h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 flex-shrink-0 flex items-center justify-center border-2">
                      <ArrowLeft className="h-5 w-5 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                    </Button>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wider text-primary-foreground/80 line-clamp-1">
                      Step {step} of {totalSteps} — {currentLabel}
                    </p>
                    <h1 className="text-lg sm:text-xl md:text-2xl font-display font-bold text-primary-foreground break-words">{title}</h1>
                    {subtitle && <p className="text-xs sm:text-sm text-primary-foreground/70 mt-0.5 sm:mt-1">{subtitle}</p>}
                  </div>
                </div>
                <Progress value={progress} className="h-1.5 sm:h-2" />
              </div>
              <Card className="p-4 sm:p-5 md:p-6 shadow-lg border-border/50 animate-slide-in w-full overflow-y-auto">
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
