import React, { memo, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { BallOutcome } from '@/types/cricket';
import { Undo2, RefreshCw } from 'lucide-react';

interface ScoringControlsProps {
  onAddBall: (outcome: BallOutcome) => void;
  onUndo: () => void;
  onChangeBowler: () => void;
}

const RUN_BUTTONS: { value: BallOutcome; label: string; variant: 'run' | 'boundary' | 'six' }[] = [
  { value: 0, label: '0', variant: 'run' },
  { value: 1, label: '1', variant: 'run' },
  { value: 2, label: '2', variant: 'run' },
  { value: 3, label: '3', variant: 'run' },
  { value: 4, label: '4', variant: 'boundary' },
  { value: 6, label: '6', variant: 'six' },
];

const EXTRA_BUTTONS: { value: BallOutcome; label: string; shortLabel: string }[] = [
  { value: 'WD', label: 'Wide', shortLabel: 'WD' },
  { value: 'NB', label: 'No Ball', shortLabel: 'NB' },
  { value: 'LB', label: 'Leg Bye', shortLabel: 'LB' },
  { value: 'B', label: 'Bye', shortLabel: 'B' },
];

const RunButton = memo<{ 
  value: BallOutcome; 
  label: string; 
  variant: 'run' | 'boundary' | 'six';
  onClick: (value: BallOutcome) => void;
}>(({ value, label, variant, onClick }) => {
  const handleClick = useCallback(() => onClick(value), [onClick, value]);
  
  return (
    <Button
      variant={variant === 'boundary' ? 'success' : variant === 'six' ? 'purple' : 'secondary'}
      size="lg"
      className="h-12 sm:h-14 text-lg sm:text-xl font-bold active:scale-95 transition-transform"
      onClick={handleClick}
    >
      {label}
    </Button>
  );
});
RunButton.displayName = 'RunButton';

const ExtraButton = memo<{
  value: BallOutcome;
  label: string;
  shortLabel: string;
  onClick: (value: BallOutcome) => void;
}>(({ value, label, shortLabel, onClick }) => {
  const handleClick = useCallback(() => onClick(value), [onClick, value]);
  
  return (
    <Button
      variant="warning"
      size="sm"
      className="font-medium text-xs sm:text-sm h-9 sm:h-10 active:scale-95 transition-transform"
      onClick={handleClick}
    >
      <span className="sm:hidden">{shortLabel}</span>
      <span className="hidden sm:inline">{label}</span>
    </Button>
  );
});
ExtraButton.displayName = 'ExtraButton';

const ScoringControls: React.FC<ScoringControlsProps> = memo(({
  onAddBall,
  onUndo,
  onChangeBowler,
}) => {
  const handleWicket = useCallback(() => onAddBall('W'), [onAddBall]);

  return (
    <div className="px-3 sm:px-4 py-3 sm:py-4 space-y-3 sm:space-y-4">
      {/* Quick Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onUndo}
          className="flex-1 gap-1.5 sm:gap-2 h-9 sm:h-10 text-xs sm:text-sm"
        >
          <Undo2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Undo</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onChangeBowler}
          className="flex-1 gap-1.5 sm:gap-2 h-9 sm:h-10 text-xs sm:text-sm"
        >
          <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Change</span> Bowler
        </Button>
      </div>

      {/* Run Buttons */}
      <div>
        <h4 className="text-xs sm:text-sm font-semibold text-foreground mb-2">Runs</h4>
        <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
          {RUN_BUTTONS.map((btn) => (
            <RunButton
              key={btn.label}
              value={btn.value}
              label={btn.label}
              variant={btn.variant}
              onClick={onAddBall}
            />
          ))}
        </div>
      </div>

      {/* Wicket Button */}
      <Button
        variant="destructive"
        size="lg"
        className="w-full h-12 sm:h-14 text-base sm:text-lg font-bold active:scale-95 transition-transform"
        onClick={handleWicket}
      >
        🏏 WICKET
      </Button>

      {/* Extra Buttons */}
      <div>
        <h4 className="text-xs sm:text-sm font-semibold text-foreground mb-2">Extras</h4>
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
          {EXTRA_BUTTONS.map((btn) => (
            <ExtraButton
              key={btn.label}
              value={btn.value}
              label={btn.label}
              shortLabel={btn.shortLabel}
              onClick={onAddBall}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

ScoringControls.displayName = 'ScoringControls';

export default ScoringControls;
