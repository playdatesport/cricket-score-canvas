import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ScoringControls = ({ onScore, onWicket, disabled }) => {
  const runButtons = [
    { value: 0, label: '0', variant: 'secondary' },
    { value: 1, label: '1', variant: 'outline' },
    { value: 2, label: '2', variant: 'outline' },
    { value: 3, label: '3', variant: 'outline' },
    { value: 4, label: '4', variant: 'default', highlight: true },
    { value: 5, label: '5', variant: 'outline' },
    { value: 6, label: '6', variant: 'default', highlight: true },
  ];

  const extraButtons = [
    { value: 'W', label: 'W', variant: 'destructive', onClick: onWicket },
    { value: 'WD', label: 'WD', variant: 'outline' },
    { value: 'NB', label: 'NB', variant: 'outline' },
    { value: 'LB', label: 'LB', variant: 'outline' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border pt-3 pb-4 safe-area-pb z-30">
      <div className="max-w-md mx-auto px-4">
        {/* Run Buttons */}
        <div className="grid grid-cols-7 gap-1.5 mb-3">
          {runButtons.map(({ value, label, variant, highlight }) => (
            <Button
              key={value}
              variant={variant}
              className={cn(
                "h-14 text-xl font-bold rounded-xl transition-all active:scale-95",
                highlight && "shadow-button ring-1 ring-primary/30",
                value === 4 && "bg-gradient-to-br from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400",
                value === 6 && "bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500"
              )}
              onClick={() => onScore(value)}
              disabled={disabled}
            >
              {label}
            </Button>
          ))}
        </div>

        {/* Extra Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {extraButtons.map(({ value, label, variant, onClick }) => (
            <Button
              key={value}
              variant={variant}
              className={cn(
                "h-12 text-sm font-bold rounded-xl transition-all active:scale-95",
                value === 'W' && "shadow-md"
              )}
              onClick={onClick || (() => onScore(value))}
              disabled={disabled}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScoringControls;
