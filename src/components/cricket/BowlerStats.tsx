import React from 'react';
import { Bowler } from '@/types/cricket';

interface BowlerStatsProps {
  bowler: Bowler;
}

const BowlerStats: React.FC<BowlerStatsProps> = ({ bowler }) => {
  return (
    <div className="bg-card rounded-xl p-4 shadow-card">
      <h3 className="text-sm font-semibold text-foreground mb-3">Bowler</h3>
      
      <div className="p-3 rounded-lg bg-muted/50">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-foreground">{bowler.name}</span>
          <span className="text-xl font-bold text-foreground">
            {bowler.overs}.{bowler.balls}
          </span>
        </div>
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span>{bowler.overs}.{bowler.balls} {bowler.maidens}</span>
          <span>{bowler.wickets} {bowler.runs}</span>
        </div>
      </div>

      {/* Economy */}
      <div className="flex justify-between items-center mt-3 px-3">
        <span className="text-sm text-muted-foreground">Economy</span>
        <span className="text-lg font-bold text-foreground">{bowler.economy.toFixed(2)}</span>
      </div>
      <div className="flex justify-end px-3">
        <span className="text-sm text-muted-foreground">{bowler.wickets}</span>
      </div>
    </div>
  );
};

export default BowlerStats;
