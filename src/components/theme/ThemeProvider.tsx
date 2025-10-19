import { useEffect } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useUserSettings } from '@/hooks/useUserSettings';
import { useAuth } from '@/contexts/AuthContext';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { settings, updateSettings } = useUserSettings();

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
      storageKey="theme-preference"
    >
      <ThemeSyncWrapper 
        user={user} 
        settings={settings} 
        updateSettings={updateSettings}
      >
        {children}
      </ThemeSyncWrapper>
    </NextThemesProvider>
  );
}

// Separate component to use theme hooks inside ThemeProvider
function ThemeSyncWrapper({ 
  children, 
  user, 
  settings, 
  updateSettings 
}: { 
  children: React.ReactNode;
  user: any;
  settings: any;
  updateSettings: (updates: any) => void;
}) {
  const { theme, setTheme } = useTheme();

  // Sync theme from user settings on mount
  useEffect(() => {
    if (user && settings?.theme && theme !== settings.theme) {
      setTheme(settings.theme);
    }
  }, [user, settings?.theme]);

  // Save theme changes to user settings
  useEffect(() => {
    if (user && theme && settings?.theme !== theme) {
      updateSettings({ theme });
    }
  }, [theme, user]);

  return <>{children}</>;
}

// Re-export useTheme for convenience
import { useTheme } from 'next-themes';
export { useTheme };
