import React, { createContext, useContext, useState, useCallback } from 'react';
import { 
  MatchState, Ball, BallOutcome, Batter, Bowler, Over, 
  FallOfWicket, Partnership, MatchSetupData 
} from '@/types/cricket';
import { playSoundWithVibration, resumeAudioContext } from '@/utils/soundEffects';

interface MatchContextType {
  matchState: MatchState;
  addBall: (outcome: BallOutcome) => void;
  undoLastBall: () => void;
  changeStriker: () => void;
  changeBowler: (bowler: Bowler) => void;
  updateBatter: (batterId: string, updates: Partial<Batter>) => void;
  resetMatch: () => void;
  setupMatch: (data: MatchSetupData) => void;
  toggleSound: () => void;
  toggleVibration: () => void;
  selectNewBatter: (name: string) => void;
  isMatchSetup: boolean;
}

const createInitialBatter = (id: string, name: string, isOnStrike: boolean): Batter => ({
  id,
  name,
  runs: 0,
  balls: 0,
  fours: 0,
  sixes: 0,
  isOnStrike,
  isOut: false,
});

const createInitialBowler = (id: string, name: string): Bowler => ({
  id,
  name,
  overs: 0,
  balls: 0,
  maidens: 0,
  runs: 0,
  wickets: 0,
  economy: 0,
  noBalls: 0,
  wides: 0,
});

