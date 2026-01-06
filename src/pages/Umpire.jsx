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

const BatterDisplay = memo(({ batter }) => (
  <div className={`flex items-center justify-between p-2 rounded ${batter.isOnStrike ? 'bg-primary/10' : ''}`}>
    <div className="flex items-center gap-2">
      {batter.isOnStrike && <span className="text-primary">●</span>}
      <span className="font-medium text-sm">{batter.name}</span>
    </div>
    <div className="text-right">
      <span className="font-bold">{batter.runs}</span>
      <span className="text-muted-foreground text-xs ml-1">({batter.balls})</span>
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
    <div className="min-h-screen bg-background pb-40">
      <div className="sticky top-0 bg-background border-b z-10">
        <div className="flex items-center justify-between p-3">
          <Link to="/" className="text-muted-foreground hover:text-foreground">
            <Home className="w-5 h-5" />
          </Link>
          <h1 className="font-semibold">Umpire Mode</h1>
          <Button variant="ghost" size="icon" onClick={() => setShowShareModal(true)}>
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {targetInfo && (
        <div className="bg-primary/10 px-4 py-2 text-center">
          <span className="text-sm font-medium">
            Need {targetInfo.needed} off {targetInfo.ballsRemaining} balls
          </span>
        </div>
      )}

      <div className="p-4 space-y-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm text-muted-foreground">{matchState.battingTeam.name}</div>
                <div className="text-3xl font-bold">
                  {matchState.battingTeam.score}/{matchState.battingTeam.wickets}
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-medium">
                  {matchState.battingTeam.overs}.{matchState.battingTeam.balls}
                </div>
                <div className="text-xs text-muted-foreground">
                  of {matchState.matchDetails.totalOvers} overs
                </div>
              </div>
            </div>

            {activeBatters.map(batter => (
              <BatterDisplay key={batter.id} batter={batter} />
            ))}
          </CardContent>
        </Card>

        <div className="flex gap-2 text-xs">
          <Link to="/scorecard" className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <ClipboardList className="w-4 h-4 mr-1" />
              Scorecard
            </Button>
          </Link>
          <Link to="/analytics" className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <Activity className="w-4 h-4 mr-1" />
              Analytics
            </Button>
          </Link>
        </div>

        <CurrentOver balls={matchState.currentOver} />

        <div className="grid grid-cols-4 gap-2">
          <Button variant="outline" size="sm" onClick={handleUndo} disabled={matchState.currentOver.length === 0}>
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleChangeBowler}>
            <ArrowRightLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowBatterChangeModal(true)}>
            <Users className="w-4 h-4" />
          </Button>
          {matchState.isFirstInnings && (
            <Button variant="outline" size="sm" onClick={handleEndInnings}>
              <SkipForward className="w-4 h-4" />
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
