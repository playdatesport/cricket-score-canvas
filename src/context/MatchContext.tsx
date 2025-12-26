import React, { createContext, useContext, useState, useCallback } from 'react';
import { 
  MatchState, Ball, BallOutcome, Batter, Bowler, Over, 
  FallOfWicket, Partnership, MatchSetupData, DismissalType, MatchResult, InningsData
} from '@/types/cricket';
import { playSoundWithVibration, playSound, vibrate, resumeAudioContext } from '@/utils/soundEffects';

interface WicketDetails {
  dismissalType: DismissalType;
  newBatter: string;
  dismissedBy: string;
  caughtBy?: string;
  runOutBy?: string;
}

interface MatchContextType {
  matchState: MatchState;
  addBall: (outcome: BallOutcome) => void;
  undoLastBall: () => void;
  changeStriker: () => void;
  changeBowler: (bowlerName: string) => void;
  updateBatter: (batterId: string, updates: Partial<Batter>) => void;
  resetMatch: () => void;
  setupMatch: (data: MatchSetupData) => void;
  toggleSound: () => void;
  toggleVibration: () => void;
  selectNewBatter: (name: string) => void;
  processWicket: (details: WicketDetails) => void;
  pendingWicket: boolean;
  setPendingWicket: (value: boolean) => void;
  pendingBowlerChange: boolean;
  setPendingBowlerChange: (value: boolean) => void;
  lastBowlerName: string;
  isMatchSetup: boolean;
  endInnings: () => void;
  startSecondInnings: () => void;
  showInningsBreak: boolean;
  setShowInningsBreak: (value: boolean) => void;
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
  const [pendingWicket, setPendingWicket] = useState(false);
  const [pendingBowlerChange, setPendingBowlerChange] = useState(false);
  const [lastBowlerName, setLastBowlerName] = useState('');
  const [showInningsBreak, setShowInningsBreak] = useState(false);

  const getSoundType = (outcome: BallOutcome) => {
    if (outcome === 'W') return 'wicket';
    if (outcome === 6) return 'six';
    if (outcome === 4) return 'boundary';
    if (outcome === 'WD') return 'wide';
    if (outcome === 'NB') return 'noBall';
    if (outcome === 0) return 'dot';
    return 'run';
  };

  const playFeedback = useCallback((outcome: BallOutcome, soundEnabled: boolean, vibrationEnabled: boolean) => {
    const soundType = getSoundType(outcome);
    if (soundEnabled) playSound(soundType);
    if (vibrationEnabled) vibrate(soundType);
  }, []);

