import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "professional" | "client" | null;

interface UseUserRoleResult {
  role: AppRole;
  isLoading: boolean;
  isProfessional: boolean;
  isClient: boolean;
  userId: string | null;
}

export const useUserRole = (): UseUserRoleResult => {
  const [role, setRole] = useState<AppRole>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsLoading(false);
          return;
        }
        
        setUserId(user.id);

        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching role:", error);
        }

        setRole(data?.role as AppRole || null);
      } catch (err) {
        console.error("Error in useUserRole:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRole();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchRole();
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    role,
    isLoading,
    isProfessional: role === "professional",
    isClient: role === "client",
    userId,
  };
};
