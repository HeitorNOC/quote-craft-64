import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  text?: string;
  className?: string;
}

const LoadingSpinner = ({ text = 'Loading...', className = '' }: LoadingSpinnerProps) => (
  <div className={`flex items-center gap-2 text-muted-foreground ${className}`}>
    <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin flex-shrink-0" />
    <span className="text-xs sm:text-sm font-medium">{text}</span>
  </div>
);

export default LoadingSpinner;
