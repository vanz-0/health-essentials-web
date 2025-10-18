import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useErrorLogging = () => {
  useEffect(() => {
    const handleError = async (event: ErrorEvent) => {
      console.error('Global error:', event.error);
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        await supabase.from('error_logs').insert({
          user_id: user?.id || null,
          error_type: 'RUNTIME_ERROR',
          error_message: event.message,
          error_stack: event.error?.stack || '',
          page_url: window.location.href,
          user_agent: navigator.userAgent,
          metadata: {
            timestamp: new Date().toISOString(),
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
          },
        });
      } catch (e) {
        console.error('Failed to log error:', e);
      }
    };

    const handleUnhandledRejection = async (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        await supabase.from('error_logs').insert({
          user_id: user?.id || null,
          error_type: 'UNHANDLED_REJECTION',
          error_message: event.reason?.message || String(event.reason),
          error_stack: event.reason?.stack || '',
          page_url: window.location.href,
          user_agent: navigator.userAgent,
          metadata: {
            timestamp: new Date().toISOString(),
            reason: event.reason,
          },
        });
      } catch (e) {
        console.error('Failed to log unhandled rejection:', e);
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);
};
