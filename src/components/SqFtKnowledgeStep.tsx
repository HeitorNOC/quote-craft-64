import { Card } from '@/components/ui/card';
import { Ruler, HelpCircle } from 'lucide-react';

interface SqFtKnowledgeStepProps {
  onAnswer: (knows: boolean) => void;
}

const SqFtKnowledgeStep = ({ onAnswer }: SqFtKnowledgeStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-display font-bold">Do you know the room sizes?</h2>
        <p className="text-sm text-muted-foreground">
          We need the approximate square footage of each room to prepare your estimate.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card
          className="p-6 cursor-pointer hover:border-primary/60 hover:shadow-md transition-all text-center group"
          onClick={() => onAnswer(true)}
        >
          <Ruler className="h-10 w-10 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-lg mb-1">Yes, I know</h3>
          <p className="text-sm text-muted-foreground">
            I can enter the approximate square footage for each room.
          </p>
        </Card>

        <Card
          className="p-6 cursor-pointer hover:border-primary/60 hover:shadow-md transition-all text-center group"
          onClick={() => onAnswer(false)}
        >
          <HelpCircle className="h-10 w-10 mx-auto mb-3 text-secondary group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-lg mb-1">No, I don't</h3>
          <p className="text-sm text-muted-foreground">
            I'll need an on-site visit for measurements before getting an estimate.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default SqFtKnowledgeStep;
