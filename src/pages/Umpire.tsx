import React from 'react';
import { useMatch } from '@/context/MatchContext';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Radio, Volume2, VolumeX, Smartphone, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CurrentOver from '@/components/cricket/CurrentOver';
import ScoringControls from '@/components/cricket/ScoringControls';
import { toast } from '@/hooks/use-toast';

const Umpire: React.FC = () => {
  const { matchState, addBall, undoLastBall, changeStriker, toggleSound, toggleVibration, isMatchSetup } = useMatch();
  const navigate = useNavigate();

  // Redirect to setup if match not configured
  React.useEffect(() => {
    if (!isMatchSetup) {
      navigate('/setup');
    }
  }, [isMatchSetup, navigate]);

  const handleUndo = () => {
    undoLastBall();
    toast({
      title: "Ball undone",
      description: "Last ball has been removed",
    });
  };

  const handleChangeBowler = () => {
    toast({
      title: "Change Bowler",
      description: "Bowler change feature coming soon",
    });
  };

  if (!isMatchSetup) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-foreground">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-primary animate-pulse" />
            <h1 className="text-lg font-bold text-foreground">Umpire Panel</h1>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={toggleSound}
              className={`p-2 rounded-full transition-colors ${
                matchState.soundEnabled ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {matchState.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            <button
              onClick={toggleVibration}
              className={`p-2 rounded-full transition-colors ${
                matchState.vibrationEnabled ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Smartphone className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Compact Score Display */}
      <div className="bg-card mx-4 mt-4 rounded-xl shadow-card p-4">
        <div className="flex items-center justify-between">
          <div className="text-center">
            <span className="text-sm text-muted-foreground">{matchState.battingTeam.name}</span>
            <div className="text-2xl font-bold text-foreground">
              {matchState.battingTeam.score}/{matchState.battingTeam.wickets}
            </div>
          </div>
          <div className="text-center px-4 py-2 rounded-full bg-primary/10">
            <span className="text-lg font-bold text-primary">
              {matchState.battingTeam.overs}.{matchState.battingTeam.balls}
            </span>
            <div className="text-xs text-muted-foreground">OVERS</div>
          </div>
          <div className="text-center">
            <span className="text-sm text-muted-foreground">{matchState.bowlingTeam.name}</span>
            <div className="text-2xl font-bold text-foreground">
              {matchState.bowlingTeam.score}/{matchState.bowlingTeam.wickets}
            </div>
          </div>
        </div>

        {/* Current Batters */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex justify-between items-center">
            {matchState.batters.filter(b => !b.isOut).map((batter) => (
              <div
                key={batter.id}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                  batter.isOnStrike ? 'bg-primary/10 border border-primary/30' : 'bg-muted/50'
                }`}
              >
                <span className="font-medium text-foreground">{batter.name}</span>
                <span className="text-lg font-bold text-foreground">{batter.runs}</span>
                <span className="text-xs text-muted-foreground">({batter.balls})</span>
                {batter.isOnStrike && (
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                )}
              </div>
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-2 text-primary"
            onClick={changeStriker}
          >
            Swap Striker
          </Button>
        </div>

        {/* Current Bowler */}
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Bowler:</span>
            <span className="font-medium text-foreground">
              {matchState.currentBowler.name} - {matchState.currentBowler.overs}.{matchState.currentBowler.balls} - {matchState.currentBowler.runs}/{matchState.currentBowler.wickets}
            </span>
          </div>
        </div>
      </div>

      {/* Full Scorecard Link */}
      <div className="px-4 mt-3">
        <Link to="/scorecard">
          <Button variant="outline" size="sm" className="w-full gap-2">
            <FileText className="w-4 h-4" />
            View Full Scorecard
          </Button>
        </Link>
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
