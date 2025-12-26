import React from 'react';
import { Bowler } from '@/types/cricket';

interface BowlerStatsProps {
  bowler: Bowler;
}

const BowlerStats: React.FC<BowlerStatsProps> = ({ bowler }) => {
  return (
    <div className="bg-card rounded-xl shadow-card border border-border/50 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2.5 bg-muted/30 border-b border-border/50">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Bowler</h3>
          <div className="flex gap-3 text-[10px] text-muted-foreground font-medium">
            <span className="w-8 text-center">O</span>
            <span className="w-6 text-center">M</span>
            <span className="w-6 text-center">R</span>
            <span className="w-6 text-center">W</span>
            <span className="w-10 text-center">Econ</span>
          </div>
        </div>
      </div>

      {/* Bowler Row */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-primary">🎯</span>
            </div>
            <span className="font-semibold text-sm text-foreground truncate">
              {bowler.name}
            </span>
          </div>
          <div className="flex gap-3 text-sm">
            <span className="w-8 text-center font-medium text-foreground">
              {bowler.overs}.{bowler.balls}
            </span>
            <span className="w-6 text-center text-muted-foreground">{bowler.maidens}</span>
            <span className="w-6 text-center text-muted-foreground">{bowler.runs}</span>
            <span className="w-6 text-center font-bold text-primary">{bowler.wickets}</span>
            <span className="w-10 text-center text-muted-foreground text-xs">
              {bowler.economy.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Extras */}
      {(bowler.wides > 0 || bowler.noBalls > 0) && (
        <div className="px-4 py-2 bg-muted/20 border-t border-border/30">
          <div className="flex gap-4 text-xs text-muted-foreground">
            {bowler.wides > 0 && (
              <span>Wides: <span className="font-medium text-foreground">{bowler.wides}</span></span>
            )}
            {bowler.noBalls > 0 && (
              <span>No Balls: <span className="font-medium text-foreground">{bowler.noBalls}</span></span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BowlerStats;