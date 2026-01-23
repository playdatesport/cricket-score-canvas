import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMatch } from '@/context/MatchContext';
import { useMatchHistory } from '@/hooks/useMatchHistory';
import { Card, CardContent } from '@/components/ui/card';
import BatterStats from '@/components/cricket/BatterStats';
import BowlerStats from '@/components/cricket/BowlerStats';
import CurrentOver from '@/components/cricket/CurrentOver';
import MatchHistoryList from '@/components/cricket/MatchHistoryList';
import ShareScorecardModal from '@/components/cricket/ShareScorecardModal';
import LiveScoreHeader from '@/components/cricket/LiveScoreHeader';
import WelcomeScreen from '@/components/WelcomeScreen';
import BottomNavigation from '@/components/ui/BottomNavigation';

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

  // Welcome screen when no match is set up
  if (!isMatchSetup) {
    return (
      <>
        <WelcomeScreen 
          onNewMatch={handleNewMatch}
          onShowHistory={handleToggleHistory}
          onNavigateStats={() => navigate('/statistics')}
          matchCount={matches.length}
        />
        {showHistory && (
          <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 overflow-auto">
            <div className="max-w-md mx-auto p-4 pt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Match History</h2>
                <button 
                  onClick={() => setShowHistory(false)}
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  Close
                </button>
              </div>
              <MatchHistoryList
                matches={matches}
                onLoadMatch={handleLoadMatch}
                onDeleteMatch={handleDeleteMatch}
              />
            </div>
          </div>
        )}
      </>
    );
  }

  // Live match view
  return (
    <div className="min-h-screen bg-background pb-24">
      <LiveScoreHeader 
        matchState={matchState} 
        onShare={() => setShowShareModal(true)} 
      />

      <div className="p-4 space-y-4">
        <BatterStats batters={matchState.batters} />
        <BowlerStats bowler={matchState.currentBowler} />
        <CurrentOver balls={matchState.currentOver} />

        {matchState.currentPartnership.runs > 0 && (
          <Card className="border-0 shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground mb-0.5">Partnership</div>
                  <div className="font-semibold">
                    {matchState.currentPartnership.runs} runs
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground mb-0.5">Balls</div>
                  <div className="font-semibold">
                    {matchState.currentPartnership.balls}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <BottomNavigation showUmpire={true} />

      <ShareScorecardModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        matchState={matchState}
      />
    </div>
  );
};

export default Index;
