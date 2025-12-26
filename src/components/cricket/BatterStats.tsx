import React from 'react';
import { Batter } from '@/types/cricket';

interface BatterStatsProps {
  batters: Batter[];
}

const BatterStats: React.FC<BatterStatsProps> = ({ batters }) => {
  const activeBatters = batters.filter(b => !b.isOut);

  return (
    <div className="bg-card rounded-xl shadow-card border border-border/50 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2.5 bg-muted/30 border-b border-border/50">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Batters</h3>
          <div className="flex gap-4 text-[10px] text-muted-foreground font-medium">
            <span className="w-8 text-center">R</span>
            <span className="w-6 text-center">B</span>
            <span className="w-6 text-center">4s</span>
            <span className="w-6 text-center">6s</span>
            <span className="w-10 text-center">SR</span>
          </div>
        </div>
      </div>

      {/* Batters List */}
      <div className="divide-y divide-border/30">
        {activeBatters.map((batter) => {
          const strikeRate = batter.balls > 0 ? ((batter.runs / batter.balls) * 100).toFixed(1) : '0.0';
          
          return (
            <div
              key={batter.id}
              className={`px-4 py-3 transition-colors ${
                batter.isOnStrike ? 'bg-primary/5' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="font-semibold text-sm text-foreground truncate">
                    {batter.name}
                  </span>
                  {batter.isOnStrike && (
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  )}
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="w-8 text-center font-bold text-foreground">{batter.runs}</span>
                  <span className="w-6 text-center text-muted-foreground">{batter.balls}</span>
                  <span className="w-6 text-center text-muted-foreground">{batter.fours}</span>
                  <span className="w-6 text-center text-muted-foreground">{batter.sixes}</span>
                  <span className="w-10 text-center text-muted-foreground text-xs">{strikeRate}</span>
                </div>
              </div>
            </div>
          );
        })}

        {activeBatters.length === 0 && (
          <div className="px-4 py-6 text-center text-sm text-muted-foreground">
            No batters at crease
          </div>
        )}
      </div>
    </div>
  );
};

export default BatterStats;