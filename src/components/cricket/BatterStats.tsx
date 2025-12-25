import React from 'react';
import { Batter } from '@/types/cricket';

interface BatterStatsProps {
  batters: Batter[];
}

const BatterStats: React.FC<BatterStatsProps> = ({ batters }) => {
  return (
    <div className="bg-card rounded-xl p-4 shadow-card">
      <h3 className="text-sm font-semibold text-foreground mb-3">Batter</h3>
      
      <div className="space-y-3">
        {batters.filter(b => !b.isOut).map((batter) => {
          const strikeRate = batter.balls > 0 ? (batter.runs / batter.balls) * 100 : 0;
          
          return (
            <div
              key={batter.id}
              className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                batter.isOnStrike 
                  ? 'bg-primary/5 border border-primary/20' 
                  : 'bg-muted/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">
                  {batter.name}
                </span>
                {batter.isOnStrike && (
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                )}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xl font-bold text-foreground">{batter.runs}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats Legend */}
      <div className="flex justify-between mt-3 px-3 text-xs text-muted-foreground">
        <span>R B</span>
        <span>SR</span>
      </div>
      {batters.filter(b => !b.isOut).map((batter) => {
        const strikeRate = batter.balls > 0 ? (batter.runs / batter.balls) * 100 : 0;
        return (
          <div key={`stats-${batter.id}`} className="flex justify-between px-3 text-sm mt-1">
            <span className="text-muted-foreground">
              {batter.runs} {batter.balls}
            </span>
            <span className="font-medium text-foreground">{strikeRate.toFixed(2)}</span>
          </div>
        );
      })}
    </div>
  );
};

export default BatterStats;
