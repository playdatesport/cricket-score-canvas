import React from 'react';
import { Ball, BallOutcome } from '@/types/cricket';

interface CurrentOverProps {
  balls: Ball[];
  currentOvers: number;
  currentBalls: number;
}

const getBallColor = (outcome: BallOutcome): string => {
  if (outcome === 'W') return 'bg-destructive text-destructive-foreground';
  if (outcome === 4) return 'bg-success text-success-foreground';
  if (outcome === 6) return 'bg-cricket-purple text-primary-foreground';
  if (outcome === 'WD' || outcome === 'NB') return 'bg-warning text-warning-foreground';
  if (outcome === 0) return 'bg-muted text-muted-foreground';
  return 'bg-primary text-primary-foreground';
};

const getBallLabel = (outcome: BallOutcome): string => {
  if (typeof outcome === 'number') return outcome.toString();
  return outcome;
};

const CurrentOver: React.FC<CurrentOverProps> = ({ balls, currentOvers, currentBalls }) => {
  const emptyBalls = Math.max(0, 6 - balls.length);

  return (
    <div className="px-4 py-4">
      <h3 className="text-sm font-semibold text-foreground mb-3">Overs</h3>
      
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {/* Current over indicator */}
        <div className="flex-shrink-0 px-3 py-2 rounded-full bg-primary text-primary-foreground font-bold text-sm">
          {currentOvers}.{currentBalls}
        </div>

        {/* Balls in current over */}
        {balls.map((ball, index) => (
          <div
            key={ball.id}
            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm animate-ball-add ${getBallColor(ball.outcome)}`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {getBallLabel(ball.outcome)}
          </div>
        ))}

        {/* Empty ball slots */}
        {Array.from({ length: emptyBalls }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-dashed border-muted flex items-center justify-center"
          />
        ))}
      </div>

      {/* Over summary */}
      <div className="flex gap-4 mt-3 text-xs text-muted-foreground overflow-x-auto">
        {balls.map((ball, idx) => (
          <span key={`label-${ball.id}`} className="flex-shrink-0 text-center w-10">
            {currentOvers}.{idx + 1}
          </span>
        ))}
        {Array.from({ length: emptyBalls }).map((_, idx) => (
          <span key={`empty-label-${idx}`} className="flex-shrink-0 text-center w-10">
            {currentOvers}.{balls.length + idx + 1}
          </span>
        ))}
        <span className="flex-shrink-0 text-center">EV/E</span>
      </div>
    </div>
  );
};

export default CurrentOver;
