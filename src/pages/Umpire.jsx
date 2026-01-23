import { useState, useCallback, useMemo, useEffect, memo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMatch } from '@/context/MatchContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import CurrentOver from '@/components/cricket/CurrentOver';
import ScoringControls from '@/components/cricket/ScoringControls';
import WicketModal from '@/components/cricket/WicketModal';
import BowlerSelectionModal from '@/components/cricket/BowlerSelectionModal';
import OpeningSelectionModal from '@/components/cricket/OpeningSelectionModal';
import BatterChangeModal from '@/components/cricket/BatterChangeModal';
import ShareScorecardModal from '@/components/cricket/ShareScorecardModal';
import InningsBreakModal from '@/components/cricket/InningsBreakModal';
import MatchResultModal from '@/components/cricket/MatchResultModal';
import { 
  Undo2, Users, ArrowRightLeft, Share2, Home, 
  ClipboardList, Activity, SkipForward 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ThemeToggle from '@/components/ThemeToggle';

const BatterDisplay = memo(({ batter }) => (
  <div className={cn(
    "flex items-center justify-between p-3 rounded-xl transition-all",
    batter.isOnStrike ? 'bg-primary/10 ring-1 ring-primary/20' : 'bg-muted/50'
  )}>
    <div className="flex items-center gap-3">
      {batter.isOnStrike && (
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
      )}
      <span className="font-medium">{batter.name}</span>
    </div>
    <div className="text-right">
      <span className="text-xl font-bold">{batter.runs}</span>
      <span className="text-muted-foreground text-sm ml-1">({batter.balls})</span>
    </div>
  </div>
));

const Umpire = () => {
  const navigate = useNavigate();
  const { 
    matchState, recordBall, recordWicket, changeBowler, 
    undoLastBall, startSecondInnings, selectOpeningPlayers,
    changeBatter, clearMatch 
  } = useMatch();

  const [showWicketModal, setShowWicketModal] = useState(false);
  const [showBowlerModal, setShowBowlerModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showBatterChangeModal, setShowBatterChangeModal] = useState(false);

  useEffect(() => {
    if (matchState.matchStatus === 'setup') {
      navigate('/setup');
    }
  }, [matchState.matchStatus, navigate]);

  useEffect(() => {
    if (matchState.matchStatus === 'completed' && matchState.matchResult) {
      setShowResultModal(true);
    }
  }, [matchState.matchStatus, matchState.matchResult]);

  const handleUndo = useCallback(() => {
    undoLastBall();
  }, [undoLastBall]);

  const handleChangeBowler = useCallback(() => {
    setShowBowlerModal(true);
  }, []);

  const handleEndInnings = useCallback(() => {
    startSecondInnings();
  }, [startSecondInnings]);

  const handleNewMatch = useCallback(() => {
    clearMatch();
    navigate('/setup');
  }, [clearMatch, navigate]);

  const handleBatterChange = useCallback((outgoingId, incomingName) => {
    changeBatter(outgoingId, incomingName);
    setShowBatterChangeModal(false);
  }, [changeBatter]);

  const availableBatters = useMemo(() => {
    const usedNames = matchState.allBatters.map(b => b.name);
    return matchState.battingTeam.players.filter(p => !usedNames.includes(p));
  }, [matchState.allBatters, matchState.battingTeam.players]);

  const outgoingBatter = useMemo(() => {
    return matchState.batters.find(b => b.isOnStrike);
  }, [matchState.batters]);

  const currentBattersForModal = useMemo(() => {
    return matchState.batters.map(b => ({ id: b.id, name: b.name }));
  }, [matchState.batters]);

  const activeBatters = useMemo(() => {
    return matchState.batters.filter(b => !b.isOut);
  }, [matchState.batters]);

  const targetInfo = useMemo(() => {
    const target = matchState.battingTeam.target;
    if (!target) return null;
    const needed = target - matchState.battingTeam.score;
    const ballsRemaining = (matchState.matchDetails.totalOvers * 6) - 
      (matchState.battingTeam.overs * 6 + matchState.battingTeam.balls);
    return { target, needed, ballsRemaining };
  }, [matchState.battingTeam.target, matchState.battingTeam.score, 
      matchState.matchDetails.totalOvers, matchState.battingTeam.overs, matchState.battingTeam.balls]);

  const showOpeningModal = matchState.matchStatus === 'not_started' && matchState.batters.length === 0;
  const showInningsBreak = matchState.matchStatus === 'innings_break';

  return (
    <div className="min-h-screen bg-background pb-44">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-lg border-b border-border z-10">
        <div className="flex items-center justify-between p-4">
          <Link to="/" className="p-2 -m-2 text-muted-foreground hover:text-foreground transition-colors">
            <Home className="w-5 h-5" />
          </Link>
          <h1 className="font-semibold text-lg">Umpire Mode</h1>
          <div className="flex items-center gap-1">
            <ThemeToggle className="rounded-full" />
            <Button variant="ghost" size="icon" onClick={() => setShowShareModal(true)} className="rounded-full">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Target Banner */}
      {targetInfo && (
        <div className="bg-gradient-to-r from-primary/10 via-primary/15 to-primary/10 px-4 py-3 text-center border-b border-primary/10">
          <span className="text-sm font-semibold text-primary">
            Need {targetInfo.needed} off {targetInfo.ballsRemaining} balls
          </span>
        </div>
      )}

      <div className="p-4 space-y-4">
        <Card className="border-0 shadow-card overflow-hidden">
          <CardContent className="p-0">
            {/* Score Section */}
            <div className="p-4 gradient-primary text-primary-foreground">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm opacity-80 mb-1">{matchState.battingTeam.name}</div>
                  <div className="text-4xl font-bold tracking-tight">
                    {matchState.battingTeam.score}
                    <span className="text-2xl opacity-70">/{matchState.battingTeam.wickets}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {matchState.battingTeam.overs}.{matchState.battingTeam.balls}
                  </div>
                  <div className="text-xs opacity-70">
                    of {matchState.matchDetails.totalOvers} overs
                  </div>
                </div>
              </div>
            </div>

            {/* Batters Section */}
            <div className="p-3 space-y-2">
              {activeBatters.map(batter => (
                <BatterDisplay key={batter.id} batter={batter} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="flex gap-2">
          <Link to="/scorecard" className="flex-1">
            <Button variant="outline" size="sm" className="w-full h-11 rounded-xl">
              <ClipboardList className="w-4 h-4 mr-2" />
              Scorecard
            </Button>
          </Link>
          <Link to="/analytics" className="flex-1">
            <Button variant="outline" size="sm" className="w-full h-11 rounded-xl">
              <Activity className="w-4 h-4 mr-2" />
              Analytics
            </Button>
          </Link>
        </div>

        <CurrentOver balls={matchState.currentOver} />

        {/* Action Buttons */}
        <div className="grid grid-cols-4 gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleUndo} 
            disabled={matchState.currentOver.length === 0}
            className="h-12 rounded-xl flex flex-col gap-0.5"
          >
            <Undo2 className="w-4 h-4" />
            <span className="text-[10px]">Undo</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleChangeBowler}
            className="h-12 rounded-xl flex flex-col gap-0.5"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span className="text-[10px]">Bowler</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowBatterChangeModal(true)}
            className="h-12 rounded-xl flex flex-col gap-0.5"
          >
            <Users className="w-4 h-4" />
            <span className="text-[10px]">Batter</span>
          </Button>
          {matchState.isFirstInnings && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleEndInnings}
              className="h-12 rounded-xl flex flex-col gap-0.5"
            >
              <SkipForward className="w-4 h-4" />
              <span className="text-[10px]">End</span>
            </Button>
          )}
        </div>
      </div>

      <ScoringControls
        onScore={recordBall}
        onWicket={() => setShowWicketModal(true)}
        disabled={matchState.matchStatus !== 'in_progress'}
      />

      <OpeningSelectionModal
        isOpen={showOpeningModal}
        battingPlayers={matchState.battingTeam.players}
        bowlingPlayers={matchState.bowlingTeam.players}
        onSelect={selectOpeningPlayers}
      />

      <BatterChangeModal
        isOpen={showBatterChangeModal}
        onClose={() => setShowBatterChangeModal(false)}
        currentBatters={currentBattersForModal}
        availablePlayers={availableBatters}
        onChangeBatter={handleBatterChange}
      />

      <WicketModal
        isOpen={showWicketModal}
        onClose={() => setShowWicketModal(false)}
        batters={matchState.batters}
        bowler={matchState.currentBowler}
        fielders={matchState.bowlingTeam.players}
        availableBatters={availableBatters}
        onRecordWicket={recordWicket}
      />

      <BowlerSelectionModal
        isOpen={showBowlerModal}
        onClose={() => setShowBowlerModal(false)}
        players={matchState.bowlingTeam.players}
        currentBowler={matchState.currentBowler.name}
        allBowlers={matchState.allBowlers}
        onSelectBowler={changeBowler}
      />

      <ShareScorecardModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        matchState={matchState}
      />

      <InningsBreakModal
        isOpen={showInningsBreak}
        firstInningsScore={matchState.firstInningsData?.battingTeam.score || matchState.battingTeam.score}
        firstInningsWickets={matchState.firstInningsData?.battingTeam.wickets || matchState.battingTeam.wickets}
        battingTeam={matchState.firstInningsData?.battingTeam.name || matchState.battingTeam.name}
        onStartSecondInnings={startSecondInnings}
      />

      <MatchResultModal
        isOpen={showResultModal}
        onClose={() => setShowResultModal(false)}
        result={matchState.matchResult}
        onNewMatch={handleNewMatch}
        onViewScorecard={() => navigate('/full-scorecard')}
      />
    </div>
  );
};

export default Umpire;
