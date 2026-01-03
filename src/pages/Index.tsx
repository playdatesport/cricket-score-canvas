import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { useMatch } from '@/context/MatchContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Radio, Plus, FileText, BarChart3, Share2, Zap, Trophy, Target, TrendingUp, History, LucideIcon } from 'lucide-react';
import BatterStats from '@/components/cricket/BatterStats';
import BowlerStats from '@/components/cricket/BowlerStats';
import CurrentOver from '@/components/cricket/CurrentOver';
import ShareScorecardModal from '@/components/cricket/ShareScorecardModal';
import MatchHistoryList from '@/components/cricket/MatchHistoryList';
import { useMatchHistory } from '@/hooks/useMatchHistory';
import { toast } from 'sonner';

// Memoized feature card component
const FeatureCard = memo<{
  icon: LucideIcon;
  title: string;
  desc: string;
  color: string;
  delay: number;
}>(({ icon: Icon, title, desc, color, delay }) => (
  <div
    className="bg-card/80 backdrop-blur-sm p-4 sm:p-5 rounded-2xl shadow-card border border-border/50 hover-lift cursor-default"
    style={{ animationDelay: `${delay}s` }}
  >
    <Icon className={`w-7 h-7 ${color} mb-3`} />
    <h3 className="font-bold text-sm sm:text-base text-foreground">{title}</h3>
    <p className="text-xs sm:text-sm text-muted-foreground mt-1">{desc}</p>
  </div>
));
FeatureCard.displayName = 'FeatureCard';

// Static features data - defined outside component to prevent recreation
const FEATURES = [
  { icon: Zap, title: 'Live Stats', desc: 'Real-time updates', color: 'text-warning' },
  { icon: Trophy, title: 'Full Scorecard', desc: 'Detailed records', color: 'text-success' },
  { icon: Target, title: 'Analytics', desc: 'Wagon wheel & charts', color: 'text-primary' },
  { icon: TrendingUp, title: 'Share', desc: 'Export & share', color: 'text-cricket-purple' },
] as const;