const getDefaultMatchState = (): MatchState => ({
  matchDetails: {
    matchType: 'T20',
    tossWinner: '',
    tossDecision: 'bat',
    venue: '',
    date: new Date().toISOString().split('T')[0],
    time: '7:30 PM',
    ballType: 'White',
    totalOvers: 20,
  },
  battingTeam: {
    name: 'Team A',
    shortName: 'TMA',
    score: 0,
    wickets: 0,
    overs: 0,
    balls: 0,
    players: [],
  },
  bowlingTeam: {
    name: 'Team B',
    shortName: 'TMB',
    score: 0,
    wickets: 0,
    overs: 0,
    balls: 0,
    players: [],
  },
  batters: [],
  allBatters: [],
  currentBowler: createInitialBowler('1', 'Select Bowler'),
  allBowlers: [],
  overs: [],
  currentOver: [],
  isFirstInnings: true,
  matchStatus: 'setup',
  fallOfWickets: [],
  partnerships: [],
  currentPartnership: { batter1: '', batter2: '', runs: 0, balls: 0 },
  soundEnabled: true,
  vibrationEnabled: true,
});

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export const MatchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [matchState, setMatchState] = useState<MatchState>(getDefaultMatchState());

  const getSoundType = (outcome: BallOutcome) => {
    if (outcome === 'W') return 'wicket';
    if (outcome === 6) return 'six';
    if (outcome === 4) return 'boundary';
    if (outcome === 'WD') return 'wide';
    if (outcome === 'NB') return 'noBall';
    if (outcome === 0) return 'dot';
    return 'run';
  };

  const addBall = useCallback((outcome: BallOutcome) => {
    resumeAudioContext();
    
    setMatchState((prev) => {
      // Play sound and vibrate
      if (prev.soundEnabled || prev.vibrationEnabled) {
        const soundType = getSoundType(outcome);
        if (prev.soundEnabled && prev.vibrationEnabled) {
          playSoundWithVibration(soundType);
        }
      }

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

      if (!isExtra) {
        newBalls++;
        if (newBalls === 6) {
          newBalls = 0;
          newOvers++;
          const completedOver: Over = {
            number: newOvers,
            balls: newCurrentOver,
            runs: newCurrentOver.reduce((sum, b) => sum + b.runs, 0),
            wickets: newCurrentOver.filter(b => b.isWicket).length,
          };
          newOversList.push(completedOver);
        }
      }

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

      // Update fall of wickets
      let newFallOfWickets = [...prev.fallOfWickets];
      if (isWicket) {
        const striker = prev.batters.find(b => b.isOnStrike);
        if (striker) {
          newFallOfWickets.push({
            wicketNumber: newWickets,
            score: newScore,
            overs: newOvers,
            balls: newBalls,
            batterName: striker.name,
          });
        }
      }

      // Update partnership
      const newPartnership = {
        ...prev.currentPartnership,
        runs: prev.currentPartnership.runs + (typeof outcome === 'number' ? outcome : 0),
        balls: prev.currentPartnership.balls + (isExtra ? 0 : 1),
      };

      // Update bowler
      const newBowlerBalls = isExtra ? prev.currentBowler.balls : prev.currentBowler.balls + 1;
      const newBowlerOvers = newBowlerBalls === 6 ? prev.currentBowler.overs + 1 : prev.currentBowler.overs;
      const totalBowlerBalls = newBowlerOvers * 6 + (newBowlerBalls === 6 ? 0 : newBowlerBalls);
      const newBowler: Bowler = {
        ...prev.currentBowler,
        balls: newBowlerBalls === 6 ? 0 : newBowlerBalls,
        overs: newBowlerOvers,
        runs: prev.currentBowler.runs + runs,
        wickets: prev.currentBowler.wickets + (isWicket ? 1 : 0),
        economy: totalBowlerBalls > 0 ? ((prev.currentBowler.runs + runs) / totalBowlerBalls) * 6 : 0,
        wides: prev.currentBowler.wides + (outcome === 'WD' ? 1 : 0),
        noBalls: prev.currentBowler.noBalls + (outcome === 'NB' ? 1 : 0),
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
        fallOfWickets: newFallOfWickets,
        currentPartnership: newPartnership,
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

  const selectNewBatter = useCallback((name: string) => {
    setMatchState((prev) => {
      const newBatter = createInitialBatter(`${Date.now()}`, name, true);
      const updatedBatters = prev.batters.map(b => 
        b.isOnStrike ? { ...b, isOut: true, isOnStrike: false } : b
      );
      
      return {
        ...prev,
        batters: [...updatedBatters.filter(b => !b.isOut), newBatter],
        allBatters: [...prev.allBatters, newBatter],
        currentPartnership: {
          batter1: name,
          batter2: prev.batters.find(b => !b.isOnStrike)?.name || '',
          runs: 0,
          balls: 0,
        },
      };
    });
  }, []);

  const setupMatch = useCallback((data: MatchSetupData) => {
    const totalOvers = data.matchType === 'T20' ? 20 : data.matchType === 'ODI' ? 50 : 90;
    const battingFirst = data.tossDecision === 'bat' ? 'team1' : 'team2';
    
    const team1: MatchState['battingTeam'] = {
      name: data.team1Name,
      shortName: data.team1ShortName,
      score: 0,
      wickets: 0,
      overs: 0,
      balls: 0,
      players: data.team1Players,
    };

    const team2: MatchState['bowlingTeam'] = {
      name: data.team2Name,
      shortName: data.team2ShortName,
      score: 0,
      wickets: 0,
      overs: 0,
      balls: 0,
      players: data.team2Players,
    };

    const battingTeam = battingFirst === 'team1' ? team1 : team2;
    const bowlingTeam = battingFirst === 'team1' ? team2 : team1;

    const openingBatters = [
      createInitialBatter('1', battingTeam.players[0] || 'Batter 1', true),
      createInitialBatter('2', battingTeam.players[1] || 'Batter 2', false),
    ];

    const openingBowler = createInitialBowler('1', bowlingTeam.players[0] || 'Bowler 1');

    setMatchState({
      matchDetails: {
        matchType: data.matchType,
        tossWinner: data.tossWinner === 'team1' ? data.team1Name : data.team2Name,
        tossDecision: data.tossDecision,
        venue: data.venue,
        date: data.date,
        time: data.time,
        ballType: data.matchType === 'Test' ? 'Red' : 'White',
        totalOvers,
      },
      battingTeam,
      bowlingTeam,
      batters: openingBatters,
      allBatters: openingBatters,
      currentBowler: openingBowler,
      allBowlers: [openingBowler],
      overs: [],
      currentOver: [],
      isFirstInnings: true,
      matchStatus: 'in_progress',
      fallOfWickets: [],
      partnerships: [],
      currentPartnership: {
        batter1: openingBatters[0].name,
        batter2: openingBatters[1].name,
        runs: 0,
        balls: 0,
      },
      soundEnabled: true,
      vibrationEnabled: true,
    });
  }, []);

  const toggleSound = useCallback(() => {
    setMatchState(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  }, []);

  const toggleVibration = useCallback(() => {
    setMatchState(prev => ({ ...prev, vibrationEnabled: !prev.vibrationEnabled }));
  }, []);

  const resetMatch = useCallback(() => {
    setMatchState(getDefaultMatchState());
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
        setupMatch,
        toggleSound,
        toggleVibration,
        selectNewBatter,
        isMatchSetup: matchState.matchStatus !== 'setup',
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
