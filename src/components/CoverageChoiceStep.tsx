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
        <h2 className="text-xl font-display font-bold">What area do you need serviced?</h2>
        <p className="text-sm text-muted-foreground">
          Choose whether you need the entire home or just specific rooms.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card
          className="p-6 cursor-pointer hover:border-primary/60 hover:shadow-md transition-all text-center group"
          onClick={() => onSelect('whole')}
        >
          <Home className="h-10 w-10 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-lg mb-1">Entire Home</h3>
          <p className="text-sm text-muted-foreground">
            Service the whole house. We'll use the total square footage for your estimate.
          </p>
        </Card>

        <Card
          className="p-6 cursor-pointer hover:border-primary/60 hover:shadow-md transition-all text-center group"
          onClick={() => onSelect('specific')}
        >
          <LayoutGrid className="h-10 w-10 mx-auto mb-3 text-secondary group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-lg mb-1">Specific Rooms</h3>
          <p className="text-sm text-muted-foreground">
            Choose exactly which rooms you'd like serviced.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default CoverageChoiceStep;