const Index: React.FC = () => {
  const { matchState, isMatchSetup, loadMatchState } = useMatch();
  const navigate = useNavigate();
  const [showShareModal, setShowShareModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const { matches, loading, saveMatch, loadMatch, deleteMatch, clearCurrentMatch, fetchMatches } = useMatchHistory();

  // Auto-save match when state changes
  useEffect(() => {
    if (isMatchSetup && matchState.matchStatus !== 'setup') {
      const saveTimer = setTimeout(() => {
        saveMatch(matchState);
      }, 2000);
      return () => clearTimeout(saveTimer);
    }
  }, [matchState, isMatchSetup, saveMatch]);

  const handleLoadMatch = useCallback(async (matchId: string) => {
    const state = await loadMatch(matchId);
    if (state) {
      loadMatchState(state);
      setShowHistory(false);
      toast.success('Match loaded');
      if (state.matchStatus === 'in_progress') {
        navigate('/umpire');
      }
    }
  }, [loadMatch, loadMatchState, navigate]);

  const handleDeleteMatch = useCallback(async (matchId: string) => {
    await deleteMatch(matchId);
  }, [deleteMatch]);

  const handleNewMatch = useCallback(() => {
    clearCurrentMatch();
    navigate('/setup');
  }, [clearCurrentMatch, navigate]);

  const handleToggleHistory = useCallback(() => {
    fetchMatches();
    setShowHistory(prev => !prev);
  }, [fetchMatches]);

  const handleOpenShare = useCallback(() => setShowShareModal(true), []);
  const handleCloseShare = useCallback(() => setShowShareModal(false), []);

  // Memoized calculations
  const stats = useMemo(() => {
    const overs = matchState.battingTeam.overs + matchState.battingTeam.balls / 6;
    const runRate = overs > 0 ? (matchState.battingTeam.score / overs).toFixed(2) : '0.00';
    
    const target = matchState.battingTeam.target;
    const runsNeeded = target ? target - matchState.battingTeam.score : 0;
    const totalBalls = matchState.matchDetails.totalOvers * 6;
    const ballsBowled = matchState.battingTeam.overs * 6 + matchState.battingTeam.balls;
    const ballsRemaining = totalBalls - ballsBowled;
    const requiredRate = ballsRemaining > 0 ? ((runsNeeded / ballsRemaining) * 6).toFixed(2) : '0.00';
    const projected = Math.round(parseFloat(runRate) * matchState.matchDetails.totalOvers);

    return { runRate, target, runsNeeded, ballsRemaining, requiredRate, projected };
  }, [
    matchState.battingTeam.overs,
    matchState.battingTeam.balls,
    matchState.battingTeam.score,
    matchState.battingTeam.target,
    matchState.matchDetails.totalOvers,
  ]);

  // Show welcome screen if no match is setup
  if (!isMatchSetup) {
    return (
      <div className="min-h-screen bg-background gradient-hero">
        <div className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-10 w-32 h-32 rounded-full border-4 border-primary" />
            <div className="absolute top-40 right-20 w-24 h-24 rounded-full border-4 border-primary" />
            <div className="absolute bottom-20 left-1/4 w-16 h-16 rounded-full border-4 border-primary" />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6 pt-12">
            {/* Logo */}
            <div className="animate-float mb-8">
              <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto gradient-primary rounded-3xl flex items-center justify-center shadow-glow rotate-12 hover:rotate-0 transition-transform duration-500">
                <span className="text-5xl sm:text-6xl -rotate-12">🏏</span>
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-8 animate-slide-up">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-3 tracking-tight">
                Cricket <span className="text-primary">Scorer</span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
                Professional ball-by-ball scoring with live stats, sound effects, and stunning analytics
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="w-full max-w-sm mb-8 animate-slide-up space-y-3" style={{ animationDelay: '0.1s' }}>
              <Button
                onClick={handleNewMatch}
                className="w-full h-14 sm:h-16 text-lg sm:text-xl font-bold gap-3 gradient-primary shadow-glow hover:shadow-lg transition-all duration-300 rounded-2xl"
              >
                <Plus className="w-6 h-6" />
                Start New Match
              </Button>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleToggleHistory}
                  className="flex-1 h-12 text-sm font-semibold gap-2 rounded-xl hover-lift"
                >
                  <History className="w-4 h-4" />
                  History
                  {matches.length > 0 && !showHistory && (
                    <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] rounded-full">
                      {matches.length}
                    </span>
                  )}
                </Button>
                <Link to="/statistics" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full h-12 text-sm font-semibold gap-2 rounded-xl hover-lift"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Stats
                  </Button>
                </Link>
              </div>
            </div>

            {/* Match History */}
            {showHistory && (
              <div className="w-full max-w-lg mb-8 animate-slide-up">
                <MatchHistoryList
                  matches={matches}
                  loading={loading}
                  onLoadMatch={handleLoadMatch}
                  onDeleteMatch={handleDeleteMatch}
                />
              </div>
            )}

            {/* Features Grid */}
            {!showHistory && (
              <div className="w-full max-w-lg animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="grid grid-cols-2 gap-4">
                  {FEATURES.map((feature, idx) => (
                    <FeatureCard
                      key={feature.title}
                      icon={feature.icon}
                      title={feature.title}
                      desc={feature.desc}
                      color={feature.color}
                      delay={0.3 + idx * 0.1}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Tagline */}
            <p className="mt-10 text-xs text-muted-foreground/60 animate-pulse-soft">
              Made for cricket enthusiasts ❤️
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 sm:pb-28">
      {/* Share Modal */}
      <ShareScorecardModal
        isOpen={showShareModal}
        onClose={handleCloseShare}
        matchState={matchState}
      />

      {/* Header with Match Info */}
      <div className="gradient-primary text-primary-foreground">
        <div className="relative px-4 pt-4 pb-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-medium opacity-90">LIVE</span>
              {!matchState.isFirstInnings && (
                <span className="text-xs bg-primary-foreground/20 px-2 py-0.5 rounded-full ml-2">
                  2nd Innings
                </span>
              )}
            </div>
            <button
              onClick={handleOpenShare}
              className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Match Type & Venue */}
          <div className="text-center mb-4">
            <span className="text-xs font-medium bg-primary-foreground/20 px-3 py-1 rounded-full">
              {matchState.matchDetails.matchType} • {matchState.matchDetails.totalOvers} Overs
            </span>
            <p className="text-xs opacity-70 mt-2 line-clamp-1">
              {matchState.matchDetails.venue || 'Venue not set'}
            </p>
          </div>

          {/* Score Display */}
          <div className="flex items-stretch justify-between gap-4">
            {/* Batting Team */}
            <div className="flex-1 text-center">
              <p className="text-xs font-medium opacity-80 mb-1 line-clamp-1">
                {matchState.battingTeam.shortName || matchState.battingTeam.name}
              </p>
              <div className="text-4xl sm:text-5xl font-black tracking-tight animate-score-update">
                {matchState.battingTeam.score}
                <span className="text-2xl sm:text-3xl opacity-70">/{matchState.battingTeam.wickets}</span>
              </div>
              <p className="text-sm font-semibold mt-1">
                ({matchState.battingTeam.overs}.{matchState.battingTeam.balls})
              </p>
            </div>

            {/* VS Divider */}
            <div className="flex flex-col items-center justify-center px-2">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center font-bold text-sm">
                VS
              </div>
            </div>

            {/* Bowling Team / First Innings */}
            <div className="flex-1 text-center">
              <p className="text-xs font-medium opacity-80 mb-1 line-clamp-1">
                {matchState.isFirstInnings 
                  ? (matchState.bowlingTeam.shortName || matchState.bowlingTeam.name)
                  : (matchState.firstInningsData?.battingTeam.shortName || matchState.firstInningsData?.battingTeam.name)
                }
              </p>
              <div className="text-4xl sm:text-5xl font-black tracking-tight opacity-60">
                {matchState.isFirstInnings 
                  ? matchState.bowlingTeam.score
                  : matchState.firstInningsData?.battingTeam.score || 0
                }
                <span className="text-2xl sm:text-3xl opacity-70">
                  /{matchState.isFirstInnings 
                    ? matchState.bowlingTeam.wickets 
                    : matchState.firstInningsData?.battingTeam.wickets || 0}
                </span>
              </div>
              {!matchState.isFirstInnings && stats.target && (
                <p className="text-sm font-semibold mt-1 opacity-80">
                  Target: {stats.target}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex justify-center gap-6 px-4 py-3 bg-primary-foreground/10">
          <div className="text-center">
            <p className="text-[10px] uppercase opacity-60">CRR</p>
            <p className="text-sm font-bold">{stats.runRate}</p>
          </div>
          {!matchState.isFirstInnings && stats.target && (
            <>
              <div className="w-px h-8 bg-primary-foreground/20" />
              <div className="text-center">
                <p className="text-[10px] uppercase opacity-60">RRR</p>
                <p className="text-sm font-bold">{stats.requiredRate}</p>
              </div>
              <div className="w-px h-8 bg-primary-foreground/20" />
              <div className="text-center">
                <p className="text-[10px] uppercase opacity-60">Need</p>
                <p className="text-sm font-bold">{stats.runsNeeded} ({stats.ballsRemaining})</p>
              </div>
            </>
          )}
          {matchState.isFirstInnings && (
            <>
              <div className="w-px h-8 bg-primary-foreground/20" />
              <div className="text-center">
                <p className="text-[10px] uppercase opacity-60">Projected</p>
                <p className="text-sm font-bold">{stats.projected}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Current Batters & Bowler */}
      <div className="px-4 py-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <BatterStats batters={matchState.batters} />
          <BowlerStats bowler={matchState.currentBowler} />
        </div>
      </div>

      {/* Current Over */}
      <CurrentOver
        balls={matchState.currentOver}
        currentOvers={matchState.battingTeam.overs}
        currentBalls={matchState.battingTeam.balls}
      />

      {/* Partnership Info */}
      {matchState.currentPartnership.runs > 0 && (
        <div className="mx-4 mt-4 p-4 bg-card rounded-xl shadow-card border border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Current Partnership</p>
                <p className="text-sm font-semibold text-foreground">
                  {matchState.currentPartnership.batter1} & {matchState.currentPartnership.batter2}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-foreground">{matchState.currentPartnership.runs}</p>
              <p className="text-xs text-muted-foreground">({matchState.currentPartnership.balls} balls)</p>
            </div>
          </div>
        </div>
      )}

      {/* Fixed bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 glass-effect border-t border-border/50 safe-area-pb">
        <div className="flex gap-2 p-3 max-w-lg mx-auto">
          <Link to="/scorecard" className="flex-1">
            <Button variant="outline" className="w-full h-12 text-sm font-semibold gap-2 rounded-xl hover-lift">
              <FileText className="w-4 h-4" />
              <span className="hidden xs:inline">Scorecard</span>
            </Button>
          </Link>
          <Link to="/analytics" className="flex-1">
            <Button variant="outline" className="w-full h-12 text-sm font-semibold gap-2 rounded-xl hover-lift">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden xs:inline">Analytics</span>
            </Button>
          </Link>
          <Link to="/umpire" className="flex-1">
            <Button className="w-full h-12 text-sm font-semibold gap-2 gradient-primary shadow-button rounded-xl">
              <Radio className="w-4 h-4" />
              Umpire
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
