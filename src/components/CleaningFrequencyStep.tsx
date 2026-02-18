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
    label: 'Uma Vez',
    description: 'Limpeza única',
    multiplier: 1,
  },
  {
    id: 'weekly',
    label: 'Semanal',
    description: 'Toda semana (desconto 10%)',
    multiplier: 0.9,
  },
  {
    id: 'biweekly',
    label: 'Quinzenal',
    description: 'A cada 2 semanas (desconto 5%)',
    multiplier: 0.95,
  },
  {
    id: 'monthly',
    label: 'Mensal',
    description: 'Uma vez por mês (acréscimo 10%)',
    multiplier: 1.1,
  },
];

interface CleaningFrequencyStepProps {
  onSelect: (frequency: CleaningFrequency) => void;
  selected?: CleaningFrequency;
}

export default function CleaningFrequencyStep({ onSelect, selected }: CleaningFrequencyStepProps) {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Com que frequência?</h2>
        <p className="text-gray-600 mt-2">Escolha a periodicidade do serviço</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {OPTIONS.map((option) => (
          <Card
            key={option.id}
            className={`p-4 cursor-pointer transition-all ${
              selected === option.id
                ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-300'
                : 'hover:border-blue-200 hover:bg-blue-50'
            }`}
            onClick={() => onSelect(option.id)}
          >
            <h3 className="font-semibold text-gray-900">{option.label}</h3>
            <p className="text-sm text-gray-600 mt-1">{option.description}</p>
            {option.multiplier !== 1 && (
              <p className="text-xs text-blue-600 mt-2">
                {option.multiplier < 1 ? '✓' : '+'} {Math.abs((option.multiplier - 1) * 100).toFixed(0)}%
              </p>
            )}
          </Card>
        ))}
      </div>

      <div className="flex gap-3">
        <Button
          onClick={() => {
            if (selected) onSelect(selected);
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          disabled={!selected}
        >
          Continuar →
        </Button>
      </div>
    </div>
  );
}
