import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  text?: string;
  className?: string;
}

const LoadingSpinner = ({ text = 'Loading...', className = '' }: LoadingSpinnerProps) => (
  <div className={`flex items-center gap-2 text-muted-foreground ${className}`}>
    <Loader2 className="h-5 w-5 animate-spin" />
    <span className="text-sm font-medium">{text}</span>
  </div>
);

export default LoadingSpinner;
