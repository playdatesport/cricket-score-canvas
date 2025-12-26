import React from 'react';
import { MapPin, Clock, Circle } from 'lucide-react';
import { MatchDetails } from '@/types/cricket';

interface MatchHeaderProps {
  details: MatchDetails;
}

const MatchHeader: React.FC<MatchHeaderProps> = ({ details }) => {
  return (
    <div className="bg-card border-b border-border/50">
      <div className="px-4 py-4">
        {/* Match Type Badge */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-bold gradient-primary text-primary-foreground rounded-full">
              {details.matchType}
            </span>
            <span className="text-xs text-muted-foreground">
              {details.totalOvers} Overs
            </span>
          </div>
          <span className="px-2 py-1 text-[10px] font-medium bg-muted text-muted-foreground rounded-full">
            {details.ballType} Ball
          </span>
        </div>

        {/* Toss Info */}
        <p className="text-sm text-foreground mb-3">
          <span className="font-semibold">{details.tossWinner}</span>
          <span className="text-muted-foreground"> won the toss and elected to </span>
          <span className="font-semibold capitalize">{details.tossDecision}</span>
        </p>

        {/* Venue & Time */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          {details.venue && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span className="line-clamp-1">{details.venue}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{details.date} • {details.time}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchHeader;