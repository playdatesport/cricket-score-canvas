import { useState, useCallback } from 'react';

const getStored = (key, defaultVal) => {
  try {
    const v = localStorage.getItem(key);
    return v !== null ? JSON.parse(v) : defaultVal;
  } catch { return defaultVal; }
};

export const useSettings = () => {
  const [soundEnabled, setSoundEnabled] = useState(() => getStored('cricket-sound', true));
  const [vibrationEnabled, setVibrationEnabled] = useState(() => getStored('cricket-vibration', true));

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => {
      localStorage.setItem('cricket-sound', JSON.stringify(!prev));
      return !prev;
    });
  }, []);

  const toggleVibration = useCallback(() => {
    setVibrationEnabled(prev => {
      localStorage.setItem('cricket-vibration', JSON.stringify(!prev));
      return !prev;
    });
  }, []);

  return { soundEnabled, vibrationEnabled, toggleSound, toggleVibration };
};
