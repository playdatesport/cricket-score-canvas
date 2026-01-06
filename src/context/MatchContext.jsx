import React, { createContext, useContext, useState, useCallback } from 'react';

const MatchContext = createContext(undefined);

const getDefaultMatchState = () => ({
  matchDetails: {
    matchType: 'T20',
    tossWinner: '',
    tossDecision: 'bat',
    venue: '',
    date: '',
    time: '',
    ballType: 'White',
    totalOvers: 20,
  },
  battingTeam: {
    name: '',
    shortName: '',
    score: 0,
    wickets: 0,
    overs: 0,
    balls: 0,
    players: [],
  },
  bowlingTeam: {
    name: '',
    shortName: '',
    score: 0,
    wickets: 0,
    overs: 0,
    balls: 0,
    players: [],
  },
  batters: [],
  allBatters: [],
  currentBowler: {
    id: '',
    name: '',
    overs: 0,
    balls: 0,
    maidens: 0,
    runs: 0,
    wickets: 0,
    economy: 0,
    noBalls: 0,
    wides: 0,
  },
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

export const MatchProvider = ({ children }) => {
  const [matchState, setMatchState] = useState(getDefaultMatchState());

  const setupMatch = useCallback((setupData) => {
    const battingTeamKey = 
      (setupData.tossWinner === 'team1' && setupData.tossDecision === 'bat') ||
      (setupData.tossWinner === 'team2' && setupData.tossDecision === 'bowl')
        ? 'team1' : 'team2';
    
    const bowlingTeamKey = battingTeamKey === 'team1' ? 'team2' : 'team1';
    
    const totalOvers = setupData.matchType === 'T20' ? 20 : setupData.matchType === 'ODI' ? 50 : 90;

    setMatchState({
      ...getDefaultMatchState(),
      matchDetails: {
        matchType: setupData.matchType,
        tossWinner: setupData[`${setupData.tossWinner}Name`],
        tossDecision: setupData.tossDecision,
        venue: setupData.venue,
        date: setupData.date,
        time: setupData.time,
        ballType: setupData.matchType === 'Test' ? 'Red' : 'White',
        totalOvers,
      },
      battingTeam: {
        name: setupData[`${battingTeamKey}Name`],
        shortName: setupData[`${battingTeamKey}ShortName`],
        score: 0,
        wickets: 0,
        overs: 0,
        balls: 0,
        players: setupData[`${battingTeamKey}Players`],
      },
      bowlingTeam: {
        name: setupData[`${bowlingTeamKey}Name`],
        shortName: setupData[`${bowlingTeamKey}ShortName`],
        score: 0,
        wickets: 0,
        overs: 0,
        balls: 0,
        players: setupData[`${bowlingTeamKey}Players`],
      },
      matchStatus: 'not_started',
    });
  }, []);

  const selectOpeningPlayers = useCallback((batter1Name, batter2Name, bowlerName) => {
    const batter1 = {
      id: crypto.randomUUID(),
      name: batter1Name,
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      isOnStrike: true,
      isOut: false,
    };
    const batter2 = {
      id: crypto.randomUUID(),
      name: batter2Name,
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      isOnStrike: false,
      isOut: false,
    };
    const bowler = {
      id: crypto.randomUUID(),
      name: bowlerName,
      overs: 0,
      balls: 0,
      maidens: 0,
      runs: 0,
      wickets: 0,
      economy: 0,
      noBalls: 0,
      wides: 0,
    };

    setMatchState(prev => ({
      ...prev,
      batters: [batter1, batter2],
      allBatters: [batter1, batter2],
      currentBowler: bowler,
      allBowlers: [bowler],
      currentPartnership: { batter1: batter1Name, batter2: batter2Name, runs: 0, balls: 0 },
      matchStatus: 'in_progress',
    }));
  }, []);

  const recordBall = useCallback((outcome) => {
    setMatchState(prev => {
      const isExtra = outcome === 'WD' || outcome === 'NB' || outcome === 'LB' || outcome === 'B';
      const isWicket = outcome === 'W';
      const isWide = outcome === 'WD';
      const isNoBall = outcome === 'NB';
      
      let runsScored = typeof outcome === 'number' ? outcome : 0;
      if (isWide || isNoBall) runsScored = 1;
      
      const newBall = {
        id: crypto.randomUUID(),
        outcome,
        runs: runsScored,
        isExtra,
        isWicket,
        overNumber: prev.battingTeam.overs,
        ballNumber: prev.battingTeam.balls,
      };

      const legalBall = !isWide && !isNoBall;
      const newBalls = legalBall ? prev.battingTeam.balls + 1 : prev.battingTeam.balls;
      const overComplete = newBalls === 6;
      const newOvers = overComplete ? prev.battingTeam.overs + 1 : prev.battingTeam.overs;
      const finalBalls = overComplete ? 0 : newBalls;

      const updatedBatters = prev.batters.map(batter => {
        if (!batter.isOnStrike) return batter;
        return {
          ...batter,
          runs: batter.runs + (typeof outcome === 'number' ? outcome : 0),
          balls: legalBall && !isWicket ? batter.balls + 1 : batter.balls,
          fours: outcome === 4 ? batter.fours + 1 : batter.fours,
          sixes: outcome === 6 ? batter.sixes + 1 : batter.sixes,
        };
      });

      const shouldRotateStrike = (typeof outcome === 'number' && outcome % 2 === 1) || overComplete;
      const rotatedBatters = shouldRotateStrike
        ? updatedBatters.map(b => ({ ...b, isOnStrike: !b.isOnStrike }))
        : updatedBatters;

      const totalOversDelivered = newOvers + finalBalls / 6;
      const updatedBowler = {
        ...prev.currentBowler,
        balls: legalBall ? prev.currentBowler.balls + 1 : prev.currentBowler.balls,
        overs: Math.floor((prev.currentBowler.balls + (legalBall ? 1 : 0)) / 6),
        runs: prev.currentBowler.runs + runsScored,
        wides: isWide ? prev.currentBowler.wides + 1 : prev.currentBowler.wides,
        noBalls: isNoBall ? prev.currentBowler.noBalls + 1 : prev.currentBowler.noBalls,
        economy: totalOversDelivered > 0 
          ? (prev.currentBowler.runs + runsScored) / totalOversDelivered 
          : 0,
      };

      const newScore = prev.battingTeam.score + runsScored;
      const target = prev.battingTeam.target;
      const inningsComplete = 
        newOvers >= prev.matchDetails.totalOvers || 
        prev.battingTeam.wickets >= 9 ||
        (target && newScore >= target);

      let matchStatus = prev.matchStatus;
      let matchResult = prev.matchResult;

      if (inningsComplete) {
        if (prev.isFirstInnings) {
          matchStatus = 'innings_break';
        } else {
          matchStatus = 'completed';
          if (target && newScore >= target) {
            const wicketsRemaining = 10 - prev.battingTeam.wickets;
            matchResult = {
              winner: prev.battingTeam.name,
              margin: `${wicketsRemaining} wickets`,
              resultText: `${prev.battingTeam.name} won by ${wicketsRemaining} wickets`,
            };
          } else {
            const runsDiff = target - newScore - 1;
            matchResult = {
              winner: prev.bowlingTeam.name,
              margin: `${runsDiff} runs`,
              resultText: `${prev.bowlingTeam.name} won by ${runsDiff} runs`,
            };
          }
        }
      }

      return {
        ...prev,
        battingTeam: {
          ...prev.battingTeam,
          score: newScore,
          overs: newOvers,
          balls: finalBalls,
        },
        batters: rotatedBatters,
        allBatters: prev.allBatters.map(ab => 
          rotatedBatters.find(rb => rb.id === ab.id) || ab
        ),
        currentBowler: updatedBowler,
        allBowlers: prev.allBowlers.map(b => 
          b.id === updatedBowler.id ? updatedBowler : b
        ),
        currentOver: [...prev.currentOver, newBall],
        currentPartnership: {
          ...prev.currentPartnership,
          runs: prev.currentPartnership.runs + (typeof outcome === 'number' ? outcome : 0),
          balls: legalBall ? prev.currentPartnership.balls + 1 : prev.currentPartnership.balls,
        },
        matchStatus,
        matchResult,
      };
    });
  }, []);

  const recordWicket = useCallback((dismissalType, dismissedBatterId, newBatterName, caughtBy) => {
    setMatchState(prev => {
      const dismissedBatter = prev.batters.find(b => b.id === dismissedBatterId);
      if (!dismissedBatter) return prev;

      const newFow = {
        wicketNumber: prev.battingTeam.wickets + 1,
        score: prev.battingTeam.score,
        overs: prev.battingTeam.overs,
        balls: prev.battingTeam.balls,
        batterName: dismissedBatter.name,
      };

      const newBatter = {
        id: crypto.randomUUID(),
        name: newBatterName,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        isOnStrike: dismissedBatter.isOnStrike,
        isOut: false,
      };

      const updatedBatters = prev.batters.map(b => {
        if (b.id === dismissedBatterId) {
          return { ...b, isOut: true, dismissalType, caughtBy };
        }
        return b;
      }).filter(b => !b.isOut);

      const strikeBatter = updatedBatters.find(b => b.isOnStrike);
      const nonStrikeName = strikeBatter?.name || '';

      const updatedBowler = {
        ...prev.currentBowler,
        wickets: prev.currentBowler.wickets + 1,
        balls: prev.currentBowler.balls + 1,
        overs: Math.floor((prev.currentBowler.balls + 1) / 6),
      };

      const newWickets = prev.battingTeam.wickets + 1;
      const target = prev.battingTeam.target;
      const allOut = newWickets >= 10;

      let matchStatus = prev.matchStatus;
      let matchResult = prev.matchResult;

      if (allOut) {
        if (prev.isFirstInnings) {
          matchStatus = 'innings_break';
        } else {
          matchStatus = 'completed';
          const runsDiff = target - prev.battingTeam.score - 1;
          matchResult = {
            winner: prev.bowlingTeam.name,
            margin: `${runsDiff} runs`,
            resultText: `${prev.bowlingTeam.name} won by ${runsDiff} runs`,
          };
        }
      }

      return {
        ...prev,
        battingTeam: {
          ...prev.battingTeam,
          wickets: newWickets,
          balls: (prev.battingTeam.balls + 1) % 6,
          overs: (prev.battingTeam.balls + 1) === 6 
            ? prev.battingTeam.overs + 1 
            : prev.battingTeam.overs,
        },
        batters: [...updatedBatters, newBatter],
        allBatters: [
          ...prev.allBatters.map(ab => 
            ab.id === dismissedBatterId 
              ? { ...ab, isOut: true, dismissalType, caughtBy }
              : ab
          ),
          newBatter,
        ],
        currentBowler: updatedBowler,
        allBowlers: prev.allBowlers.map(b => 
          b.id === updatedBowler.id ? updatedBowler : b
        ),
        currentOver: [
          ...prev.currentOver,
          {
            id: crypto.randomUUID(),
            outcome: 'W',
            runs: 0,
            isExtra: false,
            isWicket: true,
            overNumber: prev.battingTeam.overs,
            ballNumber: prev.battingTeam.balls,
          },
        ],
        fallOfWickets: [...prev.fallOfWickets, newFow],
        partnerships: [
          ...prev.partnerships,
          prev.currentPartnership,
        ],
        currentPartnership: {
          batter1: newBatter.name,
          batter2: nonStrikeName,
          runs: 0,
          balls: 0,
        },
        matchStatus,
        matchResult,
      };
    });
  }, []);

  const changeBowler = useCallback((newBowlerName) => {
    setMatchState(prev => {
      const existingBowler = prev.allBowlers.find(b => b.name === newBowlerName);
      
      const newBowler = existingBowler || {
        id: crypto.randomUUID(),
        name: newBowlerName,
        overs: 0,
        balls: 0,
        maidens: 0,
        runs: 0,
        wickets: 0,
        economy: 0,
        noBalls: 0,
        wides: 0,
      };

      const updatedAllBowlers = existingBowler 
        ? prev.allBowlers 
        : [...prev.allBowlers, newBowler];

      const currentOverRuns = prev.currentOver.reduce((sum, ball) => sum + ball.runs, 0);
      const isMaiden = prev.currentOver.length === 6 && currentOverRuns === 0;

      return {
        ...prev,
        currentBowler: newBowler,
        allBowlers: updatedAllBowlers.map(b => 
          b.id === prev.currentBowler.id && isMaiden
            ? { ...b, maidens: b.maidens + 1 }
            : b
        ),
        overs: prev.currentOver.length > 0 
          ? [...prev.overs, {
              number: prev.battingTeam.overs,
              balls: prev.currentOver,
              runs: currentOverRuns,
              wickets: prev.currentOver.filter(b => b.isWicket).length,
            }]
          : prev.overs,
        currentOver: [],
      };
    });
  }, []);

  const startSecondInnings = useCallback(() => {
    setMatchState(prev => {
      const firstInningsData = {
        battingTeam: { ...prev.battingTeam },
        bowlingTeam: { ...prev.bowlingTeam },
        allBatters: [...prev.allBatters],
        allBowlers: [...prev.allBowlers],
        overs: [...prev.overs],
        fallOfWickets: [...prev.fallOfWickets],
        partnerships: [...prev.partnerships, prev.currentPartnership],
      };

      return {
        ...prev,
        battingTeam: {
          ...prev.bowlingTeam,
          score: 0,
          wickets: 0,
          overs: 0,
          balls: 0,
          target: prev.battingTeam.score + 1,
        },
        bowlingTeam: {
          ...prev.battingTeam,
          target: undefined,
        },
        batters: [],
        allBatters: [],
        currentBowler: {
          id: '',
          name: '',
          overs: 0,
          balls: 0,
          maidens: 0,
          runs: 0,
          wickets: 0,
          economy: 0,
          noBalls: 0,
          wides: 0,
        },
        allBowlers: [],
        overs: [],
        currentOver: [],
        isFirstInnings: false,
        matchStatus: 'not_started',
        fallOfWickets: [],
        partnerships: [],
        currentPartnership: { batter1: '', batter2: '', runs: 0, balls: 0 },
        firstInningsData,
      };
    });
  }, []);

  const undoLastBall = useCallback(() => {
    setMatchState(prev => {
      if (prev.currentOver.length === 0) return prev;
      
      const lastBall = prev.currentOver[prev.currentOver.length - 1];
      const newCurrentOver = prev.currentOver.slice(0, -1);
      
      const legalBall = lastBall.outcome !== 'WD' && lastBall.outcome !== 'NB';
      
      return {
        ...prev,
        battingTeam: {
          ...prev.battingTeam,
          score: prev.battingTeam.score - lastBall.runs,
          balls: legalBall 
            ? (prev.battingTeam.balls === 0 ? 5 : prev.battingTeam.balls - 1)
            : prev.battingTeam.balls,
          overs: legalBall && prev.battingTeam.balls === 0
            ? prev.battingTeam.overs - 1
            : prev.battingTeam.overs,
        },
        currentOver: newCurrentOver,
      };
    });
  }, []);

  const changeBatter = useCallback((outgoingBatterId, incomingBatterName) => {
    setMatchState(prev => {
      const newBatter = {
        id: crypto.randomUUID(),
        name: incomingBatterName,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        isOnStrike: prev.batters.find(b => b.id === outgoingBatterId)?.isOnStrike || false,
        isOut: false,
      };

      const updatedBatters = prev.batters.map(b => 
        b.id === outgoingBatterId 
          ? { ...b, isOut: true, dismissalType: 'retired hurt' }
          : b
      ).filter(b => !b.isOut);

      return {
        ...prev,
        batters: [...updatedBatters, newBatter],
        allBatters: [
          ...prev.allBatters.map(ab => 
            ab.id === outgoingBatterId 
              ? { ...ab, isOut: true, dismissalType: 'retired hurt' }
              : ab
          ),
          newBatter,
        ],
      };
    });
  }, []);

  const toggleSound = useCallback(() => {
    setMatchState(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  }, []);

  const toggleVibration = useCallback(() => {
    setMatchState(prev => ({ ...prev, vibrationEnabled: !prev.vibrationEnabled }));
  }, []);

  const clearMatch = useCallback(() => {
    setMatchState(getDefaultMatchState());
  }, []);

  const loadMatch = useCallback((state) => {
    setMatchState(state);
  }, []);

  return (
    <MatchContext.Provider 
      value={{
        matchState,
        setupMatch,
        selectOpeningPlayers,
        recordBall,
        recordWicket,
        changeBowler,
        startSecondInnings,
        undoLastBall,
        changeBatter,
        toggleSound,
        toggleVibration,
        clearMatch,
        loadMatch,
      }}
    >
      {children}
    </MatchContext.Provider>
  );
};

export const useMatch = () => {
  const context = useContext(MatchContext);
  if (context === undefined) {
    throw new Error('useMatch must be used within a MatchProvider');
  }
  return context;
};
