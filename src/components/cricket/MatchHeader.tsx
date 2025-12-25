import React from 'react';
import { Bell, Settings } from 'lucide-react';
import { MatchDetails } from '@/types/cricket';

interface MatchHeaderProps {
  details: MatchDetails;
}

const MatchHeader: React.FC<MatchHeaderProps> = ({ details }) => {
  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-foreground">Match Details</h1>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full hover:bg-muted transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="p-2 rounded-full hover:bg-muted transition-colors">
            <Settings className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="bg-card rounded-xl p-4 shadow-card">
        <div className="mb-3">
          <h2 className="text-lg font-semibold text-foreground">{details.matchType}</h2>
          <p className="text-sm text-muted-foreground">
            {details.tossWinner} won the toss and chose to {details.tossDecision}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <div>
            <span className="text-muted-foreground">Ground Name</span>
          </div>
          <div className="text-right">
            <span className="font-medium">{details.venue}</span>
            <span className="ml-2 text-muted-foreground">{details.time}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Ball Type</span>
          </div>
          <div className="text-right">
            <span className="font-medium">{details.ballType}</span>
            <span className="ml-4 text-muted-foreground">{details.powerplay}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchHeader;
