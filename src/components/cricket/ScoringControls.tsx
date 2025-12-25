import React from 'react';
import { Button } from '@/components/ui/button';
import { BallOutcome } from '@/types/cricket';
import { Undo2, Edit, RefreshCw } from 'lucide-react';

interface ScoringControlsProps {
  onAddBall: (outcome: BallOutcome) => void;
  onUndo: () => void;
  onChangeBowler: () => void;
}

const ScoringControls: React.FC<ScoringControlsProps> = ({
  onAddBall,
  onUndo,
  onChangeBowler,
}) => {
  const runButtons: { value: BallOutcome; label: string; variant: 'run' | 'boundary' | 'six' | 'wicket' | 'extra' }[] = [
    { value: 0, label: '0', variant: 'run' },
    { value: 1, label: '1', variant: 'run' },
    { value: 2, label: '2', variant: 'run' },
    { value: 3, label: '3', variant: 'run' },
    { value: 4, label: '4', variant: 'boundary' },
    { value: 6, label: '6', variant: 'six' },
  ];

  const extraButtons: { value: BallOutcome; label: string }[] = [
    { value: 'WD', label: 'Wide' },
    { value: 'NB', label: 'No Ball' },
    { value: 'LB', label: 'Leg Bye' },
    { value: 'B', label: 'Bye' },
  ];

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Quick Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onUndo}
          className="flex-1 gap-2"
        >
          <Undo2 className="w-4 h-4" />
          Undo
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-2"
        >
          <Edit className="w-4 h-4" />
          Edit Score
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onChangeBowler}
          className="flex-1 gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Change Bowler
        </Button>
      </div>

      {/* Run Buttons */}
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-2">Runs</h4>
        <div className="grid grid-cols-6 gap-2">
          {runButtons.map((btn) => (
            <Button
              key={btn.label}
              variant={btn.variant === 'boundary' ? 'success' : btn.variant === 'six' ? 'purple' : 'secondary'}
              size="lg"
              className="h-14 text-lg font-bold"
              onClick={() => onAddBall(btn.value)}
            >
              {btn.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Wicket Button */}
      <Button
        variant="destructive"
        size="lg"
        className="w-full h-14 text-lg font-bold"
        onClick={() => onAddBall('W')}
      >
        WICKET
      </Button>

      {/* Extra Buttons */}
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-2">Extras</h4>
        <div className="grid grid-cols-4 gap-2">
          {extraButtons.map((btn) => (
            <Button
              key={btn.label}
              variant="warning"
              size="sm"
              className="font-medium"
              onClick={() => onAddBall(btn.value)}
            >
              {btn.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScoringControls;
