import { Card } from '@/components/ui/card';
import { Home, LayoutGrid } from 'lucide-react';
import type { CoverageType } from '@/types';

interface CoverageChoiceStepProps {
  onSelect: (type: CoverageType) => void;
}

const CoverageChoiceStep = ({ onSelect }: CoverageChoiceStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-lg sm:text-xl md:text-2xl font-display font-bold">What area do you need serviced?</h2>
        <p className="text-xs sm:text-sm text-muted-foreground px-2">
          Choose whether you need the entire home or just specific rooms.
        </p>
      </div>

      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
        <Card
          className="p-4 sm:p-5 md:p-6 cursor-pointer hover:border-primary/60 hover:shadow-md transition-all text-center group"
          onClick={() => onSelect('whole')}
        >
          <Home className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 mx-auto mb-2 sm:mb-3 text-primary group-hover:scale-110 transition-transform flex-shrink-0" />
          <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-1">Entire Home</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Service the whole house. We'll use the total square footage for your estimate.
          </p>
        </Card>

        <Card
          className="p-4 sm:p-5 md:p-6 cursor-pointer hover:border-primary/60 hover:shadow-md transition-all text-center group"
          onClick={() => onSelect('specific')}
        >
          <LayoutGrid className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 mx-auto mb-2 sm:mb-3 text-secondary group-hover:scale-110 transition-transform flex-shrink-0" />
          <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-1">Specific Rooms</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Choose exactly which rooms you'd like serviced.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default CoverageChoiceStep;
