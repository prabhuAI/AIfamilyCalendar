import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Database } from "@/integrations/supabase/types";

type Family = Database['public']['Tables']['families']['Row'];
type FamilyMember = Database['public']['Tables']['family_members']['Row'];

export const useFamily = () => {
  const [familyId, setFamilyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrCreateFamily = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: familyMember, error: memberError } = await supabase
          .from('family_members')
          .select('family_id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (memberError) throw memberError;

        if (familyMember) {
          setFamilyId(familyMember.family_id);
        } else {
          const { data: newFamily, error: familyError } = await supabase
            .from('families')
            .insert([{ family_name: 'My Family' }])
            .select()
            .single();

          if (familyError) throw familyError;

          if (newFamily) {
            const { error: membershipError } = await supabase
              .from('family_members')
              .insert([{ 
                family_id: newFamily.id, 
                user_id: user.id 
              }]);

            if (membershipError) throw membershipError;
            setFamilyId(newFamily.id);
          }
        }
      } catch (error: any) {
        console.error('Error in fetchOrCreateFamily:', error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrCreateFamily();
  }, []);

  return { familyId, isLoading };
};