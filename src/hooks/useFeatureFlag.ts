import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface FeatureFlag {
  id: number;
  key: string;
  enabled: boolean;
  rollout: number;
  payload: Record<string, any>;
  start_at?: string;
  end_at?: string;
}

export function useFeatureFlag(flagKey: string) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [payload, setPayload] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkFlag() {
      try {
        const { data, error } = await supabase
          .from('feature_flags')
          .select('enabled, rollout, payload, start_at, end_at')
          .eq('key', flagKey)
          .single();

        if (error || !data) {
          setIsEnabled(false);
          setPayload({});
          return;
        }

        // Check time constraints
        const now = new Date();
        if (data.start_at && new Date(data.start_at) > now) {
          setIsEnabled(false);
          return;
        }
        if (data.end_at && new Date(data.end_at) < now) {
          setIsEnabled(false);
          return;
        }

        // Check rollout percentage
        const shouldEnable = data.enabled && Math.random() * 100 < data.rollout;
        
        setIsEnabled(shouldEnable);
        setPayload(typeof data.payload === 'object' && data.payload !== null ? data.payload as Record<string, any> : {});
      } catch (error) {
        console.error('Feature flag check failed:', error);
        setIsEnabled(false);
      } finally {
        setLoading(false);
      }
    }

    checkFlag();
  }, [flagKey]);

  return { isEnabled, payload, loading };
}

export function useFeatureFlags(flagKeys: string[]) {
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkFlags() {
      try {
        const { data, error } = await supabase
          .from('feature_flags')
          .select('key, enabled, rollout, start_at, end_at')
          .in('key', flagKeys);

        if (error || !data) {
          setFlags({});
          return;
        }

        const now = new Date();
        const flagsMap = data.reduce((acc, flag) => {
          // Check time constraints
          if (flag.start_at && new Date(flag.start_at) > now) {
            acc[flag.key] = false;
            return acc;
          }
          if (flag.end_at && new Date(flag.end_at) < now) {
            acc[flag.key] = false;
            return acc;
          }

          // Check rollout percentage
          const shouldEnable = flag.enabled && Math.random() * 100 < flag.rollout;
          acc[flag.key] = shouldEnable;
          return acc;
        }, {} as Record<string, boolean>);

        setFlags(flagsMap);
      } catch (error) {
        console.error('Feature flags check failed:', error);
        setFlags({});
      } finally {
        setLoading(false);
      }
    }

    checkFlags();
  }, [flagKeys.join(',')]);

  return { flags, loading };
}