import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MatchState } from '@/types/cricket';
import { toast } from 'sonner';

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

export function useMatchHistory() {
  const [matches, setMatches] = useState<SavedMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentMatchId, setCurrentMatchId] = useState<string | null>(null);

  const fetchMatches = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      setMatches((data || []).map(m => ({
        ...m,
        match_state: m.match_state as unknown as MatchState,
      })));
    } catch (error) {
      console.error('Error fetching matches:', error);
      toast.error('Failed to load match history');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveMatch = useCallback(async (matchState: MatchState): Promise<string | null> => {
    try {
      const isFirstInnings = matchState.isFirstInnings;
      const team1Score = isFirstInnings 
        ? matchState.battingTeam.score 
        : (matchState.firstInningsData?.battingTeam.score || 0);
      const team2Score = isFirstInnings 
        ? 0 
        : matchState.battingTeam.score;

      const matchData = {
        match_details: JSON.parse(JSON.stringify(matchState.matchDetails)),
        match_state: JSON.parse(JSON.stringify(matchState)),
        status: matchState.matchStatus as string,
        team1_name: isFirstInnings ? matchState.battingTeam.name : matchState.bowlingTeam.name,
        team2_name: isFirstInnings ? matchState.bowlingTeam.name : matchState.battingTeam.name,
        team1_score: team1Score,
        team2_score: team2Score,
        winner: matchState.matchResult?.winner || null,
      };

      if (currentMatchId) {
        const { error } = await supabase
          .from('matches')
          .update(matchData)
          .eq('id', currentMatchId);

        if (error) throw error;
        return currentMatchId;
      } else {
        const { data, error } = await supabase
          .from('matches')
          .insert([matchData])
          .select('id')
          .single();

        if (error) throw error;
        setCurrentMatchId(data.id);
        return data.id;
      }
    } catch (error) {
      console.error('Error saving match:', error);
      toast.error('Failed to save match');
      return null;
    }
  }, [currentMatchId]);

  const loadMatch = useCallback(async (matchId: string): Promise<MatchState | null> => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .eq('id', matchId)
        .single();

      if (error) throw error;
      
      setCurrentMatchId(matchId);
      return data.match_state as unknown as MatchState;
    } catch (error) {
      console.error('Error loading match:', error);
      toast.error('Failed to load match');
      return null;
    }
  }, []);

  const deleteMatch = useCallback(async (matchId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('matches')
        .delete()
        .eq('id', matchId);

      if (error) throw error;
      
      setMatches(prev => prev.filter(m => m.id !== matchId));
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
