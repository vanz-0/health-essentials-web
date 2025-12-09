import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Challenge {
  id: string;
  challenge_type: string;
  title: string;
  description: string;
  icon: string;
  duration_days: number;
  discount_percent: number;
  difficulty: string;
  category: string;
  recommended_products: string[];
  active: boolean;
  created_at: string;
}

export interface ChallengeDay {
  id: string;
  challenge_id: string;
  day_number: number;
  title: string;
  tip: string;
  routine_time: string;
  product_nums: string[];
}

export function useChallenges() {
  return useQuery({
    queryKey: ['challenges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('active', true)
        .order('created_at');
      
      if (error) throw error;
      
      return (data || []).map(challenge => ({
        ...challenge,
        recommended_products: Array.isArray(challenge.recommended_products) 
          ? challenge.recommended_products 
          : JSON.parse(challenge.recommended_products as string || '[]')
      })) as Challenge[];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useChallenge(challengeId: string | undefined) {
  return useQuery({
    queryKey: ['challenge', challengeId],
    queryFn: async () => {
      if (!challengeId) return null;
      
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('id', challengeId)
        .single();
      
      if (error) throw error;
      
      return {
        ...data,
        recommended_products: Array.isArray(data.recommended_products) 
          ? data.recommended_products 
          : JSON.parse(data.recommended_products as string || '[]')
      } as Challenge;
    },
    enabled: !!challengeId,
  });
}

export function useChallengeDays(challengeId: string | undefined) {
  return useQuery({
    queryKey: ['challenge-days', challengeId],
    queryFn: async () => {
      if (!challengeId) return [];
      
      const { data, error } = await supabase
        .from('challenge_days')
        .select('*')
        .eq('challenge_id', challengeId)
        .order('day_number');
      
      if (error) throw error;
      
      return (data || []).map(day => ({
        ...day,
        product_nums: Array.isArray(day.product_nums) 
          ? day.product_nums 
          : JSON.parse(day.product_nums as string || '[]')
      })) as ChallengeDay[];
    },
    enabled: !!challengeId,
  });
}
