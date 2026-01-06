import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMatch } from '@/context/MatchContext';
import { useMatchHistory } from '@/hooks/useMatchHistory';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import BatterStats from '@/components/cricket/BatterStats';
import BowlerStats from '@/components/cricket/BowlerStats';
import CurrentOver from '@/components/cricket/CurrentOver';
import MatchHistoryList from '@/components/cricket/MatchHistoryList';
import ShareScorecardModal from '@/components/cricket/ShareScorecardModal';
import { 
  Plus, History, BarChart3, ClipboardList, Activity, 
  Settings, Share2, Trophy, Target, TrendingUp 
} from 'lucide-react';

const FeatureCard = memo(({ icon: Icon, title, description, color, delay }) => (
  <div 
    className="p-4 rounded-xl bg-card border border-border animate-in fade-in slide-in-from-bottom-4"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-3`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <h3 className="font-semibold text-sm mb-1">{title}</h3>
    <p className="text-xs text-muted-foreground">{description}</p>
  </div>
));

const FEATURES = [
  { icon: Trophy, title: 'Live Scoring', description: 'Real-time ball-by-ball updates', color: 'bg-primary' },
  { icon: BarChart3, title: 'Analytics', description: 'Detailed match statistics', color: 'bg-blue-500' },
  { icon: Target, title: 'Wagon Wheel', description: 'Shot placement visualization', color: 'bg-orange-500' },
  { icon: TrendingUp, title: 'Run Rate', description: 'Track scoring patterns', color: 'bg-purple-500' },
];

const Index = () => {
  const navigate = useNavigate();
  const { matchState, loadMatch, clearMatch } = useMatch();
  const { matches, fetchMatches, saveMatch, deleteMatch } = useMatchHistory();
  const [showShareModal, setShowShareModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const isMatchSetup = matchState.matchStatus !== 'setup';

  useEffect(() => {
    if (isMatchSetup && matchState.matchStatus !== 'completed') {
      saveMatch(matchState);
    }
  }, [matchState, isMatchSetup, saveMatch]);

  const handleLoadMatch = useCallback((match) => {
    if (match.match_state) {
      loadMatch(match.match_state);
      if (match.status === 'in_progress') {
        navigate('/umpire');
      }
    }
    setShowHistory(false);
  }, [loadMatch, navigate]);

  const handleDeleteMatch = useCallback((matchId) => {
    deleteMatch(matchId);
  }, [deleteMatch]);

  const handleNewMatch = useCallback(() => {
    clearMatch();
    navigate('/setup');
  }, [clearMatch, navigate]);

  const handleToggleHistory = useCallback(() => {
    if (!showHistory) {
      fetchMatches();
    }
    setShowHistory(prev => !prev);
  }, [showHistory, fetchMatches]);

  const runRate = useMemo(() => {
    const totalOvers = matchState.battingTeam.overs + matchState.battingTeam.balls / 6;
    return totalOvers > 0 ? (matchState.battingTeam.score / totalOvers).toFixed(2) : '0.00';
  }, [matchState.battingTeam.score, matchState.battingTeam.overs, matchState.battingTeam.balls]);

  const target = matchState.battingTeam.target;
  const runsNeeded = target ? target - matchState.battingTeam.score : null;
  const ballsRemaining = useMemo(() => {
    if (!target) return null;
    const totalBalls = matchState.matchDetails.totalOvers * 6;
    const ballsBowled = matchState.battingTeam.overs * 6 + matchState.battingTeam.balls;
    return totalBalls - ballsBowled;
  }, [target, matchState.matchDetails.totalOvers, matchState.battingTeam.overs, matchState.battingTeam.balls]);

  const requiredRate = useMemo(() => {
    if (!runsNeeded || !ballsRemaining || ballsRemaining <= 0) return null;
    return ((runsNeeded / ballsRemaining) * 6).toFixed(2);
  }, [runsNeeded, ballsRemaining]);

  if (!isMatchSetup) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex-1 p-4 max-w-md mx-auto w-full">
          <div className="text-center pt-12 pb-8">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Cricket Scorer</h1>
            <p className="text-muted-foreground text-sm">Professional cricket scoring made simple</p>
          </div>

          <div className="space-y-3 mb-8">
            <Button onClick={handleNewMatch} className="w-full h-12 text-base" size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Start New Match
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={handleToggleHistory} variant="outline" className="h-11">
                <History className="w-4 h-4 mr-2" />
                History
              </Button>
              <Button onClick={() => navigate('/statistics')} variant="outline" className="h-11">
                <BarChart3 className="w-4 h-4 mr-2" />
                Stats
              </Button>
            </div>
          </div>

          {showHistory && (
            <div className="mb-8">
              <MatchHistoryList
                matches={matches}
                onLoadMatch={handleLoadMatch}
                onDeleteMatch={handleDeleteMatch}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 mb-8">
            {FEATURES.map((feature, index) => (
              <FeatureCard key={feature.title} {...feature} delay={index * 100} />
            ))}
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Track every ball, analyze every innings
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded animate-pulse">LIVE</span>
            <span className="text-xs opacity-80">{matchState.matchDetails.matchType}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => setShowShareModal(true)} className="text-primary-foreground hover:bg-primary-foreground/10">
              <Share2 className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigate('/setup')} className="text-primary-foreground hover:bg-primary-foreground/10">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="text-xs opacity-80 mb-3">{matchState.matchDetails.venue}</div>

        <div className="grid grid-cols-2 gap-4">
          <div className={!matchState.isFirstInnings ? 'opacity-60' : ''}>
            <div className="text-sm font-medium">{matchState.bowlingTeam.shortName || matchState.bowlingTeam.name}</div>
            <div className="text-2xl font-bold">
              {matchState.firstInningsData?.battingTeam.score || 0}/{matchState.firstInningsData?.battingTeam.wickets || 0}
            </div>
            <div className="text-xs opacity-80">
              ({matchState.firstInningsData?.battingTeam.overs || 0}.{matchState.firstInningsData?.battingTeam.balls || 0} ov)
            </div>
          </div>
          <div className={matchState.isFirstInnings ? 'opacity-60' : ''}>
            <div className="text-sm font-medium">{matchState.battingTeam.shortName || matchState.battingTeam.name}</div>
            <div className="text-2xl font-bold">
              {matchState.battingTeam.score}/{matchState.battingTeam.wickets}
            </div>
            <div className="text-xs opacity-80">
              ({matchState.battingTeam.overs}.{matchState.battingTeam.balls} ov)
            </div>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 px-4 py-2 flex justify-between text-xs">
        <div>
          <span className="text-muted-foreground">CRR: </span>
          <span className="font-medium">{runRate}</span>
        </div>
        {requiredRate && (
          <div>
            <span className="text-muted-foreground">RRR: </span>
            <span className="font-medium">{requiredRate}</span>
          </div>
        )}
        {runsNeeded && ballsRemaining && (
          <div>
            <span className="text-muted-foreground">Need: </span>
            <span className="font-medium">{runsNeeded} off {ballsRemaining}</span>
          </div>
        )}
      </div>

      <div className="p-4 space-y-4">
        <BatterStats batters={matchState.batters} />
        <BowlerStats bowler={matchState.currentBowler} />
        <CurrentOver balls={matchState.currentOver} />

        {matchState.currentPartnership.runs > 0 && (
          <Card>
            <CardContent className="p-3">
              <div className="text-xs text-muted-foreground mb-1">Partnership</div>
              <div className="font-medium">
                {matchState.currentPartnership.runs} ({matchState.currentPartnership.balls} balls)
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t">
        <div className="flex justify-around py-2 max-w-md mx-auto">
          <Link to="/scorecard" className="flex flex-col items-center gap-1 px-4 py-2 text-muted-foreground hover:text-primary">
            <ClipboardList className="w-5 h-5" />
            <span className="text-xs">Scorecard</span>
          </Link>
          <Link to="/analytics" className="flex flex-col items-center gap-1 px-4 py-2 text-muted-foreground hover:text-primary">
            <Activity className="w-5 h-5" />
            <span className="text-xs">Analytics</span>
          </Link>
          <Link to="/umpire" className="flex flex-col items-center gap-1 px-4 py-2 text-primary font-medium">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center -mt-4 shadow-lg">
              <Plus className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xs">Umpire</span>
          </Link>
        </div>
      </div>

      <ShareScorecardModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        matchState={matchState}
      />
    </div>
  );
};

export default Index;
