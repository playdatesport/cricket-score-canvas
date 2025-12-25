import React from 'react';
import { useMatch } from '@/context/MatchContext';
import MatchHeader from '@/components/cricket/MatchHeader';
import LiveScore from '@/components/cricket/LiveScore';
import BatterStats from '@/components/cricket/BatterStats';
import BowlerStats from '@/components/cricket/BowlerStats';
import CurrentOver from '@/components/cricket/CurrentOver';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Radio } from 'lucide-react';

const Scorecard: React.FC = () => {
  const { matchState } = useMatch();

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
        <Link to="/umpire">
          <Button className="w-full h-12 text-base font-semibold gap-2 gradient-primary">
            <Radio className="w-5 h-5" />
            Open Umpire Controls
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Scorecard;
