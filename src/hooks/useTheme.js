import { useState, useEffect, useCallback } from 'react';

const THEMES = [
  { id: 'blue', label: 'Ocean Blue', primary: '221 83% 53%', accent: '199 89% 48%' },
  { id: 'green', label: 'Cricket Green', primary: '142 71% 45%', accent: '160 84% 39%' },
  { id: 'purple', label: 'Royal Purple', primary: '263 70% 50%', accent: '280 65% 60%' },
  { id: 'orange', label: 'Sunset Orange', primary: '25 95% 53%', accent: '38 92% 50%' },
  { id: 'red', label: 'Crimson Red', primary: '0 84% 50%', accent: '350 80% 55%' },
  { id: 'teal', label: 'Teal Fresh', primary: '174 72% 40%', accent: '187 76% 45%' },
];

const FONTS = [
  { id: 'outfit', label: 'Outfit', family: "'Outfit', sans-serif", url: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap' },
  { id: 'inter', label: 'Inter', family: "'Inter', sans-serif", url: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap' },
  { id: 'poppins', label: 'Poppins', family: "'Poppins', sans-serif", url: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap' },
  { id: 'space-grotesk', label: 'Space Grotesk', family: "'Space Grotesk', sans-serif", url: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap' },
  { id: 'dm-sans', label: 'DM Sans', family: "'DM Sans', sans-serif", url: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap' },
  { id: 'nunito', label: 'Nunito', family: "'Nunito', sans-serif", url: 'https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700;800&display=swap' },
];

const loadFont = (url) => {
  if (document.querySelector(`link[href="${url}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  document.head.appendChild(link);
};

export const useTheme = () => {
  const [mode, setMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('cricket-theme-mode');
      if (stored) return stored;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  const [colorTheme, setColorTheme] = useState(() => {
    return localStorage.getItem('cricket-color-theme') || 'blue';
  });

  const [fontId, setFontId] = useState(() => {
    return localStorage.getItem('cricket-font') || 'outfit';
  });

  // Apply dark/light mode
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(mode);
    localStorage.setItem('cricket-theme-mode', mode);
    // Keep legacy key for backward compat
    localStorage.setItem('cricket-theme', mode);
  }, [mode]);

  // Apply color theme
  useEffect(() => {
    const theme = THEMES.find(t => t.id === colorTheme) || THEMES[0];
    const root = document.documentElement;
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--ring', theme.primary);
    root.style.setProperty('--sidebar-primary', theme.primary);
    root.style.setProperty('--sidebar-ring', theme.primary);
    localStorage.setItem('cricket-color-theme', colorTheme);
  }, [colorTheme, mode]);

  // Apply font
  useEffect(() => {
    const font = FONTS.find(f => f.id === fontId) || FONTS[0];
    loadFont(font.url);
    document.body.style.fontFamily = font.family;
    localStorage.setItem('cricket-font', fontId);
  }, [fontId]);

  const toggleTheme = useCallback(() => {
    setMode(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const isDark = mode === 'dark';
  const theme = mode; // backward compat

  return {
    theme, mode, toggleTheme, isDark,
    colorTheme, setColorTheme,
    fontId, setFontId,
    themes: THEMES,
    fonts: FONTS,
  };
};
