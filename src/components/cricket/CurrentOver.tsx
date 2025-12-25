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
    <div className="px-3 sm:px-4 py-3 sm:py-4">
      <h3 className="text-xs sm:text-sm font-semibold text-foreground mb-2 sm:mb-3">Current Over</h3>
      
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {/* Current over indicator */}
        <div className="flex-shrink-0 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full bg-primary text-primary-foreground font-bold text-xs sm:text-sm">
          {currentOvers}.{currentBalls}
        </div>

        {/* Balls in current over */}
        {balls.map((ball, index) => (
          <div
            key={ball.id}
            className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm animate-ball-add shadow-sm ${getBallColor(ball.outcome)}`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {getBallLabel(ball.outcome)}
          </div>
        ))}

        {/* Empty ball slots */}
        {Array.from({ length: emptyBalls }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-dashed border-muted flex items-center justify-center"
          />
        ))}
      </div>

      {/* This Over Stats */}
      {balls.length > 0 && (
        <div className="flex items-center gap-3 sm:gap-4 mt-2 sm:mt-3 text-xs sm:text-sm">
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Runs:</span>
            <span className="font-semibold text-foreground">
              {balls.reduce((sum, b) => sum + b.runs, 0)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Wickets:</span>
            <span className="font-semibold text-foreground">
              {balls.filter(b => b.isWicket).length}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Extras:</span>
            <span className="font-semibold text-foreground">
              {balls.filter(b => b.isExtra).length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentOver;
