import React from 'react';
import { Ball, BallOutcome } from '@/types/cricket';

interface CurrentOverProps {
  balls: Ball[];
  currentOvers: number;
  currentBalls: number;
}

const getBallDisplay = (ball: Ball) => {
  if (ball.isWicket) return 'W';
  if (ball.outcome === 'WD') return 'WD';
  if (ball.outcome === 'NB') return 'NB';
  if (ball.outcome === 'LB') return 'LB';
  if (ball.outcome === 'B') return 'B';
  return ball.runs.toString();
};

const getBallStyle = (ball: Ball) => {
  if (ball.isWicket) return 'bg-destructive text-destructive-foreground ring-2 ring-destructive/30';
  if (ball.outcome === 6) return 'bg-cricket-purple text-white ring-2 ring-cricket-purple/30';
  if (ball.outcome === 4) return 'bg-success text-success-foreground ring-2 ring-success/30';
  if (ball.outcome === 'WD' || ball.outcome === 'NB') return 'bg-warning text-warning-foreground';
  if (ball.outcome === 0) return 'bg-muted text-muted-foreground';
  return 'bg-primary/20 text-primary font-semibold';
};

const CurrentOver: React.FC<CurrentOverProps> = ({ balls, currentOvers, currentBalls }) => {
  // Show placeholder dots for remaining balls in the over
  const legalBalls = balls.filter(b => !b.isExtra || b.outcome === 'NB').length;
  const remainingBalls = Math.max(0, 6 - legalBalls);
  const placeholders = Array(remainingBalls).fill(null);

  return (
    <div className="mx-4 my-4">
      <div className="bg-card rounded-xl shadow-card border border-border/50 p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">
            This Over
          </h3>
          <span className="text-sm font-bold text-primary">
            Over {currentOvers + 1}
          </span>
        </div>

        {/* Balls Display */}
        <div className="flex items-center gap-2 flex-wrap">
          {balls.map((ball, index) => (
            <div
              key={ball.id}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold animate-ball-add ${getBallStyle(ball)}`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {getBallDisplay(ball)}
            </div>
          ))}
          
          {/* Placeholder dots */}
          {placeholders.map((_, index) => (
            <div
              key={`placeholder-${index}`}
              className="w-10 h-10 rounded-full border-2 border-dashed border-border flex items-center justify-center"
            >
              <span className="w-2 h-2 rounded-full bg-border" />
            </div>
          ))}
        </div>

        {/* Over Summary */}
        {balls.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Runs this over: <span className="font-bold text-foreground">{balls.reduce((sum, b) => sum + b.runs, 0)}</span>
            </span>
            <span>
              {balls.filter(b => b.isWicket).length > 0 && (
                <span className="text-destructive font-semibold">
                  {balls.filter(b => b.isWicket).length} Wicket{balls.filter(b => b.isWicket).length > 1 ? 's' : ''}
                </span>
              )}
            </span>
          </div>
        )}

        {balls.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-2">
            Over not started yet
          </p>
        )}
      </div>
    </div>
  );
};

export default CurrentOver;