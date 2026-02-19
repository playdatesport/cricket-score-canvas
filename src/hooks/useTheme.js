import { useState, useEffect, useCallback } from 'react';

const THEMES = [
  { id: 'blue', label: 'Ocean Blue', primary: '221 83% 53%', accent: '199 89% 48%' },
  { id: 'green', label: 'Cricket Green', primary: '142 71% 45%', accent: '160 84% 39%' },
  { id: 'purple', label: 'Royal Purple', primary: '263 70% 50%', accent: '280 65% 60%' },
  { id: 'orange', label: 'Sunset', primary: '25 95% 53%', accent: '38 92% 50%' },
  { id: 'red', label: 'Crimson', primary: '0 84% 50%', accent: '350 80% 55%' },
  { id: 'teal', label: 'Teal', primary: '174 72% 40%', accent: '187 76% 45%' },
  { id: 'pink', label: 'Hot Pink', primary: '330 81% 60%', accent: '340 75% 55%' },
  { id: 'indigo', label: 'Indigo', primary: '239 84% 67%', accent: '245 58% 51%' },
  { id: 'amber', label: 'Amber', primary: '45 93% 47%', accent: '38 92% 50%' },
  { id: 'cyan', label: 'Cyan', primary: '189 94% 43%', accent: '199 89% 48%' },
  { id: 'rose', label: 'Rose', primary: '347 77% 50%', accent: '350 80% 60%' },
  { id: 'emerald', label: 'Emerald', primary: '160 84% 39%', accent: '152 76% 44%' },
];

const FONTS = [
  { id: 'outfit', label: 'Outfit', family: "'Outfit', sans-serif", url: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap' },
  { id: 'inter', label: 'Inter', family: "'Inter', sans-serif", url: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap' },
  { id: 'poppins', label: 'Poppins', family: "'Poppins', sans-serif", url: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap' },
  { id: 'space-grotesk', label: 'Space Grotesk', family: "'Space Grotesk', sans-serif", url: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap' },
  { id: 'dm-sans', label: 'DM Sans', family: "'DM Sans', sans-serif", url: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap' },
  { id: 'nunito', label: 'Nunito', family: "'Nunito', sans-serif", url: 'https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700;800&display=swap' },
  { id: 'raleway', label: 'Raleway', family: "'Raleway', sans-serif", url: 'https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700;800&display=swap' },
  { id: 'rubik', label: 'Rubik', family: "'Rubik', sans-serif", url: 'https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700;800&display=swap' },
];

const loadFont = (url) => {
  if (document.querySelector(`link[href="${url}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  document.head.appendChild(link);
};

// Convert hex to HSL string
const hexToHsl = (hex) => {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
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

  const [customColor, setCustomColor] = useState(() => {
    return localStorage.getItem('cricket-custom-color') || '#3b82f6';
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
    localStorage.setItem('cricket-theme', mode);
  }, [mode]);

  // Apply color theme
  useEffect(() => {
    const root = document.documentElement;
    if (colorTheme === 'custom') {
      const hsl = hexToHsl(customColor);
      root.style.setProperty('--primary', hsl);
      root.style.setProperty('--accent', hsl);
      root.style.setProperty('--ring', hsl);
      root.style.setProperty('--sidebar-primary', hsl);
      root.style.setProperty('--sidebar-ring', hsl);
      localStorage.setItem('cricket-custom-color', customColor);
    } else {
      const theme = THEMES.find(t => t.id === colorTheme) || THEMES[0];
      root.style.setProperty('--primary', theme.primary);
      root.style.setProperty('--accent', theme.accent);
      root.style.setProperty('--ring', theme.primary);
      root.style.setProperty('--sidebar-primary', theme.primary);
      root.style.setProperty('--sidebar-ring', theme.primary);
    }
    localStorage.setItem('cricket-color-theme', colorTheme);
  }, [colorTheme, customColor, mode]);

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
  const theme = mode;

  return {
    theme, mode, toggleTheme, isDark,
    colorTheme, setColorTheme,
    customColor, setCustomColor,
    fontId, setFontId,
    themes: THEMES,
    fonts: FONTS,
  };
};
