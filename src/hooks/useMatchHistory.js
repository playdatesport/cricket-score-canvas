import { useState, useCallback } from 'react';

const STORAGE_KEY = 'cricket_match_history';

export const useMatchHistory = () => {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMatches = useCallback(() => {
    setIsLoading(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : [];
      setMatches(parsed);
    } catch (error) {
      console.error('Error fetching matches:', error);
      setMatches([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveMatch = useCallback((matchState) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const existing = stored ? JSON.parse(stored) : [];
      
      const matchToSave = {
        id: matchState.id || crypto.randomUUID(),
        team1_name: matchState.battingTeam?.name || '',
        team2_name: matchState.bowlingTeam?.name || '',
        team1_score: matchState.battingTeam?.score || 0,
        team2_score: matchState.bowlingTeam?.score || 0,
        status: matchState.matchStatus || 'in_progress',
        winner: matchState.matchResult?.winner || null,
        match_details: matchState.matchDetails || {},
        match_state: matchState,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const existingIndex = existing.findIndex(m => m.id === matchToSave.id);
      if (existingIndex >= 0) {
        existing[existingIndex] = matchToSave;
      } else {
        existing.unshift(matchToSave);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      setMatches(existing);
      return matchToSave.id;
    } catch (error) {
      console.error('Error saving match:', error);
      return null;
    }
  }, []);

  const deleteMatch = useCallback((matchId) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const existing = stored ? JSON.parse(stored) : [];
      const filtered = existing.filter(m => m.id !== matchId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      setMatches(filtered);
      return true;
    } catch (error) {
      console.error('Error deleting match:', error);
      return false;
    }
  }, []);

  const getMatch = useCallback((matchId) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const existing = stored ? JSON.parse(stored) : [];
      return existing.find(m => m.id === matchId) || null;
    } catch (error) {
      console.error('Error getting match:', error);
      return null;
    }
  }, []);

  return {
    matches,
    isLoading,
    fetchMatches,
    saveMatch,
    deleteMatch,
    getMatch,
  };
};
