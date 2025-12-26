import React from 'react';
import { Team } from '@/types/cricket';
import OversProgress from './OversProgress';

interface LiveScoreProps {
  battingTeam: Team;
  bowlingTeam: Team;
  isFirstInnings?: boolean;
  firstInningsScore?: number;
  firstInningsWickets?: number;
}

const LiveScore: React.FC<LiveScoreProps> = ({ 
  battingTeam, 
  bowlingTeam,
  isFirstInnings = true,
  firstInningsScore,
  firstInningsWickets 
}) => {
  const runRate = battingTeam.score / (battingTeam.overs + battingTeam.balls / 6) || 0;
  const target = battingTeam.target;
  const remainingRuns = target ? target - battingTeam.score : 0;
  const remainingBalls = (20 - battingTeam.overs) * 6 - battingTeam.balls;
  const requiredRate = remainingRuns > 0 && remainingBalls > 0 ? remainingRuns / (remainingBalls / 6) : 0;

  return (
    <div className="px-4 py-5">
      <div className="bg-card rounded-2xl shadow-card border border-border/50 overflow-hidden">
        {/* Score Header */}
        <div className="p-4 pb-3">
          <div className="flex items-center justify-between">
            {/* Batting Team */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <h4 className="text-sm font-semibold text-foreground line-clamp-1">
                  {battingTeam.shortName || battingTeam.name}
                </h4>
              </div>
              <div className="text-3xl font-black text-foreground animate-score-update">
                {battingTeam.score}
                <span className="text-xl text-muted-foreground">/{battingTeam.wickets}</span>
              </div>
              <span className="text-sm text-primary font-semibold">
                ({battingTeam.overs}.{battingTeam.balls})
              </span>
            </div>

            {/* VS */}
            <div className="px-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <span className="text-xs font-bold text-muted-foreground">VS</span>
              </div>
            </div>

            {/* Bowling Team */}
            <div className="flex-1 text-right">
              <h4 className="text-sm font-semibold text-muted-foreground line-clamp-1 mb-1">
                {bowlingTeam.shortName || bowlingTeam.name}
              </h4>
              <div className="text-3xl font-black text-muted-foreground">
                {isFirstInnings 
                  ? `${bowlingTeam.score}/${bowlingTeam.wickets}`
                  : `${firstInningsScore || 0}/${firstInningsWickets || 0}`
                }
              </div>
              {target && (
                <span className="text-sm text-primary font-semibold">
                  Target: {target}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center justify-around py-3 px-4 bg-muted/30 border-t border-border/50">
          <div className="text-center">
            <p className="text-[10px] uppercase text-muted-foreground font-medium">CRR</p>
            <p className="text-sm font-bold text-foreground">{runRate.toFixed(2)}</p>
          </div>
          {target && (
            <>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <p className="text-[10px] uppercase text-muted-foreground font-medium">RRR</p>
                <p className="text-sm font-bold text-foreground">{requiredRate.toFixed(2)}</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <p className="text-[10px] uppercase text-muted-foreground font-medium">Need</p>
                <p className="text-sm font-bold text-foreground">{remainingRuns}</p>
              </div>
            </>
          )}
          {!target && (
            <>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <p className="text-[10px] uppercase text-muted-foreground font-medium">Projected</p>
                <p className="text-sm font-bold text-foreground">
                  {Math.round(runRate * 20)}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveScore;