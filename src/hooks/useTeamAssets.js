import { useState, useCallback } from 'react';

const TEAM_ASSETS_KEY = 'cricket_team_assets';
const PLAYER_AVATARS_KEY = 'cricket_player_avatars';

export const useTeamAssets = () => {
  const [teamLogos, setTeamLogos] = useState({});
  const [playerAvatars, setPlayerAvatars] = useState({});

  const saveTeamLogo = useCallback((teamName, logoData) => {
    try {
      const stored = localStorage.getItem(TEAM_ASSETS_KEY);
      const existing = stored ? JSON.parse(stored) : {};
      existing[teamName] = logoData;
      localStorage.setItem(TEAM_ASSETS_KEY, JSON.stringify(existing));
      setTeamLogos(existing);
    } catch (error) {
      console.error('Error saving team logo:', error);
    }
  }, []);

  const getTeamLogo = useCallback((teamName) => {
    try {
      const stored = localStorage.getItem(TEAM_ASSETS_KEY);
      const existing = stored ? JSON.parse(stored) : {};
      return existing[teamName] || null;
    } catch (error) {
      console.error('Error getting team logo:', error);
      return null;
    }
  }, []);

  const savePlayerAvatar = useCallback((playerName, avatarData) => {
    try {
      const stored = localStorage.getItem(PLAYER_AVATARS_KEY);
      const existing = stored ? JSON.parse(stored) : {};
      existing[playerName] = avatarData;
      localStorage.setItem(PLAYER_AVATARS_KEY, JSON.stringify(existing));
      setPlayerAvatars(existing);
    } catch (error) {
      console.error('Error saving player avatar:', error);
    }
  }, []);

  const getPlayerAvatar = useCallback((playerName) => {
    try {
      const stored = localStorage.getItem(PLAYER_AVATARS_KEY);
      const existing = stored ? JSON.parse(stored) : {};
      return existing[playerName] || null;
    } catch (error) {
      console.error('Error getting player avatar:', error);
      return null;
    }
  }, []);

  const loadAllAssets = useCallback(() => {
    try {
      const storedLogos = localStorage.getItem(TEAM_ASSETS_KEY);
      const storedAvatars = localStorage.getItem(PLAYER_AVATARS_KEY);
      setTeamLogos(storedLogos ? JSON.parse(storedLogos) : {});
      setPlayerAvatars(storedAvatars ? JSON.parse(storedAvatars) : {});
    } catch (error) {
      console.error('Error loading assets:', error);
    }
  }, []);

  return {
    teamLogos,
    playerAvatars,
    saveTeamLogo,
    getTeamLogo,
    savePlayerAvatar,
    getPlayerAvatar,
    loadAllAssets,
  };
};
