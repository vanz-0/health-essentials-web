import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface UserChallenge {
  id: string;
  user_id: string | null;
  challenge_id: string;
  email: string;
  full_name: string | null;
  started_at: string;
  completed_at: string | null;
  current_day: number;
  missed_days_streak: number;
  status: string;
  discount_code: string | null;
  product_snapshot: Record<string, any>;
  last_activity_at: string;
}

export interface ChallengeProgress {
  id: string;
  user_challenge_id: string;
  day_number: number;
  completed: boolean;
  notes: string | null;
  completed_at: string | null;
}

function generateDiscountCode(challengeType: string): string {
  const prefix = challengeType.toUpperCase().slice(0, 4);
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${random}`;
}

export function useUserChallenges() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-challenges', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_challenges')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as UserChallenge[];
    },
    enabled: !!user?.id,
  });
}

export function useUserChallenge(userChallengeId: string | undefined) {
  return useQuery({
    queryKey: ['user-challenge', userChallengeId],
    queryFn: async () => {
      if (!userChallengeId) return null;
      
      const { data, error } = await supabase
        .from('user_challenges')
        .select('*')
        .eq('id', userChallengeId)
        .single();
      
      if (error) throw error;
      return data as UserChallenge;
    },
    enabled: !!userChallengeId,
  });
}

export function useChallengeProgress(userChallengeId: string | undefined) {
  return useQuery({
    queryKey: ['challenge-progress', userChallengeId],
    queryFn: async () => {
      if (!userChallengeId) return [];
      
      const { data, error } = await supabase
        .from('challenge_progress')
        .select('*')
        .eq('user_challenge_id', userChallengeId)
        .order('day_number');
      
      if (error) throw error;
      return data as ChallengeProgress[];
    },
    enabled: !!userChallengeId,
  });
}

export function useEnrollChallenge() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ 
      challengeId, 
      email, 
      fullName,
      challengeType,
      productSnapshot 
    }: { 
      challengeId: string; 
      email: string; 
      fullName?: string;
      challengeType: string;
      productSnapshot?: Record<string, any>;
    }) => {
      const discountCode = generateDiscountCode(challengeType);
      
      const { data, error } = await supabase
        .from('user_challenges')
        .insert({
          user_id: user?.id || null,
          challenge_id: challengeId,
          email,
          full_name: fullName || null,
          discount_code: discountCode,
          product_snapshot: productSnapshot || {},
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Initialize progress for all 30 days
      const progressInserts = Array.from({ length: 30 }, (_, i) => ({
        user_challenge_id: data.id,
        day_number: i + 1,
        completed: false,
      }));
      
      const { error: progressError } = await supabase
        .from('challenge_progress')
        .insert(progressInserts);
      
      if (progressError) throw progressError;
      
      // Send welcome email
      try {
        await supabase.functions.invoke('send-challenge-welcome', {
          body: { 
            userChallengeId: data.id,
            email,
            fullName,
            discountCode 
          }
        });
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-challenges'] });
      toast({
        title: "Challenge Started! 🎉",
        description: "Check your email for your welcome guide and discount code.",
      });
    },
    onError: (error) => {
      console.error('Enrollment error:', error);
      toast({
        title: "Enrollment Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateProgress() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      userChallengeId,
      dayNumber, 
      completed,
      notes 
    }: { 
      userChallengeId: string;
      dayNumber: number; 
      completed: boolean;
      notes?: string;
    }) => {
      // First, get the current challenge to check current_day
      const { data: currentChallenge, error: fetchError } = await supabase
        .from('user_challenges')
        .select('current_day')
        .eq('id', userChallengeId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Update progress
      const { error: progressError } = await supabase
        .from('challenge_progress')
        .update({
          completed,
          completed_at: completed ? new Date().toISOString() : null,
          notes: notes || null,
        })
        .eq('user_challenge_id', userChallengeId)
        .eq('day_number', dayNumber);
      
      if (progressError) throw progressError;
      
      // Only update current_day if the new day is greater than existing
      const shouldUpdateCurrentDay = dayNumber > (currentChallenge?.current_day || 0);
      
      const { error: ucError } = await supabase
        .from('user_challenges')
        .update({
          last_activity_at: new Date().toISOString(),
          ...(shouldUpdateCurrentDay && { current_day: dayNumber }),
          ...(completed && { missed_days_streak: 0 }),
        })
        .eq('id', userChallengeId);
      
      if (ucError) throw ucError;
      
      return { dayNumber, completed };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['challenge-progress', variables.userChallengeId] });
      queryClient.invalidateQueries({ queryKey: ['user-challenge', variables.userChallengeId] });
      
      if (variables.completed) {
        toast({
          title: `Day ${variables.dayNumber} Complete! ✅`,
          description: "Great job staying on track!",
        });
      }
    },
  });
}

export function useAbandonChallenge() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userChallengeId: string) => {
      const { error } = await supabase
        .from('user_challenges')
        .update({
          status: 'abandoned',
          completed_at: new Date().toISOString(),
        })
        .eq('id', userChallengeId);
      
      if (error) throw error;
      return userChallengeId;
    },
    onSuccess: (userChallengeId) => {
      queryClient.invalidateQueries({ queryKey: ['user-challenges'] });
      queryClient.invalidateQueries({ queryKey: ['user-challenge', userChallengeId] });
      toast({
        title: "Challenge Ended",
        description: "You can start a new challenge anytime.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to end challenge",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });
}
