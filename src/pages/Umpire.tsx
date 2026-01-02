import React, { useState } from 'react';
import { useMatch } from '@/context/MatchContext';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Radio, Volume2, VolumeX, Smartphone, FileText, BarChart3, Share2, Flag, Target, UserMinus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CurrentOver from '@/components/cricket/CurrentOver';
import ScoringControls from '@/components/cricket/ScoringControls';
import WicketModal from '@/components/cricket/WicketModal';
import BowlerSelectionModal from '@/components/cricket/BowlerSelectionModal';
import ShareScorecardModal from '@/components/cricket/ShareScorecardModal';
import InningsBreakModal from '@/components/cricket/InningsBreakModal';
import MatchResultModal from '@/components/cricket/MatchResultModal';
import OpeningSelectionModal from '@/components/cricket/OpeningSelectionModal';
import BatterChangeModal from '@/components/cricket/BatterChangeModal';
import { toast } from '@/hooks/use-toast';

const Umpire: React.FC = () => {
  const { 
    matchState, 
    addBall, 
    undoLastBall, 
    changeStriker, 
    toggleSound, 
    toggleVibration, 
    isMatchSetup,
    pendingWicket,
    setPendingWicket,
    processWicket,
    pendingBowlerChange,
    setPendingBowlerChange,
    changeBowler,
    lastBowlerName,
    endInnings,
    startSecondInnings,
    showInningsBreak,
    setShowInningsBreak,
    resetMatch,
    pendingOpeningSelection,
    setOpeningPlayers,
    replaceBatter,
    isSecondInningsSelection,
  } = useMatch();
  const navigate = useNavigate();
  const [showShareModal, setShowShareModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showBatterChangeModal, setShowBatterChangeModal] = useState(false);

  // Redirect to setup if match not configured
  React.useEffect(() => {
    if (!isMatchSetup) {
      navigate('/setup');
    }
  }, [isMatchSetup, navigate]);

  // Show result modal when match completes
  React.useEffect(() => {
    if (matchState.matchStatus === 'completed' && matchState.matchResult) {
      setShowResultModal(true);
    }
  }, [matchState.matchStatus, matchState.matchResult]);

  const handleUndo = () => {
    undoLastBall();
    toast({
      title: "Ball undone",
      description: "Last ball has been removed",
    });
  };

  const handleChangeBowler = () => {
    setPendingBowlerChange(true);
  };

  const handleEndInnings = () => {
    endInnings();
    toast({
      title: matchState.isFirstInnings ? "First innings ended" : "Match completed",
      description: matchState.isFirstInnings 
        ? `Target: ${matchState.battingTeam.score + 1} runs` 
        : "View the full scorecard for details",
    });
  };

  const handleNewMatch = () => {
    resetMatch();
    navigate('/setup');
  };

  // Get available batters (those who haven't batted yet)
  const battedPlayers = matchState.allBatters.map(b => b.name);
  const availableBatters = matchState.battingTeam.players.filter(
    p => p.trim() && !battedPlayers.includes(p)
  );

  const outgoingBatter = matchState.batters.find(b => b.isOnStrike)?.name || '';

  // Calculate required info for second innings
  const target = matchState.battingTeam.target;
  const runsNeeded = target ? target - matchState.battingTeam.score : 0;
  const totalBalls = matchState.matchDetails.totalOvers * 6;
  const ballsBowled = matchState.battingTeam.overs * 6 + matchState.battingTeam.balls;
  const ballsRemaining = totalBalls - ballsBowled;
  const requiredRate = ballsRemaining > 0 ? (runsNeeded / ballsRemaining) * 6 : 0;

  if (!isMatchSetup) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Opening Selection Modal */}
      <OpeningSelectionModal
        isOpen={pendingOpeningSelection}
        onClose={() => {}}
        onConfirm={setOpeningPlayers}
        battingTeamPlayers={matchState.battingTeam.players}
        bowlingTeamPlayers={matchState.bowlingTeam.players}
        battingTeamName={matchState.battingTeam.name}
        bowlingTeamName={matchState.bowlingTeam.name}
        isSecondInnings={isSecondInningsSelection}
      />

      {/* Batter Change Modal */}
      <BatterChangeModal
        isOpen={showBatterChangeModal}
        onClose={() => setShowBatterChangeModal(false)}
        onConfirm={(outgoingId, newBatter, reason) => {
          replaceBatter(outgoingId, newBatter, reason);
          toast({
            title: reason === 'retired_hurt' ? 'Batter Retired Hurt' : 'Batter Substituted',
            description: `${newBatter} is now at the crease`,
          });
        }}
        currentBatters={matchState.batters.filter(b => !b.isOut).map(b => ({
          id: b.id,
          name: b.name,
          isOnStrike: b.isOnStrike,
          runs: b.runs,
          balls: b.balls,
        }))}
        availableBatters={availableBatters}
        battingTeamName={matchState.battingTeam.name}
      />

      {/* Wicket Modal */}
      <WicketModal
        isOpen={pendingWicket}
        onClose={() => setPendingWicket(false)}
        onConfirm={processWicket}
        outgoingBatter={outgoingBatter}
        availableBatters={availableBatters}
        fielders={matchState.bowlingTeam.players}
        currentBowler={matchState.currentBowler.name}
      />

      {/* Bowler Selection Modal */}
      <BowlerSelectionModal
        isOpen={pendingBowlerChange}
        onClose={() => setPendingBowlerChange(false)}
        onSelectBowler={changeBowler}
        availableBowlers={matchState.bowlingTeam.players}
        previousBowlers={matchState.allBowlers}
        lastBowler={lastBowlerName}
        overNumber={matchState.battingTeam.overs}
      />

      {/* Share Modal */}
      <ShareScorecardModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        matchState={matchState}
      />

      {/* Innings Break Modal */}
      <InningsBreakModal
        isOpen={showInningsBreak}
        onClose={() => setShowInningsBreak(false)}
        firstInningsScore={matchState.battingTeam.score}
        firstInningsWickets={matchState.battingTeam.wickets}
        firstInningsOvers={`${matchState.battingTeam.overs}.${matchState.battingTeam.balls}`}
        battingTeamName={matchState.battingTeam.name}
        bowlingTeamName={matchState.bowlingTeam.name}
        target={matchState.battingTeam.score + 1}
        onStartSecondInnings={startSecondInnings}
      />

      {/* Match Result Modal */}
      {matchState.matchResult && (
        <MatchResultModal
          isOpen={showResultModal}
          onClose={() => setShowResultModal(false)}
          result={matchState.matchResult}
          onNewMatch={handleNewMatch}
          onViewScorecard={() => {
            setShowResultModal(false);
            navigate('/scorecard');
          }}
        />
      )}

      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3">
          <Link to="/" className="flex items-center gap-1 sm:gap-2 text-foreground">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium text-sm sm:text-base hidden sm:inline">Back</span>
          </Link>
          <div className="flex items-center gap-1 sm:gap-2">
            <Radio className="w-4 h-4 sm:w-5 sm:h-5 text-primary animate-pulse" />
            <h1 className="text-base sm:text-lg font-bold text-foreground">Umpire</h1>
            {!matchState.isFirstInnings && (
              <span className="text-[10px] sm:text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
                2nd Inn
              </span>
            )}
          </div>
          <div className="flex items-center gap-0.5 sm:gap-1">
            <button
              onClick={() => setShowShareModal(true)}
              className="p-1.5 sm:p-2 rounded-full transition-colors text-muted-foreground hover:text-primary"
            >
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={toggleSound}
              className={`p-1.5 sm:p-2 rounded-full transition-colors ${
                matchState.soundEnabled ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {matchState.soundEnabled ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
            <button
              onClick={toggleVibration}
              className={`p-1.5 sm:p-2 rounded-full transition-colors ${
                matchState.vibrationEnabled ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Smartphone className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Target Display (Second Innings Only) */}
      {!matchState.isFirstInnings && target && (
        <div className="mx-3 sm:mx-4 mt-3 bg-primary/10 border border-primary/30 rounded-xl p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Target: {target}</span>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-primary">{runsNeeded}</span>
              <span className="text-xs text-muted-foreground ml-1">needed from</span>
              <span className="text-lg font-bold text-foreground ml-1">{ballsRemaining}</span>
              <span className="text-xs text-muted-foreground ml-1">balls</span>
            </div>
          </div>
          <div className="mt-2 flex justify-end">
            <span className="text-xs text-muted-foreground">
              RRR: <span className="font-semibold text-foreground">{requiredRate.toFixed(2)}</span>
            </span>
          </div>
        </div>
      )}

      {/* Compact Score Display */}
      <div className="bg-card mx-3 sm:mx-4 mt-3 sm:mt-4 rounded-xl shadow-card p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <span className="text-xs sm:text-sm text-muted-foreground line-clamp-1">{matchState.battingTeam.name}</span>
            <div className="text-xl sm:text-2xl font-bold text-foreground">
              {matchState.battingTeam.score}/{matchState.battingTeam.wickets}
            </div>
          </div>
          <div className="text-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 mx-2">
            <span className="text-base sm:text-lg font-bold text-primary">
              {matchState.battingTeam.overs}.{matchState.battingTeam.balls}
            </span>
            <div className="text-[10px] sm:text-xs text-muted-foreground">OVERS</div>
          </div>
          <div className="text-center flex-1">
            <span className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
              {matchState.isFirstInnings ? matchState.bowlingTeam.name : matchState.firstInningsData?.battingTeam.name || matchState.bowlingTeam.name}
            </span>
            <div className="text-xl sm:text-2xl font-bold text-foreground">
              {matchState.isFirstInnings 
                ? `${matchState.bowlingTeam.score}/${matchState.bowlingTeam.wickets}`
                : `${matchState.firstInningsData?.battingTeam.score || 0}/${matchState.firstInningsData?.battingTeam.wickets || 0}`
              }
            </div>
          </div>
        </div>

        {/* Current Batters */}
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border">
          <div className="flex flex-col sm:flex-row gap-2">
            {matchState.batters.filter(b => !b.isOut).map((batter) => (
              <div
                key={batter.id}
                className={`flex-1 flex items-center justify-between px-2.5 sm:px-3 py-2 rounded-lg ${
                  batter.isOnStrike ? 'bg-primary/10 border border-primary/30' : 'bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                  <span className="font-medium text-foreground text-xs sm:text-sm truncate">{batter.name}</span>
                  {batter.isOnStrike && (
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary animate-pulse flex-shrink-0" />
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-base sm:text-lg font-bold text-foreground">{batter.runs}</span>
                  <span className="text-[10px] sm:text-xs text-muted-foreground ml-0.5 sm:ml-1">({batter.balls})</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 text-primary text-xs sm:text-sm h-8 sm:h-9"
              onClick={changeStriker}
            >
              Swap Striker
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 text-orange-500 text-xs sm:text-sm h-8 sm:h-9"
              onClick={() => setShowBatterChangeModal(true)}
            >
              <UserMinus className="w-3.5 h-3.5 mr-1" />
              Change Batter
            </Button>
          </div>
        </div>

        {/* Current Bowler */}
        <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-border">
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span className="text-muted-foreground">Bowler:</span>
            <span className="font-medium text-foreground">
              {matchState.currentBowler.name} - {matchState.currentBowler.overs}.{matchState.currentBowler.balls} - {matchState.currentBowler.runs}/{matchState.currentBowler.wickets}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="px-3 sm:px-4 mt-2 sm:mt-3 flex gap-2">
        <Link to="/scorecard" className="flex-1">
          <Button variant="outline" size="sm" className="w-full gap-1.5 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9">
            <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Scorecard</span>
          </Button>
        </Link>
        <Link to="/analytics" className="flex-1">
          <Button variant="outline" size="sm" className="w-full gap-1.5 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9">
            <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Analytics</span>
          </Button>
        </Link>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 gap-1.5 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9 text-destructive border-destructive/30 hover:bg-destructive/10"
          onClick={handleEndInnings}
        >
          <Flag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden xs:inline">End Innings</span>
        </Button>
      </div>

      {/* Current Over */}
      <CurrentOver
        balls={matchState.currentOver}
        currentOvers={matchState.battingTeam.overs}
        currentBalls={matchState.battingTeam.balls}
      />

      {/* Scoring Controls */}
      <ScoringControls
        onAddBall={addBall}
        onUndo={handleUndo}
        onChangeBowler={handleChangeBowler}
      />
    </div>
  );
};

export default Umpire;
