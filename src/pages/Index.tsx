import React from 'react';
import { useMatch } from '@/context/MatchContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Radio, Plus, FileText } from 'lucide-react';
import MatchHeader from '@/components/cricket/MatchHeader';
import LiveScore from '@/components/cricket/LiveScore';
import BatterStats from '@/components/cricket/BatterStats';
import BowlerStats from '@/components/cricket/BowlerStats';
import CurrentOver from '@/components/cricket/CurrentOver';

const Index: React.FC = () => {
  const { matchState, isMatchSetup } = useMatch();
  const navigate = useNavigate();

  // Show welcome screen if no match is setup
  if (!isMatchSetup) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 gradient-primary rounded-full flex items-center justify-center">
            <span className="text-4xl">🏏</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">Cricket Scorer</h1>
          <p className="text-muted-foreground mb-8">
            Track cricket matches ball-by-ball with live scoring, detailed statistics, and real-time updates.
          </p>
          
          <Button
            onClick={() => navigate('/setup')}
            className="w-full h-14 text-lg font-semibold gap-2 gradient-primary mb-4"
          >
            <Plus className="w-5 h-5" />
            Start New Match
          </Button>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-card p-4 rounded-xl shadow-card text-center">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-semibold text-sm">Live Stats</h3>
              <p className="text-xs text-muted-foreground">Ball-by-ball tracking</p>
            </div>
            <div className="bg-card p-4 rounded-xl shadow-card text-center">
              <div className="text-2xl mb-2">🔊</div>
              <h3 className="font-semibold text-sm">Sound Effects</h3>
              <p className="text-xs text-muted-foreground">Audio feedback</p>
            </div>
            <div className="bg-card p-4 rounded-xl shadow-card text-center">
              <div className="text-2xl mb-2">📱</div>
              <h3 className="font-semibold text-sm">Vibration</h3>
              <p className="text-xs text-muted-foreground">Haptic feedback</p>
            </div>
            <div className="bg-card p-4 rounded-xl shadow-card text-center">
              <div className="text-2xl mb-2">📋</div>
              <h3 className="font-semibold text-sm">Full Scorecard</h3>
              <p className="text-xs text-muted-foreground">Detailed stats</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <MatchHeader details={matchState.matchDetails} />
      
      <LiveScore
        battingTeam={matchState.battingTeam}
        bowlingTeam={matchState.bowlingTeam}
      />

      <div className="px-4 grid grid-cols-2 gap-4">
        <BatterStats batters={matchState.batters} />
        <BowlerStats bowler={matchState.currentBowler} />
      </div>

      <CurrentOver
        balls={matchState.currentOver}
        currentOvers={matchState.battingTeam.overs}
        currentBalls={matchState.battingTeam.balls}
      />

      {/* Fixed bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border">
        <div className="flex gap-3">
          <Link to="/scorecard" className="flex-1">
            <Button variant="outline" className="w-full h-12 text-base font-semibold gap-2">
              <FileText className="w-5 h-5" />
              Scorecard
            </Button>
          </Link>
          <Link to="/umpire" className="flex-1">
            <Button className="w-full h-12 text-base font-semibold gap-2 gradient-primary">
              <Radio className="w-5 h-5" />
              Umpire
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
