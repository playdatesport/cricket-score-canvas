import { memo, useMemo } from 'react';
import { Share2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const LiveScoreHeader = memo(({ matchState, onShare }) => {
  const navigate = useNavigate();
  
  const stats = useMemo(() => {
    const totalOvers = matchState.battingTeam.overs + matchState.battingTeam.balls / 6;
    const runRate = totalOvers > 0 ? (matchState.battingTeam.score / totalOvers).toFixed(2) : '0.00';
    
    const target = matchState.battingTeam.target;
    const runsNeeded = target ? target - matchState.battingTeam.score : null;
    
    let ballsRemaining = null;
    let requiredRate = null;
    
    if (target) {
      const totalBalls = matchState.matchDetails.totalOvers * 6;
      const ballsBowled = matchState.battingTeam.overs * 6 + matchState.battingTeam.balls;
      ballsRemaining = totalBalls - ballsBowled;
      
      if (runsNeeded && ballsRemaining > 0) {
        requiredRate = ((runsNeeded / ballsRemaining) * 6).toFixed(2);
      }
    }
    
    return { runRate, runsNeeded, ballsRemaining, requiredRate };
  }, [matchState]);

  return (
    <div className="bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground rounded-b-3xl shadow-lg">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-white rounded-full" />
            LIVE
          </span>
          <span className="text-xs opacity-80 font-medium">{matchState.matchDetails.matchType}</span>
        </div>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onShare}
            className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10 rounded-full w-9 h-9"
          >
            <Share2 className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/setup')}
            className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10 rounded-full w-9 h-9"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Venue */}
      {matchState.matchDetails.venue && (
        <div className="text-xs opacity-70 px-4 mb-3">{matchState.matchDetails.venue}</div>
      )}

      {/* Score Cards */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-2 gap-3">
          {/* First Innings / Bowling Team */}
          <div className={`p-3 rounded-2xl transition-all ${
            matchState.isFirstInnings ? 'bg-white/10' : 'bg-white/5 opacity-60'
          }`}>
            <div className="text-sm font-medium opacity-90 mb-1 truncate">
              {matchState.bowlingTeam.shortName || matchState.bowlingTeam.name}
            </div>
            <div className="text-2xl font-bold tracking-tight">
              {matchState.firstInningsData?.battingTeam.score || 0}
              <span className="text-lg opacity-70">/{matchState.firstInningsData?.battingTeam.wickets || 0}</span>
            </div>
            <div className="text-xs opacity-70 mt-0.5">
              ({matchState.firstInningsData?.battingTeam.overs || 0}.{matchState.firstInningsData?.battingTeam.balls || 0} ov)
            </div>
          </div>

          {/* Current Innings / Batting Team */}
          <div className={`p-3 rounded-2xl transition-all ${
            !matchState.isFirstInnings ? 'bg-white/15 ring-2 ring-white/20' : 'bg-white/5 opacity-60'
          }`}>
            <div className="text-sm font-medium opacity-90 mb-1 truncate">
              {matchState.battingTeam.shortName || matchState.battingTeam.name}
            </div>
            <div className="text-2xl font-bold tracking-tight">
              {matchState.battingTeam.score}
              <span className="text-lg opacity-70">/{matchState.battingTeam.wickets}</span>
            </div>
            <div className="text-xs opacity-70 mt-0.5">
              ({matchState.battingTeam.overs}.{matchState.battingTeam.balls} ov)
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-black/10 px-4 py-2.5 flex justify-between text-xs font-medium">
        <div className="flex items-center gap-1">
          <span className="opacity-60">CRR</span>
          <span>{stats.runRate}</span>
        </div>
        {stats.requiredRate && (
          <div className="flex items-center gap-1">
            <span className="opacity-60">RRR</span>
            <span>{stats.requiredRate}</span>
          </div>
        )}
        {stats.runsNeeded && stats.ballsRemaining && (
          <div className="flex items-center gap-1">
            <span className="opacity-60">Need</span>
            <span>{stats.runsNeeded} off {stats.ballsRemaining}</span>
          </div>
        )}
      </div>
    </div>
  );
});

LiveScoreHeader.displayName = 'LiveScoreHeader';

export default LiveScoreHeader;
