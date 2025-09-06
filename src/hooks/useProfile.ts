import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

type Profile = {
  id: number;
  user_id: string;
  username: string;
  bio?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
};

export const useProfile = () => {
  const { user, session } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  const createProfile = async (username: string) => {
    if (!user) return { error: new Error("No authenticated user") };

    const { data, error } = await supabase
      .from("profiles")
      .insert({
        user_id: user.id,
        username: username || user.email?.split("@")[0] || "user",
      })
      .select()
      .single();

    if (!error && data) {
      setProfile(data);
    }

    return { data, error };
  };

  const updateProfile = async (updates: Partial<Pick<Profile, "username" | "bio" | "avatar_url">>) => {
    if (!user || !profile) return { error: new Error("No authenticated user or profile") };

    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("user_id", user.id)
      .select()
      .single();

    if (!error && data) {
      setProfile(data);
    }

    return { data, error };
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
        return;
      }

      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error && error.code === "PGRST116") {
          // Profile doesn't exist, create one
          await createProfile(user.email?.split("@")[0] || "user");
        } else if (!error && data) {
          setProfile(data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  return {
    profile,
    loading,
    createProfile,
    updateProfile,
  };
};