import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Clock, CalendarDays, CalendarCheck } from 'lucide-react';
import type { CleaningFrequency } from '@/types';

interface CleaningFrequencyStepProps {
  onSelect: (frequency: CleaningFrequency) => void;
}

const options: { key: CleaningFrequency; title: string; description: string; icon: typeof Clock }[] = [
  { key: 'one-time', title: 'One Time', description: 'Single cleaning session — great for deep cleans or move-outs.', icon: Clock },
  { key: 'weekly', title: 'Once a Week', description: 'Regular weekly cleaning to keep your home spotless.', icon: CalendarDays },
  { key: 'monthly', title: 'Monthly', description: 'Monthly maintenance cleaning at a lower cost.', icon: CalendarCheck },
];

const CleaningFrequencyStep = ({ onSelect }: CleaningFrequencyStepProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-center">How often do you need cleaning?</h3>
      <div className="grid gap-3">
        {options.map(({ key, title, description, icon: Icon }) => (
          <Card
            key={key}
            className="cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 border-border/50"
            onClick={() => onSelect(key)}
          >
            <CardHeader className="flex flex-row items-center gap-4 p-4">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">{title}</CardTitle>
                <CardDescription className="text-xs">{description}</CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CleaningFrequencyStep;