  const addBall = useCallback((outcome: BallOutcome) => {
    resumeAudioContext();
    
    // If it's a wicket, set pending and wait for modal
    if (outcome === 'W') {
      setPendingWicket(true);
      setMatchState(prev => {
        playFeedback('W', prev.soundEnabled, prev.vibrationEnabled);
        return prev;
      });
      return;
    }
    
    setMatchState((prev) => {
      playFeedback(outcome, prev.soundEnabled, prev.vibrationEnabled);

      const isExtra = outcome === 'WD' || outcome === 'NB' || outcome === 'LB' || outcome === 'B';
      let runs = typeof outcome === 'number' ? outcome : 0;
      
      if (outcome === 'WD' || outcome === 'NB') runs = 1;

      const newBall: Ball = {
        id: `${Date.now()}`,
        outcome,
        runs,
        isExtra,
        isWicket: false,
        overNumber: prev.battingTeam.overs,
        ballNumber: prev.battingTeam.balls + 1,
      };

      const newCurrentOver = [...prev.currentOver, newBall];
      const newScore = prev.battingTeam.score + runs;
      
      let newBalls = prev.battingTeam.balls;
      let newOvers = prev.battingTeam.overs;
      let newOversList = [...prev.overs];
      let overEnded = false;

      if (!isExtra) {
        newBalls++;
        if (newBalls === 6) {
          newBalls = 0;
          newOvers++;
          overEnded = true;
          const completedOver: Over = {
            number: newOvers,
            balls: newCurrentOver,
            runs: newCurrentOver.reduce((sum, b) => sum + b.runs, 0),
            wickets: newCurrentOver.filter(b => b.isWicket).length,
          };
          newOversList.push(completedOver);
        }
      }

      // Check if over ended and trigger bowler change
      if (overEnded) {
        setLastBowlerName(prev.currentBowler.name);
        setPendingBowlerChange(true);
      }

      const shouldRotateStrike = (typeof outcome === 'number' && outcome % 2 === 1) || overEnded;
      const newBatters = prev.batters.map(batter => {
        if (batter.isOnStrike) {
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
        economy: totalBowlerBalls > 0 ? ((prev.currentBowler.runs + runs) / totalBowlerBalls) * 6 : 0,
        wides: prev.currentBowler.wides + (outcome === 'WD' ? 1 : 0),
        noBalls: prev.currentBowler.noBalls + (outcome === 'NB' ? 1 : 0),
      };

      // Update allBatters
      const newAllBatters = prev.allBatters.map(ab => {
        const currentBatter = newBatters.find(b => b.id === ab.id);
        return currentBatter || ab;
      });

      // Update allBowlers
      const existingBowlerIndex = prev.allBowlers.findIndex(b => b.id === prev.currentBowler.id);
      let newAllBowlers = [...prev.allBowlers];
      if (existingBowlerIndex >= 0) {
        newAllBowlers[existingBowlerIndex] = newBowler;
      }

      return {
        ...prev,
        battingTeam: {
          ...prev.battingTeam,
          score: newScore,
          overs: newOvers,
          balls: newBalls,
        },
        batters: newBatters,
        allBatters: newAllBatters,
        currentBowler: newBowler,
        allBowlers: newAllBowlers,
        currentOver: newBalls === 0 && !isExtra ? [] : newCurrentOver,
        overs: newOversList,
        currentPartnership: newPartnership,
      };
    });
  }, [playFeedback]);

  const changeBowler = useCallback((bowlerName: string) => {
    setMatchState((prev) => {
      // Check if this bowler has bowled before
      const existingBowler = prev.allBowlers.find(b => b.name === bowlerName);
      
      let newBowler: Bowler;
      let newAllBowlers = [...prev.allBowlers];

      // Update previous bowler's stats in allBowlers
      const prevBowlerIndex = newAllBowlers.findIndex(b => b.id === prev.currentBowler.id);
      if (prevBowlerIndex >= 0) {
        newAllBowlers[prevBowlerIndex] = prev.currentBowler;
      } else if (prev.currentBowler.balls > 0 || prev.currentBowler.overs > 0) {
        newAllBowlers.push(prev.currentBowler);
      }

      if (existingBowler) {
        newBowler = existingBowler;
      } else {
        newBowler = createInitialBowler(`${Date.now()}`, bowlerName);
        newAllBowlers.push(newBowler);
      }

      return {
        ...prev,
        currentBowler: newBowler,
        allBowlers: newAllBowlers,
      };
    });
    
    setPendingBowlerChange(false);
  }, []);

  const processWicket = useCallback((details: WicketDetails) => {
    setMatchState((prev) => {
      const striker = prev.batters.find(b => b.isOnStrike);
      if (!striker) return prev;

      // Create wicket ball
      const newBall: Ball = {
        id: `${Date.now()}`,
        outcome: 'W',
        runs: 0,
        isExtra: false,
        isWicket: true,
        overNumber: prev.battingTeam.overs,
        ballNumber: prev.battingTeam.balls + 1,
      };

      const newCurrentOver = [...prev.currentOver, newBall];
      const newWickets = prev.battingTeam.wickets + 1;
      
      let newBalls = prev.battingTeam.balls + 1;
      let newOvers = prev.battingTeam.overs;
      let newOversList = [...prev.overs];
      let overEnded = false;

      if (newBalls === 6) {
        newBalls = 0;
        newOvers++;
        overEnded = true;
        const completedOver: Over = {
          number: newOvers,
          balls: newCurrentOver,
          runs: newCurrentOver.reduce((sum, b) => sum + b.runs, 0),
          wickets: newCurrentOver.filter(b => b.isWicket).length,
        };
        newOversList.push(completedOver);
      }

      // Trigger bowler change if over ended
      if (overEnded) {
        setLastBowlerName(prev.currentBowler.name);
        setPendingBowlerChange(true);
      }

      // Update outgoing batter
      const updatedStriker: Batter = {
        ...striker,
        isOut: true,
        isOnStrike: false,
        dismissalType: details.dismissalType,
        dismissedBy: details.dismissedBy,
        caughtBy: details.caughtBy,
        balls: striker.balls + 1,
      };

      // Create new batter
      const newBatter = createInitialBatter(`${Date.now()}`, details.newBatter, true);

      // Update batters array - rotate strike if over ended
      const nonStriker = prev.batters.find(b => !b.isOnStrike);
      let newBatters: Batter[];
      if (overEnded && nonStriker) {
        newBatters = [
          { ...nonStriker, isOnStrike: false },
          { ...newBatter, isOnStrike: true },
        ];
      } else {
        newBatters = prev.batters
          .filter(b => b.id !== striker.id)
          .concat(newBatter);
      }

      // Add fall of wicket
      const newFallOfWickets: FallOfWicket[] = [
        ...prev.fallOfWickets,
        {
          wicketNumber: newWickets,
          score: prev.battingTeam.score,
          overs: newOvers,
          balls: newBalls,
          batterName: striker.name,
        },
      ];

      // Save current partnership and start new one
      const newPartnerships = prev.currentPartnership.runs > 0 || prev.currentPartnership.balls > 0
        ? [...prev.partnerships, prev.currentPartnership]
        : prev.partnerships;

      const newCurrentPartnership: Partnership = {
        batter1: details.newBatter,
        batter2: nonStriker?.name || '',
        runs: 0,
        balls: 0,
      };

      // Update bowler
      const newBowlerBalls = prev.currentBowler.balls + 1;
      const newBowlerOvers = newBowlerBalls === 6 ? prev.currentBowler.overs + 1 : prev.currentBowler.overs;
      const totalBowlerBalls = newBowlerOvers * 6 + (newBowlerBalls === 6 ? 0 : newBowlerBalls);
      const newBowler: Bowler = {
        ...prev.currentBowler,
        balls: newBowlerBalls === 6 ? 0 : newBowlerBalls,
        overs: newBowlerOvers,
        wickets: prev.currentBowler.wickets + 1,
        economy: totalBowlerBalls > 0 ? (prev.currentBowler.runs / totalBowlerBalls) * 6 : 0,
      };

      // Update allBatters
      const newAllBatters = prev.allBatters
        .map(ab => ab.id === striker.id ? updatedStriker : ab)
        .concat(newBatter);

      // Update allBowlers
      const existingBowlerIndex = prev.allBowlers.findIndex(b => b.id === prev.currentBowler.id);
      let newAllBowlers = [...prev.allBowlers];
      if (existingBowlerIndex >= 0) {
        newAllBowlers[existingBowlerIndex] = newBowler;
      }

      return {
        ...prev,
        battingTeam: {
          ...prev.battingTeam,
          wickets: newWickets,
          overs: newOvers,
          balls: newBalls,
        },
        batters: newBatters,
        allBatters: newAllBatters,
        currentBowler: newBowler,
        allBowlers: newAllBowlers,
        currentOver: newBalls === 0 ? [] : newCurrentOver,
        overs: newOversList,
        fallOfWickets: newFallOfWickets,
        partnerships: newPartnerships,
        currentPartnership: newCurrentPartnership,
      };
    });

    setPendingWicket(false);
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
    resumeAudioContext();
    setMatchState(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  }, []);

  const toggleVibration = useCallback(() => {
    setMatchState(prev => ({ ...prev, vibrationEnabled: !prev.vibrationEnabled }));
  }, []);

  const resetMatch = useCallback(() => {
    setMatchState(getDefaultMatchState());
    setPendingWicket(false);
    setPendingBowlerChange(false);
    setShowInningsBreak(false);
  }, []);

  const getMatchResult = useCallback((battingScore: number, battingWickets: number, target: number, bowlingTeamName: string, battingTeamName: string, remainingBalls: number): MatchResult => {
    if (battingScore >= target) {
      const wicketsLeft = 10 - battingWickets;
      return {
        winner: battingTeamName,
        margin: `by ${wicketsLeft} wicket${wicketsLeft !== 1 ? 's' : ''}`,
        resultText: `${battingTeamName} wins!`,
      };
    } else if (battingScore === target - 1 && remainingBalls === 0) {
      return {
        winner: null,
        margin: '',
        resultText: 'Match Tied!',
      };
    } else {
      const runsShort = target - battingScore - 1;
      return {
        winner: bowlingTeamName,
        margin: `by ${runsShort} run${runsShort !== 1 ? 's' : ''}`,
        resultText: `${bowlingTeamName} wins!`,
      };
    }
  }, []);

  const endInnings = useCallback(() => {
    setMatchState(prev => {
      if (prev.isFirstInnings) {
        // End first innings - show innings break
        setShowInningsBreak(true);
        return {
          ...prev,
          matchStatus: 'innings_break',
        };
      } else {
        // End second innings - calculate result
        const target = prev.bowlingTeam.target || prev.battingTeam.score + 1;
        const result = getMatchResult(
          prev.battingTeam.score,
          prev.battingTeam.wickets,
          target,
          prev.bowlingTeam.name,
          prev.battingTeam.name,
          0
        );
        return {
          ...prev,
          matchStatus: 'completed',
          matchResult: result,
        };
      }
    });
  }, [getMatchResult]);

  const startSecondInnings = useCallback(() => {
    setMatchState(prev => {
      const target = prev.battingTeam.score + 1;
      
      // Save first innings data
      const firstInningsData: InningsData = {
        battingTeam: { ...prev.battingTeam },
        bowlingTeam: { ...prev.bowlingTeam },
        allBatters: [...prev.allBatters],
        allBowlers: [...prev.allBowlers],
        overs: [...prev.overs],
        fallOfWickets: [...prev.fallOfWickets],
        partnerships: [...prev.partnerships],
      };

      // Swap teams
      const newBattingTeam = {
        ...prev.bowlingTeam,
        score: 0,
        wickets: 0,
        overs: 0,
        balls: 0,
        target,
      };

      const newBowlingTeam = {
        ...prev.battingTeam,
        target: undefined,
      };

      // Create opening batters for second innings
      const openingBatters = [
        createInitialBatter('s1', newBattingTeam.players[0] || 'Batter 1', true),
        createInitialBatter('s2', newBattingTeam.players[1] || 'Batter 2', false),
      ];

      // Create opening bowler for second innings
      const openingBowler = createInitialBowler('s1', newBowlingTeam.players[0] || 'Bowler 1');

      return {
        ...prev,
        battingTeam: newBattingTeam,
        bowlingTeam: newBowlingTeam,
        batters: openingBatters,
        allBatters: openingBatters,
        currentBowler: openingBowler,
        allBowlers: [openingBowler],
        overs: [],
        currentOver: [],
        isFirstInnings: false,
        matchStatus: 'in_progress',
        fallOfWickets: [],
        partnerships: [],
        currentPartnership: {
          batter1: openingBatters[0].name,
          batter2: openingBatters[1].name,
          runs: 0,
          balls: 0,
        },
        firstInningsData,
      };
    });
    
    setShowInningsBreak(false);
    setPendingBowlerChange(true);
    setLastBowlerName('');
  }, []);

  // Check for match completion after each ball in second innings
  const checkMatchCompletion = useCallback((state: MatchState): MatchState => {
    if (state.isFirstInnings) return state;
    
    const target = state.battingTeam.target;
    if (!target) return state;

    const totalBalls = state.matchDetails.totalOvers * 6;
    const ballsBowled = state.battingTeam.overs * 6 + state.battingTeam.balls;
    const remainingBalls = totalBalls - ballsBowled;

    // Check if target reached
    if (state.battingTeam.score >= target) {
      const wicketsLeft = 10 - state.battingTeam.wickets;
      return {
        ...state,
        matchStatus: 'completed',
        matchResult: {
          winner: state.battingTeam.name,
          margin: `by ${wicketsLeft} wicket${wicketsLeft !== 1 ? 's' : ''}`,
          resultText: `${state.battingTeam.name} wins!`,
        },
      };
    }

    // Check if all out or overs finished
    if (state.battingTeam.wickets >= 10 || remainingBalls === 0) {
      if (state.battingTeam.score === target - 1) {
        return {
          ...state,
          matchStatus: 'completed',
          matchResult: {
            winner: null,
            margin: '',
            resultText: 'Match Tied!',
          },
        };
      } else {
        const runsShort = target - state.battingTeam.score - 1;
        return {
          ...state,
          matchStatus: 'completed',
          matchResult: {
            winner: state.bowlingTeam.name,
            margin: `by ${runsShort} run${runsShort !== 1 ? 's' : ''}`,
            resultText: `${state.bowlingTeam.name} wins!`,
          },
        };
      }
    }

    return state;
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
        processWicket,
        pendingWicket,
        setPendingWicket,
        pendingBowlerChange,
        setPendingBowlerChange,
        lastBowlerName,
        isMatchSetup: matchState.matchStatus !== 'setup',
        endInnings,
        startSecondInnings,
        showInningsBreak,
        setShowInningsBreak,
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
