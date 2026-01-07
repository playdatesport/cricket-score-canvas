import { useState, useEffect, useCallback } from 'react';
import { MatchState } from '@/types/cricket';
import { toast } from 'sonner';

const STORAGE_KEY = 'cricket_match_history';

export interface SavedMatch {
  id: string;
  created_at: string;
  updated_at: string;
  match_details: any;
  match_state: MatchState;
  status: string;
  team1_name: string;
  team2_name: string;
  team1_score: number;
  team2_score: number;
  winner: string | null;
}

function getStoredMatches(): SavedMatch[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function setStoredMatches(matches: SavedMatch[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(matches));
}

export function useMatchHistory() {
  const [matches, setMatches] = useState<SavedMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentMatchId, setCurrentMatchId] = useState<string | null>(null);

  const fetchMatches = useCallback(() => {
    setLoading(true);
    const stored = getStoredMatches();
    setMatches(stored.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()));
    setLoading(false);
  }, []);

  const saveMatch = useCallback((matchState: MatchState): string | null => {
    try {
      const isFirstInnings = matchState.isFirstInnings;
      const team1Score = isFirstInnings 
        ? matchState.battingTeam.score 
        : (matchState.firstInningsData?.battingTeam.score || 0);
      const team2Score = isFirstInnings 
        ? 0 
        : matchState.battingTeam.score;

      const now = new Date().toISOString();
      const stored = getStoredMatches();

      if (currentMatchId) {
        const index = stored.findIndex(m => m.id === currentMatchId);
        if (index !== -1) {
          stored[index] = {
            ...stored[index],
            updated_at: now,
            match_details: matchState.matchDetails,
            match_state: matchState,
            status: matchState.matchStatus as string,
            team1_name: isFirstInnings ? matchState.battingTeam.name : matchState.bowlingTeam.name,
            team2_name: isFirstInnings ? matchState.bowlingTeam.name : matchState.battingTeam.name,
            team1_score: team1Score,
            team2_score: team2Score,
            winner: matchState.matchResult?.winner || null,
          };
          setStoredMatches(stored);
          setMatches(stored.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()));
          return currentMatchId;
        }
      }

      const newId = crypto.randomUUID();
      const newMatch: SavedMatch = {
        id: newId,
        created_at: now,
        updated_at: now,
        match_details: matchState.matchDetails,
        match_state: matchState,
        status: matchState.matchStatus as string,
        team1_name: isFirstInnings ? matchState.battingTeam.name : matchState.bowlingTeam.name,
        team2_name: isFirstInnings ? matchState.bowlingTeam.name : matchState.battingTeam.name,
        team1_score: team1Score,
        team2_score: team2Score,
        winner: matchState.matchResult?.winner || null,
      };

      stored.push(newMatch);
      setStoredMatches(stored);
      setMatches(stored.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()));
      setCurrentMatchId(newId);
      return newId;
    } catch (error) {
      console.error('Error saving match:', error);
      toast.error('Failed to save match');
      return null;
    }
  }, [currentMatchId]);

  const loadMatch = useCallback((matchId: string): MatchState | null => {
    try {
      const stored = getStoredMatches();
      const match = stored.find(m => m.id === matchId);
      if (match) {
        setCurrentMatchId(matchId);
        return match.match_state;
      }
      return null;
    } catch (error) {
      console.error('Error loading match:', error);
      toast.error('Failed to load match');
      return null;
    }
  }, []);

  const deleteMatch = useCallback((matchId: string): boolean => {
    try {
      const stored = getStoredMatches();
      const filtered = stored.filter(m => m.id !== matchId);
      setStoredMatches(filtered);
      setMatches(filtered.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()));
      if (currentMatchId === matchId) {
        setCurrentMatchId(null);
      }
      toast.success('Match deleted');
      return true;
    } catch (error) {
      console.error('Error deleting match:', error);
      toast.error('Failed to delete match');
      return false;
    }
  }, [currentMatchId]);

  const clearCurrentMatch = useCallback(() => {
    setCurrentMatchId(null);
  }, []);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  return {
    matches,
    loading,
    currentMatchId,
    fetchMatches,
    saveMatch,
    loadMatch,
    deleteMatch,
    clearCurrentMatch,
  };
}
