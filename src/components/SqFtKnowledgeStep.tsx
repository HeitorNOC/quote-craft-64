import { Card } from '@/components/ui/card';
import { Ruler, HelpCircle } from 'lucide-react';

interface SqFtKnowledgeStepProps {
  onAnswer: (knows: boolean) => void;
}

const SqFtKnowledgeStep = ({ onAnswer }: SqFtKnowledgeStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-lg sm:text-xl md:text-2xl font-display font-bold">Do you know the room sizes?</h2>
        <p className="text-xs sm:text-sm text-muted-foreground px-2">
          We need the approximate square footage of each room to prepare your estimate.
        </p>
      </div>

      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
        <Card
          className="p-4 sm:p-5 md:p-6 cursor-pointer hover:border-primary/60 hover:shadow-md transition-all text-center group"
          onClick={() => onAnswer(true)}
        >
          <Ruler className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 mx-auto mb-2 sm:mb-3 text-primary group-hover:scale-110 transition-transform flex-shrink-0" />
          <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-1">Yes, I know</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            I can enter the approximate square footage for each room.
          </p>
        </Card>

        <Card
          className="p-4 sm:p-5 md:p-6 cursor-pointer hover:border-primary/60 hover:shadow-md transition-all text-center group"
          onClick={() => onAnswer(false)}
        >
          <HelpCircle className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 mx-auto mb-2 sm:mb-3 text-secondary group-hover:scale-110 transition-transform flex-shrink-0" />
          <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-1">No, I don't</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            I'll need an on-site visit for measurements before getting an estimate.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default SqFtKnowledgeStep;
