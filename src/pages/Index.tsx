import React, { useState } from 'react';
import { useMatch } from '@/context/MatchContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Radio, Plus, FileText, BarChart3, Share2 } from 'lucide-react';
import MatchHeader from '@/components/cricket/MatchHeader';
import LiveScore from '@/components/cricket/LiveScore';
import BatterStats from '@/components/cricket/BatterStats';
import BowlerStats from '@/components/cricket/BowlerStats';
import CurrentOver from '@/components/cricket/CurrentOver';
import ShareScorecardModal from '@/components/cricket/ShareScorecardModal';

const Index: React.FC = () => {
  const { matchState, isMatchSetup } = useMatch();
  const navigate = useNavigate();
  const [showShareModal, setShowShareModal] = useState(false);

  // Show welcome screen if no match is setup
  if (!isMatchSetup) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6">
        <div className="text-center max-w-md w-full">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 gradient-primary rounded-full flex items-center justify-center shadow-lg">
            <span className="text-3xl sm:text-4xl">🏏</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 sm:mb-3">Cricket Scorer</h1>
          <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 px-4">
            Track cricket matches ball-by-ball with live scoring, detailed statistics, and real-time updates.
          </p>
          
          <Button
            onClick={() => navigate('/setup')}
            className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold gap-2 gradient-primary mb-4 shadow-button"
          >
            <Plus className="w-5 h-5" />
            Start New Match
          </Button>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-6 sm:mt-8">
            <div className="bg-card p-3 sm:p-4 rounded-xl shadow-card text-center hover:shadow-lg transition-shadow">
              <div className="text-xl sm:text-2xl mb-1 sm:mb-2">📊</div>
              <h3 className="font-semibold text-xs sm:text-sm">Live Stats</h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Ball-by-ball</p>
            </div>
            <div className="bg-card p-3 sm:p-4 rounded-xl shadow-card text-center hover:shadow-lg transition-shadow">
              <div className="text-xl sm:text-2xl mb-1 sm:mb-2">🔊</div>
              <h3 className="font-semibold text-xs sm:text-sm">Sound Effects</h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Audio feedback</p>
            </div>
            <div className="bg-card p-3 sm:p-4 rounded-xl shadow-card text-center hover:shadow-lg transition-shadow">
              <div className="text-xl sm:text-2xl mb-1 sm:mb-2">📱</div>
              <h3 className="font-semibold text-xs sm:text-sm">Vibration</h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Haptic feedback</p>
            </div>
            <div className="bg-card p-3 sm:p-4 rounded-xl shadow-card text-center hover:shadow-lg transition-shadow">
              <div className="text-xl sm:text-2xl mb-1 sm:mb-2">📋</div>
              <h3 className="font-semibold text-xs sm:text-sm">Scorecard</h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Full details</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-24">
      {/* Share Modal */}
      <ShareScorecardModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        matchState={matchState}
      />

      {/* Share Button - Fixed top right */}
      <button
        onClick={() => setShowShareModal(true)}
        className="fixed top-3 right-3 sm:top-4 sm:right-4 z-20 p-2 sm:p-2.5 bg-card rounded-full shadow-lg hover:shadow-xl transition-all border border-border"
      >
        <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
      </button>

      <MatchHeader details={matchState.matchDetails} />
      
      <LiveScore
        battingTeam={matchState.battingTeam}
        bowlingTeam={matchState.bowlingTeam}
      />

      <div className="px-3 sm:px-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <BatterStats batters={matchState.batters} />
        <BowlerStats bowler={matchState.currentBowler} />
      </div>

      <CurrentOver
        balls={matchState.currentOver}
        currentOvers={matchState.battingTeam.overs}
        currentBalls={matchState.battingTeam.balls}
      />

      {/* Fixed bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-3 sm:p-4 bg-background/95 backdrop-blur-sm border-t border-border safe-area-pb">
        <div className="flex gap-2 max-w-lg mx-auto">
          <Link to="/scorecard" className="flex-1">
            <Button variant="outline" className="w-full h-10 sm:h-12 text-xs sm:text-sm font-semibold gap-1.5 sm:gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden xs:inline">Scorecard</span>
            </Button>
          </Link>
          <Link to="/analytics" className="flex-1">
            <Button variant="outline" className="w-full h-10 sm:h-12 text-xs sm:text-sm font-semibold gap-1.5 sm:gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden xs:inline">Analytics</span>
            </Button>
          </Link>
          <Link to="/umpire" className="flex-1">
            <Button className="w-full h-10 sm:h-12 text-xs sm:text-sm font-semibold gap-1.5 sm:gap-2 gradient-primary shadow-button">
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
