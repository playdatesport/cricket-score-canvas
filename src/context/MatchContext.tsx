import React, { createContext, useContext, useState, useCallback } from 'react';
import { MatchState, Ball, BallOutcome, Batter, Bowler, Over } from '@/types/cricket';

interface MatchContextType {
  matchState: MatchState;
  addBall: (outcome: BallOutcome) => void;
  undoLastBall: () => void;
  changeStriker: () => void;
  changeBowler: (bowler: Bowler) => void;
  updateBatter: (batterId: string, updates: Partial<Batter>) => void;
  resetMatch: () => void;
}

const initialBatters: Batter[] = [
  { id: '1', name: 'R Sharma', runs: 54, balls: 32, fours: 6, sixes: 2, isOnStrike: true, isOut: false },
  { id: '2', name: 'K Reddy', runs: 21, balls: 15, fours: 2, sixes: 1, isOnStrike: false, isOut: false },
];

const initialBowler: Bowler = {
  id: '1',
  name: 'M Singh',
  overs: 3,
  balls: 4,
  maidens: 1,
  runs: 24,
  wickets: 1,
  economy: 6.46,
};

const initialMatchState: MatchState = {
  matchDetails: {
    matchType: 'T20 League',
    tossWinner: 'Mumbai',
    tossDecision: 'bowl',
    venue: 'Wankhede Stadium',
    time: '7:30 PM',
    ballType: 'White',
    powerplay: 'PPs 6-11, 16-20',
  },
  battingTeam: {
    name: 'Mumbai',
    score: 178,
    wickets: 5,
    overs: 18,
    balls: 4,
  },
  bowlingTeam: {
    name: 'Delhi',
    score: 125,
    wickets: 2,
    overs: 0,
    balls: 0,
    target: 179,
  },
  batters: initialBatters,
  currentBowler: initialBowler,
  overs: [],
  currentOver: [],
  isFirstInnings: true,
  matchStatus: 'in_progress',
};

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export const MatchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [matchState, setMatchState] = useState<MatchState>(initialMatchState);

  const addBall = useCallback((outcome: BallOutcome) => {
    setMatchState((prev) => {
      const isExtra = outcome === 'WD' || outcome === 'NB' || outcome === 'LB' || outcome === 'B';
      const isWicket = outcome === 'W';
      let runs = typeof outcome === 'number' ? outcome : 0;
      
      if (outcome === 'WD' || outcome === 'NB') runs = 1;

      const newBall: Ball = {
        id: `${Date.now()}`,
        outcome,
        runs,
        isExtra,
        isWicket,
        overNumber: prev.battingTeam.overs,
        ballNumber: prev.battingTeam.balls + 1,
      };

      const newCurrentOver = [...prev.currentOver, newBall];
      const newScore = prev.battingTeam.score + runs;
      const newWickets = prev.battingTeam.wickets + (isWicket ? 1 : 0);
      
      let newBalls = prev.battingTeam.balls;
      let newOvers = prev.battingTeam.overs;
      let newOversList = [...prev.overs];

      // Only count legal deliveries
      if (!isExtra) {
        newBalls++;
        if (newBalls === 6) {
          newBalls = 0;
          newOvers++;
          // Save completed over
          const completedOver: Over = {
            number: newOvers,
            balls: newCurrentOver,
            runs: newCurrentOver.reduce((sum, b) => sum + b.runs, 0),
            wickets: newCurrentOver.filter(b => b.isWicket).length,
          };
          newOversList.push(completedOver);
        }
      }

      // Update striker for odd runs
      const shouldRotateStrike = typeof outcome === 'number' && outcome % 2 === 1;
      const newBatters = prev.batters.map(batter => {
        if (batter.isOnStrike && !isWicket) {
          return {
            ...batter,
            runs: batter.runs + (typeof outcome === 'number' ? outcome : 0),
            balls: batter.balls + (isExtra ? 0 : 1),
            fours: batter.fours + (outcome === 4 ? 1 : 0),
            sixes: batter.sixes + (outcome === 6 ? 1 : 0),
            isOnStrike: shouldRotateStrike ? false : true,
          };
        }
        if (!batter.isOnStrike && shouldRotateStrike) {
          return { ...batter, isOnStrike: true };
        }
        return batter;
      });

      // Update bowler
      const newBowlerBalls = isExtra ? prev.currentBowler.balls : prev.currentBowler.balls + 1;
      const newBowlerOvers = newBowlerBalls === 6 ? prev.currentBowler.overs + 1 : prev.currentBowler.overs;
      const newBowler: Bowler = {
        ...prev.currentBowler,
        balls: newBowlerBalls === 6 ? 0 : newBowlerBalls,
        overs: newBowlerOvers,
        runs: prev.currentBowler.runs + runs,
        wickets: prev.currentBowler.wickets + (isWicket ? 1 : 0),
        economy: (prev.currentBowler.runs + runs) / (newBowlerOvers + newBowlerBalls / 6 || 1),
      };

      return {
        ...prev,
        battingTeam: {
          ...prev.battingTeam,
          score: newScore,
          wickets: newWickets,
          overs: newOvers,
          balls: newBalls,
        },
        batters: newBatters,
        currentBowler: newBowler,
        currentOver: newBalls === 0 && !isExtra ? [] : newCurrentOver,
        overs: newOversList,
      };
    });
  }, []);

  const undoLastBall = useCallback(() => {
    setMatchState((prev) => {
      if (prev.currentOver.length === 0) return prev;
      
      const lastBall = prev.currentOver[prev.currentOver.length - 1];
      const newCurrentOver = prev.currentOver.slice(0, -1);
      
      const newScore = prev.battingTeam.score - lastBall.runs;
      const newWickets = prev.battingTeam.wickets - (lastBall.isWicket ? 1 : 0);
      const newBalls = lastBall.isExtra ? prev.battingTeam.balls : prev.battingTeam.balls - 1;

      return {
        ...prev,
        battingTeam: {
          ...prev.battingTeam,
          score: newScore,
          wickets: newWickets,
          balls: newBalls < 0 ? 5 : newBalls,
          overs: newBalls < 0 ? prev.battingTeam.overs - 1 : prev.battingTeam.overs,
        },
        currentOver: newCurrentOver,
      };
    });
  }, []);

  const changeStriker = useCallback(() => {
    setMatchState((prev) => ({
      ...prev,
      batters: prev.batters.map(batter => ({
        ...batter,
        isOnStrike: !batter.isOnStrike,
      })),
    }));
  }, []);

  const changeBowler = useCallback((bowler: Bowler) => {
    setMatchState((prev) => ({
      ...prev,
      currentBowler: bowler,
    }));
  }, []);

  const updateBatter = useCallback((batterId: string, updates: Partial<Batter>) => {
    setMatchState((prev) => ({
      ...prev,
      batters: prev.batters.map(batter =>
        batter.id === batterId ? { ...batter, ...updates } : batter
      ),
    }));
  }, []);

  const resetMatch = useCallback(() => {
    setMatchState(initialMatchState);
  }, []);

  return (
    <MatchContext.Provider
      value={{
        matchState,
        addBall,
        undoLastBall,
        changeStriker,
        changeBowler,
        updateBatter,
        resetMatch,
      }}
    >
      {children}
    </MatchContext.Provider>
  );
};

export const useMatch = () => {
  const context = useContext(MatchContext);
  if (!context) {
    throw new Error('useMatch must be used within a MatchProvider');
  }
  return context;
};
