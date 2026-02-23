import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { CleaningFrequency } from '@/types';

interface FrequencyOption {
  id: CleaningFrequency;
  label: string;
  description: string;
  multiplier: number;
}

const OPTIONS: FrequencyOption[] = [
  {
    id: 'one-time',
    label: 'One-Time',
    description: 'Single cleaning service',
    multiplier: 1,
  },
  {
    id: 'monthly',
    label: 'Monthly',
    description: 'Once per month',
    multiplier: 1,
  },
];

interface CleaningFrequencyStepProps {
  onSelect: (frequency: CleaningFrequency) => void;
  selected?: CleaningFrequency;
}

export default function CleaningFrequencyStep({ onSelect, selected }: CleaningFrequencyStepProps) {
  return (
    <div className="w-full space-y-4 sm:space-y-6">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-lg sm:text-xl md:text-3xl font-display font-bold text-gray-900">How often do you need cleaning?</h2>
        <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 sm:mt-2 px-2">Choose your preferred service frequency</p>
      </div>

      <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
        {OPTIONS.map((option) => (
          <Card
            key={option.id}
            className={`p-3 sm:p-4 cursor-pointer transition-all ${
              selected === option.id
                ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-300'
                : 'hover:border-blue-200 hover:bg-blue-50'
            }`}
            onClick={() => onSelect(option.id)}
          >
            <h3 className="font-semibold text-xs sm:text-sm md:text-base text-gray-900">{option.label}</h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">{option.description}</p>
          </Card>
        ))}
      </div>

      <div className="flex gap-3">
        <Button
          onClick={() => {
            if (selected) onSelect(selected);
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm"
          disabled={!selected}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
