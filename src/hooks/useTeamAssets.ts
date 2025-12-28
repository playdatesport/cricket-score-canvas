import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface TeamAsset {
  id: string;
  name: string;
  short_name: string;
  logo_url: string | null;
}

export interface PlayerAsset {
  id: string;
  name: string;
  team_id: string | null;
  avatar_url: string | null;
}

// Preset avatars and logos
export const PRESET_TEAM_LOGOS = [
  { id: 'cricket-1', url: 'https://api.dicebear.com/7.x/identicon/svg?seed=team1&backgroundColor=0ea5e9' },
  { id: 'cricket-2', url: 'https://api.dicebear.com/7.x/identicon/svg?seed=team2&backgroundColor=3b82f6' },
  { id: 'cricket-3', url: 'https://api.dicebear.com/7.x/identicon/svg?seed=team3&backgroundColor=6366f1' },
  { id: 'cricket-4', url: 'https://api.dicebear.com/7.x/identicon/svg?seed=team4&backgroundColor=8b5cf6' },
  { id: 'cricket-5', url: 'https://api.dicebear.com/7.x/identicon/svg?seed=team5&backgroundColor=ec4899' },
  { id: 'cricket-6', url: 'https://api.dicebear.com/7.x/identicon/svg?seed=team6&backgroundColor=f97316' },
];

export const PRESET_PLAYER_AVATARS = [
  { id: 'player-1', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player1' },
  { id: 'player-2', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player2' },
  { id: 'player-3', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player3' },
  { id: 'player-4', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player4' },
  { id: 'player-5', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player5' },
  { id: 'player-6', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player6' },
  { id: 'player-7', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player7' },
  { id: 'player-8', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player8' },
];

export const useTeamAssets = () => {
  const [teams, setTeams] = useState<TeamAsset[]>([]);
  const [players, setPlayers] = useState<PlayerAsset[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeams = async () => {
    const { data, error } = await supabase.from('teams').select('*');
    if (!error && data) {
      setTeams(data);
    }
  };

  const fetchPlayers = async () => {
    const { data, error } = await supabase.from('players').select('*');
    if (!error && data) {
      setPlayers(data);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchTeams(), fetchPlayers()]);
      setLoading(false);
    };
    init();
  }, []);

  const uploadImage = async (file: File, folder: 'logos' | 'avatars'): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}.${fileExt}`;
    
    const { error } = await supabase.storage
      .from('team-assets')
      .upload(fileName, file);

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    const { data } = supabase.storage
      .from('team-assets')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const saveTeam = async (name: string, shortName: string, logoUrl: string | null): Promise<TeamAsset | null> => {
    // Check if team exists
    const existing = teams.find(t => t.name.toLowerCase() === name.toLowerCase());
    
    if (existing) {
      const { data, error } = await supabase
        .from('teams')
        .update({ logo_url: logoUrl, short_name: shortName })
        .eq('id', existing.id)
        .select()
        .single();

      if (!error && data) {
        await fetchTeams();
        return data;
      }
    } else {
      const { data, error } = await supabase
        .from('teams')
        .insert({ name, short_name: shortName, logo_url: logoUrl })
        .select()
        .single();

      if (!error && data) {
        await fetchTeams();
        return data;
      }
    }
    return null;
  };

  const savePlayer = async (name: string, avatarUrl: string | null, teamId?: string): Promise<PlayerAsset | null> => {
    // Check if player exists
    const existing = players.find(p => p.name.toLowerCase() === name.toLowerCase());
    
    if (existing) {
      const { data, error } = await supabase
        .from('players')
        .update({ avatar_url: avatarUrl, team_id: teamId || null })
        .eq('id', existing.id)
        .select()
        .single();

      if (!error && data) {
        await fetchPlayers();
        return data;
      }
    } else {
      const { data, error } = await supabase
        .from('players')
        .insert({ name, avatar_url: avatarUrl, team_id: teamId || null })
        .select()
        .single();

      if (!error && data) {
        await fetchPlayers();
        return data;
      }
    }
    return null;
  };

  const getTeamLogo = (teamName: string): string | null => {
    const team = teams.find(t => t.name.toLowerCase() === teamName.toLowerCase());
    return team?.logo_url || null;
  };

  const getPlayerAvatar = (playerName: string): string | null => {
    const player = players.find(p => p.name.toLowerCase() === playerName.toLowerCase());
    return player?.avatar_url || null;
  };

  // Generate avatar from name if none exists
  const getPlayerAvatarOrGenerated = (playerName: string): string => {
    const existing = getPlayerAvatar(playerName);
    if (existing) return existing;
    // Generate consistent avatar based on name
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(playerName)}&backgroundColor=0ea5e9,3b82f6,6366f1`;
  };

  const getTeamLogoOrGenerated = (teamName: string): string => {
    const existing = getTeamLogo(teamName);
    if (existing) return existing;
    // Generate consistent logo based on name
    return `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(teamName)}&backgroundColor=0ea5e9`;
  };

  return {
    teams,
    players,
    loading,
    uploadImage,
    saveTeam,
    savePlayer,
    getTeamLogo,
    getPlayerAvatar,
    getPlayerAvatarOrGenerated,
    getTeamLogoOrGenerated,
    fetchTeams,
    fetchPlayers,
  };
};
