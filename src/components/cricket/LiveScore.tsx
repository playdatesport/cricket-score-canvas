import React from 'react';
import { Team } from '@/types/cricket';
import OversProgress from './OversProgress';

interface LiveScoreProps {
  battingTeam: Team;
  bowlingTeam: Team;
}

const LiveScore: React.FC<LiveScoreProps> = ({ battingTeam, bowlingTeam }) => {
  const runRate = battingTeam.score / (battingTeam.overs + battingTeam.balls / 6) || 0;
  const remainingRuns = bowlingTeam.target ? bowlingTeam.target - battingTeam.score : 0;
  const remainingBalls = (20 - battingTeam.overs) * 6 - battingTeam.balls;
  const requiredRate = remainingRuns / (remainingBalls / 6) || 0;

  return (
    <div className="px-4 py-4">
      <h3 className="text-sm font-semibold text-foreground mb-3">Live Score</h3>
      
      <div className="flex items-center justify-between">
        {/* Batting Team */}
        <div className="text-center">
          <h4 className="text-lg font-bold text-foreground">{battingTeam.name}</h4>
          <div className="text-3xl font-extrabold text-foreground animate-score-update">
            {battingTeam.score}/{battingTeam.wickets}
          </div>
          <span className="text-sm text-primary font-medium">
            {battingTeam.overs}.{battingTeam.balls}
          </span>
        </div>

        {/* Overs Progress */}
        <OversProgress overs={battingTeam.overs} balls={battingTeam.balls} />

        {/* Bowling Team */}
        <div className="text-center">
          <h4 className="text-lg font-bold text-foreground">{bowlingTeam.name}</h4>
          <div className="text-3xl font-extrabold text-foreground">
            {bowlingTeam.score}/{bowlingTeam.wickets}
          </div>
          <span className="text-sm text-primary font-medium">
            T {bowlingTeam.target}
          </span>
        </div>
      </div>

      {/* Run Rates */}
      <div className="flex justify-center gap-6 mt-4 text-sm">
        <div>
          <span className="text-muted-foreground">SC </span>
          <span className="font-semibold text-foreground">{runRate.toFixed(2)}</span>
        </div>
        <div>
          <span className="text-muted-foreground">RRR </span>
          <span className="font-semibold text-foreground">{requiredRate.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default LiveScore;
