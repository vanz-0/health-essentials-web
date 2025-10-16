import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PerformanceMetrics {
  [key: string]: number;
}

export function usePerformance() {
  useEffect(() => {
    // Wait for page to fully load
    if (document.readyState === 'complete') {
      capturePerformanceMetrics();
    } else {
      window.addEventListener('load', capturePerformanceMetrics);
      return () => window.removeEventListener('load', capturePerformanceMetrics);
    }
  }, []);

  const capturePerformanceMetrics = async () => {
    try {
      // Get performance entries
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (!navigation) return;

      const metrics: PerformanceMetrics = {
        // Core Web Vitals
        'DNS Lookup': navigation.domainLookupEnd - navigation.domainLookupStart,
        'TCP Connection': navigation.connectEnd - navigation.connectStart,
        'Request Time': navigation.responseStart - navigation.requestStart,
        'Response Time': navigation.responseEnd - navigation.responseStart,
        'DOM Processing': navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        'Load Complete': navigation.loadEventEnd - navigation.loadEventStart,
        'Total Load Time': navigation.loadEventEnd - navigation.fetchStart,
      };

      // Get connection info if available
      const connection = (navigator as any).connection;
      const connectionType = connection?.effectiveType || 'unknown';

      // Send metrics to database (batch insert)
      const metricEntries = Object.entries(metrics).map(([name, value]) => ({
        page_url: window.location.pathname,
        metric_name: name,
        metric_value: value,
        user_agent: navigator.userAgent,
        connection_type: connectionType
      }));

      await supabase.from('performance_metrics').insert(metricEntries);

      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Performance Metrics:', metrics);
      }
    } catch (error) {
      console.error('Error capturing performance metrics:', error);
    }
  };

  // Observe Largest Contentful Paint (LCP)
  useEffect(() => {
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          
          supabase.from('performance_metrics').insert({
            page_url: window.location.pathname,
            metric_name: 'Largest Contentful Paint (LCP)',
            metric_value: lastEntry.renderTime || lastEntry.loadTime,
            user_agent: navigator.userAgent
          }).then(({ error }) => {
            if (error) console.error('Error logging LCP:', error);
          });
        });

        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        return () => lcpObserver.disconnect();
      } catch (error) {
        console.error('Error observing LCP:', error);
      }
    }
  }, []);

  // Observe First Input Delay (FID)
  useEffect(() => {
    if ('PerformanceObserver' in window) {
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            supabase.from('performance_metrics').insert({
              page_url: window.location.pathname,
              metric_name: 'First Input Delay (FID)',
              metric_value: entry.processingStart - entry.startTime,
              user_agent: navigator.userAgent
            }).then(({ error }) => {
              if (error) console.error('Error logging FID:', error);
            });
          });
        });

        fidObserver.observe({ entryTypes: ['first-input'] });

        return () => fidObserver.disconnect();
      } catch (error) {
        console.error('Error observing FID:', error);
      }
    }
  }, []);

  return null;
}
