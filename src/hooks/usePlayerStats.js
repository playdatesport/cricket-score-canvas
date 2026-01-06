import { useState, useCallback } from 'react';

export const usePlayerStats = () => {
  const [stats, setStats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const calculateStats = useCallback((matches) => {
    setIsLoading(true);
    try {
      const playerMap = new Map();

      matches.forEach(match => {
        const state = match.match_state;
        if (!state) return;

        const processInnings = (inningsData) => {
          if (!inningsData) return;

          inningsData.allBatters?.forEach(batter => {
            const existing = playerMap.get(batter.name) || {
              name: batter.name,
              matches: 0,
              runs: 0,
              balls: 0,
              fours: 0,
              sixes: 0,
              wickets: 0,
              overs: 0,
              runsConceded: 0,
              dismissals: 0,
            };

            existing.runs += batter.runs || 0;
            existing.balls += batter.balls || 0;
            existing.fours += batter.fours || 0;
            existing.sixes += batter.sixes || 0;
            if (batter.isOut) existing.dismissals += 1;

            playerMap.set(batter.name, existing);
          });

          inningsData.allBowlers?.forEach(bowler => {
            const existing = playerMap.get(bowler.name) || {
              name: bowler.name,
              matches: 0,
              runs: 0,
              balls: 0,
              fours: 0,
              sixes: 0,
              wickets: 0,
              overs: 0,
              runsConceded: 0,
              dismissals: 0,
            };

            existing.wickets += bowler.wickets || 0;
            existing.overs += bowler.overs || 0;
            existing.runsConceded += bowler.runs || 0;

            playerMap.set(bowler.name, existing);
          });
        };

        processInnings(state);
        processInnings(state.firstInningsData);
      });

      const statsArray = Array.from(playerMap.values()).map(player => ({
        ...player,
        strikeRate: player.balls > 0 ? ((player.runs / player.balls) * 100).toFixed(1) : '0.0',
        average: player.dismissals > 0 ? (player.runs / player.dismissals).toFixed(1) : player.runs.toFixed(1),
        economy: player.overs > 0 ? (player.runsConceded / player.overs).toFixed(2) : '0.00',
        bowlingAverage: player.wickets > 0 ? (player.runsConceded / player.wickets).toFixed(1) : '-',
      }));

      setStats(statsArray);
    } catch (error) {
      console.error('Error calculating stats:', error);
      setStats([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    stats,
    isLoading,
    calculateStats,
  };
};
