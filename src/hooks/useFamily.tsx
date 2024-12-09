import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  getCurrentUser,
  getFamilyMember,
  createNewFamily,
  createFamilyMember,
  getFamilyMembers,
} from "@/utils/familyUtils";

export const useFamilyData = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: familyData, isLoading } = useQuery({
    queryKey: ['family'],
    queryFn: async () => {
      try {
        console.log('Starting family data fetch...');
        const user = await getCurrentUser();
        
        // Get user's family membership
        const { familyMembers } = await getFamilyMember(user.id);

        // If user has no family, create one
        if (!familyMembers || familyMembers.length === 0) {
          console.log('No family found, creating new family...');
          try {
            const newFamily = await createNewFamily(user.id);
            return { familyId: newFamily.id, members: [] };
          } catch (error: any) {
            console.error('Error creating new family:', error);
            return { familyId: null, members: [] };
          }
        }

        const familyId = familyMembers[0].family_id;
        console.log('Found family ID:', familyId);

        // Get all members of the family
        try {
          const members = await getFamilyMembers(familyId);
          return { familyId, members };
        } catch (error: any) {
          console.error('Error fetching family members:', error);
          return { familyId, members: [] };
        }
      } catch (error: any) {
        console.error('Error in family data fetch:', error);
        // Return a safe default state instead of throwing
        return { familyId: null, members: [] };
      }
    },
    retry: 1,
    retryDelay: 1000
  });

  const removeMember = useMutation({
    mutationFn: async (userId: string) => {
      if (!familyData?.familyId) {
        throw new Error('No family ID found');
      }
      const { error } = await supabase
        .from('family_members')
        .delete()
        .eq('family_id', familyData.familyId)
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['family'] });
      toast({
        title: "Success",
        description: "Family member removed successfully",
      });
    },
    onError: (error: Error) => {
      console.error("Error removing family member:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return {
    familyData: familyData || { familyId: null, members: [] },
    isLoading,
    removeMember
  };
};