import { useState, useEffect } from 'react';

const TEAMS_STORAGE_KEY = 'cricket_teams';
const PLAYERS_STORAGE_KEY = 'cricket_players';

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

function getStoredTeams(): TeamAsset[] {
  try {
    const stored = localStorage.getItem(TEAMS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function setStoredTeams(teams: TeamAsset[]) {
  localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(teams));
}

function getStoredPlayers(): PlayerAsset[] {
  try {
    const stored = localStorage.getItem(PLAYERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function setStoredPlayers(players: PlayerAsset[]) {
  localStorage.setItem(PLAYERS_STORAGE_KEY, JSON.stringify(players));
}

export const useTeamAssets = () => {
  const [teams, setTeams] = useState<TeamAsset[]>([]);
  const [players, setPlayers] = useState<PlayerAsset[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeams = () => {
    setTeams(getStoredTeams());
  };

  const fetchPlayers = () => {
    setPlayers(getStoredPlayers());
  };

  useEffect(() => {
    setLoading(true);
    fetchTeams();
    fetchPlayers();
    setLoading(false);
  }, []);

  const uploadImage = async (file: File, _folder: 'logos' | 'avatars'): Promise<string | null> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        resolve(null);
      };
      reader.readAsDataURL(file);
    });
  };

  const saveTeam = async (name: string, shortName: string, logoUrl: string | null): Promise<TeamAsset | null> => {
    const stored = getStoredTeams();
    const existingIndex = stored.findIndex(t => t.name.toLowerCase() === name.toLowerCase());
    
    if (existingIndex !== -1) {
      stored[existingIndex] = {
        ...stored[existingIndex],
        short_name: shortName,
        logo_url: logoUrl,
      };
      setStoredTeams(stored);
      setTeams(stored);
      return stored[existingIndex];
    } else {
      const newTeam: TeamAsset = {
        id: crypto.randomUUID(),
        name,
        short_name: shortName,
        logo_url: logoUrl,
      };
      stored.push(newTeam);
      setStoredTeams(stored);
      setTeams(stored);
      return newTeam;
    }
  };

  const savePlayer = async (name: string, avatarUrl: string | null, teamId?: string): Promise<PlayerAsset | null> => {
    const stored = getStoredPlayers();
    const existingIndex = stored.findIndex(p => p.name.toLowerCase() === name.toLowerCase());
    
    if (existingIndex !== -1) {
      stored[existingIndex] = {
        ...stored[existingIndex],
        avatar_url: avatarUrl,
        team_id: teamId || null,
      };
      setStoredPlayers(stored);
      setPlayers(stored);
      return stored[existingIndex];
    } else {
      const newPlayer: PlayerAsset = {
        id: crypto.randomUUID(),
        name,
        avatar_url: avatarUrl,
        team_id: teamId || null,
      };
      stored.push(newPlayer);
      setStoredPlayers(stored);
      setPlayers(stored);
      return newPlayer;
    }
  };

  const getTeamLogo = (teamName: string): string | null => {
    const team = teams.find(t => t.name.toLowerCase() === teamName.toLowerCase());
    return team?.logo_url || null;
  };

  const getPlayerAvatar = (playerName: string): string | null => {
    const player = players.find(p => p.name.toLowerCase() === playerName.toLowerCase());
    return player?.avatar_url || null;
  };

  const getPlayerAvatarOrGenerated = (playerName: string): string => {
    const existing = getPlayerAvatar(playerName);
    if (existing) return existing;
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(playerName)}&backgroundColor=0ea5e9,3b82f6,6366f1`;
  };

  const getTeamLogoOrGenerated = (teamName: string): string => {
    const existing = getTeamLogo(teamName);
    if (existing) return existing;
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
