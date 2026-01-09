import { useEffect, useRef } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useUserSettings } from '@/hooks/useUserSettings';
import { useAuth } from '@/contexts/AuthContext';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { settings, isLoading, updateSettings } = useUserSettings();

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
        isLoading={isLoading}
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
  isLoading,
  updateSettings 
}: { 
  children: React.ReactNode;
  user: any;
  settings: any;
  isLoading: boolean;
  updateSettings: (updates: any) => void;
}) {
  const { theme, setTheme } = useTheme();
  const hasInitialized = useRef(false);
  const lastSyncedTheme = useRef<string | null>(null);

  // Sync theme FROM user settings on initial load only
  useEffect(() => {
    if (user && !isLoading && settings?.theme && !hasInitialized.current) {
      if (settings.theme !== 'system' && theme !== settings.theme) {
        setTheme(settings.theme);
      }
      hasInitialized.current = true;
      lastSyncedTheme.current = settings.theme;
    }
  }, [user, settings?.theme, isLoading]);

  // Reset initialization when user changes
  useEffect(() => {
    if (!user) {
      hasInitialized.current = false;
      lastSyncedTheme.current = null;
    }
  }, [user]);

  // Save theme changes to user settings (only after initialization and on user action)
  useEffect(() => {
    if (
      user && 
      hasInitialized.current && 
      theme && 
      theme !== 'system' &&
      theme !== lastSyncedTheme.current
    ) {
      lastSyncedTheme.current = theme;
      updateSettings({ theme });
    }
  }, [theme, user]);

  return <>{children}</>;
}

// Re-export useTheme for convenience
import { useTheme } from 'next-themes';
export { useTheme };
