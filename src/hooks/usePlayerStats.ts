import { useMemo } from 'react';
import { SavedMatch } from '@/hooks/useMatchHistory';
import { Batter, Bowler } from '@/types/cricket';

export interface PlayerBattingStats {
  name: string;
  matches: number;
  innings: number;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  highestScore: number;
  average: number;
  strikeRate: number;
  notOuts: number;
}

export interface PlayerBowlingStats {
  name: string;
  matches: number;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
  average: number;
  bestFigures: string;
  bestWickets: number;
  bestRuns: number;
}

export function usePlayerStats(matches: SavedMatch[]) {
  const battingStats = useMemo(() => {
    const playerMap = new Map<string, PlayerBattingStats>();

    matches.forEach((match) => {
      const state = match.match_state;
      if (!state) return;

      // Process first innings batters
      const firstInningsBatters = state.firstInningsData?.allBatters || [];
      const secondInningsBatters = state.allBatters || [];

      const processBatters = (batters: Batter[], matchId: string) => {
        batters.forEach((batter) => {
          if (!batter.name || batter.name === 'Batter 1' || batter.name === 'Batter 2') return;
          
          const existing = playerMap.get(batter.name) || {
            name: batter.name,
            matches: 0,
            innings: 0,
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0,
            highestScore: 0,
            average: 0,
            strikeRate: 0,
            notOuts: 0,
          };

          existing.innings += 1;
          existing.runs += batter.runs;
          existing.balls += batter.balls;
          existing.fours += batter.fours;
          existing.sixes += batter.sixes;
          if (batter.runs > existing.highestScore) {
            existing.highestScore = batter.runs;
          }
          if (!batter.isOut) {
            existing.notOuts += 1;
          }

          playerMap.set(batter.name, existing);
        });
      };

      processBatters(firstInningsBatters, match.id);
      processBatters(secondInningsBatters, match.id);
    });

    // Calculate averages and strike rates
    const stats = Array.from(playerMap.values()).map((player) => {
      const dismissals = player.innings - player.notOuts;
      return {
        ...player,
        matches: player.innings,
        average: dismissals > 0 ? player.runs / dismissals : player.runs,
        strikeRate: player.balls > 0 ? (player.runs / player.balls) * 100 : 0,
      };
    });

    return stats.sort((a, b) => b.runs - a.runs);
  }, [matches]);

  const bowlingStats = useMemo(() => {
    const playerMap = new Map<string, PlayerBowlingStats>();

    matches.forEach((match) => {
      const state = match.match_state;
      if (!state) return;

      const firstInningsBowlers = state.firstInningsData?.allBowlers || [];
      const secondInningsBowlers = state.allBowlers || [];

      const processBowlers = (bowlers: Bowler[]) => {
        bowlers.forEach((bowler) => {
          if (!bowler.name || bowler.name === 'Select Bowler' || bowler.name === 'Bowler 1') return;
          if (bowler.overs === 0 && bowler.balls === 0) return;

          const existing = playerMap.get(bowler.name) || {
            name: bowler.name,
            matches: 0,
            overs: 0,
            maidens: 0,
            runs: 0,
            wickets: 0,
            economy: 0,
            average: 0,
            bestFigures: '0/0',
            bestWickets: 0,
            bestRuns: 999,
          };

          existing.matches += 1;
          existing.overs += bowler.overs + bowler.balls / 6;
          existing.maidens += bowler.maidens;
          existing.runs += bowler.runs;
          existing.wickets += bowler.wickets;

          // Track best figures (most wickets, then fewest runs)
          if (
            bowler.wickets > existing.bestWickets ||
            (bowler.wickets === existing.bestWickets && bowler.runs < existing.bestRuns)
          ) {
            existing.bestWickets = bowler.wickets;
            existing.bestRuns = bowler.runs;
            existing.bestFigures = `${bowler.wickets}/${bowler.runs}`;
          }

          playerMap.set(bowler.name, existing);
        });
      };

      processBowlers(firstInningsBowlers);
      processBowlers(secondInningsBowlers);
    });

    // Calculate averages and economy
    const stats = Array.from(playerMap.values()).map((player) => ({
      ...player,
      overs: Math.round(player.overs * 10) / 10,
      economy: player.overs > 0 ? player.runs / player.overs : 0,
      average: player.wickets > 0 ? player.runs / player.wickets : 0,
    }));

    return stats.sort((a, b) => b.wickets - a.wickets);
  }, [matches]);

  const topScorers = useMemo(() => battingStats.slice(0, 10), [battingStats]);
  const topWicketTakers = useMemo(() => bowlingStats.slice(0, 10), [bowlingStats]);
  const bestStrikeRates = useMemo(
    () => [...battingStats].filter(p => p.balls >= 10).sort((a, b) => b.strikeRate - a.strikeRate).slice(0, 10),
    [battingStats]
  );
  const bestEconomy = useMemo(
    () => [...bowlingStats].filter(p => p.overs >= 2).sort((a, b) => a.economy - b.economy).slice(0, 10),
    [bowlingStats]
  );

  return {
    battingStats,
    bowlingStats,
    topScorers,
    topWicketTakers,
    bestStrikeRates,
    bestEconomy,
  };
}
