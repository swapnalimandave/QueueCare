import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'light' | 'dark';

export interface ThemeColors {
  bgMain: string;
  bgCard: string;
  bgAlt: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderFocus: string;
  cardShadow: string;
  badgeBg: string;
  badgeText: string;
  btnPrimary: string;
  btnSecondary: string;
  btnDanger: string;
  inputBg: string;
}

const lightColors: ThemeColors = {
  bgMain: 'bg-[#E4E8F7] text-[#1A1A2E]',
  bgCard: 'bg-white',
  bgAlt: 'bg-slate-50',
  textPrimary: 'text-[#1A1A2E]',
  textSecondary: 'text-slate-600',
  textMuted: 'text-slate-400',
  border: 'border-slate-200/80',
  borderFocus: 'border-indigo-300',
  cardShadow: 'shadow-[0_4px_24px_rgba(74,95,232,0.06)]',
  badgeBg: 'bg-indigo-50',
  badgeText: 'text-[#4A5FE8]',
  btnPrimary: 'bg-[#4A5FE8] hover:bg-indigo-600 text-white',
  btnSecondary: 'bg-slate-100 hover:bg-slate-200 text-[#1A1A2E]',
  btnDanger: 'bg-rose-500 hover:bg-rose-600 text-white',
  inputBg: 'bg-white border-slate-250',
};

const darkColors: ThemeColors = {
  bgMain: 'bg-[#090D16] text-[#F1F5F9]',
  bgCard: 'bg-[#121824]',
  bgAlt: 'bg-[#182030]',
  textPrimary: 'text-[#F1F5F9]',
  textSecondary: 'text-slate-400',
  textMuted: 'text-slate-500',
  border: 'border-slate-800/80',
  borderFocus: 'border-blue-500/50',
  cardShadow: 'shadow-[0_4px_24px_rgba(0,0,0,0.3)]',
  badgeBg: 'bg-blue-950/50',
  badgeText: 'text-blue-400',
  btnPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
  btnSecondary: 'bg-[#1E293B] hover:bg-slate-800 text-[#F1F5F9]',
  btnDanger: 'bg-rose-600 hover:bg-rose-700 text-white',
  inputBg: 'bg-[#182030] border-slate-700',
};

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Sync with existing qc_darkMode from local storage or default to light
    const preserved = localStorage.getItem('qc_darkMode');
    if (preserved === 'true') return 'dark';
    if (preserved === 'false') return 'light';
    
    // Check local storage for qc_theme alternatively
    const preservedTheme = localStorage.getItem('qc_theme');
    return (preservedTheme as Theme) || 'light';
  });

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  useEffect(() => {
    localStorage.setItem('qc_darkMode', String(theme === 'dark'));
    localStorage.setItem('qc_theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, [theme]);

  const isDark = theme === 'dark';
  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, isDark, colors, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
