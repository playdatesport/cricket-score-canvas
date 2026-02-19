import { useState, useEffect, useCallback } from 'react';

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

// Inject theme transition style once
const ensureTransitionStyle = () => {
  if (document.getElementById('theme-transition-style')) return;
  const style = document.createElement('style');
  style.id = 'theme-transition-style';
  style.textContent = `
    .theme-transitioning,
    .theme-transitioning *,
    .theme-transitioning *::before,
    .theme-transitioning *::after {
      transition: background-color 0.5s ease, color 0.3s ease, border-color 0.4s ease, box-shadow 0.4s ease, fill 0.3s ease, stroke 0.3s ease !important;
    }
  `;
  document.head.appendChild(style);
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

  const [primaryColor, setPrimaryColor] = useState(() => {
    return localStorage.getItem('cricket-primary-color') || '#3b82f6';
  });

  const [fontId, setFontId] = useState(() => {
    return localStorage.getItem('cricket-font') || 'outfit';
  });

  // Apply dark/light mode with transition
  useEffect(() => {
    const root = document.documentElement;
    ensureTransitionStyle();
    root.classList.add('theme-transitioning');
    root.classList.remove('light', 'dark');
    root.classList.add(mode);
    localStorage.setItem('cricket-theme-mode', mode);
    localStorage.setItem('cricket-theme', mode);
    const timer = setTimeout(() => root.classList.remove('theme-transitioning'), 600);
    return () => clearTimeout(timer);
  }, [mode]);

  // Apply primary color
  useEffect(() => {
    const root = document.documentElement;
    const hsl = hexToHsl(primaryColor);
    root.style.setProperty('--primary', hsl);
    root.style.setProperty('--accent', hsl);
    root.style.setProperty('--ring', hsl);
    root.style.setProperty('--sidebar-primary', hsl);
    root.style.setProperty('--sidebar-ring', hsl);
    localStorage.setItem('cricket-primary-color', primaryColor);
  }, [primaryColor, mode]);

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
    primaryColor, setPrimaryColor,
    fontId, setFontId,
    fonts: FONTS,
  };
};
