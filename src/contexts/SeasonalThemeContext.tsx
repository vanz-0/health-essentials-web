import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SeasonalTheme, seasonalThemes, getCurrentSeasonalTheme } from '@/config/seasonalThemes';

interface SeasonalThemeContextType {
  theme: SeasonalTheme;
  setTheme: (theme: SeasonalTheme) => void;
  resetToAuto: () => void;
  isAutoMode: boolean;
  allThemes: SeasonalTheme[];
}

const SeasonalThemeContext = createContext<SeasonalThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'seasonal-theme-override';

export function SeasonalThemeProvider({ children }: { children: ReactNode }) {
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [theme, setThemeState] = useState<SeasonalTheme>(getCurrentSeasonalTheme);

  useEffect(() => {
    // Check for stored override
    const storedOverride = localStorage.getItem(STORAGE_KEY);
    if (storedOverride) {
      const overrideTheme = seasonalThemes.find(t => t.id === storedOverride);
      if (overrideTheme) {
        setThemeState(overrideTheme);
        setIsAutoMode(false);
      }
    }
  }, []);

  const setTheme = (newTheme: SeasonalTheme) => {
    setThemeState(newTheme);
    setIsAutoMode(false);
    localStorage.setItem(STORAGE_KEY, newTheme.id);
  };

  const resetToAuto = () => {
    localStorage.removeItem(STORAGE_KEY);
    setThemeState(getCurrentSeasonalTheme());
    setIsAutoMode(true);
  };

  return (
    <SeasonalThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      resetToAuto, 
      isAutoMode,
      allThemes: seasonalThemes 
    }}>
      {children}
    </SeasonalThemeContext.Provider>
  );
}

export function useSeasonalTheme() {
  const context = useContext(SeasonalThemeContext);
  if (context === undefined) {
    throw new Error('useSeasonalTheme must be used within a SeasonalThemeProvider');
  }
  return context;
}
