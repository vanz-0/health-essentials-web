import { useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Generate a session ID that persists across page reloads
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

interface AnalyticsEventData {
  [key: string]: any;
}

export function useAnalytics() {
  const { user } = useAuth();
  const sessionId = useRef(getSessionId());

  // Track page view
  const trackPageView = useCallback(async (pageUrl?: string) => {
    const url = pageUrl || window.location.pathname;
    
    try {
      await supabase.from('analytics_events').insert({
        user_id: user?.id || null,
        session_id: sessionId.current,
        event_type: 'page_view',
        event_name: 'Page View',
        page_url: url,
        referrer: document.referrer,
        user_agent: navigator.userAgent,
        event_data: {
          title: document.title,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  }, [user]);

  // Track custom event
  const trackEvent = useCallback(async (
    eventName: string,
    eventType: string,
    eventData?: AnalyticsEventData
  ) => {
    try {
      await supabase.from('analytics_events').insert({
        user_id: user?.id || null,
        session_id: sessionId.current,
        event_type: eventType,
        event_name: eventName,
        page_url: window.location.pathname,
        referrer: document.referrer,
        user_agent: navigator.userAgent,
        event_data: eventData || {}
      });
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }, [user]);

  // Track product view
  const trackProductView = useCallback(async (productId: string, productName: string, price: number) => {
    await trackEvent('Product View', 'product', {
      product_id: productId,
      product_name: productName,
      price
    });
  }, [trackEvent]);

  // Track add to cart
  const trackAddToCart = useCallback(async (productId: string, productName: string, quantity: number, price: number) => {
    await trackEvent('Add to Cart', 'cart', {
      product_id: productId,
      product_name: productName,
      quantity,
      price,
      total: quantity * price
    });
  }, [trackEvent]);

  // Track purchase
  const trackPurchase = useCallback(async (orderId: string, total: number, items: any[]) => {
    await trackEvent('Purchase', 'conversion', {
      order_id: orderId,
      total,
      items_count: items.length,
      items
    });
  }, [trackEvent]);

  // Track contact form submission
  const trackContactSubmit = useCallback(async (source: string) => {
    await trackEvent('Contact Submit', 'lead', {
      source,
      timestamp: new Date().toISOString()
    });
  }, [trackEvent]);

  // Auto-track page views on route change
  useEffect(() => {
    trackPageView();
  }, [trackPageView]);

  return {
    trackPageView,
    trackEvent,
    trackProductView,
    trackAddToCart,
    trackPurchase,
    trackContactSubmit
  };
}
